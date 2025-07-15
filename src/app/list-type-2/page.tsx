"use client";
import { useEffect, useState } from "react";
import { MARKUP_QUESTIONS, Question } from "@/data/quiz";

const Quiz = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [isEnglish, setIsEnglish] = useState(false); // 用來切換語言

  const currentQuestion = questions[currentQuestionIndex];

  useEffect(() => {
    // Shuffle questions when the component mounts
    const type2Questions = [...MARKUP_QUESTIONS].filter(
      (q) => q.type === "findReference"
    );
    setQuestions(type2Questions);
  }, []);

  const handleNextQuestion = () => {
    setShowAnswer(false);
    setCurrentQuestionIndex((prev) => prev + 1);
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
            顯示答案
          </button>

          {showAnswer && (
            <div className="mt-4 text-base font-bold font-serif max-w-2xl">
              {currentQuestion.type === "findReference" ? (
                <div className="font-serif">
                  <p className="p-1 px-2 rounded  font-serif custom-text-shadow">
                    {currentQuestion.reference.zh}
                  </p>
                  <p className="p-1  px-2 rounded  font-serif custom-text-shadow">
                    {currentQuestion.reference.en}
                  </p>
                </div>
              ) : (
                <div className="font-serif">
                  <p className="p-1  px-2 rounded  font-serif custom-text-shadow">
                    {currentQuestion.verse.zh}
                  </p>
                  <p className="p-1 px-2  rounded  mt-2 font-serif custom-text-shadow">
                    {currentQuestion.verse.en}
                  </p>
                </div>
              )}
            </div>
          )}

          <button
            className="mt-8 bg-blue-500 text-white px-4 py-2 rounded"
            onClick={handleNextQuestion}
          >
            下一題
          </button>
          <div className="mt-4 text-sm text-gray-600 lg:text-white">
            {currentQuestionIndex + 1} / {questions.length}
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center">
          <h2 className="text-3xl font-bold px-3 py-1 bg-white rounded">
            測驗完成！
          </h2>
          <button
            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
            onClick={() => window.location.reload()}
          >
            重新開始
          </button>
        </div>
      )}
    </div>
  );
};

export default Quiz;
