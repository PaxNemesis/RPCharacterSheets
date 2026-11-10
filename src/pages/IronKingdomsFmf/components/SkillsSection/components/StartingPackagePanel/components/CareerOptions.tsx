import { bookRef } from '../../../../../constants/books';
import type { CareerOption } from '../../../../../types';
import { describeOption } from '../utils/describeOption';

type CareerOptionsProps = {
  options: CareerOption[];
  chosen: string[];
  onChange: (chosen: string[]) => void;
};

/**
 * Kingdom versions of the starting careers. An option for a single career replaces the standard
 * career, so picking one clears any other option for that career.
 */
export function CareerOptions({ options, chosen, onChange }: CareerOptionsProps) {
  const toggle = (option: CareerOption, on: boolean) => {
    const rivals =
      option.careers.length === 1
        ? options
            .filter((other) => other.careers.length === 1 && other.careers[0] === option.careers[0])
            .map((other) => other.name)
        : [];
    const kept = chosen.filter((name) => name !== option.name && !rivals.includes(name));
    onChange(on ? [...kept, option.name] : kept);
  };

  return (
    <fieldset className="starting-package-options">
      <legend>Career options</legend>
      {options.map((option) => (
        <label key={option.name}>
          <input
            type="checkbox"
            checked={chosen.includes(option.name)}
            onChange={(event) => toggle(option, event.target.checked)}
          />
          <span>
            <strong>{option.name}</strong> ({option.careers.join(' / ')}, {bookRef(option.book, option.page)}).{' '}
            <em>{option.requires}.</em> {describeOption(option)}
          </span>
        </label>
      ))}
    </fieldset>
  );
}
