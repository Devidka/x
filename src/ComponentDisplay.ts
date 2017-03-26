
import { Composite, CompositeProperties } from "tabris/tabris";

export default class ComponentsDisplay extends Composite {

  constructor(properties?: CompositeProperties) {
    super(properties || {});

  }

  public applyData(components: { kanji: string, meaning: string }[]): this {
    //throw "not implemented";
    return this;
  }
}
