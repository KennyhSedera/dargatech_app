import { useState, useEffect } from "react";

export default function AnimatedSolarText() {
  const phrases = [
    "EXIGEZ LE MEILLEUR DU SOLAIRE",
    "L'ÉNERGIE DE DEMAIN, AUJOURD'HUI",
    "SOLUTIONS SOLAIRES DURABLES",
  ];

  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);
  const [visible, setVisible] = useState("");

  useEffect(() => {
    let i = 0;
    let timeoutId;
    const fullText = phrases[currentPhraseIndex];

    const interval = setInterval(() => {
      if (i <= fullText.length) {
        setVisible(fullText.substring(0, i));
        i++;
      } else {
        clearInterval(interval);
        timeoutId = setTimeout(() => {
          setCurrentPhraseIndex((prev) => (prev + 1) % phrases.length);
          setVisible("");
        }, 3000);
      }
    }, 250);

    return () => {
      clearInterval(interval);
      clearTimeout(timeoutId);
    };
  }, [currentPhraseIndex]);

  return (
    <div className="hidden sm:flex justify-center text-orange-600 dark:text-indigo-600 items-center font-black text-2xl relative whitespace-pre">
      {phrases[currentPhraseIndex].split("").map((char, index) => (
        <span
          key={index}
          className={`inline-block transition-all duration-500 ${
            index < visible.length
              ? "translate-y-0 opacity-100"
              : "translate-y-8 opacity-0"
          }`}
          style={{
            transitionDelay: `${index * 75}ms`,
          }}
        >
          {char === " " ? "\u00A0" : char}
        </span>
      ))}
      <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 -z-10 w-full h-8 bg-yellow-200 dark:bg-blue-800 rounded-full blur-xl opacity-30 animate-pulse"></div>
    </div>
  );
}
