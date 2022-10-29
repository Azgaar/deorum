const randomNames = [
  'Aurelia',
  'Aurora',
  'Ava',
  'Avery',
  'Bella',
  'Brooklyn',
  'Charlotte',
  'Chloe',
  'Ella',
  'Evelyn',
  'Grace',
  'Harper',
  'Hazel',
  'Isabella',
  'Layla',
  'Lillian',
  'Lily',
  'Mia',
  'Nora',
  'Olivia',
  'Penelope',
  'Riley',
  'Savannah',
  'Serenity',
  'Skylar',
  'Sophia',
  'Stella',
  'Zoey',
  'Zoe',
  'Aaliyah',
  'Alexa',
  'Alice',
  'Allison',
  'Amelia',
  'Anna',
  'Annabelle',
  'Aria',
  'Ariana',
  'Aubrey',
  'Audrey',
  'Autumn',
  'Beatrix',
  'Brianna',
  'Camila',
  'Caroline',
  'Cora',
  'Daisy',
  'Eleanor',
  'Pavel',
  'Pavla',
  'Petr',
  'Petra',
  'Petrus',
  'Petronela',
  'Poe',
  'Polly',
  'Pollyanna',
  'Lada',
  'Ladislav',
  'Ladislava'
];

export const getRandomName = () => randomNames[Math.floor(Math.random() * randomNames.length)];

export const getRandomNames = (quantity: number) => {
  const names = new Set<string>();

  while (names.size < quantity) {
    names.add(getRandomName());
  }

  return [...names];
};
