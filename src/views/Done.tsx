import { useEffect, useState } from 'react';
import type { Importance } from '../types';
import PixelPet from '../components/PixelPet';
import { playCompletionChime } from '../hooks/useChime';
import { getCharacter } from '../data/characters';
import './Done.css';

export default function Done() {
  const [importance, setImportance] = useState<Importance>(3);
  const [characterId, setCharacterId] = useState<string>('clawd');
  const [winWidth, setWinWidth] = useState<number>(() => window.innerWidth);

  useEffect(() => {
    window.focusApp.getSettings().then((s) => {
      setImportance((s.lastImportance ?? 3) as Importance);
      setCharacterId(s.lastCharacter ?? 'clawd');
    });
    playCompletionChime();
    const onResize = () => setWinWidth(window.innerWidth);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const characterSize = Math.round(winWidth * 0.55);
  const character = getCharacter(characterId);

  return (
    <div className="done-stage">
      <div className="done-character">
        <div className="done-bubble">완료! 🎉</div>
        <PixelPet character={character} importance={importance} phase="done" size={characterSize} draggable />
      </div>

      <div className="done-meta">
        <div className="done-label">COMPLETE</div>
        <div className="done-title">Done!</div>
        <div className="done-sub">잘 했어요</div>
      </div>

      <div className="done-actions">
        <button className="action primary" onClick={() => window.focusApp.startNewSession()}>
          새 세션
        </button>
        <button className="action ghost" onClick={() => window.close()}>
          닫기
        </button>
      </div>
    </div>
  );
}
