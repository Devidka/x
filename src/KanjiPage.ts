import { Page, TextView, ScrollView, ImageView, Composite } from 'tabris';
import { IDictionaryEntry, IJukugo, IKunyomi, ILookalikeSet } from './interfaces';
import { parseImage, getUsefulnessStars, createKanji, getOnyomi } from './util';
import { applyColors } from './resources';

const MAIN_KANJI_SIZE = 80;

export default class KanjiPage extends Page {

  constructor(data: IDictionaryEntry) {
    super();
    let scrollView = new ScrollView({ left: 0, top: 0, right: 0, bottom: 0 }).appendTo(this);
    scrollView.on('swipe:left', () => this.trigger('navigate', { target: this, offset: 1 }));
    scrollView.on('swipe:right', () => this.trigger('navigate', { target: this, offset: -1 }));
    scrollView.append(
      createKanji(data, MAIN_KANJI_SIZE),
      this.createComponentsDisplay(data.components),
      new TextView({ class: 'usefulness', text: getUsefulnessStars(data), font: '20px' }),
      new TextView({ class: 'strokeCount', text: data.strokeCount + ' strokes', font: '15px' }),
      new TextView({ class: 'translation', text: data.meaning, font: '30px' }),
      new TextView({ class: 'number', text: 'number ' + data.number, font: '16px' }),
      new TextView({ class: 'label', id: 'onLabel', text: 'On: ', font: '24px' }),
      new TextView({ class: 'onyomi', text: getOnyomi(data), font: '24px' }),
      new TextView({ class: 'mnemonic', text: data.mnemonic, font: "20px", markupEnabled: true })
    )
    for (let kunyomi of data.kunyomi) {
      this.createKunyomiDisplay(kunyomi).appendTo(scrollView);
    }
    for (let jukugo of data.jukugo) {
      this.createJukugoDisplay(jukugo).appendTo(scrollView);
    }
    for (let set of data.lookalikeSets) {
      this.createLookalikeDisplay(set);
    }
    this.createUsedInDisplay(data.usedIn);

    applyColors(this);
    this.applyLayout();
  }

  createComponentsDisplay(components: { kanji: string, kanjiImageSource: string, meaning: string }[]) {
    return new Composite();
  }

  createKunyomiDisplay(kunyomi: IKunyomi) {
    return new Composite();
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
      '.usefulness': { right: 10, top: 10 },
      '.strokeCount': { right: 10, top: ['.usefulness', 2] },
      '.kanji': { left: 20, top: 20 },
      '.translation': { left: ['.kanji', 16], top: 35 },
      '#onLabel': { left: ['.kanji', 16], top: ['.translation', 0] },
      '.onyomi': { left: ['#onLabel', 0], baseline: '#onLabel' },
      '.mnemonic': { top: ['.kanji', 5], left: 20, right: 20}
    });
  }

}
