import { useState } from 'react';
import { Panel } from '@/components/Panel';
import { useSheet } from '@/components/SheetProvider';
import { findRace } from '../../../../constants/races';
import { useIkCharacter } from '../../../../hooks/useIkCharacter';
import { availableOptions } from '../../../../utils/careerOptions';
import { CareerOptions, CareerPackage, CompanyPackage } from './components';
import { applyStartingPackage, choiceKey, startingPackage, type PackageSelection } from './utils/startingPackage';
import './StartingPackagePanel.styles.css';

/** Shows what the two starting careers and the adventuring company give a new character, and adds it to the sheet. */
export function StartingPackagePanel() {
  const { character } = useIkCharacter();
  const { set } = useSheet();
  const selection: PackageSelection = character.identity.careerChoices ?? {};
  const [result, setResult] = useState<string[]>();
  const pack = startingPackage(character, selection);
  const race = character.settings.raceRules ? findRace(character.identity.race) : undefined;
  const options = availableOptions(character);

  if (pack.careers.length === 0) {
    return (
      <Panel title="Starting package">
        <p className="ik-note">
          Choose two starting careers on the Character tab to see what they give a new character.
        </p>
      </Panel>
    );
  }

  const openChoices = pack.careers.flatMap((career) =>
    career.skills.flatMap((entry, index) =>
      'choose' in entry && (selection[choiceKey(career, index)] ?? []).filter(Boolean).length < entry.choose
        ? [career.name]
        : [],
    ),
  );

  const apply = () => {
    const applied = applyStartingPackage(character, pack);
    set('', applied.character);
    setResult([
      `Added the starting package: ${pack.skills.length} skills, ${pack.abilities.length} abilities, ${pack.archetypeBenefits.length} archetype benefits, ${pack.connections.length} connections and ${pack.spells.length} spells. Nothing already on the sheet was removed.`,
      ...applied.notes,
    ]);
  };

  return (
    <Panel title="Starting package" className="starting-package-container">
      <p className="ik-note">
        For new characters (pp. 117–119 and, for an adventuring company, pp. 151–153). A skill from both careers starts
        at level 2. Adding the package never removes anything, so it&apos;s safe to use after typing in your own
        entries.
      </p>
      {options.length > 0 && (
        <CareerOptions
          options={options}
          chosen={character.identity.careerOptions ?? []}
          onChange={(chosen) => set('identity.careerOptions', chosen)}
        />
      )}
      <div className="starting-package-careers">
        {pack.careers.map((career) => (
          <CareerPackage
            key={career.name}
            career={career}
            character={character}
            selection={selection}
            onSelect={(key, picks) => set('identity.careerChoices', { ...selection, [key]: picks })}
          />
        ))}
        {pack.company && (
          <CompanyPackage
            company={pack.company}
            character={character}
            repeated={pack.repeatedAbilities}
            onChoose={(pick) => set('identity.companyChoice', pick)}
          />
        )}
      </div>
      {race && (race.abilities || race.connections) && (
        <p className="ik-note">
          {race.name}s also start with {[...(race.abilities ?? []), ...(race.connections ?? [])].join(' and ')}.
        </p>
      )}
      {openChoices.length > 0 && (
        <p className="ik-warning">Pick the remaining skill choices for {[...new Set(openChoices)].join(' and ')}.</p>
      )}
      <button type="button" className="ik-start" onClick={apply}>
        Add starting package to sheet
      </button>
      {result?.map((line) => (
        <p key={line} className="ik-note" role="status">
          {line}
        </p>
      ))}
    </Panel>
  );
}
