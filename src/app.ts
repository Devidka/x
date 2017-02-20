import { Action, NavigationView, Page, Composite, TextView, SearchAction, device, Button, ui, WebView } from 'tabris';
import { IDictionaryEntry } from './interfaces';
import KanjiPage from './Kanjipage';
import EntryCollection from './EntryCollection';
import { toHiragana, toKatakana, toRomaji, isHiragana } from './wanakana'

export var config = {
  onMode: "romaji"
}

var navigationView = new NavigationView({
  left: 0, top: 0, right: 0, bottom: 0, animated: false
}).appendTo(ui.contentView);

var page = new Page({
  title: 'Search action'
}).appendTo(navigationView);
new Action({
  placementPriority: "low",
  title: "toggleKana"
}).on('select', () => {
  if (config.onMode == "romaji") {
    config.onMode = "hiragana";
  } else if (config.onMode == "hiragana") {
    config.onMode = "katakana";
  } else if (config.onMode == "katakana") {
    config.onMode = "romaji";
  }
  ui.contentView.find('.onyomi').forEach((widget: TextView) => {
    widget.text = config.onMode == "hiragana" ? toHiragana(widget.text) : config.onMode == "katakana" ? toKatakana(widget.text) : toRomaji(widget.text).toUpperCase();
  })
  console.error("onyomi now displayed as " + config.onMode);
}).appendTo(navigationView);

new SearchAction({
  title: 'Search',
  image: {
    src: device.platform === 'iOS' ? '../images/search-black-24dp@3x.png' : '../images/search-white-24dp@3x.png',
    scale: 3
  }
}).on('select', function () {
  this.text = '';
}).on('accept', function (widget, query) {
  //searchKanji(query);
}).appendTo(navigationView);


// new Button({
//   text: 'Open Search',
//   centerX: 0,
//   top: 'prev() 10'
// }).on('select', function() {
//   action.open();
// }).appendTo(searchBox);

let dictionary: IDictionaryEntry[] = [];


// TODO: kill that pyramid
fetch('../KanjiDamage.json')
  .then(response => response.json().then(json => dictionary = json)
    .then(() => {
      new EntryCollection(dictionary, { left: 0, top: 0, right: 0, bottom: 0 })
        .on('select', (collection: EntryCollection, entry, { index }) => {
          let entryNum = 0;
          let openNextPage = (event?: { target: Page, offset: number }) => {
            if (event) {
              event.target.dispose();
              entryNum = (entryNum + event.offset) % collection.length;
              entryNum = (entryNum < 0) ? collection.length + entryNum : entryNum;
            }
            new KanjiPage(collection.getEntry(entryNum)).on('navigate', openNextPage).appendTo(navigationView);
          };
          openNextPage();
        }).appendTo(page);
    })
  );



// function searchKanji(value) {
//   fetch('../KanjiDamage.json')
//     .then(response => response.json())
//     .then(json => dictionary = json)
//     .then(() => {
//       let result = dictionary.filter(entry => entry.kanji === value)[0];
//       if (result) {
//         //textView.text = result.kanji;
//       } else {
//         if (parseInt(value)) {
//           //textView.text = dictionary[parseInt(value)].kanji;
//           new KanjiPage(dictionary[parseInt(value)])
//             .appendTo(navigationView);
//         }
//       }
//     }).catch(err => console.log(err));
// }
// export function openPage(pageNum) {
//   new KanjiPage(dictionary[pageNum - 1]).appendTo(navigationView);
// }
