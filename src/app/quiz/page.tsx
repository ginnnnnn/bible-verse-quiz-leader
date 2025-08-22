"use client";
import { useEffect, useState } from "react";
import { MARKUP_QUESTIONS, Question } from "@/data/quiz";
import BackToRoot from "@/components/backToRoot";

// Utility function to shuffle an array
const shuffleArray = (array: Question[]) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

const Quiz = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [isEnglish, setIsEnglish] = useState(false); // 用來切換語言

  const currentQuestion = questions[currentQuestionIndex];

  useEffect(() => {
    // Shuffle questions when the component mounts
    const shuffledQuestions = shuffleArray([...MARKUP_QUESTIONS]);
    setQuestions(shuffledQuestions);
  }, []);

  const handleNextQuestion = () => {
    setShowAnswer(false);
    setCurrentQuestionIndex((prev) => prev + 1);
  };

  const handlePreviousQuestion = () => {
    setShowAnswer(false);
    setCurrentQuestionIndex((prev) => prev - 1);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-5">
      {currentQuestion ? (
        <>
          {/* 切換語言按鈕 */}

          {/* 題目標題根據當前語言狀態切換 */}
          <div className="flex gap-1">
            <button
              className={
                "mb-4 bg-blue-500 text-white px-2 py-1 rounded text-sm w-[45px] " +
                (isEnglish ? " opacity-50" : "")
              }
              onClick={() => setIsEnglish(false)}
            >
              中文
            </button>

            <button
              className={
                "mb-4 bg-blue-600 text-white px-2 py-1 rounded text-sm w-[45px] " +
                (!isEnglish ? " opacity-50" : "")
              }
              onClick={() => setIsEnglish(true)}
            >
              EN
            </button>
          </div>
          <div className=" px-4 py-2 rounded bg-opacity-90 custom-text-shadow">
            <h2 className="text-2xl font-bold custom-text-shadow">
              {currentQuestion.type === "findReference"
                ? isEnglish
                  ? "Where is this verse from?"
                  : "請問這節經文出自哪裡？"
                : isEnglish
                ? "Please recite this verse"
                : "請背誦此經文"}
            </h2>

            {/* 題目內容根據當前語言狀態切換 */}

            <p className="mt-4 text-lg lg:text-xl text-center font-black custom-text-shadow font-serif">
              {currentQuestion.type === "findReference"
                ? isEnglish
                  ? currentQuestion.verse.en
                  : currentQuestion.verse.zh
                : isEnglish
                ? currentQuestion.reference.en
                : currentQuestion.reference.zh}
            </p>
          </div>

          <button
            className={
              "mt-4 bg-green-500 text-white px-4 py-2 rounded" +
              (showAnswer ? " hidden" : "")
            }
            onClick={() => setShowAnswer(true)}
          >
            {isEnglish ? "Show Answer" : "顯示答案"}
          </button>

          {showAnswer && (
            <div className="mt-4 text-base font-bold font-serif max-w-2xl">
              {currentQuestion.type === "findReference" ? (
                <div className="font-serif">
                  <p className="p-1 px-2 rounded font-serif custom-text-shadow">
                    {isEnglish
                      ? currentQuestion.reference.en
                      : currentQuestion.reference.zh}
                  </p>
                </div>
              ) : (
                <div className="font-serif">
                  <p className="p-1 px-2 rounded font-serif custom-text-shadow">
                    {isEnglish
                      ? currentQuestion.verse.en
                      : currentQuestion.verse.zh}
                  </p>
                </div>
              )}
            </div>
          )}

          <div className="flex gap-4 mt-8">
            <button
              className={`bg-gray-500 text-white px-4 py-2 rounded ${
                currentQuestionIndex === 0
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-gray-600"
              }`}
              onClick={handlePreviousQuestion}
              disabled={currentQuestionIndex === 0}
            >
              {isEnglish ? "Previous" : "上一題"}
            </button>
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              onClick={handleNextQuestion}
            >
              {isEnglish ? "Next Question" : "下一題"}
            </button>
          </div>
          <div className="mt-4 text-sm text-gray-600 lg:text-white">
            {currentQuestionIndex + 1} / {questions.length}
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center">
          <h2 className="text-3xl font-bold px-3 py-1 bg-white rounded">
            {isEnglish ? "Quiz Completed!" : "測驗完成！"}
          </h2>
          <BackToRoot />
        </div>
      )}
    </div>
  );
};

export default Quiz;
