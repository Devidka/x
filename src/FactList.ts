import { IFact, IKanji } from "./interfaces";
import { dictionary } from "./app";
import { getType } from "./util";

export default class FactList {
  private _data: IFact[];
  public get length(): number { return this._data.length; }

  constructor(facts?: IFact[]) {
    if (facts) {
      this._data = facts;
      for (let i = 0; i < facts.length; i++) {
        this[facts[i].id] = i;
      }
    } else {
      this._data = [];
    }
  }

  public asArray(): IFact[] {
    return this._data;
  }

  public get(i: number) {
    return this._data[i];
  }

  public push(fact: IFact) {
    this[fact.id] = this.length;
    this._data.push(fact);
    return this.length;
  }

  public addJukugo(minUsefulness: number) {
    let newFactList = new FactList();
    this._data.forEach(entry => {
      newFactList.push(entry);
      if (getType(entry) === 'kanji') {
        (entry as IKanji).jukugo.forEach(jukugoIndex => {
          let jukugo = dictionary.jukugo[jukugoIndex];
          if (jukugo.usefulness >= minUsefulness && !this.contains(jukugo) && !newFactList.contains(jukugo)) {
            newFactList.push(jukugo);
          }
        })
      }
    });
    return newFactList;
  }

  public contains(fact: IFact) {
    return !!this[fact.id];
  }
}
