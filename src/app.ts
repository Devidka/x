import {NavigationView, Page, Composite, TextView, SearchAction, device, Button, ui} from 'tabris';
import { IDictionaryEntry } from './interfaces';
import KanjiPage from './Kanjipage'

var navigationView = new NavigationView({
  left: 0, top: 0, right: 0, bottom: 0, animated: false
}).appendTo(ui.contentView);

var page = new Page({
  title: 'Search action'
}).appendTo(navigationView);

var searchBox = new Composite({
  centerX: 0, centerY: 0
}).appendTo(page);

var textView = new TextView().appendTo(searchBox);

var action = new SearchAction({
  title: 'Search',
  image: {
    src: device.platform === 'iOS' ? '../images/search-black-24dp@3x.png' : '../images/search-white-24dp@3x.png',
    scale: 3
  }
}).on('select', function() {
  this.text = '';
}).on('accept', function(widget, query) {
  searchKanji(query);
}).appendTo(navigationView);


new Button({
  text: 'Open Search',
  centerX: 0,
  top: 'prev() 10'
}).on('select', function() {
  action.open();
}).appendTo(searchBox);

let dictionary: IDictionaryEntry[] = [];

function searchKanji(value) {
  fetch('../KanjiDamage.json')
    .then(response => response.json())
    .then(json => dictionary = json)
    .then(() => {
     let result = dictionary.filter(entry => entry.kanji === value)[0];
     if (result) {
       textView.text = result.kanji;
     } else {
        if (parseInt(value)) {
          //textView.text = dictionary[parseInt(value)].kanji;
          new KanjiPage(dictionary[parseInt(value)])
            .appendTo(navigationView);
        } 
    }
    }).catch(err => console.log(err));
} 
export function openPage(pageNum) {
  new KanjiPage(dictionary[pageNum])
            .appendTo(navigationView);
}
