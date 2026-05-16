import type { Importance } from '../types';
import './ImportanceDots.css';

interface Props {
  value: Importance;
  onChange?: (v: Importance) => void;
  size?: 'sm' | 'md';
}

export default function ImportanceDots({ value, onChange, size = 'md' }: Props) {
  const interactive = !!onChange;

  return (
    <div className={`dots ${size} ${interactive ? 'interactive' : ''}`}>
      {([1, 2, 3, 4, 5] as Importance[]).map((n) => (
        <button
          key={n}
          type="button"
          className={`dot ${n <= value ? 'on' : 'off'}`}
          aria-label={`Importance ${n}`}
          onClick={() => onChange?.(n)}
          disabled={!interactive}
        />
      ))}
    </div>
  );
}
