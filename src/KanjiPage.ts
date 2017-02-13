import { Page, TextView, ScrollView } from 'tabris';
import { IDictionaryEntry } from './interfaces';

export default class KanjiPage extends Page {
  
  private data: IDictionaryEntry;

  constructor(data: IDictionaryEntry) {
    super();
    this.data = data;
    let scrollView = new ScrollView({ left: 0, top: 0, right: 0, bottom: 0 }).appendTo(this);
    scrollView.append(
      new TextView({ class: 'kanji' }),
      new TextView({ class: 'usefulness' }),      
      //new TextView({ class: 'headline onyomi' }),
      //new TextView({ class: 'reading' }),
      //new TextView({ class: 'description'})
      new TextView({ class: 'other', markupEnabled: true})
    )
    this.applyContent();
    this.applyStyle();
    this.applyLayout();
  }

  applyContent() {
    let dataString = '';
    for (let key of Object.keys(this.data)) {
      dataString += key + ': ' + this.data[key] + '<br/>';
    }
    this.apply({
      '.kanji': { text: this.data.kanji},
      '.usefulness': { text: '★'.repeat(this.data.usefulness) + '☆'.repeat(5 - this.data.usefulness) },
      '.other': { text: dataString }
    });
  }

  applyStyle() {
    this.apply({
      '.kanji': { font: '72px'},
      '.usefulness': { font: '20px', textColor: 'rgb(226,192,40)' },
      '.other': { font: '16px'}
    });
  }

  applyLayout() {
    this.apply({
      '.kanji': { left: 20, top: 20},
      '.usefulness': { left: ['.kanji', 16], top: 20 },
      '.other': { left: 20, top: ['.kanji', 16], right: 0}
    });
  }
}