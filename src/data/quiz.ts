import scriptures from "./scriptures.json";
import studentScriptures from "./studentScriptures.json";

export type QuestionType = "findReference" | "reciteVerse";
export type DataSource = "leader" | "student";

export interface Verse {
  en: string;
  zh: string;
}

export interface Question {
  id: string;
  type: QuestionType;
  verse: Verse;
  reference: Verse;
}

const getShortenedVerse = (text: string, length: number) => {
  if (text.length > length) {
    return text.substring(0, length) + "...";
  }
  return text; // 如果文字長度小於指定長度，則不加 "..."
};

// 獲取數據源
const getDataSource = (): DataSource => {
  if (typeof window !== "undefined") {
    const versionType = localStorage.getItem("versionType");
    return (versionType as DataSource) || "leader";
  }
  return "leader";
};

// 獲取對應的經文數據
const getScriptureData = (dataSource?: DataSource) => {
  const source = dataSource || getDataSource();
  return source === "student" ? studentScriptures : scriptures;
};

// 定義問題陣列的型別
export const generateQuestions = (
  selectedScriptureIds?: number[],
  dataSource?: DataSource
): Question[] => {
  const questions: Question[] = [];
  const scriptureData = getScriptureData(dataSource);

  // 如果有指定選中的經文，就過濾；否則使用全部經文
  const filteredScriptures =
    selectedScriptureIds && selectedScriptureIds.length > 0
      ? scriptureData.filter((scripture) =>
          selectedScriptureIds.includes(scripture.id)
        )
      : scriptureData;

  filteredScriptures.forEach((verseItem) => {
    // Type 1: Find reference
    const findReferenceQuestion: Question = {
      id: `findReference-${verseItem.id}`,
      type: "findReference",
      verse: {
        en: getShortenedVerse(verseItem.verse.en, 30), // 提取前30個字加上 "..."
        zh: getShortenedVerse(verseItem.verse.zh, 15),
      },
      reference: verseItem.reference,
    };

    // Type 2: Recite verse
    const reciteVerseQuestion: Question = {
      id: `reciteVerse-${verseItem.id}`,
      type: "reciteVerse",
      reference: verseItem.reference,
      verse: verseItem.verse,
    };

    questions.push(findReferenceQuestion, reciteVerseQuestion);
  });

  return questions;
};

// 獲取選中的經文ID
export const getSelectedScriptures = (): number[] => {
  if (typeof window !== "undefined") {
    const dataSource = getDataSource();
    const storageKey =
      dataSource === "student"
        ? "student_selectedScriptures"
        : "leader_selectedScriptures";
    const saved = localStorage.getItem(storageKey);
    return saved ? JSON.parse(saved) : [];
  }
  return [];
};

// 使用 generateQuestions 函數來生成問題
export const MARKUP_QUESTIONS = generateQuestions();
