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

export function createTag(tag?: string, size = 16) {
  const INNER_MARGIN = 3;
  return new Composite({ class: 'tag', cornerRadius: 3, background: colors.tag }).append(
    new TextView({
      left: INNER_MARGIN,
      right: INNER_MARGIN,
      text: tag || '',
      textColor: 'white',
      font: 'bold ' + size + 'px'
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


// TODO: Revmoce in favor of Component Display class?
  export function createComponentsDisplay(components: { kanji: string, kanjiImageSource?: string, meaning: string }[], maxColumns?: number) {
    let composite = new Composite({ class: 'components' });
    let prevLeft: any = 0;
    let prevTop: any = 0;
    let columns = 0;
    components.forEach(component => {
      columns++;
      prevLeft = new TextView({ class: 'componentKanji', text: component.kanji + ' ' })
        .set({ top: prevTop, left: prevLeft })
        .appendTo(composite);
      let meaning = '(' + component.meaning + ')';
      meaning += components.indexOf(component) == components.length - 1 ? '' : ' + '
      prevLeft = new TextView({ class: 'componentMeaning', text: meaning })
        .set({ top: prevTop, left: prevLeft })
        .appendTo(composite);
      if (columns >= maxColumns) {
        columns = 0;
        prevTop = prevLeft;
        prevLeft = 0;
      }
    });
    return composite;
  }

