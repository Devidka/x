import { Composite, TextView, CompositeProperties } from "tabris/tabris";
import { createKanjiWithFurigana, getType, getUsefulnessStars } from "./util";
import { IWord, IJukugo, IKunyomi } from "./interfaces";

const COLUMN_WIDTH = 110;

export default class WordDisplay extends Composite {

  constructor(properties?: CompositeProperties) {
    super(properties || {});
    let rightSide = new Composite({ left: COLUMN_WIDTH, top: 0, bottom: 0, right: 0 }).appendTo(this);
    let leftSide = new Composite({ left: 0, right: [rightSide, 8], top: 0 }).appendTo(this);
    leftSide.append(
      // todo: Components
      new TextView({ class: 'usefulness' }),
      new TextView({ class: 'particle', id: 'postParticle' }),
      new TextView({ class: 'kana', id: 'postOkurigana' }),
      createKanjiWithFurigana('', ''),
      new TextView({ class: 'kana', id: 'preOkurigana' }),
      new TextView({ class: 'particle', id: 'preParticle' })
    );
    rightSide.append(
      new TextView({ class: 'meaning' }),
      new TextView({ class: 'description' })
    );
    this.applyLayout();
  }

  public applyData(data: IWord): this {
    // TODO: add componentsDisplay
    // TODO: add Tags
    // TODO: remove description TextView when description is empty or meaning === description
    if (data) {
      console.log(data);
      this.visible = true;
      let preOkurigana = (getType(data) === 'jukugo') ? (data as IJukugo).okurigana.pre : '';
      let postOkurigana = (getType(data) === 'jukugo') ? (data as IJukugo).okurigana.post : (data as IKunyomi).okurigana;
      this.apply({
        '.usefulness': { text: getUsefulnessStars(data.usefulness) || '' },
        '#postParticle': { text: data.postParticle || '' },
        '#postOkurigana': { text: postOkurigana || '' },
        '.kanji': { text: data.kanji || '' },
        '.furigana': { text: data.reading || '' },
        '#preOkurigana': { text: preOkurigana || '' },
        '#preParticle': { text: data.preParticle || '' },
        '.meaning': { text: data.meaning || '' },
        '.description': { text: data.description || '' },
      });
    } else {
      this.visible = false;
    }
    return this;
  }

  private applyLayout() {
    let stars = this.find().first() as TextView;
    this.apply({
      '.usefulness': { right: 0, top: 0 },
      '#postParticle': { right: 0, top: ['.usefulness', 9] },
      '#postOkurigana': { right: ['prev()', 0], top: ['.usefulness', 8] },
      '.kanjiBox': { right: ['prev()', 0], top: 15 },
      '#preOkurigana': { right: ['prev()', 0], top: ['.usefulness', 8] },
      '#preParticle': { right: ['prev()', 2], top: ['.usefulness', 9] },
      '.meaning': { top: 20, left: 0, right: 0 },
      '.description': { top: ['prev()', 5], left: 0, right: 0 }
    });

  }
}