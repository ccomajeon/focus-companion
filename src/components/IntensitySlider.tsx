import type { Importance } from '../types';
import './IntensitySlider.css';

interface Props {
  value: Importance;
  onChange: (v: Importance) => void;
}

const LABELS: Record<Importance, string> = {
  1: '매우 낮음',
  2: '낮음',
  3: '보통',
  4: '높음',
  5: '매우 높음',
};

export default function IntensitySlider({ value, onChange }: Props) {
  return (
    <div className="intensity-row">
      <span className="intensity-num">{value}</span>
      <div className="intensity-track-wrap">
        <input
          type="range"
          min={1}
          max={5}
          step={1}
          value={value}
          onChange={(e) => onChange(Number(e.target.value) as Importance)}
          className="intensity-input"
          aria-label="우선 순위"
        />
        <div className="intensity-track">
          <div
            className="intensity-fill"
            style={{ width: `${((value - 1) / 4) * 100}%` }}
          />
          <div
            className="intensity-knob"
            style={{ left: `${((value - 1) / 4) * 100}%` }}
          />
        </div>
      </div>
      <span className="intensity-label">{LABELS[value]}</span>
    </div>
  );
}
