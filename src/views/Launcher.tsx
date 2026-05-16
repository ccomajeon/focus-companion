import { useEffect, useState } from 'react';
import type { Importance } from '../types';
import PixelPet from '../components/PixelPet';
import ImportanceDots from '../components/ImportanceDots';
import DurationPicker from '../components/DurationPicker';
import { CHARACTER_LIST, getCharacter, type CharacterId } from '../data/characters';
import './Launcher.css';

export default function Launcher() {
  const [taskName, setTaskName] = useState('');
  const [duration, setDuration] = useState(25);
  const [importance, setImportance] = useState<Importance>(3);
  const [characterId, setCharacterId] = useState<CharacterId>('clawd');
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    window.focusApp
      .getSettings()
      .then((s) => {
        setTaskName(s.lastTaskName ?? '');
        setDuration(s.lastDurationMin ?? 25);
        setImportance((s.lastImportance ?? 3) as Importance);
        setCharacterId((s.lastCharacter ?? 'clawd') as CharacterId);
      })
      .finally(() => setLoaded(true));
  }, []);

  const begin = () => {
    if (!loaded) return;
    window.focusApp.startSession({
      lastTaskName: taskName,
      lastDurationMin: duration,
      lastImportance: importance,
      lastCharacter: characterId,
    });
  };

  const close = () => window.close();
  const selectedCharacter = getCharacter(characterId);

  return (
    <div className="launcher">
      <div className="title-bar">
        <div className="hero">
          <PixelPet
            character={selectedCharacter}
            importance={importance}
            phase="running"
            size={56}
          />
        </div>
        <button className="close-btn" onClick={close} aria-label="Close">×</button>
      </div>

      <h1 className="launcher-title">Focus Session</h1>
      <p className="launcher-subtitle">무엇에 집중하시겠어요?</p>

      <div className="field">
        <div className="label">TASK</div>
        <input
          className="text-input"
          placeholder="예: 디자인 리뷰 작성"
          value={taskName}
          onChange={(e) => setTaskName(e.target.value)}
          maxLength={60}
        />
      </div>

      <div className="field">
        <div className="label">DURATION</div>
        <DurationPicker value={duration} onChange={setDuration} />
      </div>

      <div className="field">
        <div className="label">IMPORTANCE</div>
        <div className="importance-row">
          <ImportanceDots value={importance} onChange={setImportance} />
          <span className="importance-hint">{labelFor(importance)}</span>
        </div>
      </div>

      <div className="field">
        <div className="label">COMPANION</div>
        <div className="character-grid">
          {CHARACTER_LIST.map((c) => (
            <button
              key={c.id}
              type="button"
              className={`character-tile ${characterId === c.id ? 'active' : ''}`}
              onClick={() => setCharacterId(c.id)}
              aria-label={c.name}
            >
              <PixelPet character={c} importance={3} phase="running" size={52} />
              <span className="character-name">{c.name}</span>
            </button>
          ))}
        </div>
      </div>

      <button className="begin-btn" onClick={begin} disabled={!loaded}>
        Begin Focus →
      </button>
    </div>
  );
}

function labelFor(i: Importance): string {
  switch (i) {
    case 1: return '— Low';
    case 2: return '— Light';
    case 3: return '— Normal';
    case 4: return '— Focused';
    case 5: return '— Intense';
  }
}
