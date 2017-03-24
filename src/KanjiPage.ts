import { Page, TextView, ScrollView, ImageView, Composite, Widget, CompositeProperties } from 'tabris';
import { IKanji, IJukugo, IKunyomi, ILookalikeSet } from './interfaces';
import { parseImage, getUsefulnessStars, createKanji, getOnyomi, createTag, createKanjiWithFurigana } from './util';
import { applyColors, applyFonts } from './resources';
import { dictionary } from "./app";

const MAIN_KANJI_SIZE = 80;
const TEMP_KUN_KANJI_SETTING = true;
const COLUMN_WIDTH = 110;

const MAX_KUNYOMI = 10;
const MAX_JUKUGO = 10;

export default class KanjiPage extends Page {
  private kanji: string;
  private header: Header;
  private kunyomiDisplays: KunyomiDisplay[];
  private kunSeparators: Composite[];
  private jukugos: Composite[];
  private usefulness: TextView;
  private strokeCount: TextView;
  private meaning: TextView;
  private number: TextView;
  private onLabel: TextView;
  private onyomi: TextView;
  private mnemonic: TextView;
  private kunLabel: TextView;

  constructor(data: IKanji, title?: string) {
    super();
    this.title = title + '  ' + data.kanji;
    this.kanji = data.kanji;
    let scrollView = new ScrollView({ left: 0, top: 0, right: 0, bottom: 0 }).appendTo(this);
    scrollView.on('swipe:left', () => this.trigger('navigate', { target: this, offset: 1 }));
    scrollView.on('swipe:right', () => this.trigger('navigate', { target: this, offset: -1 }));
    this.header = new Header({ id: 'header' }).appendTo(scrollView);
    this.kunLabel = new TextView({ class: 'label', id: 'kunLabel', text: 'Kunyomi: ' }).appendTo(scrollView);
    this.kunyomiDisplays = [];
    this.kunSeparators = [];
    // for (let i = 0; i < MAX_KUNYOMI; i++) {
    //   this.kunyomiDisplays.push(new KunyomiDisplay({ class: 'kunDisplay' }).appendTo(scrollView));
    //   new Composite({ class: 'seperator', id: 'kunSeperator' + i, height: 1, background: '#ddd' }).appendTo(scrollView);
    // }
    new TextView({ class: 'label', id: 'jukugoLabel', text: 'Jukugo: ' }).appendTo(scrollView);
    // this.jukugos = [];
    // for (let i = 0; i < MAX_JUKUGO; i++) {
    //   this.jukugos[i] = this.createJukugoDisplay().appendTo(scrollView);
    //   //new Composite({ class: 'seperator', height: 1, background: '#ddd' }).appendTo(scrollView);
    // }
    // let prev = scrollView.find('.strokeCount')[0];
    // data.tags.forEach(tag => {
    //   prev = createTag(tag).set({ top: [prev, 2], right: 10 }).appendTo(scrollView);
    // })
    // data.lookalikeSets.forEach(set => {
    //   this.createLookalikeDisplay(set);
    // });
    // this.createUsedInDisplay(data.usedIn);
    this.applyData(data);

    applyColors(this);
    applyFonts(this);
    this.applyLayout();
  }

  public applyData(data: IKanji) {
    this.header.applyData(data);
    for (let i = this.kunyomiDisplays.length; i < data.kunyomi.length; i++) {
      this.kunyomiDisplays[i] = new KunyomiDisplay({ class: 'kunDisplay' }).insertAfter(this.kunLabel);
      this.kunSeparators[i] = new Composite({ class: 'seperator', id: 'kunSeperator' + i, height: 1, background: '#ddd' })
      .insertAfter(this.kunyomiDisplays[i]);
    }
    for (let i = data.kunyomi.length; i < this.kunyomiDisplays.length; i++) {
      this.kunyomiDisplays[i].dispose();
      this.kunyomiDisplays[i] = null;
      this.kunSeparators[i].dispose();
      this.kunSeparators[i] = null;

    }
    for (let i = 0; i < data.kunyomi.length; i++) {
      this.kunyomiDisplays[i].applyData(data.kunyomi[i]);
    }
    // for (let i = 0; i < data.jukugo.length; i++) {
    //   let jukugo = dictionary.jukugo[data.jukugo[i]];
    //   this.jukugos[i].apply({
    //     '.usefulness': { text: getUsefulnessStars(jukugo.usefulness) },
    //     '#postParticle': { text: jukugo.postParticle },
    //     '#postOkurigana': { text: jukugo.okurigana.post },
    //     '.mainKanji': { text: jukugo.kanji },
    //     '.reading': { text: jukugo.reading },
    //     '#preOkurigana': { text: jukugo.okurigana.pre },
    //     '#preParticle': { text: jukugo.preParticle },
    //     '.meaning': { text: jukugo.meaning },
    //     '.description': { text: jukugo.description }
    //   })
    // }

  }

