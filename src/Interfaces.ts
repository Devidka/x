export interface IKunyomi {
        tags: string[];
        preParticle: string;
        postParticle: string;
        reading: string;
        okurigana: string;
        translation: string;
        usefulness: number;
}

export interface IJukugo {
        preParticle: string;
        postParticle: string;
        kanji: string;
        reading: string;
        translation: string;
        description: string;
        usefulness: number;
        components: { kanji: string, meaning: string }[];
        tags: string[];
}


export interface IDictionaryEntry {
  number: number;
  kanji: string;
  kanjiImageSource: string;
  strokeCount: number;
  meaning: string;
  usefulness: number;
  tags: string[];
  strokeOrderImageSource: string;
  components: {kanji: string, kanjiImageSource: string, meaning: string}[];
  onyomi: string[];
  mnemonic: string;
  kunyomi: IKunyomi[];
  jukugo: IJukugo[];
}