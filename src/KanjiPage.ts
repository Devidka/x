import { Page, TextView, ScrollView, ImageView } from 'tabris';
import { IDictionaryEntry } from './interfaces';
import { openPage } from './app';
import { parseImage } from './util';

export default class KanjiPage extends Page {
  
  private data: IDictionaryEntry;

  constructor(data: IDictionaryEntry) {
    super();
    this.data = data;
    let scrollView = new ScrollView({ left: 0, top: 0, right: 0, bottom: 0 }).appendTo(this);
    scrollView.on('swipe:left', () => openPage(data.id ));
    scrollView.on('swipe:right', () => openPage(data.id - 2));
    let dataString = '';
    for (let key of Object.keys(this.data)) {
      dataString += key + ': ' + this.data[key] + '<br/>';
    }
    scrollView.append(
      this._createKanji(),
      new TextView({ class: 'usefulness', text: '★'.repeat(this.data.usefulness) + '☆'.repeat(5 - this.data.usefulness), font: '20px', textColor: 'rgb(226,192,40)' }),      
      new TextView({ class: 'meaning', text: this.data.meaning, textColor: 'green', font: '30px'}),
      new TextView({ class: 'number', text: 'number ' + this.data.id, font: '16px' }),
      //new TextView({ class: 'description'})
      new TextView({ class: 'other', markupEnabled: true, text: dataString, font: '20px'})
    )
    this.applyLayout();
  }

  applyLayout() {
    this.apply({
      '.number': {left:5, top: 5},
      '.usefulness': { right: 10, top: 10 },
      '.kanji': { left: 20, top: 10},
      '.meaning': {left: ['.kanji', 16], top: 40 },
      '.other': { left: 20, top: ['.kanji', 16], right: 0}
    });
  }

  _createKanji() {
    if (this.data.kanji.charAt(0) === '<') {
      return new ImageView({ class: 'kanji', image: parseImage(this.data.kanji), scaleMode: 'fit', width: 72, height: 100 });
    } else {
      return new TextView({ class: 'kanji', text: this.data.kanji, font: '72px'});
    }
  }

}
