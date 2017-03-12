import { IKanji } from './Interfaces';
import { CollectionView, Composite, Cell, TextView, ImageView, device, ui } from 'tabris';
import KanjiPage from './Kanjipage';
import { getUsefulnessStars } from "./util";
import { applyColors, applyFonts } from "./resources";


export default class EntryCollectionView extends CollectionView {

  data: IKanji[];

  get length(): number {
    return this.data.length;
  }

  constructor(data: IKanji[], properties?) {
    properties = properties || {};
    properties.class = 'entryCollectionView';
    properties.items = data;
    properties.itemHeight = 60;
    properties.initializeCell = (cell) => {
      cell.append(
        new TextView({ class: 'usefulness', left: 5, top: 0 }),
        new TextView({ class: 'kanjiText', left: 10, top: 'prev()', font: '30px', }),
        new TextView({ class: 'meaningText', left: ['.kanjiText', 10], top: 25, font: '20px', textColor: 'green' }),
        new Composite({ left: 0, right: 0, bottom: 0, height: 1, background: '#bbb' })
      )
      cell.on('change:item', function (widget, entry) {
        cell.apply({
          '.kanjiText': { text: entry.kanji },
          '.meaningText': { text: entry.meaning },
          '.usefulness': { text: getUsefulnessStars(entry) }
        });
        applyColors(cell);
        applyFonts(cell);
      });
    };
    super(properties);
    this.data = data;
  }

  public getEntry(index: number): IKanji {
    return this.data[index];
  }

}