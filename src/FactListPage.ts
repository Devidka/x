import { IKanji, IJukugo, IFact } from './Interfaces';
import { CollectionView, Composite, Cell, TextView, ImageView, device, ui, Page, PageProperties } from 'tabris';
import KanjiPage from './Kanjipage';
import { getUsefulnessStars, getType } from "./util";
import { applyColors, applyFonts, fonts } from "./resources";
import { navigationView } from "./app";
import FactList from "./FactList";

interface FactListPageProperties extends PageProperties {
  facts: FactList;
}

export default class FactListPage extends Page {

  private entryCollectionView: CollectionView;
  public facts: FactList;

  constructor(properties: FactListPageProperties) {
    super(properties);
    this.facts = properties.facts;
    this.entryCollectionView = new CollectionView({
      left: 0, top: 0, right: 0, bottom: 0,
      items: this.facts.asArray(),
      itemHeight: 60,
      initializeCell: this.initializeCell
    }).on('select', this.handleSelectCell.bind(this)).appendTo(this);
    this.on('appear', () => {
      navigationView.apply({
        '#expandAction' : {visible: true},
        '#filterAction' : {visible: true}
      });
    });
    this.on('disappear', () => {
      navigationView.apply({
        '#expandAction' : {visible: false},
        '#filterAction' : {visible: false}
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
    cell.on('change:item', function (widget, entry) {
      let kanjiText = entry.kanji;
      if (entry.okurigana) {
        kanjiText = entry.okurigana.pre + kanjiText + entry.okurigana.post;
      }
      cell.apply({
        '.kanjiText': { text: kanjiText, font: fonts['entryCollection_' + getType(entry)] },
        '.meaningText': { text: entry.meaning },
        '.usefulness': { text: getUsefulnessStars(entry.usefulness) }
      });
      // if (getType(entry) === 'jukugo') {
      //   let kanjiTextView = cell.find('.kanjiText').first();
      //   cell.find('.meaningText').first().baseline = kanjiTextView;
      // }
      applyColors(cell);
      applyFonts(cell);
    });
  }

  private handleSelectCell(widget, entry, { index }) {
    let entryNum = index;
    let openNextPage = (event?: { target: Page, offset: number }) => {
      if (event) {
        event.target.dispose();
        entryNum = (entryNum + event.offset) % this.facts.length;
        entryNum = (entryNum < 0) ? this.facts.length + entryNum : entryNum;
      }
      new KanjiPage(this.facts.get(entryNum) as IKanji, (entryNum + 1) + '/' + this.facts.length).on('navigate', openNextPage).appendTo(navigationView);
    };
    openNextPage();
  }

}