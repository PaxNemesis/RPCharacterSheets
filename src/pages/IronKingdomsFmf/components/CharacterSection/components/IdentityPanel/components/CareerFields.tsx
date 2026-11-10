import { Fragment } from 'react';
import { SelectField } from '@/components/SelectField';
import { useSheet } from '@/components/SheetProvider';
import { TextField } from '@/components/TextField';
import { useRowIds } from '@/hooks/useRowIds';
import { bookEnabled, SUPPLEMENTS } from '../../../../../constants/books';
import { CAREERS } from '../../../../../constants/careers';
import { useIkCharacter } from '../../../../../hooks/useIkCharacter';
import type { CareerData } from '../../../../../types';
import { alphabetical, compareNames } from '@/utils/alphabetical';
import { resolveCareer } from '../../../../../utils/careerOptions';

const careerLabel = (career: CareerData) => {
  const book = SUPPLEMENTS.find((supplement) => supplement.id === career.book);
  return book ? `${career.name} (${book.short})` : career.name;
};

/** Starting careers plus any learned later, starting a line; free text when career rules are off. */
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
  const [first, second] = careers;
  const notes = careers.flatMap((career, index) => {
    if (!career) return [];
    const other = index === 0 ? second : index === 1 ? first : undefined;
    return [
      career.prerequisites !== 'None' && `${career.name} requires: ${career.prerequisites}.`,
      career.startingOnly && index >= 2 && `${career.name} can only be a starting career.`,
      career.pairsWith &&
        index < 2 &&
        other &&
        !career.pairsWith.includes(other.name) &&
        `${career.name} must be paired with ${alphabetical(career.pairsWith).join(', ')}.`,
    ].filter((note): note is string => Boolean(note));
  });

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
        if (index < 2) return <Fragment key={rowIds.ids[index]}>{field}</Fragment>;
        // A later career has its remove button beside it, in line with the dropdown.
        return (
          <div key={rowIds.ids[index]} className="identity-panel-removable">
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
        );
      })}
      {/* Each career's version, such as a priest's faith, in a field of its own after the careers. */}
      {careers.map(
        (career) =>
          career?.variants && (
            <SelectField
              key={`variant-${career.name}`}
              path={`identity.careerVariants.${career.name}`}
              label={`${career.name} ${(career.variantLabel ?? 'version').toLowerCase()}`}
              options={[
                { value: '', label: 'Choose…' },
                ...career.variants.map((v) => ({ value: v.label, label: v.label })),
              ]}
            />
          ),
      )}
      <button type="button" className="identity-panel-add" onClick={() => set('identity.careerList', [...list, ''])}>
        + Add career
      </button>
      {notes.length > 0 && <p className="ik-note ik-wide">{notes.join(' ')}</p>}
    </>
  );
}
