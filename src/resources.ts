import { Composite } from 'tabris';

export let colors = {
  usefulness: '#ffc40d',
  tag: '#2d6987',
  onyomi: '#f89406',
  translation: '#46a546',
  particle: '#06c',
  component: '#9d261d',
  link: '#08c'
}

export function applyColors(composite: Composite) {
  composite.apply({
    '.usefulness': { textColor: colors.usefulness },
    '.tagContainer': { background: colors.tag },
    '.onyomi': { textColor: colors.onyomi },
    '.translation': { textColor: colors.translation },
    '.particle': { textColor: colors.particle, tintColor: colors.particle },
    '.componentKanji': { textColor: colors.component, tintColor: colors.component },
    '.usedIn': { textColor: colors.link, tintColor: colors.link },
    '.lookalike': { textColor: colors.link, tintColor: colors.link }
  });
}