  createComponentsDisplay(components: { kanji: string, kanjiImageSource?: string, meaning: string }[], maxColumns?: number) {
    let composite = new Composite({ class: 'components' });
    let prevLeft: any = 0;
    let prevTop: any = 0;
    let columns = 0;
    components.forEach(component => {
      columns++;
      prevLeft = new TextView({ class: 'componentKanji', text: component.kanji + ' ' })
        .set({ top: prevTop, left: prevLeft })
        .appendTo(composite);
      let meaning = '(' + component.meaning + ')';
      meaning += components.indexOf(component) == components.length - 1 ? '' : ' + '
      prevLeft = new TextView({ class: 'componentMeaning', text: meaning })
        .set({ top: prevTop, left: prevLeft })
        .appendTo(composite);
      if (columns >= maxColumns) {
        columns = 0;
        prevTop = prevLeft;
        prevLeft = 0;
      }
    });
    return composite;
  }

  createJukugoDisplay() {
    let composite = new Composite({ class: 'jukugo' });
    let rightSide = new Composite({ left: COLUMN_WIDTH, top: 0, bottom: 0, right: 0 }).appendTo(composite);
    let leftSide = new Composite({ left: 0, right: [rightSide, 8], top: 0, bottom: 0 }).appendTo(composite);
    let stars = new TextView({ class: 'usefulness' }).set({ top: 0, right: 0 }).appendTo(leftSide);
    let prev: any = 0;
    prev = new TextView({ class: 'particle', id: 'postParticle', }).set({ top: 29, right: prev }).appendTo(leftSide);
    prev = new TextView({ class: 'okurigana', id: 'postOkurigana', }).set({ top: 26, right: prev }).appendTo(leftSide);
    let kanjiBox = createKanjiWithFurigana('', '').set({ right: prev, top: 15 }).appendTo(leftSide);
    prev = kanjiBox;
    prev = new TextView({ class: 'okurigana', id: 'preOkurigana' }).set({ top: 26, right: prev }).appendTo(leftSide);
    new TextView({ class: 'particle', id: 'preParticle' }).set({ top: 29, right: prev }).appendTo(leftSide);
    prev = 0;
    // jukugo.tags.forEach(tag => {
    //   prev = createTag(tag, 12).set({ top: kanjiBox, right: [prev, 3] }).appendTo(leftSide);
    // })
    // this.createComponentsDisplay(jukugo.components, 2).set({ left: 0, top: 5, right: 0 }).appendTo(rightSide);
    new TextView({ class: 'meaning' }).set({ top: 'prev()' }).appendTo(rightSide);
    new TextView({ class: 'description' }).set({ top: 'prev()' }).appendTo(rightSide);
    return composite;
  }

  createLookalikeDisplay(set: ILookalikeSet) {
    return new Composite();
  }

  createUsedInDisplay(kanji: { kanji: string, kanjiImageSource: string }[]) {
    return new Composite();
  }

  applyLayout() {
    this.apply({
      '.header': { left: 0, top: 0, right: 0 },
      '#kunLabel': { left: 10, top: ['prev()', 5] },
      '.kunDisplay': { top: 'prev()', left: 0, right: 20 },
      '.kunSeperator': { top: 'prev()', left: 0, right: 20 },
      '#jukugoLabel': { left: 10, top: ['prev()', 5] },
      '.jukugo': { top: ['prev()', 0], left: 0, right: 20 },
      '.seperator': { top: ['prev()', 3], left: 20, right: 20 }
    });
  }

}

class Header extends Composite {

  private componentsDisplay: ComponentsDisplay;

