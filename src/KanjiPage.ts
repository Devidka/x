import { Page, TextView, ScrollView, ImageView, Composite, Widget, CompositeProperties } from 'tabris';
import { IKanji, IJukugo, IKunyomi, IWord, ILookalikeSet } from './interfaces';
import { parseImage, getUsefulnessStars, createKanji, getOnyomi, createTag, createKanjiWithFurigana, getType } from './util';
import { applyColors, applyFonts } from './resources';
import { dictionary } from "./app";

const MAIN_KANJI_SIZE = 80;
const TEMP_KUN_KANJI_SETTING = true;
const COLUMN_WIDTH = 110;

const MAX_KUNYOMI = 10;
const MAX_JUKUGO = 10;

export default class KanjiPage extends Page {
  private header: Header;
  private kunyomiDisplays: WordDisplay[];
  private kunSeparators: Composite[];
  private jukugoDisplays: WordDisplay[];
  private jukSeparators: Composite[];
  private tags: Composite[];
  private onLabel: TextView;
  private onyomi: TextView;
  private mnemonic: TextView;
  private kunLabel: TextView;
  private jukugoLabel: TextView;

  constructor(data: IKanji, title?: string) {
    super();
    this.title = title + '  ' + data.kanji;
    let scrollView = new ScrollView({ left: 0, top: 0, right: 0, bottom: 0 }).appendTo(this);
    scrollView.on('swipe:left', () => this.trigger('navigate', { target: this, offset: 1 }));
    scrollView.on('swipe:right', () => this.trigger('navigate', { target: this, offset: -1 }));
    this.createHeader();
    this.mnemonic = new TextView({ class: 'mnemonic', markupEnabled: true }).appendTo(scrollView);
    this.kunLabel = new TextView({ class: 'label', id: 'kunLabel', text: 'Kunyomi: ' }).appendTo(scrollView);
    this.kunyomiDisplays = [];
    this.kunSeparators = [];
    for (let i = 0; i < MAX_KUNYOMI; i++) {
      this.kunyomiDisplays.push(new WordDisplay({ class: 'kunDisplay' }).appendTo(scrollView));
      this.kunSeparators.push(new Composite({ class: 'seperator', height: 1, background: '#ddd' }).appendTo(scrollView));
    }
    this.jukugoLabel = new TextView({ class: 'label', id: 'jukugoLabel', text: 'Jukugo: ' }).appendTo(scrollView);
    this.jukugoDisplays = [];
    this.jukSeparators = [];
    for (let i = 0; i < MAX_JUKUGO; i++) {
      this.jukugoDisplays.push(new WordDisplay({ class: 'jukugoDisplay' }).appendTo(scrollView));
      this.jukSeparators.push(new Composite({ class: 'seperator', height: 1, background: '#ddd' }).appendTo(scrollView));
    }
    this.tags = [];
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
    this.applyLayout();

    applyColors(this);
    applyFonts(this);
    this.applyData(data);
  }

  private createHeader() {
    let scrollView = this.find('ScrollView').first() as Composite;
    new TextView({ id: 'mainKanji', font: MAIN_KANJI_SIZE + 'px' }).appendTo(scrollView);
    //this.componentsDisplay = new ComponentsDisplay({ id: "components" }).appendTo(scrollView);
    new TextView({ class: 'usefulness', id: 'usefulness' }).appendTo(scrollView);
    new TextView({ id: 'strokeCount' }).appendTo(scrollView);
    new TextView({ id: 'meaning', maxLines: 3 }).appendTo(scrollView);
    new TextView({ id: 'number' }).appendTo(scrollView);
    new TextView({ class: 'label', id: 'onLabel', text: 'On: ' }).appendTo(scrollView);
    new TextView({ class: 'onyomi', id: 'onyomi' }).appendTo(scrollView);
  }

