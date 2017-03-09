import { Action, NavigationView, Page, Composite, TextView, SearchAction, device, Button, ui, WebView } from 'tabris';
import { IDictionaryEntry } from './interfaces';
import KanjiPage from './Kanjipage';
import EntryCollectionView from './EntryCollectionView';
import { toHiragana, toKatakana, toRomaji, isHiragana, isRomaji, isKana, isKanji, getKanji } from './wanakana'
import { findKanji } from "./util";

export var config = {
  onMode: "romaji"
}

var navigationView = new NavigationView({
  left: 0, top: 0, right: 0, bottom: 0, animated: false
}).appendTo(ui.contentView);

var page = new Page({
  title: 'Kanji Damage'
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
  search(query);
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
      new EntryCollectionView(dictionary, { left: 0, top: 0, right: 0, bottom: 0 })
        .on('select', (collection: EntryCollectionView, entry, { index }) => {
          let entryNum = index;
          let openNextPage = (event?: { target: Page, offset: number }) => {
            if (event) {
              event.target.dispose();
              entryNum = (entryNum + event.offset) % collection.length;
              entryNum = (entryNum < 0) ? collection.length + entryNum : entryNum;
            }
            new KanjiPage(collection.getEntry(entryNum), (entryNum + 1) + '/' + collection.length).on('navigate', openNextPage).appendTo(navigationView);
          };
          openNextPage();
        }).appendTo(page);
    })
  );



function search(value) {
  let searchResults = new Page({ title: "search for \"" + value + "\" " }).appendTo(navigationView);
  new EntryCollectionView(findKanji(dictionary, getKanji(value)), { left: 0, top: 0, right: 0, bottom: 0 })
    .on('select', (collection: EntryCollectionView, entry, { index }) => {
      let entryNum = index;
      let openNextPage = (event?: { target: Page, offset: number }) => {
        if (event) {
          event.target.dispose();
          entryNum = (entryNum + event.offset) % collection.length;
          entryNum = (entryNum < 0) ? collection.length + entryNum : entryNum;
        }
        new KanjiPage(collection.getEntry(entryNum), (entryNum + 1) + '/' + collection.length).on('navigate', openNextPage).appendTo(navigationView);
      };
      openNextPage();
    }).appendTo(searchResults);

}
