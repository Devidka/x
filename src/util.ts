import { TextView, ImageView, Composite } from 'tabris';
import { toHiragana, toKatakana } from './wanakana';
import { config, dictionary } from './app';
import { colors } from './resources';
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
  let kanjiBox = new Composite();
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

export function getType(object: Object) {
  if (object.hasOwnProperty("strokeCount")) return "kanji";
  if (object.hasOwnProperty("reading")) {
    if (object.hasOwnProperty("components")) return "jukugo";
    else return "kunyomi";
  }
  return "undefined";
}

export function addJukugo(data: IFact[], minUsefulness: number) {
  let newData = [];
  let addedJukugo: number[] = [];
  data.forEach(entry => {
    newData.push(entry);
    if (getType(entry) === 'kanji') {
      (entry as IKanji).jukugo.forEach(jukugoIndex => {
        let jukugo = dictionary.jukugo[jukugoIndex];
        // if (jukugoIndex < 5) {
        //   newData.forEach(oldEntry => {
        //     if (getType(oldEntry) == 'jukugo' && oldEntry.kanji == jukugo.kanji) {
        //       console.log(jukugo.kanji + ' ' + newData.indexOf(jukugo));
        //     }
        //   });
        // }
        if (jukugo.usefulness >= minUsefulness && addedJukugo.indexOf(jukugoIndex) === -1 && data.indexOf(jukugo) === -1) {
          newData.push(jukugo);
        }
      })
    }
  });
  return newData;
}
