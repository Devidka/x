import { CollectionView, Composite, Cell, TextView, ImageView, device } from 'tabris';
import { openPage } from './app';

export default class EntryCollection extends CollectionView {

  constructor(data, properties) {
    properties.initializeCell = (cell) => {
      console.log('initCell');
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
        console.log(entry.kanji);
        kanjiText.text = entry.kanji;
        meaningText.text = entry.meaning;
      });
    };
    properties.items = data;
    properties.itemHeight = 60;
    super(properties);
    this.on('select', function (target, descriptor) {      
      openPage(descriptor.id);
    });
  }

}