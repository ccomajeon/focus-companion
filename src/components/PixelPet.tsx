import { useEffect, useState } from 'react';
import type { Facing, Importance, Phase } from '../types';
import { type CharacterDef, type EarStyle } from '../data/characters';
import './PixelPet.css';

interface Props {
  character: CharacterDef;
  importance: Importance;
  phase: Phase;
  size?: number;
  draggable?: boolean;
  facing?: Facing;
  walking?: boolean;
}

const STEP_INTERVAL_MS: Record<Importance, number> = {
  1: 600,
  2: 480,
  3: 360,
  4: 260,
  5: 180,
};

const LEG_X_POSITIONS = [2, 9, 16, 23] as const;

function Ears({ style, color, innerColor }: { style: EarStyle; color: string; innerColor?: string }) {
  if (style === 'cat') {
    return (
      <g>
        <polygon points="2,-1 8,-1 5,-7" fill={color} />
        <polygon points="20,-1 26,-1 23,-7" fill={color} />
        <polygon points="4,-1 7,-1 5.5,-4" fill="#F4C4B8" />
        <polygon points="21,-1 24,-1 22.5,-4" fill="#F4C4B8" />
      </g>
    );
  }
  if (style === 'dog') {
    return (
      <g>
        <rect x="-2" y="2" width="3" height="7" fill={color} />
        <rect x="-2" y="9" width="4" height="2" fill={color} />
        <rect x="27" y="2" width="3" height="7" fill={color} />
        <rect x="26" y="9" width="4" height="2" fill={color} />
      </g>
    );
  }
  if (style === 'bunny') {
    return (
      <g>
        <rect x="5" y="-8" width="2" height="9" fill={color} />
        <rect x="21" y="-8" width="2" height="9" fill={color} />
        {innerColor && (
          <>
            <rect x="5" y="-5" width="2" height="4" fill={innerColor} />
            <rect x="21" y="-5" width="2" height="4" fill={innerColor} />
          </>
        )}
      </g>
    );
  }
  return null;
}

function Cheeks({ color }: { color: string }) {
  return (
    <g>
      <rect x="5" y="11" width="2" height="1" fill={color} opacity="0.7" />
      <rect x="21" y="11" width="2" height="1" fill={color} opacity="0.7" />
    </g>
  );
}

export default function PixelPet({
  character,
  importance,
  phase,
  size = 140,
  draggable = false,
  facing = 'right',
  walking = false,
}: Props) {
  const [blink, setBlink] = useState(false);
  const [stepFrame, setStepFrame] = useState<0 | 1>(0);

  useEffect(() => {
    if (phase === 'done') return;
    let blinkClose: number | undefined;
    let blinkOpen: number | undefined;
    const schedule = () => {
      const delay = 2800 + Math.random() * 3200;
      blinkClose = window.setTimeout(() => {
        setBlink(true);
        blinkOpen = window.setTimeout(() => {
          setBlink(false);
          schedule();
        }, 140);
      }, delay);
    };
    schedule();
    return () => {
      if (blinkClose !== undefined) window.clearTimeout(blinkClose);
      if (blinkOpen !== undefined) window.clearTimeout(blinkOpen);
    };
  }, [phase]);

  useEffect(() => {
    if (phase !== 'running') return;
    const baseInterval = STEP_INTERVAL_MS[importance];
    const interval = walking ? Math.max(120, Math.round(baseInterval * 0.6)) : baseInterval;
    const id = window.setInterval(() => {
      setStepFrame((f) => (f === 0 ? 1 : 0));
    }, interval);
    return () => window.clearInterval(id);
  }, [phase, importance, walking]);

  const isDone = phase === 'done';
  const coral = isDone ? character.doneBody : character.body;
  const coralShade = isDone ? character.doneShade : character.bodyShade;

  const liftPattern: readonly boolean[] =
    phase !== 'running'
      ? [false, false, false, false]
      : stepFrame === 0
        ? [true, false, true, false]
        : [false, true, false, true];

  const flipX = facing === 'left';
  const leanDeg = walking ? (facing === 'right' ? 4 : -4) : 0;

  return (
    <div
      className={`pet-wrap ${phase} ${draggable ? 'drag' : ''} ${walking ? 'walking' : ''}`}
      style={{
        width: size,
        height: size,
        transform: `${flipX ? 'scaleX(-1)' : ''} rotate(${leanDeg}deg)`,
        transition: 'transform 0.35s ease-out',
      }}
    >
      <svg
        className="pet-svg"
        viewBox="-3 -9 34 33"
        width={size}
        height={size}
        shapeRendering="crispEdges"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g className={phase === 'running' ? `pet-bob bob-${stepFrame}` : 'pet-bob'}>
          <Ears style={character.ears} color={coral} innerColor={character.earInner} />

          {/* Body */}
          <rect x="4" y="0" width="20" height="2" fill={coral} />
          <rect x="2" y="2" width="24" height="2" fill={coral} />
          <rect x="0" y="4" width="28" height="12" fill={coral} />
          <rect x="0" y="14" width="28" height="2" fill={coralShade} opacity="0.3" />

          {/* Eyes */}
          {blink ? (
            <>
              <rect x="8" y="10" width="2" height="1" fill="#141414" />
              <rect x="18" y="10" width="2" height="1" fill="#141414" />
            </>
          ) : (
            <>
              <rect x="8" y="7" width="2" height="4" fill="#141414" />
              <rect x="18" y="7" width="2" height="4" fill="#141414" />
            </>
          )}

          {character.cheek && !blink && <Cheeks color={character.cheek} />}

          {isDone && (
            <>
              <rect x="11" y="13" width="6" height="1" fill="#141414" />
              <rect x="10" y="12" width="1" height="1" fill="#141414" />
              <rect x="17" y="12" width="1" height="1" fill="#141414" />
            </>
          )}
        </g>

        {LEG_X_POSITIONS.map((x, i) => (
          <rect
            key={i}
            x={x}
            y={16}
            width={3}
            height={liftPattern[i] ? 4 : 6}
            fill={coral}
          />
        ))}
      </svg>
    </div>
  );
}
