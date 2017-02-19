import { IDictionaryEntry } from './Interfaces';
import { CollectionView, Composite, Cell, TextView, ImageView, device, ui } from 'tabris';
import KanjiPage from './Kanjipage';


export default class EntryCollection extends CollectionView {

  constructor(data: IDictionaryEntry[], properties) {
    properties.items = data;
    properties.itemHeight = 60;
    properties.initializeCell = (cell) => {
      new Composite({
        left: 0, right: 0, bottom: 0, height: 1,
        background: '#bbb'
      }).appendTo(cell);
      var kanjiText = new TextView({
        left: 10, centerY: 0,
        font: '30px',
      }).appendTo(cell);
      var meaningText = new TextView({
        left: [kanjiText, 10], centerY: 0,
        font: '20px',
        textColor: 'green'
      }).appendTo(cell);
      cell.on('change:item', function (widget, entry) {
        kanjiText.text = entry.kanji;
        meaningText.text = entry.meaning;
      });
    };    
    super(properties);
  }

}