  constructor(properties?: CompositeProperties) {
    super(properties || {});
    new TextView({ class: 'mainKanji', font: MAIN_KANJI_SIZE + 'px' }).appendTo(this);
    this.componentsDisplay = new ComponentsDisplay({ class: "components" }).appendTo(this);
    new TextView({ class: 'usefulness', id: 'usefulness' }).appendTo(this);
    new TextView({ class: 'strokeCount' }).appendTo(this);
    new TextView({ id: 'meaning' }).appendTo(this);
    new TextView({ class: 'number' }).appendTo(this);
    new TextView({ class: 'label', id: 'onLabel', text: 'On: ' }).appendTo(this);
    new TextView({ class: 'onyomi' }).appendTo(this);
    new TextView({ class: 'mnemonic', markupEnabled: true }).appendTo(this);
    this.applyLayout();
  }

  public applyData(data: IKanji): this {
    this.componentsDisplay.applyData(data.components);
    this.apply({
      '.usefulness': { text: getUsefulnessStars(data.usefulness) },
      '.strokeCount': { text: data.strokeCount + ' strokes' },
      '#meaning': { text: data.meaning },
      '.mainKanji': { text: data.kanji },
      '.number': { text: 'number ' + data.number },
      '.onyomi': { text: getOnyomi(data) },
      '.mnemonic': { text: data.mnemonic },
      '#kunLabel': { visible: (data.kunyomi && data.kunyomi.length > 0) }
    });
    return this;
  }

  private applyLayout() {
    this.apply({
      '.number': { centerX: 0, top: 5 },
      '#usefulness': { left: 10, top: 8 },
      '.strokeCount': { right: 10, top: 10 },
      '.mainKanji': { left: 20, top: 20 },
      '#components': { left: 20, top: ['#onLabel', 5] },
      '#meaning': { left: ['.mainKanji', 10], top: 38, right: 100 },
      '#onLabel': { left: ['.mainKanji', 10], top: ['#meaning', 0] },
      '.onyomi': { left: ['#onLabel', 0], baseline: '#onLabel', right: '.tag' },
      '.mnemonic': { top: ['.components', 5], left: 20, right: 20 },
    })
  }
}

class ComponentsDisplay extends Composite {

  constructor(properties?: CompositeProperties) {
    super(properties || {});

  }

  public applyData(components: { kanji: string, meaning: string }[]): this {
    //throw "not implemented";
    return this;
  }
}

class KunyomiDisplay extends Composite {

  constructor(properties?: CompositeProperties) {
    super(properties || {});
    let rightSide = new Composite({ left: COLUMN_WIDTH, top: 0, bottom: 0, right: 0 }).appendTo(this);
    let leftSide = new Composite({ left: 0, right: [rightSide, 8], top: 0 }).appendTo(this);
    leftSide.append(
      new TextView({ class: 'usefulness' }),
      new TextView({ class: 'particle', id: 'postParticle' }),
      new TextView({ class: 'kana', id: 'okurigana' }),
      createKanjiWithFurigana('', ''),
      new TextView({ class: 'particle', id: 'preParticle' })
    );
    rightSide.append(
      new TextView({ class: 'meaning' })
    );
    this.applyLayout();
  }

  public applyData(data: IKunyomi): this {
    if (data) {
      this.visible = true;
      this.apply({
        '.usefulness': { text: getUsefulnessStars(data.usefulness), visible: data.usefulness !== null },
        '.meaning': { text: data.description, visible: data.description !== null },
        '#postParticle': { text: data.postParticle, visible: data.postParticle !== null },
        '#okurigana': { text: data.okurigana, visible: data.okurigana !== null },
        '.kanji': { text: data.kanji, visible: data.kanji !== null },
        '.furigana': { text: data.reading, visible: data.reading !== null },
        '#preParticle': { text: data.preParticle, visible: data.preParticle !== null }
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
      '#postParticle': { right: 0, top: '.usefulness' },
      '#okurigana': { right: ['prev()', 5], top: 15 },
      '.kanjiBox': { right: ['prev()', 5], top: '.usefulness' },
      '#preParticle': { right: 'prev()', top: '.usefulness' },
      '.meaning': { top: 0, left: 0, right: 0 }
    });

  }
}

class jukugoDisplay extends Composite {

  public applyData(data: any): this {
    //throw "not implemented";
    return this;
  }
}

class LookalikeDisplay extends Composite {

  public applyData(data: any): this {
    //throw "not implemented";
    return this;
  }
}

class UsedInDisplay extends Composite {

  public applyData(data: any): this {
    //throw "not implemented";
    return this;
  }
}
