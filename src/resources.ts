import { Composite } from 'tabris';

export let colors = {
  usefulness: '#ffc40d',
  tagContainer: '#2d6987',
  onyomi: '#f89406',
  mainMeaning: '#46a546',
  particle: '#06c',
  componentKanji: '#9d261d',
  usedIn: '#08c',
  lookalike: '#08c',
  backgroundBlur: 'rgba(120,120,120,0.3)'
}

export let fonts = {
  mainUsefulness: '20px',
  usefulness: '14px',
  mainMeaning: '30px',
  number: '16px',
  strokeCount: '16px',
  component: '14px',
  label: '26px',
  smallLabel: '18px',
  onyomi: '26px',
  mnemonic: '18px',
  meaning: '18px',
  kana : '18px',
  description: '16px',
  particle: '16px',
  furigana: '10px',
  kanji: '20px',
  okurigana: '20px',
  mainKanji: '80px',
  mainComponent: '18px',
  entryCollection_kanji: '30px',
  entryCollection_jukugo: '18px',
  entryCollection_kunyomi: '18px',
  mainTag: 'bold 16px',
  wordTag: 'bold 12px',
}

export function applyColors(composite: Composite) {
  if (composite.children().length === 0) return;
  let colorsApply = {};
  Object.keys(colors).forEach(key => {
    colorsApply['.' + key] = {textColor: colors[key], tintColor: colors[key]}
  })
  composite.apply(colorsApply);
}

export function applyFonts(composite: Composite) {
  if (composite.children().length === 0) return;
  let fontsApply = {};
  Object.keys(fonts).forEach(key => {
    fontsApply['.' + key] = {font: fonts[key]}
  })
  composite.apply(fontsApply);
}
