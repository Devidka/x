import { IKanji, IJukugo } from './Interfaces';
import { CollectionView, Composite, Cell, TextView, ImageView, device, ui } from 'tabris';
import KanjiPage from './Kanjipage';
import { getUsefulnessStars, getType } from "./util";
import { applyColors, applyFonts, fonts } from "./resources";

export default class EntryCollectionView extends CollectionView {

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
          '.usefulness': { text: getUsefulnessStars(entry) }
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