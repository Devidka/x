import { Page, TextView, ScrollView, ImageView, Composite, Widget } from 'tabris';
import { IDictionaryEntry, IJukugo, IKunyomi, ILookalikeSet } from './interfaces';
import { parseImage, getUsefulnessStars, createKanji, getOnyomi, createTag } from './util';
import { applyColors } from './resources';

const MAIN_KANJI_SIZE = 80;
const TEMP_KUN_KANJI_SETTING = true;
const COLUMN_WIDTH = 110;

export default class KanjiPage extends Page {

  constructor(data: IDictionaryEntry, title?: string) {
    super();
    this.title = title + '  ' + data.kanji;
    let scrollView = new ScrollView({ left: 0, top: 0, right: 0, bottom: 0 }).appendTo(this);
    scrollView.on('swipe:left', () => this.trigger('navigate', { target: this, offset: 1 }));
    scrollView.on('swipe:right', () => this.trigger('navigate', { target: this, offset: -1 }));
    let prev = scrollView.find('.strokeCount')[0];
    data.tags.forEach(tag => {
      prev = createTag(tag).set({ top: [prev, 2], right: 10 }).appendTo(scrollView);
    })
    scrollView.append(
      createKanji(data, MAIN_KANJI_SIZE),
      this.createComponentsDisplay(data.components).set("id", "components"),
      new TextView({ class: 'usefulness', id: 'usefulness', text: getUsefulnessStars(data), font: '20px' }),
      new TextView({ class: 'strokeCount', text: data.strokeCount + ' strokes', font: '15px' }),
      new TextView({ class: 'translation', text: data.meaning, font: '30px' }),
      new TextView({ class: 'number', text: 'number ' + data.number, font: '16px' }),
      new TextView({ class: 'label', id: 'onLabel', text: 'On: ', font: '24px' }),
      new TextView({ class: 'onyomi', text: getOnyomi(data), font: '24px' }),
      new TextView({ class: 'mnemonic', text: data.mnemonic, font: "18px", markupEnabled: true })
    )
    if (data.kunyomi && data.kunyomi.length > 0) {
      new TextView({ class: 'label', id: 'kunLabel', text: 'Kunyomi: ', font: '26px' }).appendTo(scrollView),
        data.kunyomi.forEach(kunyomi => {
          this.createKunyomiDisplay(kunyomi).appendTo(scrollView);
          new Composite({ class: 'seperator', height: 1, background: '#ddd' }).appendTo(scrollView);
        });
    }
    if (data.jukugo && data.jukugo.length > 0) {
      new TextView({ class: 'label', id: 'jukugoLabel', text: 'Jukugo: ', font: '26px' }).appendTo(scrollView),
        data.jukugo.forEach(jukugo => {
          this.createJukugoDisplay(jukugo).appendTo(scrollView);
          new Composite({ class: 'seperator', height: 1, background: '#ddd' }).appendTo(scrollView);
        });
    }
    data.lookalikeSets.forEach(set => {
      this.createLookalikeDisplay(set);
    });
    this.createUsedInDisplay(data.usedIn);

    applyColors(this);
    this.applyLayout();
  }

