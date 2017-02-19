import { Page, TextView, ScrollView, ImageView } from 'tabris';
import { IDictionaryEntry } from './interfaces';
import { parseImage, getUsefulnessStars, createKanji } from './util';
import { applyColors } from './resources';

const MAIN_KANJI_SIZE = 80;

export default class KanjiPage extends Page {
  
  constructor(data: IDictionaryEntry) {
    super();
    let scrollView = new ScrollView({ left: 0, top: 0, right: 0, bottom: 0 }).appendTo(this);
    scrollView.on('swipe:left', () => this.trigger('navigate', {target: this, offset: 1}));
    scrollView.on('swipe:right', () => this.trigger('navigate', {target: this, offset: -1}));    
    scrollView.append(
      createKanji(data, MAIN_KANJI_SIZE),
      new TextView({ class: 'usefulness', text: getUsefulnessStars(data), font: '20px' }),
      new TextView({ class: 'translation', text: data.meaning, font: '30px' }),
      new TextView({ class: 'number', text: '' + data.number, font: '16px' }),
      new TextView({ class: 'label', id: 'onLabel', text: 'On: ', font: '24px' }),
      new TextView({ class: 'onyomi', text: data.onyomi, font: '24px' }),
      //new TextView({ class: 'description'})
    )
    applyColors(this);
    this.applyLayout();
  }

  applyLayout() {
    this.apply({
      '.number': { centerX: 0, top: 5 },      
      '.usefulness': { right: 10, top: 10 },
      '.kanji': { left: 20, top: 20},
      '.translation': { left: ['.kanji', 16], top: 50 },
      '#onLabel': { left: 20, top: ['.kanji', 5] },
      '.onyomi': {left: ['#onLabel', 10], baseline: '#onLabel'}
    });
  }

}
