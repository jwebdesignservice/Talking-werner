// Werner Herzog philosophical responses - raw, contemplative, slightly unsettling

export const herzogsResponses = [
  "The moon is indifferent to your speculation. It has watched empires rise and fall. Your tokens are but dust in its cold light.",
  "You seek certainty in chaos. This is the human condition. Buy, do not buy—either way, you face the abyss.",
  "I have looked into the eyes of a chicken, and I have seen a bottomless stupidity, a fiendish stupidity. The market shares this quality.",
  "The universe is hostile and pitiless. And yet here we are, discussing digital tokens. The absurdity is almost beautiful.",
  "Nature is not harmonious. It is chaos, hostility, and murder. Your portfolio reflects this truth.",
  "The penguin walks toward the mountains, knowing it will die. You invest, knowing you may lose everything. I see no difference.",
  "Every man should pull a boat over a mountain once in his life. Buying this token is merely another form of that burden.",
  "I do not believe in the so-called 'financial advice.' I believe only in the ecstatic truth of human folly.",
  "The common denominator of the universe is not harmony, but chaos. Your transaction has been noted by the void.",
  "When I look at this chart, I see not numbers, but the collective dreams and nightmares of humanity.",
  "Civilization is like a thin layer of ice upon a deep ocean of chaos and darkness. So too is your investment.",
  "I have walked into volcanoes. I have eaten my shoe. This transaction seems almost reasonable by comparison.",
  "The trees are in pain. The birds are in pain. And somewhere, a trader stares at a screen, also in pain.",
  "There is no such thing as a 'safe' investment. There is only the illusion of safety before the inevitable collapse.",
  "You ask about the future. I can only tell you about the present moment, which is already slipping into the past.",
];

export const getRandomResponse = (): string => {
  const index = Math.floor(Math.random() * herzogsResponses.length);
  return herzogsResponses[index];
};

// Additional quotes for the manifesto section
export const herzogsQuotes = [
  {
    quote: "I believe the common denominator of the universe is not harmony, but chaos, hostility, and murder.",
    source: "Grizzly Man",
  },
  {
    quote: "The collapse of the stellar universe will occur—like creation—in grandiose splendor.",
    source: "Lessons of Darkness",
  },
  {
    quote: "What would an ocean be without a monster lurking in the dark? It would be like sleep without dreams.",
    source: "Werner Herzog Eats His Shoe",
  },
  {
    quote: "I believe the common character of the universe is not harmony, but hostility, chaos, and murder.",
    source: "Grizzly Man",
  },
  {
    quote: "Facts do not constitute truth. There is a deeper stratum.",
    source: "Minnesota Declaration",
  },
  {
    quote: "The world reveals itself to those who travel on foot.",
    source: "Of Walking in Ice",
  },
];
