import { Panel } from '@/components/Panel';
import { RepeatTable, type RepeatTableColumn } from '@/components/RepeatTable';
import { alphabetical, compareNames } from '@/utils/alphabetical';
import { bookEnabled, bookRef } from '../../../constants/books';
import { HEROIC_SKILLS } from '../../../constants/heroicSkills';
import type { FuCharacter, FuHeroicSkill } from '../../../types';
import { heroicIssues, nextSource, OTHER_SOURCE } from '../../../utils/heroicSkills';
import { classLevel } from '../../../utils/rules';

type HeroicSkillsPanelProps = {
  character: FuCharacter;
};

export function HeroicSkillsPanel({ character }: HeroicSkillsPanelProps) {
  const available = HEROIC_SKILLS.filter((skill) => bookEnabled(character.settings, skill.book));
  const known = new Set<string>();
  const classOptions = character.classes.flatMap((entry) => {
    const name = entry.name.trim();
    if (!name || known.has(name.toLowerCase())) return [];
    known.add(name.toLowerCase());
    const level = classLevel(entry);
    return [{ value: name, label: level >= 10 ? name : `${name} (level ${level})` }];
  });
  // Keep links to renamed or removed classes visible, so they can be fixed rather than silently changed.
  const orphans = [...new Set(character.heroicSkills.map((skill) => (skill.source ?? '').trim()))].filter(
    (source) => source && source !== OTHER_SOURCE && !known.has(source.toLowerCase()),
  );
  const sourceOptions = [
    { value: '', label: 'Choose…' },
    ...classOptions.sort((a, b) => compareNames(a.value, b.value)),
    ...orphans.map((name) => ({ value: name, label: `${name} (not one of your classes)` })),
    { value: OTHER_SOURCE, label: 'Other (not a class)' },
  ];

  const columns: RepeatTableColumn[] = [
    {
      key: 'name',
      label: 'Heroic Skill',
      width: 'minmax(160px, 1fr)',
      suggestions: alphabetical([...new Set(available.map((skill) => skill.name))]),
    },
    { key: 'source', label: 'From', width: 'minmax(150px, 1fr)', type: 'select', options: sourceOptions },
    { key: 'notes', label: 'Notes', width: 'minmax(220px, 3fr)', rows: 2 },
  ];
  const createHeroicSkill = (): FuHeroicSkill => ({ name: '', source: nextSource(character), notes: '' });

  const mastered = character.classes.filter((entry) => classLevel(entry) >= 10).length;
  const issues = heroicIssues(character);
  const references = character.heroicSkills.flatMap(({ name }) => {
    const data = available.find((skill) => skill.name.toLowerCase() === name.trim().toLowerCase());
    return data ? [`${data.name} ${bookRef(data.book, data.page)}`] : [];
  });

  return (
    <Panel title="Heroic skills">
      <p className="fu-note">
        Mastering a class (level 10) gives one Heroic Skill (p. 228); link each to the class that granted it, or to
        Other for ones from elsewhere, such as breaking the Cursed Quirk. Mastered classes: {mastered}. Extra HP, Extra
        MP and Extra IP are added to your maximums.
      </p>
      <RepeatTable path="heroicSkills" columns={columns} createRow={createHeroicSkill} itemName="Heroic Skill" />
      {issues.map((issue) => (
        <p key={issue} className="fu-warning">
          {issue}
        </p>
      ))}
      {references.length > 0 && <p className="fu-note">Pages: {references.join(', ')}.</p>}
    </Panel>
  );
}
