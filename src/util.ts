import { TextView, ImageView, Composite } from 'tabris';
import { toHiragana, toKatakana } from './wanakana';
import { config, dictionary } from './app';
import { colors, fonts } from './resources';
import { IKanji, IFact } from "./interfaces";

export function parseImage(tag) {
  return '../images/dictionary/' + tag.split('"')[1];
}

export function getUsefulnessStars(usefulness: number) {
  let stars = '';
  for (let i = 0; i < 5; i++) stars += usefulness > i ? '★' : '☆';
  stars += usefulness == 6 ? '★' : '';
  return stars;
}

export function createKanji(data: { kanji: string, kanjiImageSource?: string }, size: number) {
  if (data.kanjiImageSource) {
    console.error('drawing image kanji is not yet supportet')
  }
  return new TextView({ class: 'mainKanji', text: data.kanji, font: size + 'px' });
}

export function createKanjiWithFurigana(kanji: string, furigana: string) {
  let kanjiBox = new Composite({class: 'kanjiBox'});
  new TextView({ class: 'furigana', text: furigana })
    .set({ top: 2, centerX: 0 })
    .appendTo(kanjiBox);
  new TextView({ class: 'kanji', text: kanji })
    .set({ top: 10, centerX: 0 })
    .appendTo(kanjiBox);
  return kanjiBox;
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

export function createTag(textClass: string) {
  const INNER_MARGIN = 3;
  return new Composite({ class: 'tag', cornerRadius: 3, background: colors.tagContainer }).append(
    new TextView({
      class: textClass,
      font: fonts[textClass],
      left: INNER_MARGIN,
      right: INNER_MARGIN,
      textColor: 'white',      
    })
  );
}

export function findKanji(collection: IKanji[], kanji: string[]) {
  return collection.filter((entry => kanji.indexOf(entry.kanji) != -1));
}

export function getType(object: IFact) {
  if (object.id.slice(0, 1) == 'k') return "kanji";
  if (object.id.slice(0, 1) == 'j') return "jukugo";
  if (object.id.slice(0, 3) == 'kun') return "kunyomi";
  return "undefined";
}