  createComponentsDisplay(components: { kanji: string, kanjiImageSource?: string, meaning: string }[], maxColumns?: number) {
    let composite = new Composite({ class: 'components' });
    let prevLeft: any = 0;
    let prevTop: any = 0;
    let columns = 0;
    components.forEach(component => {
      columns++;
      prevLeft = new TextView({ top: prevTop, left: prevLeft, class: 'componentKanji', text: component.kanji + ' ' }).appendTo(composite);
      let meaning = '(' + component.meaning + ')';
      meaning += components.indexOf(component) == components.length - 1 ? '' : ' + '
      prevLeft = new TextView({ top: prevTop, left: prevLeft, class: 'componentMeaning', text: meaning }).appendTo(composite);
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
    let offset = 5;
    let stars = new TextView({ class: 'usefulness', left: 0, top: 0, text: getUsefulnessStars(kunyomi) }).appendTo(composite);
    let prev = new TextView({ class: 'kunMeaning', left: stars, top: [stars, 3], right: 0, text: kunyomi.translation }).appendTo(composite);
    if (kunyomi.postParticle != null) {
      prev = new TextView({ class: 'post particle', right: [prev, offset], top: stars, text: kunyomi.postParticle }).appendTo(composite);
      offset = 0;
    }
    if (kunyomi.okurigana != null) {
      prev = new TextView({ class: 'kun okurigana', right: [prev, offset], top: stars, text: kunyomi.okurigana }).appendTo(composite);
      offset = 0;
      if (TEMP_KUN_KANJI_SETTING) prev = new TextView({ class: 'kun okuriStar', right: prev, top: stars, text: '*' }).appendTo(composite);
    }
    prev = new TextView({ class: 'kun reading', right: [prev, offset], top: stars, text: kunyomi.reading }).appendTo(composite);
    if (kunyomi.preParticle != null) prev = new TextView({ class: 'pre particle', right: prev, top: stars, text: kunyomi.preParticle }).appendTo(composite);
    composite.apply({
      '*': { font: '18px' },
      '.kunMeaning': { font: '16px' }
    });
    return composite;
  }

  createJukugoDisplay(jukugo: IJukugo) {
    let composite = new Composite({ class: 'jukugo' });
    let rightSide = new Composite({ left: COLUMN_WIDTH, top: 0, bottom: 0, right: 0 }).appendTo(composite);
    let leftSide = new Composite({ left: 0, right: [rightSide, 8], top: 0, bottom: 0 }).appendTo(composite);
    let stars = new TextView({ class: 'usefulness', top: 0, right: 0, text: getUsefulnessStars(jukugo) }).appendTo(leftSide);
    let kanjiBox = new Composite({ right: 0, top: 15 }).appendTo(leftSide);
    new TextView({ class: 'juk reading', top: 2, centerX: 0, text: jukugo.reading, font: "10px" }).appendTo(kanjiBox);
    new TextView({ top: 10, centerX: 0, text: jukugo.kanji, font: "20px" }).appendTo(kanjiBox);
    //new TextView({ class: 'juk kanji', top: 100, text: jukugo.kanji, font: "20px" }).appendTo(leftSide);
    // if (jukugo.postParticle != null) {
    //   prev = new TextView({ class: 'post particle', top: reading, right: 0, text: jukugo.postParticle }).appendTo(leftSide);
    // }
    // if (jukugo.postParticle != null) {
    //   new TextView({ class: 'pre particle', top: reading, right: prev, text: jukugo.preParticle }).appendTo(leftSide);
    // }
    let prev: any = 0;
    jukugo.tags.forEach(tag => {
      prev = createTag(tag, 12).set({ top: kanjiBox, right: [prev, 3] }).appendTo(leftSide);
    })
    prev = 0;
    this.createComponentsDisplay(jukugo.components, 2).set({ left: 0, top: 5, right:0 }).appendTo(rightSide);
    new TextView({ class: 'jukugoMeaning', top: 'prev()', font: "20px", text: jukugo.translation }).appendTo(rightSide);
    if (jukugo.description) {
      new TextView({ class: 'jukugoDescription', top: 'prev()', font: "16px", text: jukugo.description }).appendTo(rightSide);
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
      '.kanji': { left: 20, top: 20 },
      '#components': { left: 20, top: ['#onLabel', 5] },
      '.translation': { left: ['.kanji', 10], top: 38, right: 100 },
      '#onLabel': { left: ['.kanji', 10], top: ['.translation', 0] },
      '.onyomi': { left: ['#onLabel', 0], baseline: '#onLabel', right: 100 },
      '.mnemonic': { top: ['.components', 5], left: 20, right: 20 },
      '#kunLabel': { left: 10, top: ['.mnemonic', 5] },
      '.kunyomi': { top: ['prev()', 0], left: 20, right: 20 },
      '#jukugoLabel': { left: 10, top: ['prev()', 5] },
      '.jukugo': { top: ['prev()', 0], left: 0, right: 20 },
      '.seperator': { top: ['prev()', 3], left: 20, right: 20 }
    });
  }

}
