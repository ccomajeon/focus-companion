import { useState } from 'react';
import './DurationPicker.css';

const PRESETS = [15, 25, 45, 60] as const;

interface Props {
  value: number;
  onChange: (minutes: number) => void;
}

export default function DurationPicker({ value, onChange }: Props) {
  const isPreset = (PRESETS as readonly number[]).includes(value);
  const [customOpen, setCustomOpen] = useState(!isPreset);
  const [customText, setCustomText] = useState(isPreset ? '' : String(value));

  const commitCustom = (raw: string) => {
    setCustomText(raw);
    const n = Math.floor(Number(raw));
    if (Number.isFinite(n) && n >= 1 && n <= 480) onChange(n);
  };

  return (
    <div className="duration-picker">
      <div className="preset-row">
        {PRESETS.map((m) => (
          <button
            key={m}
            type="button"
            className={`preset ${value === m && !customOpen ? 'active' : ''}`}
            onClick={() => {
              setCustomOpen(false);
              setCustomText('');
              onChange(m);
            }}
          >
            {m}m
          </button>
        ))}
        <button
          type="button"
          className={`preset custom-toggle ${customOpen ? 'active' : ''}`}
          onClick={() => setCustomOpen((v) => !v)}
          aria-label="Custom duration"
        >
          ···
        </button>
      </div>

      {customOpen && (
        <div className="custom-row">
          <input
            type="number"
            min={1}
            max={480}
            placeholder="분 단위 (예: 30)"
            value={customText}
            onChange={(e) => commitCustom(e.target.value)}
            className="custom-input"
          />
          <span className="unit">분</span>
        </div>
      )}
    </div>
  );
}
