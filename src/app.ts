import { Action, NavigationView, Page, Composite, TextView, SearchAction, device, Button, ui, WebView } from 'tabris';
import { IKanji, IJukugo } from './interfaces';
import KanjiPage from './Kanjipage';
import EntryCollectionView from './EntryCollectionView';
import { toHiragana, toKatakana, toRomaji, isHiragana, isRomaji, isKana, isKanji, getKanji } from './wanakana'
import { findKanji } from "./util";
import FloatingWindow from "./FloatingWindow";

export var config = {
  onMode: "romaji"
}
export var dictionary: { kanji: IKanji[], jukugo: IJukugo[] };

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

new Action({
  placementPriority: "high",
  title: "filter"
}).on('select', () => {
  let floatingWindow = new FloatingWindow({ centerX: 0, centerY: 0 });
  new Button({ top: 10, left: 10, right: 10, bottom: 10, text: 'By usefulness' }).on('select', () => {
    let usefulnessWindow = new FloatingWindow({ centerX: 0, centerY: 0 });
    for (let i = 0; i < 6; i++) {
      new Button({ left: 10, right: 10, top: 'prev()', text: '>' + i }).on('select', () => {
        floatingWindow.dispose();
        usefulnessWindow.dispose();
        let entryCollectionView = navigationView.pages().first().find('.entryCollectionView').first() as EntryCollectionView;
        let data = entryCollectionView.data;
        let filterResults = new Page({ title: "filter results" }).appendTo(navigationView);
        createSearchResultEntryCollectionView(data.filter(entry => entry.usefulness > i))
          .set({ left: 0, top: 0, right: 0, bottom: 0 })
          .appendTo(filterResults);
      }).appendTo(usefulnessWindow);
    }
  }).appendTo(floatingWindow);
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



fetch('../KanjiDamage.json').then(response => response.json().then(json => dictionary = json).then(() => {
  createSearchResultEntryCollectionView(dictionary.kanji)
    .set({ left: 0, top: 0, right: 0, bottom: 0 })
    .appendTo(page);
})
);

function search(value) {
  let searchResults = new Page({ title: "search for \"" + value + "\" " }).appendTo(navigationView);
  createSearchResultEntryCollectionView(findKanji(dictionary.kanji, getKanji(value)))
    .set({ left: 0, top: 0, right: 0, bottom: 0 })
    .appendTo(searchResults);
}

function createSearchResultEntryCollectionView(dictionary: IKanji[]) {
  return new EntryCollectionView(dictionary)
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
    })
}