  public applyData(data: IKanji) {
    // header
    this.apply({
      '#usefulness': { text: getUsefulnessStars(data.usefulness) },
      '#strokeCount': { text: data.strokeCount + ' strokes' },
      '#meaning': { text: data.meaning },
      '#mainKanji': { text: data.kanji },
      '#number': { text: 'number ' + data.number },
      '#onyomi': { text: getOnyomi(data) },
      '#kunLabel': { visible: (data.kunyomi && data.kunyomi.length > 0) }
    });
    this.addTags(data.tags);
    this.mnemonic.text = data.mnemonic;
    for (let i = 0; i < MAX_KUNYOMI; i++) {
      if (i < data.kunyomi.length) {
        if (!this.kunyomiDisplays[i].parent()) {
          this.kunyomiDisplays[i].insertAfter(this.kunLabel);
          this.kunSeparators[i].insertAfter(this.kunyomiDisplays[i]);
        }
        this.kunyomiDisplays[i].applyData(data.kunyomi[i]);
      }
      if (i >= data.kunyomi.length) {
        if (this.kunyomiDisplays[i].parent()) {
          this.kunyomiDisplays[i].detach();
          this.kunSeparators[i].detach();
        }
      }
    }
    for (let i = 0; i < MAX_JUKUGO; i++) {
      if (i < data.jukugo.length) {
        if (!this.jukugoDisplays[i].parent()) {
          this.jukugoDisplays[i].insertAfter(this.jukugoLabel);
          this.jukSeparators[i].insertAfter(this.jukugoDisplays[i]);
        }
        this.jukugoDisplays[i].applyData(dictionary.jukugo[data.jukugo[i]]);
      }
      if (i >= data.jukugo.length) {
        if (this.jukugoDisplays[i].parent()) {
          this.jukugoDisplays[i].detach();
          this.jukSeparators[i].detach();
        }
      }
    }
    //this.applyLayout();
    //applyColors(this);
    //applyFonts(this);
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

  addTags(tags: string[]) {
    let scrollView = this.find('ScrollView').first() as Composite;
    let previousTag: any = '#strokeCount';
    let i = 0;
    for (;i < Math.min(this.tags.length, tags.length); i++) {
      this.tags[i].find('TextView').set('text', tags[i]);
      previousTag = this.tags[i];
    }
    for (; i < this.tags.length; i++) {
      this.tags[i].dispose();
    }
    for (; i < tags.length; i++) {
      previousTag = createTag(tags[i]).set({right: 10, top: [previousTag, 5]}).appendTo(scrollView);
      this.tags.push(previousTag);
    }
    this.tags.length = tags.length;
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
    //header
    this.apply({
      '#number': { centerX: 0, top: 5 },
      '#usefulness': { left: 10, top: 8 },
      '#strokeCount': { right: 10, top: 10 },
      '#mainKanji': { left: 20, top: 20 },
      '#components': { left: 20, top: ['#onLabel', 5] },
      '#meaning': { left: ['#mainKanji', 10], top: 38, right: 100 },
      '#onLabel': { left: ['#mainKanji', 10], top: ['#meaning', 0] },
      '#onyomi': { left: ['#onLabel', 0], baseline: '#onLabel', right: '.tag' },
    })

    //rest
    this.apply({
      '.mnemonic': { left: 10, top: ['prev()', 5], right: 10 },
      '#kunLabel': { left: 10, top: ['prev()', 5] },
      '.kunDisplay': { top: 'prev()', left: 0, right: 20 },
      '#jukugoLabel': { left: 10, top: ['prev()', 5] },
      '.jukugoDisplay': { top: 'prev()', left: 0, right: 20 },
      '.seperator': { top: ['prev()', 3], left: 20, right: 20 }
    });
  }

}

class Header extends Composite {

  private componentsDisplay: ComponentsDisplay;

  constructor(properties?: CompositeProperties) {
    properties.background = 'rgba(255,0,0,0.1)';
    super(properties || {});

    this.applyLayout();
  }

  public applyData(data: IKanji): this {
    this.componentsDisplay.applyData(data.components);

    return this;
  }

  private applyLayout() {

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

class WordDisplay extends Composite {

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
    // todo: add componentsDisplay
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
