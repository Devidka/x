
import FloatingWindow from "./FloatingWindow";
import { CompositeProperties, Page, Button, Composite, TextView, RadioButton } from "tabris/tabris";
import EntryCollectionView from "./EntryCollectionView";
import { navigationView, dictionary } from "./app";
import { IKanji, IJukugo } from "./interfaces";
import { getUsefulnessStars } from "./util";

export default class CollectionManipulationWindow extends FloatingWindow {
  constructor(properties: CompositeProperties) {
    super(properties);
    let usefulnessComposite = new Composite({ right: 10, top: 10, bottom: 10, left: ['Button', 10] });
    new TextView({ text: 'min usefulness', top: 0, left: 0 }).appendTo(usefulnessComposite);
    for (let i = 0; i < 7; i++) {
      // TODO: make star radio buttons here
      
    }
        new RadioButton({class: 'usefulness', text: getUsefulnessStars(0)})      
    this.append(
      new Button({ id: 'applyUsefulnessButton', top: 10, left: 10, right: 10, text: 'apply usefulness' }),
      new Button({ id: 'addJukugoButton', top: ['prev()', 10], left: 10, right: 10, bottom: 10, text: 'Add Jukugo' }),
      usefulnessComposite
    )
  }

  static Open() {
    new CollectionManipulationWindow({ centerX: 0, centerY: 0 });
  }
}