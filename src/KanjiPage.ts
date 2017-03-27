import { Page, TextView, ScrollView, ImageView, Composite, Widget, CompositeProperties } from 'tabris';
import { IKanji, IJukugo, IKunyomi, IWord, ILookalikeSet } from './interfaces';
import { parseImage, getUsefulnessStars, createKanji, getOnyomi, createTag, createKanjiWithFurigana, getType } from './util';
import { applyColors, applyFonts } from './resources';
import { dictionary } from "./app";
import WordDisplay from "./WordDisplay";
import ComponentsDisplay from "./ComponentsDisplay";

const TEMP_KUN_KANJI_SETTING = true;

const MAX_KUNYOMI = 10;
const MAX_JUKUGO = 10;

export default class KanjiPage extends Page {
  private scrollView: ScrollView;
  private tags: Composite[];
  private onLabel: TextView;
  private onyomi: TextView;
  private mainKanji: TextView;
  private usefulness: TextView;
  private strokeCount: TextView;
  private meaning: TextView;
  private number: TextView;
  private componentsDisplay: ComponentsDisplay;
  private mnemonic: TextView;
  private kunyomiDisplays: WordDisplay[];
  private kunSeparators: Widget[];
  private jukugoDisplays: WordDisplay[];
  private jukSeparators: Widget[];
  private kunLabel: TextView;
  private jukugoLabel: TextView;

  constructor(data?: IKanji, title?: string) {
    super({ autoDispose: false });
    this.title = title || '';
    this.scrollView = new ScrollView({ left: 0, top: 0, right: 0, bottom: 0 }).appendTo(this);
    this.scrollView.on('swipe:left', () => this.trigger('navigate', { target: this, offset: 1 }));
    this.scrollView.on('swipe:right', () => this.trigger('navigate', { target: this, offset: -1 }));

    this.createComponents();
    applyColors(this);
    applyFonts(this);
    this.applyLayout();
    if (data) this.applyData(data);
  }

  private createComponents() {
    this.mainKanji = new TextView({ class: 'mainKanji' }).appendTo(this.scrollView);
    this.usefulness = new TextView({ class: 'usefulness mainUsefulness' }).appendTo(this.scrollView);
    this.strokeCount = new TextView().appendTo(this.scrollView);
    this.meaning = new TextView({ class: 'mainMeaning' }).appendTo(this.scrollView);
    this.number = new TextView().appendTo(this.scrollView);
    this.onLabel = new TextView({ class: 'label', text: 'On: ' }).appendTo(this.scrollView);
    this.onyomi = new TextView({ class: 'onyomi' }).appendTo(this.scrollView);
    this.componentsDisplay = new ComponentsDisplay(2, 'mainComponent').appendTo(this.scrollView);
    this.mnemonic = new TextView({ class: 'mnemonic', markupEnabled: true }).appendTo(this.scrollView);
    this.kunLabel = new TextView({ class: 'label', id: 'kunLabel', text: 'Kunyomi: ' }).appendTo(this.scrollView);
    this.kunyomiDisplays = [];
    this.kunSeparators = [];
    this.jukugoLabel = new TextView({ class: 'label', id: 'jukugoLabel', text: 'Jukugo: ' }).appendTo(this.scrollView);;
    this.jukugoDisplays = [];
    this.jukSeparators = [];
    this.tags = [];
  }

  public applyData(data: IKanji): this {
    // header
    this.usefulness.text = getUsefulnessStars(data.usefulness);
    this.strokeCount.text = data.strokeCount + ' strokes';
    this.meaning.text = data.meaning;
    this.mainKanji.text = data.kanji;
    this.number.text = 'number ' + data.number;
    this.onyomi.text = getOnyomi(data);
    this.kunLabel.visible = (data.kunyomi && data.kunyomi.length > 0);
    this.addTags(data.tags);
    this.mnemonic.text = data.mnemonic;
    this.handleWordDisplays(data.kunyomi, this.kunLabel, this.kunyomiDisplays, this.kunSeparators, 'kunyomiDisplay');
    this.handleWordDisplays(data.jukugo.map(index => dictionary.jukugo[index]), this.jukugoLabel, this.jukugoDisplays, this.jukSeparators, 'jukugoDisplay');
    this.componentsDisplay.applyData(data.components);
    return this;
  }

  private handleWordDisplays(data: IWord[], baseWidget: Widget, wordDisplays: WordDisplay[], separators: Widget[], className: string) {
    for (let i = 0; i < Math.max(data.length, wordDisplays.length); i++) {
      if (i < data.length) {
        if (i >= wordDisplays.length) {
          wordDisplays.push(new WordDisplay({ class: className, top: 'prev()', left: 0, right: 20 }).insertAfter(baseWidget));
          separators.push(new Composite({ background: '#ddd', top: ['prev()', 3], left: 20, right: 20, height: 1 }).insertAfter(wordDisplays[i]));
        }
        wordDisplays[i].applyData(data[data.length - 1 - i]);
      }
      if (i >= data.length) {
        wordDisplays[i].dispose();
        separators[i].dispose();
      }
    }
    wordDisplays.length = data.length;
    separators.length = data.length;
  }

  private addTags(tags: string[]) {
    let previousTag: any = this.strokeCount;
    for (let i = 0; i < Math.max(this.tags.length, tags.length); i++) {
      if (i < tags.length) {
        if (i >= this.tags.length) {
          previousTag = createTag('mainTag').set({ right: 10, top: [previousTag, 5] }).appendTo(this.scrollView);
          this.tags.push(previousTag);
        }
        this.tags[i].find('TextView').set('text', tags[i]);
        previousTag = this.tags[i];
      } else {
        this.tags[i].dispose();
      }
    }
    this.tags.length = tags.length;
  }

  private applyLayout() {
    //header
    this.number.layoutData = { centerX: 0, top: 5 };
    this.usefulness.layoutData = { left: 10, top: 8 };
    this.strokeCount.layoutData = { right: 10, top: 10 };
    this.mainKanji.layoutData = { left: 20, top: 20 };
    this.meaning.layoutData = { left: [this.mainKanji, 10], top: 38, right: 100 };
    this.onLabel.layoutData = { left: [this.mainKanji, 10], top: this.meaning };
    this.onyomi.layoutData = { left: [this.onLabel, 0], baseline: this.onLabel, right: 50 };
    this.componentsDisplay.layoutData = { left: 20, right: 20, top: [this.onyomi, 5] }
    //rest
    this.mnemonic.layoutData = { left: 10, top: ['prev()', 5], right: 10 };
    this.kunLabel.layoutData = { left: 10, top: ['prev()', 5] };
    this.jukugoLabel.layoutData = { left: 10, top: ['prev()', 5] };
  }

}
