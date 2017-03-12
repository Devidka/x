import { Page, TextView, ScrollView, ImageView, Composite, Widget } from 'tabris';
import { IKanji, IJukugo, IKunyomi, ILookalikeSet } from './interfaces';
import { parseImage, getUsefulnessStars, createKanji, getOnyomi, createTag, createKanjiWithFurigana } from './util';
import { applyColors, applyFonts } from './resources';
import { dictionary } from "./app";

const MAIN_KANJI_SIZE = 80;
const TEMP_KUN_KANJI_SETTING = true;
const COLUMN_WIDTH = 110;

export default class KanjiPage extends Page {
  private kanji: string;

  constructor(data: IKanji, title?: string) {
    super();
    this.kanji = data.kanji;
    this.title = title + '  ' + data.kanji;
    let scrollView = new ScrollView({ left: 0, top: 0, right: 0, bottom: 0 }).appendTo(this);
    scrollView.on('swipe:left', () => this.trigger('navigate', { target: this, offset: 1 }));
    scrollView.on('swipe:right', () => this.trigger('navigate', { target: this, offset: -1 }));
    scrollView.append(
      createKanji(data, MAIN_KANJI_SIZE),
      this.createComponentsDisplay(data.components).set("id", "components"),
      new TextView({ class: 'usefulness', id: 'usefulness', text: getUsefulnessStars(data) }),
      new TextView({ class: 'strokeCount', text: data.strokeCount + ' strokes' }),
      new TextView({ id: 'meaning', text: data.meaning }),
      new TextView({ class: 'number', text: 'number ' + data.number }),
      new TextView({ class: 'label', id: 'onLabel', text: 'On: ' }),
      new TextView({ class: 'onyomi', text: getOnyomi(data) }),
      new TextView({ class: 'mnemonic', text: data.mnemonic, markupEnabled: true })
    )
    if (data.kunyomi && data.kunyomi.length > 0) {
      new TextView({ class: 'label', id: 'kunLabel', text: 'Kunyomi: ' }).appendTo(scrollView),
        data.kunyomi.forEach(kunyomi => {
          this.createKunyomiDisplay(kunyomi).appendTo(scrollView);
          new Composite({ class: 'seperator', height: 1, background: '#ddd' }).appendTo(scrollView);
        });
    }
    if (data.jukugo && data.jukugo.length > 0) {
      new TextView({ class: 'label', id: 'jukugoLabel', text: 'Jukugo: ' }).appendTo(scrollView),
        data.jukugo.forEach(jukugoIndex => {
          this.createJukugoDisplay(dictionary.jukugo[jukugoIndex]).appendTo(scrollView);
          new Composite({ class: 'seperator', height: 1, background: '#ddd' }).appendTo(scrollView);
        });
    }
    let prev = scrollView.find('.strokeCount')[0];
    data.tags.forEach(tag => {
      prev = createTag(tag).set({ top: [prev, 2], right: 10 }).appendTo(scrollView);
    })
    data.lookalikeSets.forEach(set => {
      this.createLookalikeDisplay(set);
    });
    this.createUsedInDisplay(data.usedIn);

    applyColors(this);
    applyFonts(this);
    this.applyLayout();
  }

