import { useEffect, useState } from 'react';
import type { Importance, ThemeMode } from '../types';
import PixelPet from '../components/PixelPet';
import IntensitySlider from '../components/IntensitySlider';
import DurationPicker from '../components/DurationPicker';
import { CHARACTER_LIST, getCharacter, type CharacterId } from '../data/characters';
import './Launcher.css';

export default function Launcher() {
  const [taskName, setTaskName] = useState('');
  const [duration, setDuration] = useState(25);
  const [importance, setImportance] = useState<Importance>(3);
  const [characterId, setCharacterId] = useState<CharacterId>('clawd');
  const [theme, setTheme] = useState<ThemeMode>('dark');
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    window.focusApp
      .getSettings()
      .then((s) => {
        setTaskName(s.lastTaskName ?? '');
        setDuration(s.lastDurationMin ?? 25);
        setImportance((s.lastImportance ?? 3) as Importance);
        setCharacterId((s.lastCharacter ?? 'clawd') as CharacterId);
        setTheme((s.themeMode ?? 'dark') as ThemeMode);
      })
      .finally(() => setLoaded(true));
  }, []);

  const handleThemeChange = (next: ThemeMode) => {
    setTheme(next);
    window.focusApp.setSettings({ themeMode: next }).catch(() => undefined);
  };

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
    <div className={`launcher-shell launcher-theme-${theme}`}>
      <header className="launcher-header">
        <div className="header-left">
          <span className="live-dot" />
          <span className="live-text">새 세션</span>
        </div>
        <div className="header-right">
          <div className="theme-toggle" role="tablist" aria-label="테마 모드">
            <button
              type="button"
              className={theme === 'light' ? 'on' : ''}
              onClick={() => handleThemeChange('light')}
              role="tab"
              aria-selected={theme === 'light'}
            >
              기본
            </button>
            <button
              type="button"
              className={theme === 'dark' ? 'on' : ''}
              onClick={() => handleThemeChange('dark')}
              role="tab"
              aria-selected={theme === 'dark'}
            >
              다크
            </button>
          </div>
          <button className="close-btn" onClick={close} aria-label="닫기">×</button>
        </div>
      </header>

      <main className="launcher-body">
        <div className="title-block">
          <PixelPet
            character={selectedCharacter}
            importance={importance}
            phase="running"
            size={44}
          />
          <div className="title-text">
            <h1 className="title">포커스 세션</h1>
            <p className="subtitle">작업과 시간, 강도를 설정하세요</p>
          </div>
        </div>

        <section className="field">
          <label className="field-label" htmlFor="task-input">작업 이름</label>
          <input
            id="task-input"
            className="text-input"
            placeholder="어떤 일에 집중하시나요?"
            value={taskName}
            onChange={(e) => setTaskName(e.target.value)}
            maxLength={60}
          />
        </section>

        <section className="field">
          <label className="field-label">시간</label>
          <DurationPicker value={duration} onChange={setDuration} />
        </section>

        <section className="field">
          <label className="field-label">우선 순위</label>
          <IntensitySlider value={importance} onChange={setImportance} />
        </section>

        <section className="field">
          <label className="field-label">친구</label>
          <div className="character-grid">
            {CHARACTER_LIST.map((c) => (
              <button
                key={c.id}
                type="button"
                className={`character-tile ${characterId === c.id ? 'on' : ''}`}
                onClick={() => setCharacterId(c.id)}
                aria-label={c.name}
                aria-pressed={characterId === c.id}
              >
                <PixelPet character={c} importance={3} phase="running" size={40} />
                <span className="character-name">{c.name}</span>
              </button>
            ))}
          </div>
        </section>

        <button className="begin-btn" onClick={begin} disabled={!loaded}>
          세션 시작 →
        </button>
      </main>
    </div>
  );
}
