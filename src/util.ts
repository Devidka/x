import { TextView, ImageView } from 'tabris';

export function parseImage(tag) {
  return '../images/dictionary/' + tag.split('"')[1];
}

export function getUsefulnessStars(data: { usefulness: number }) {
  let stars = '';
  for (let i = 0; i <= 5; i++) stars += data.usefulness > i ? '★' : '☆';
  return stars;
}

export function createKanji(data: { kanji: string, kanjiImageSource?: string }, size: number) {
  if (data.kanjiImageSource) {
    console.error('drawing image kanji is not yet supportet')
  }
  return new TextView({ class: 'kanji', text: data.kanji, font: size + 'px' });
}