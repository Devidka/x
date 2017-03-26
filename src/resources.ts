import { Composite } from 'tabris';

export let colors = {
  usefulness: '#ffc40d',
  tag: '#2d6987',
  onyomi: '#f89406',
  translation: '#46a546',
  particle: '#06c',
  component: '#9d261d',
  link: '#08c',
  backgroundBlur: 'rgba(120,120,120,0.3)'
}

export let fonts = {
  mainUsefulness: '20px',
  usefulness: '14px',
  meaning: '30px',
  number: '16px',
  strokeCount: '16px',
  component: '14px',
  mnemonic: '18px',
  label: '26px',
  smallLabel: '18px',
  onyomi: '26px',
  bigText: '18px',
  smallText: '16px',
  particle: '16px',
  furigana: '10px',
  kanji: '20px',
  mainKanji: '80px',
  mainComponent: '18px',
  entryCollection_kanji: '30px',
  entryCollection_jukugo: '18px',
  entryCollection_kunyomi: '18px'
}

export function applyColors(composite: Composite) {
  if (composite.children().length === 0) return;
  composite.apply({
    '.usefulness': { textColor: colors.usefulness },
    '.tagContainer': { background: colors.tag },
    '.onyomi': { textColor: colors.onyomi },
    '.mainMeaning': { textColor: colors.translation },
    '.particle': { textColor: colors.particle, tintColor: colors.particle },
    '.componentKanji': { textColor: colors.component, tintColor: colors.component },
    '.usedIn': { textColor: colors.link, tintColor: colors.link },
    '.lookalike': { textColor: colors.link, tintColor: colors.link },
  });
}

export function applyFonts(composite: Composite) {
  if (composite.children().length === 0) return;
  composite.apply({
    '.usefulness': {font: fonts.usefulness},
    '.mainUsefulness': {font: fonts.mainUsefulness},
    '.mainMeaning': {font: fonts.meaning},
    '.mainKanji': {font: fonts.mainKanji},
    '.label': {font: fonts.label},
    '.onyomi': {font: fonts.onyomi},
    '.mnemonic': {font: fonts.bigText},
    '.meaning': {font: fonts.bigText},
    '.description': {font: fonts.smallText},
    '.furigana': {font: fonts.furigana},
    '.particle': {font: fonts.particle},
    '.kana': { font: fonts.bigText },
    '.okurigana': {font: fonts.kanji},
    '.kanji': {font: fonts.kanji},
    '.component': {font: fonts.component},
    '.componentKanji': {font: fonts.component},
    '.smallLabel': {font: fonts.smallLabel},
    '.mainComponent': {font: fonts.mainComponent}
  })
}
