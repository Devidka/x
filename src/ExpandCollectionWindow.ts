
import FloatingWindow from "./FloatingWindow";
import { CompositeProperties, Page, Button, Composite, TextView, RadioButton } from "tabris/tabris";
import FactListPage from "./FactListPage";
import { navigationView, dictionary } from "./app";
import { IKanji, IJukugo, IFact } from "./interfaces";
import { getUsefulnessStars, getType } from "./util";
import { applyColors, applyFonts } from "./resources";

export default class ExpandCollectionWindow extends FloatingWindow {
  private minUsefulness: number;

  constructor(properties?: CompositeProperties) {
    properties = properties || {};
    properties.centerX = 0;
    properties.centerY = 0;
    super(properties);
    this.minUsefulness = 0;
    let buttonsComposite = new Composite();
    buttonsComposite.append(
      new Button({ left: 10, top: 10, right: 10, text: 'add Jukugo' })
        .on('select', () => {
          this.dispose();
          let currentPage = navigationView.pages().last() as FactListPage;
          new FactListPage(currentPage.facts.addJukugo(this.minUsefulness), "expand results").appendTo(navigationView);
        })
        .appendTo(buttonsComposite)
    )
    let usefulnessComposite = new Composite({ left: buttonsComposite });
    new TextView({ class: 'smallLabel', text: 'limit usefulness', left: 10, top: 10, right: 10 }).appendTo(usefulnessComposite);
    for (let i = 0; i < 6; i++) {
      new RadioButton({ class: 'usefulness', centerX: 0, width: 100, top: 'prev()', checked: i == 0, text: getUsefulnessStars(i) })
        .on("select", () => this.minUsefulness = i)
        .appendTo(usefulnessComposite);
    }
    this.append(buttonsComposite, usefulnessComposite)
    applyColors(this);
    applyFonts(this);
  }

  static Open() {
    new ExpandCollectionWindow({ centerX: 0, centerY: 0 });
  }
}