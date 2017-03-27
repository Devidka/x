import { IKanji, IJukugo, IFact } from './Interfaces';
import { CollectionView, Composite, Cell, TextView, ImageView, device, ui, Page, PageProperties, ActivityIndicator } from 'tabris';
import KanjiPage from './Kanjipage';
import { getUsefulnessStars, getType } from "./util";
import { applyColors, applyFonts, fonts } from "./resources";
import { navigationView } from "./app";
import FactList from "./FactList";

export default class FactListPage extends Page {

  private entryCollectionView: CollectionView;
  public facts: FactList;

  constructor(facts: FactList, title?: string) {
    super({ title });
    this.facts = facts;
    this.entryCollectionView = new CollectionView({
      left: 0, top: 0, right: 0, bottom: 0,
      items: this.facts.asArray(),
      itemHeight: 60,
      initializeCell: this.initializeCell
    }).on('select', this.handleSelectCell.bind(this)).appendTo(this);
    this.on('appear', () => {
      navigationView.apply({
        '#expandAction': { visible: true },
        '#filterAction': { visible: true }
      });
    });
    this.on('disappear', () => {
      navigationView.apply({
        '#expandAction': { visible: false },
        '#filterAction': { visible: false }
      });
    });
  }

  private initializeCell(cell: Cell) {
    cell.append(
      new TextView({ class: 'kanjiText', left: 10, centerY: 0, font: '30px', }),
      new TextView({ class: 'meaningText', left: ['.kanjiText', 10], right: ['.usefulness', 10], centerY: 0, font: '20px', textColor: 'green' }),
      new TextView({ class: 'usefulness', centerY: 0, right: 5 }),
      new Composite({ left: 0, right: 0, bottom: 0, height: 1, background: '#bbb' })
    )
    cell.on('change:item', (event) => {
      let kanjiText = event.value.kanji;
      if (event.value.okurigana) {
        kanjiText = event.value.okurigana.pre + kanjiText + event.value.okurigana.post;
      }
      cell.apply({
        '.kanjiText': { text: kanjiText, font: fonts['entryCollection_' + getType(event.value)] },
        '.meaningText': { text: event.value.meaning },
        '.usefulness': { text: getUsefulnessStars(event.value.usefulness) }
      });
      applyColors(cell);
      applyFonts(cell);
    });
  }

  private handleSelectCell(event) {
    let then = Date.now();
    let entryNum = event.index;
    new KanjiPage().applyData(this.facts.get(entryNum) as IKanji).on('navigate', event => {
      entryNum = (entryNum + event.offset) % this.facts.length;
      entryNum = (entryNum < 0) ? this.facts.length + entryNum : entryNum;
      event.target.applyData(this.facts.get(entryNum));
    }).appendTo(navigationView);
    console.log(Date.now() - then);
  };
}


