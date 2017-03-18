type jukugoIndex = number;

export interface IFact {
        tags: string[];
        kanji: string; // the word without okurigana
        meaning: string;
        usefulness: number;
        id: string;
}
export interface IWord extends IFact {
        preParticle: string;
        postParticle: string;
        reading: string; // full reading with okurigana
        description: string;
}

export interface IKunyomi extends IWord {
        okurigana: string;
}

export interface IJukugo extends IWord {
        okurigana: { pre: string, post: string };
        components: { kanji: string, meaning: string }[];
}

export interface ILookalikeSet {
        lookalikeTable: { kanji: string, meaning: string, hint: string, radical: string }[],
        lookalikeMnemonics: string[]
}

export interface IKanji extends IFact {
        number: number;
        kanjiImageSource: string;
        strokeCount: number;
        strokeOrderImageSource: string;
        components: { kanji: string, kanjiImageSource: string, meaning: string }[];
        onyomi: string[];
        mnemonic: string;
        kunyomi: IKunyomi[];
        jukugo: jukugoIndex[];
        frequencyRating: number;
        usedIn: { kanji: string, kanjiImageSource: string }[];
        lookalikeSets: ILookalikeSet[];
}