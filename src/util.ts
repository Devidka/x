import { TextView, ImageView } from 'tabris';
import { toHiragana, toKatakana } from './wanakana';
import { config } from './app'

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
  return new TextView({ class: 'kanji', text: data.kanji, font: size + 'px' });
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
    return result.join(", ");
  }
}