import studentScriptures from "./studentScriptures.json";
import leaderScriptures from "./scriptures.json";

export interface Scripture {
  id: number;
  kind: "scripture" | "supplement";
  reference: string;
  verse: string;
  audio?: string;
  source?: string;
}

export interface Collection {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  introduction: string;
  color: "sage" | "clay";
  scriptures: Scripture[];
}

// Each collection owns its content and reading state. Future topic collections
// can use this same model without introducing another reading experience.
export const collections: Collection[] = [
  {
    id: "student",
    title: "學員版",
    subtitle: "扎根真理，活出信仰",
    description: "從神的話語開始，讓信仰在生活中扎根。",
    introduction: "一節一節，將真理收藏在心裡。",
    color: "sage",
    scriptures: studentScriptures as Scripture[],
  },
  {
    id: "leader",
    title: "領袖版",
    subtitle: "在真理中裝備，於生活中帶領",
    description: "在真理中扎根，以謙卑與智慧活出影響力。",
    introduction: "讓神的話，成為帶領與服事的根基。",
    color: "clay",
    scriptures: leaderScriptures as Scripture[],
  },
];

export const getCollection = (id: string) =>
  collections.find((collection) => collection.id === id);
