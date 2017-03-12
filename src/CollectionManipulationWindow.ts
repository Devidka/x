
import FloatingWindow from "./FloatingWindow";
import { CompositeProperties, Page, Button } from "tabris/tabris";
import EntryCollectionView from "./EntryCollectionView";
import { navigationView, dictionary } from "./app";
import { IKanji, IJukugo } from "./interfaces";

export default class CollectionManipulationWindow extends FloatingWindow {
  constructor(properties: CompositeProperties) {
    super(properties);
    new Button({ top: 10, left: 10, right: 10, text: 'By usefulness' }).on('select', () => {
    let usefulnessWindow = new FloatingWindow({ centerX: 0, centerY: 0 });
    for (let i = 0; i < 6; i++) {
      new Button({ left: 10, right: 10, top: 'prev()', text: '>' + i }).on('select', () => {
        this.dispose();
        usefulnessWindow.dispose();
        let entryCollectionView = navigationView.pages().last().find('.entryCollectionView').first() as EntryCollectionView;
        console.log((navigationView.pages().first() as Page).title);
        let data = entryCollectionView.data;
        let filterResults = new Page({ title: "filter results" }).appendTo(navigationView);
        EntryCollectionView.createSearchResultEntryCollectionView(data.filter(entry => entry.usefulness > i))
          .set({ left: 0, top: 0, right: 0, bottom: 0 })
          .appendTo(filterResults);
      }).appendTo(usefulnessWindow);
    }
  }).appendTo(this);
  new Button({ top: ['prev()', 10], left: 10, right: 10, bottom: 10, text: 'Add Jukugo' }).on('select', () => {
    this.dispose();
    let entryCollectionView = navigationView.pages().last().find('.entryCollectionView').first() as EntryCollectionView;
    console.log((navigationView.pages().first() as Page).title);
    let data = entryCollectionView.data;
    let newData: (IKanji | IJukugo)[] = [];
    data.forEach(entry => {
      newData.push(entry);
      (entry as IKanji).jukugo.forEach(index => {
        newData.push(dictionary.jukugo[index]);
      });
    });
    let filterResults = new Page({ title: "filter results" }).appendTo(navigationView);
    EntryCollectionView.createSearchResultEntryCollectionView(newData)
      .set({ left: 0, top: 0, right: 0, bottom: 0 })
      .appendTo(filterResults);
  }).appendTo(this);
  }

  static Open() {
    new CollectionManipulationWindow({ centerX: 0, centerY: 0 });
  }
}