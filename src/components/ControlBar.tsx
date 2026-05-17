import './ControlBar.css';

interface Props {
  paused: boolean;
  onPauseToggle: () => void;
  onCancel: () => void;
  onReset: () => void;
}

export default function ControlBar({ paused, onPauseToggle, onCancel, onReset }: Props) {
  return (
    <div className="control-bar">
      <button
        className="ctrl"
        onClick={onPauseToggle}
        aria-label={paused ? '재개' : '일시정지'}
        data-tip={paused ? '재개' : '일시정지'}
      >
        {paused ? (
          <svg viewBox="0 0 24 24" width="14" height="14"><path d="M8 5v14l11-7L8 5z" fill="currentColor"/></svg>
        ) : (
          <svg viewBox="0 0 24 24" width="14" height="14"><rect x="6" y="5" width="4" height="14" fill="currentColor"/><rect x="14" y="5" width="4" height="14" fill="currentColor"/></svg>
        )}
      </button>
      <button
        className="ctrl"
        onClick={onReset}
        aria-label="재설정"
        data-tip="재설정"
      >
        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 12a9 9 0 1 1-3.36-7" />
          <path d="M21 4v6h-6" />
        </svg>
      </button>
      <button
        className="ctrl danger"
        onClick={onCancel}
        aria-label="세션 취소"
        data-tip="세션 취소"
      >
        <svg viewBox="0 0 24 24" width="14" height="14"><path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/></svg>
      </button>
    </div>
  );
}
