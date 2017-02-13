export interface IWord {
  word: string;
  meaning: string;
  description?: string[];
  usefulness: number;
}

export interface IDictionaryEntry {
  id: number;
  kanji: string;
  meaning: string;
  usefulness: number;
  strokeCount: number;
  tags: string[];
  radicals: string;
  onyomi: string[];
  mnemonic: string[];
  description: string[];
  kunyomi: IWord[];
  jukugo: IWord[];
}