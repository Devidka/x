import { Composite, TextView, CompositeProperties } from "tabris/tabris";
import { createKanjiWithFurigana, getType, getUsefulnessStars, createTag } from "./util";
import { IWord, IJukugo, IKunyomi } from "./interfaces";

const COLUMN_WIDTH = 110;

export default class WordDisplay extends Composite {

  private tags: Composite[];
  private rightSide: Composite;
  private leftSide: Composite;
  private usefulness: TextView;
  private postParticle: TextView;
  private postOkurigana: TextView;
  private preOkurigana: TextView;
  private preParticle: TextView;
  private kanjiBox: Composite;
  private meaning: TextView;
  private description: TextView;


  constructor(properties?: CompositeProperties) {
    super(properties || {});
    this.tags = [];
    this.rightSide = new Composite({ left: COLUMN_WIDTH, top: 0, bottom: 0, right: 0 }).appendTo(this);
    this.leftSide = new Composite({ left: 0, right: [this.rightSide, 8], top: 0 }).appendTo(this);
    this.usefulness = new TextView({ class: 'usefulness' }).appendTo(this.leftSide);
    this.postParticle = new TextView({ class: 'particle' }).appendTo(this.leftSide);
    this.postOkurigana = new TextView({ class: 'kana' }).appendTo(this.leftSide);
    this.kanjiBox = createKanjiWithFurigana('', '').appendTo(this.leftSide);
    this.preOkurigana = new TextView({ class: 'kana' }).appendTo(this.leftSide);
    this.preParticle = new TextView({ class: 'particle' }).appendTo(this.leftSide);
    this.meaning = new TextView({ class: 'meaning' }).appendTo(this.rightSide);
    this.description = new TextView({ class: 'description' }).appendTo(this.rightSide);
    this.applyLayout();
  }

  public applyData(data: IWord): this {
    // TODO: add componentsDisplay
    // TODO: add Tags
    // TODO: remove description TextView when description is empty or meaning === description
    if (data) {
      this.visible = true;
      this.addTags(data.tags)
      let preOkurigana = (getType(data) === 'jukugo') ? (data as IJukugo).okurigana.pre : '';
      let postOkurigana = (getType(data) === 'jukugo') ? (data as IJukugo).okurigana.post : (data as IKunyomi).okurigana;
      this.kanjiBox.apply({
        '.kanji': { text: data.kanji || '' },
        '.furigana': { text: data.reading || '' }
      });
      this.usefulness.text = getUsefulnessStars(data.usefulness) || '';
      this.postParticle.text = data.postParticle || '';
      this.postOkurigana.text = postOkurigana || '';
      this.preOkurigana.text = preOkurigana || '';
      this.preParticle.text = data.preParticle || '';
      this.meaning.text = data.meaning || '';
      this.description.text = data.description || '';
    } else {
      this.visible = false;
    }
    return this;
  }

  private addTags(tags: string[]) {
    ;
    for (let i = 0; i < Math.max(this.tags.length, tags.length); i++) {
      if (i < tags.length) {
        if (i >= this.tags.length) {
          this.tags.push(createTag('wordTag').set({ top: '.kanjiBox', right: i === 0 ? 0 : [this.tags[i - 1], 3] }).appendTo(this.leftSide));
        }
        this.tags[i].find('TextView').set('text', tags[i]);
      } else {
        this.tags[i].dispose();
      }
    }
    this.tags.length = tags.length;
  }

  private applyLayout() {
    this.usefulness.layoutData = { right: 0, top: 0 };
    this.postParticle.layoutData = { right: 0, top: [this.usefulness, 9] };
    this.postOkurigana.layoutData = { right: ['prev()', 0], top: [this.usefulness, 8] };
    this.kanjiBox.layoutData = { right: ['prev()', 0], top: 15 };
    this.preOkurigana.layoutData = { right: ['prev()', 0], top: [this.usefulness, 8] };
    this.preParticle.layoutData = { right: ['prev()', 2], top: [this.usefulness, 9] };
    this.meaning.layoutData = { top: 20, left: 0, right: 0 };
    this.description.layoutData = { top: ['prev()', 5], left: 0, right: 0 };
  }
}