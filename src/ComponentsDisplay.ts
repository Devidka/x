
import { Composite, CompositeProperties, TextView } from "tabris/tabris";
import { applyFonts, applyColors } from "./resources";

export default class ComponentsDisplay extends Composite {
  private components: { kanji: TextView, meaning: TextView }[];

  constructor(private maxColumns: number, private className = 'component', properties?: CompositeProperties) {
    super(properties || {});
    this.components = [];
  }

  public applyData(components: { kanji: string, meaning: string }[]): this {
    for (let i = 0; i < Math.max(this.components.length, components.length); i++) {
      if (i < components.length) {
        if (i >= this.components.length) {
          this.components.push({
            kanji: new TextView({class: 'componentKanji ' + this.className}).appendTo(this),
            meaning: new TextView({class: 'componentMeaning ' + this.className}).appendTo(this)
          });
        }
        this.components[i].kanji.text = components[i].kanji + ' ';
        this.components[i].meaning.text = '(' + components[i].meaning + ')'  + (i === components.length - 1 ? '' : ' + ');
      } else {
        this.components[i].kanji.dispose();
        this.components[i].meaning.dispose();
      }
    }
    this.components.length = components.length;
    applyColors(this);
    applyFonts(this);
    this.applyLayout();
    return this;
  }

  private applyLayout() {
    for (let i = 0; i < this.components.length; i++) {
      let row = Math.floor(i / this.maxColumns);
      let column = i % this.maxColumns;
      this.components[i].kanji.layoutData = {
        left: column === 0 ? 0 : this.components[i - 1].meaning,
        top: row === 0 ? 0 : this.components[i - this.maxColumns].kanji
      }
      this.components[i].meaning.layoutData = {
        left: this.components[i].kanji,
        top: row === 0 ? 0 : this.components[i - this.maxColumns].kanji
      }
    }
  }
}
