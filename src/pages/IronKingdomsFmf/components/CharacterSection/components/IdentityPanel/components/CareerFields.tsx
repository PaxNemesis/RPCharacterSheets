import { Fragment } from 'react';
import { SelectField } from '@/components/SelectField';
import { useSheet } from '@/components/SheetProvider';
import { TextField } from '@/components/TextField';
import { useRowIds } from '@/hooks/useRowIds';
import { bookEnabled, SUPPLEMENTS } from '../../../../../constants/books';
import { CAREERS } from '../../../../../constants/careers';
import { useIkCharacter } from '../../../../../hooks/useIkCharacter';
import type { CareerData } from '../../../../../types';
import { compareNames } from '@/utils/alphabetical';
import { resolveCareer } from '../../../../../utils/careerOptions';

const careerLabel = (career: CareerData) => {
  const book = SUPPLEMENTS.find((supplement) => supplement.id === career.book);
  return book ? `${career.name} (${book.short})` : career.name;
};

/**
 * Starting careers plus any learned later, starting a line; free text when career rules are off. Their
 * notes are in CareerNotes, after the adventuring company that can share the line.
 */
export function CareerFields() {
  const { character } = useIkCharacter();
  const { set } = useSheet();
  const { careerList } = character.identity;
  // Always at least the two starting careers; later ones can be removed from the middle.
  const rowIds = useRowIds(Math.max(2, careerList.length));

  if (!character.settings.careerRules) {
    return <TextField path="identity.careers" label="Careers" className="identity-panel-row identity-panel-wide" />;
  }

  const list = careerList.length >= 2 ? careerList : [...careerList, '', ''].slice(0, 2);
  const careers = list.map((name) => resolveCareer(character, name ?? ''));
  // Careers from books that are turned off stay listed while a character has them.
  const options = [
    { value: '', label: 'Choose…' },
    ...CAREERS.filter((career) => bookEnabled(character.settings, career.book) || list.includes(career.name))
      .sort((a, b) => compareNames(a.name, b.name))
      .map((career) => ({ value: career.name, label: careerLabel(career) })),
  ];
  // A career's version, such as a priest's faith, in a field of its own right after the career; once,
  // if the same career is listed twice, since both share the choice.
  const versionField = (index: number) => {
    const career = careers[index];
    if (!career?.variants || careers.findIndex((other) => other?.name === career.name) !== index) return null;
    return (
      <SelectField
        path={`identity.careerVariants.${career.name}`}
        label={`${career.name} ${(career.variantLabel ?? 'version').toLowerCase()}`}
        options={[{ value: '', label: 'Choose…' }, ...career.variants.map((v) => ({ value: v.label, label: v.label }))]}
      />
    );
  };

  return (
    <>
      {list.map((_, index) => {
        const row = index === 0 ? 'identity-panel-row' : undefined;
        const field = (
          <SelectField
            path={`identity.careerList.${index}`}
            label={index < 2 ? `Starting career ${index + 1}` : `Career ${index + 1}`}
            options={options}
            className={index < 2 ? row : undefined}
          />
        );
        if (index < 2) {
          return (
            <Fragment key={rowIds.ids[index]}>
              {field}
              {versionField(index)}
            </Fragment>
          );
        }
        // A later career has its remove button beside it, in line with the dropdown.
        return (
          <Fragment key={rowIds.ids[index]}>
            <div className="identity-panel-removable">
              {field}
              <button
                type="button"
                className="identity-panel-remove"
                aria-label={`Remove career ${index + 1}`}
                title="Remove career"
                onClick={() => {
                  rowIds.remove(index);
                  set(
                    'identity.careerList',
                    list.filter((_, other) => other !== index),
                  );
                }}
              >
                ×
              </button>
            </div>
            {versionField(index)}
          </Fragment>
        );
      })}
      <button type="button" className="identity-panel-add" onClick={() => set('identity.careerList', [...list, ''])}>
        + Add career
      </button>
    </>
  );
}
