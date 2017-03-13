import { IKanji, IJukugo } from './Interfaces';
import { CollectionView, Composite, Cell, TextView, ImageView, device, ui, Page } from 'tabris';
import KanjiPage from './Kanjipage';
import { getUsefulnessStars, getType } from "./util";
import { applyColors, applyFonts, fonts } from "./resources";
import { navigationView } from "./app";

export default class EntryCollectionView extends CollectionView {

  static createSearchResultEntryCollectionView(dictionary: (IKanji | IJukugo)[]) {
  return new EntryCollectionView(dictionary)
    .on('select', (collection: EntryCollectionView, entry, { index }) => {
      let entryNum = index;
      let openNextPage = (event?: { target: Page, offset: number }) => {
        if (event) {
          event.target.dispose();
          entryNum = (entryNum + event.offset) % collection.length;
          entryNum = (entryNum < 0) ? collection.length + entryNum : entryNum;
        }
        new KanjiPage(collection.getEntry(entryNum) as IKanji, (entryNum + 1) + '/' + collection.length).on('navigate', openNextPage).appendTo(navigationView);
      };
      openNextPage();
    })
}


  data: (IKanji | IJukugo)[];

  get length(): number {
    return this.data.length;
  }

  constructor(data: (IKanji | IJukugo)[], properties?) {
    properties = properties || {};
    properties.class = 'entryCollectionView';
    properties.items = data;
    properties.itemHeight = 60;
    properties.initializeCell = (cell) => {
      cell.append(
        new TextView({ class: 'kanjiText', left: 10, centerY: 0, font: '30px', }),
        new TextView({ class: 'meaningText', left: ['.kanjiText',10], right: ['.usefulness', 10], centerY: 0, font: '20px', textColor: 'green' }),
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
    };
    super(properties);
    this.data = data;
  }

  public getEntry(index: number): (IKanji | IJukugo) {
    return this.data[index];
  }

}