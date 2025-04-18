export type MangaItemsProps = {
  title: string;
  cardsData: { id: number; img: string }[];
};

const MANGA_PATH = '/gallery/manga/';

const titlesWithCounts: { title: string; count: number }[] = [
  { title: 'おひとり様には慣れましたので。　婚約者放置中！', count: 2 },
  { title: 'ファントムバスターズ', count: 4 },
  { title: '君と宇宙を歩くために', count: 4 },
  { title: '恋せよまやかし天使ども', count: 4 },
  { title: 'ふつうの軽音部', count: 6 },
  { title: 'ドカ食いダイスキ！ もちづきさん', count: 1 },
  { title: 'シバつき物件', count: 3 },
  { title: 'ねずみの初恋', count: 5 },
  { title: '路傍のフジイ', count: 4 },
  { title: 'Dr.STONE', count: 2 },
];

const generateCardsData = (title: string, count: number) =>
  Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    img: `${MANGA_PATH}${title}${i + 1}.jpg`,
  }));

export const MangaItems = titlesWithCounts.map(({ title, count }) => ({
  title,
  cardsData: generateCardsData(title, count),
})) satisfies readonly MangaItemsProps[];
