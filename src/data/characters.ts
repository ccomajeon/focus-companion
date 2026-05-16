export type CharacterId = 'clawd' | 'catto' | 'pup' | 'bunny';

export type EarStyle = 'cat' | 'dog' | 'bunny' | null;

export interface CharacterDef {
  id: CharacterId;
  name: string;
  description: string;
  body: string;       // main body color
  bodyShade: string;  // shadow band color
  doneBody: string;   // body color when done
  doneShade: string;  // shadow when done
  ears: EarStyle;
  earInner?: string;  // inner ear color (for bunny)
  cheek?: string;     // optional cheek blush color
}

export const CHARACTERS: Record<CharacterId, CharacterDef> = {
  clawd: {
    id: 'clawd',
    name: "Claw'd",
    description: '코랄 픽셀 로봇',
    body: '#CC785C',
    bodyShade: '#A85F46',
    doneBody: '#9BAE7B',
    doneShade: '#7A8A5D',
    ears: null,
  },
  catto: {
    id: 'catto',
    name: 'Catto',
    description: '회색 고양이',
    body: '#9BA3B0',
    bodyShade: '#7A828F',
    doneBody: '#A8B89A',
    doneShade: '#869475',
    ears: 'cat',
    cheek: '#E8B0B0',
  },
  pup: {
    id: 'pup',
    name: 'Pup',
    description: '갈색 강아지',
    body: '#C68B5A',
    bodyShade: '#9E6E40',
    doneBody: '#9BAE7B',
    doneShade: '#7A8A5D',
    ears: 'dog',
  },
  bunny: {
    id: 'bunny',
    name: 'Bunny',
    description: '핑크 토끼',
    body: '#E8B5B5',
    bodyShade: '#C08D8D',
    doneBody: '#B5D5B5',
    doneShade: '#8DAD8D',
    ears: 'bunny',
    earInner: '#F4D0D0',
    cheek: '#E89090',
  },
};

export const CHARACTER_LIST: CharacterDef[] = [
  CHARACTERS.clawd,
  CHARACTERS.catto,
  CHARACTERS.pup,
  CHARACTERS.bunny,
];

export function getCharacter(id: string | undefined): CharacterDef {
  if (id && id in CHARACTERS) return CHARACTERS[id as CharacterId];
  return CHARACTERS.clawd;
}
