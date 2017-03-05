import { Page, TextView, ScrollView, ImageView, Composite, Widget } from 'tabris';
import { IDictionaryEntry, IJukugo, IKunyomi, ILookalikeSet } from './interfaces';
import { parseImage, getUsefulnessStars, createKanji, getOnyomi } from './util';
import { applyColors } from './resources';

const MAIN_KANJI_SIZE = 80;
const TEMP_KUN_KANJI_SETTING = true;

export default class KanjiPage extends Page {

  constructor(data: IDictionaryEntry, title?: string) {
    super();
    this.title = title + '  ' + data.kanji;
    let scrollView = new ScrollView({ left: 0, top: 0, right: 0, bottom: 0 }).appendTo(this);
    scrollView.on('swipe:left', () => this.trigger('navigate', { target: this, offset: 1 }));
    scrollView.on('swipe:right', () => this.trigger('navigate', { target: this, offset: -1 }));
    scrollView.append(
      createKanji(data, MAIN_KANJI_SIZE),
      this.createComponentsDisplay(data.components),
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
        });
    }
    data.jukugo.forEach(jukugo => {
      this.createJukugoDisplay(jukugo).appendTo(scrollView);
    });
    data.lookalikeSets.forEach(set => {
      this.createLookalikeDisplay(set);
    });
    this.createUsedInDisplay(data.usedIn);

    applyColors(this);
    this.applyLayout();
  }

  createComponentsDisplay(components: { kanji: string, kanjiImageSource: string, meaning: string }[]) {
    let composite = new Composite({ class: 'components' });
    let prev: any = 0;
    components.forEach(component => {
      prev = new TextView({ top: 0, left: prev, class: 'componentKanji', text: component.kanji + ' ' }).appendTo(composite);
      let meaning = '(' + component.meaning + ')';
      meaning += components.indexOf(component) == components.length - 1 ? '' : ' + '
      prev = new TextView({ top: 0, left: prev, class: 'componentMeaning', text: meaning }).appendTo(composite);
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
    return new Composite();
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
      '#usefulness': { right: 10, top: 10 },
      '.strokeCount': { right: 10, top: ['.usefulness', 2] },
      '.kanji': { left: 20, top: 20 },
      '.components': { left: 20, top: ['.kanji', 0] },
      '.translation': { left: ['.kanji', 16], top: 35 },
      '#onLabel': { left: ['.kanji', 16], top: ['.translation', 0] },
      '.onyomi': { left: ['#onLabel', 0], baseline: '#onLabel' },
      '.mnemonic': { top: ['.components', 5], left: 20, right: 20 },
      '#kunLabel': { left: 10, top: ['.mnemonic', 5] },
      '.kunyomi': { top: ['prev()', 0], left: 20, right: 20 }
    });
  }

}
