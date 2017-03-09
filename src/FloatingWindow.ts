import { Composite, CompositeProperties, ui } from "tabris";
import { colors } from "./resources";

export default class FloatingWindow extends Composite {

  private backgroundBlur: Composite;

  constructor(properties: CompositeProperties) {
    properties.background = properties.background || "white";
    properties.elevation = 1000;
    properties.cornerRadius = 5;
    super(properties);
    this.backgroundBlur = new Composite({ left: 0, right: 0, top: 0, bottom: 0, background: colors.backgroundBlur })
      .on('tap', () => {
        this.backgroundBlur.dispose();
        this.dispose();
      }).appendTo(ui.contentView);
    this.appendTo(this.backgroundBlur);
  }

  dispose() {
    this.backgroundBlur.dispose();
    super.dispose();
  }


}
