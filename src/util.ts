import { TextView, ImageView, Composite } from 'tabris';
import { toHiragana, toKatakana } from './wanakana';
import { config } from './app';
import { colors } from './resources';
import { IKanji } from "./interfaces";

export function parseImage(tag) {
  return '../images/dictionary/' + tag.split('"')[1];
}

export function getUsefulnessStars(data: { usefulness: number }) {
  let stars = '';
  for (let i = 0; i <= 5; i++) stars += data.usefulness > i ? '★' : '☆';
  return stars;
}

export function createKanji(data: { kanji: string, kanjiImageSource?: string }, size: number) {
  if (data.kanjiImageSource) {
    console.error('drawing image kanji is not yet supportet')
  }
  return new TextView({ class: 'mainKanji', text: data.kanji, font: size + 'px' });
}

export function getOnyomi(data: { onyomi: string[] }) {
  let result = [];
  for (let yomi of data.onyomi) {
    switch (config.onMode) {
      case "hiragana":
        result.push(toHiragana(yomi));
        break;
      case "katakana":
        result.push(toKatakana(yomi));
        break;
      default:
        result.push(yomi);
    }
  }
  return result.join(", ");
}

export function createTag(tag: string, size = 16) {
  const INNER_MARGIN = 3;
  return new Composite({ class: 'tag', cornerRadius: 3, background: colors.tag }).append(
    new TextView({
      left: INNER_MARGIN,
      right: INNER_MARGIN,
      text: tag,
      textColor: 'white',
      font: 'bold ' + size + 'px'
    })
  );
}

export function findKanji(collection: IKanji[], kanji: string[]) {
  return collection.filter((entry => kanji.indexOf(entry.kanji) != -1));
}