  createComponentsDisplay(components: { kanji: string, kanjiImageSource?: string, meaning: string }[], maxColumns?: number) {
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

  createKunyomiDisplay(kunyomi: IKunyomi) {
    let composite = new Composite({ class: 'kunyomi' });
    let rightSide = new Composite({ left: COLUMN_WIDTH, top: 0, bottom: 0, right: 0 }).appendTo(composite);
    let leftSide = new Composite({ left: 0, right: [rightSide, 8], top: 0, bottom: 0 }).appendTo(composite);
    let offset = 5;
    let topMargin = TEMP_KUN_KANJI_SETTING ? 8 : 0;
    let stars = new TextView({ class: 'usefulness', text: getUsefulnessStars(kunyomi) })
      .set({ top: 0, right: 0 })
      .appendTo(leftSide);
    new TextView({ class: 'meaning', left: stars, text: kunyomi.description })
      .set({ top: 20, left: 0 })
      .appendTo(rightSide);
    let prev: any = 0;
    if (kunyomi.postParticle != null) {
      prev = new TextView({ class: 'particle', text: kunyomi.postParticle })
        .set({ right: [prev, offset], top: [stars, topMargin] })
        .appendTo(leftSide);
      offset = 0;
    }
    if (kunyomi.okurigana != null) {
      prev = new TextView({ class: 'kana', text: kunyomi.okurigana })
        .set({ right: [prev, offset], top: [stars, topMargin] })
        .appendTo(leftSide);
      offset = 0;
      if (!TEMP_KUN_KANJI_SETTING) {
        prev = new TextView({ class: 'kana', text: '*' })
          .set({ right: prev, top: stars })
          .appendTo(leftSide);
      }
    }
    if (!TEMP_KUN_KANJI_SETTING) {
      prev = new TextView({ class: 'kana', text: kunyomi.reading })
        .set({ right: [prev, offset], top: stars })
        .appendTo(leftSide);
    } else {
      let kanjiBox = createKanjiWithFurigana(this.kanji, kunyomi.reading).set({ right: [prev, offset], top: 15 }).appendTo(leftSide)
      prev = kanjiBox;
    }
    if (kunyomi.preParticle != null) {
      prev = new TextView({ class: 'particle', text: kunyomi.preParticle })
        .set({ right: prev, top: [stars, topMargin] })
        .appendTo(composite);
    }
    return composite;
  }

  createJukugoDisplay(jukugo: IJukugo) {
    let composite = new Composite({ class: 'jukugo' });
    let rightSide = new Composite({ left: COLUMN_WIDTH, top: 0, bottom: 0, right: 0 }).appendTo(composite);
    let leftSide = new Composite({ left: 0, right: [rightSide, 8], top: 0, bottom: 0 }).appendTo(composite);
    let stars = new TextView({ class: 'usefulness', text: getUsefulnessStars(jukugo) })
      .set({ top: 0, right: 0 })
      .appendTo(leftSide);
    let prev: any = 0;
    if (jukugo.postParticle != null) {
      prev = new TextView({ class: 'post particle', text: jukugo.postParticle })
        .set({ top: 29, right: prev })
        .appendTo(leftSide);
    }
    if (jukugo.okurigana.post != null) {
      prev = new TextView({ class: 'post okurigana', text: jukugo.okurigana.post })
        .set({ top: 26, right: prev })
        .appendTo(leftSide);
    }

    let kanjiBox = createKanjiWithFurigana(jukugo.kanji, jukugo.reading).set({ right: prev, top: 15 }).appendTo(leftSide);
    prev = kanjiBox;

    if (jukugo.okurigana.pre != null) {
      prev = new TextView({ class: 'pre okurigana', text: jukugo.okurigana.pre })
        .set({ top: 26, right: prev })
        .appendTo(leftSide);
    }

    if (jukugo.preParticle != null) {
      new TextView({ class: 'particle', text: jukugo.preParticle })
        .set({ top: 29, right: prev })
        .appendTo(leftSide);
    }
    prev = 0;
    jukugo.tags.forEach(tag => {
      prev = createTag(tag, 12).set({ top: kanjiBox, right: [prev, 3] }).appendTo(leftSide);
    })
    this.createComponentsDisplay(jukugo.components, 2).set({ left: 0, top: 5, right: 0 }).appendTo(rightSide);
    new TextView({ class: 'meaning', text: jukugo.meaning }).set({ top: 'prev()' }).appendTo(rightSide);
    if (jukugo.description) {
      new TextView({ class: 'description', text: jukugo.description }).set({ top: 'prev()' }).appendTo(rightSide);
    }
    return composite;
  }

  createLookalikeDisplay(set: ILookalikeSet) {
    return new Composite();
  }

  createUsedInDisplay(kanji: { kanji: string, kanjiImageSource: string }[]) {
    return new Composite();
  }

  applyLayout() {
    this.apply({
      '.number': { centerX: 0, top: 5 },
      '#usefulness': { left: 10, top: 8 },
      '.strokeCount': { right: 10, top: 10 },
      '.mainKanji': { left: 20, top: 20 },
      '#components': { left: 20, top: ['#onLabel', 5] },
      '#meaning': { left: ['.mainKanji', 10], top: 38, right: 100 },
      '#onLabel': { left: ['.mainKanji', 10], top: ['#meaning', 0] },
      '.onyomi': { left: ['#onLabel', 0], baseline: '#onLabel', right: '.tag' },
      '.mnemonic': { top: ['.components', 5], left: 20, right: 20 },
      '#kunLabel': { left: 10, top: ['.mnemonic', 5] },
      '.kunyomi': { top: ['prev()', 0], left: 0, right: 20 },
      '#jukugoLabel': { left: 10, top: ['prev()', 5] },
      '.jukugo': { top: ['prev()', 0], left: 0, right: 20 },
      '.seperator': { top: ['prev()', 3], left: 20, right: 20 }
    });
  }

}
