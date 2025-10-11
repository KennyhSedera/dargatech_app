import { useState, useEffect } from "react";

export function AnimatedSolarText1() {
    const phrases = [
        "Sisam dargatech Togo",
        "Innovation Solaire",
        "Énergie Renouvelable",
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
                    setCurrentPhraseIndex(
                        (prev) => (prev + 1) % phrases.length
                    );
                    setVisible("");
                }, 3000);
            }
        }, 150);

        return () => {
            clearInterval(interval);
            clearTimeout(timeoutId);
        };
    }, [currentPhraseIndex]);

    return (
        <div className="relative flex items-center justify-center py-8">
            {/* Particules de fond */}
            <div className="absolute inset-0 overflow-hidden">
                {[...Array(20)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute w-1 h-1 bg-yellow-400 rounded-full animate-pulse"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            animationDelay: `${Math.random() * 2}s`,
                            opacity: Math.random() * 0.5 + 0.2,
                        }}
                    />
                ))}
            </div>

            {/* Texte principal */}
            <div className="relative z-10">
                <div className="relative text-xl font-black md:text-2xl lg:text-3xl">
                    {phrases[currentPhraseIndex]
                        .split("")
                        .map((char, index) => (
                            <span
                                key={index}
                                className={`inline-block transition-all duration-700 bg-gradient-to-br from-yellow-400 via-orange-500 to-red-600 bg-clip-text text-transparent ${
                                    index < visible.length
                                        ? "translate-y-0 opacity-100 scale-100 rotate-0"
                                        : "translate-y-12 opacity-0 scale-50 rotate-12"
                                }`}
                                style={{
                                    transitionDelay: `${index * 50}ms`,
                                    textShadow:
                                        "0 0 30px rgba(251, 191, 36, 0.5)",
                                    animation:
                                        index < visible.length
                                            ? `wave 2s ease-in-out ${
                                                  index * 0.1
                                              }s infinite`
                                            : "none",
                                }}
                            >
                                {char === " " ? "\u00A0" : char}
                            </span>
                        ))}
                </div>

                {/* Effets de lueur multiples */}
                <div className="absolute left-0 right-0 flex justify-center -z-10 top-1/2">
                    <div className="w-3/4 h-12 rounded-full bg-gradient-to-r from-transparent via-yellow-400 to-transparent blur-2xl opacity-40 animate-pulse"></div>
                </div>
                <div className="absolute left-0 right-0 flex justify-center -z-20 top-1/2">
                    <div
                        className="w-full h-16 rounded-full bg-gradient-to-r from-orange-400 via-red-500 to-orange-400 blur-3xl opacity-20 animate-pulse"
                        style={{ animationDelay: "0.5s" }}
                    ></div>
                </div>
            </div>

            <style jsx>{`
                @keyframes wave {
                    0%,
                    100% {
                        transform: translateY(0px);
                    }
                    50% {
                        transform: translateY(-10px);
                    }
                }
            `}</style>
        </div>
    );
}

export function AnimatedSolarText3() {
    const phrases = [
        "Sisam Dargatech Togo et Burkina Faso",
        "Innovation Solaire",
        "Togo Énergie",
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
                    setCurrentPhraseIndex(
                        (prev) => (prev + 1) % phrases.length
                    );
                    setVisible("");
                }, 3000);
            }
        }, 100);

        return () => {
            clearInterval(interval);
            clearTimeout(timeoutId);
        };
    }, [currentPhraseIndex]);

    return (
        <div className="relative flex items-center justify-center perspective-1000">
            <div className="relative">
                <div className="text-lg font-black uppercase md:text-xl lg:text-2xl transform-style-3d">
                    {phrases[currentPhraseIndex]
                        .split("")
                        .map((char, index) => (
                            <span
                                key={index}
                                className={`inline-block transition-all duration-1000 ${
                                    index < visible.length
                                        ? "translate-y-0 opacity-100 rotate-x-0"
                                        : "translate-y-16 opacity-0 rotate-x-90"
                                }`}
                                style={{
                                    transitionDelay: `${index * 60}ms`,
                                    textShadow: `
                  0 1px 0 #ccc,
                  0 2px 0 #c9c9c9,
                  0 3px 0 #bbb,
                  0 4px 0 #b9b9b9,
                  0 5px 0 #aaa,
                  0 6px 1px rgba(0,0,0,.1),
                  0 0 5px rgba(0,0,0,.1),
                  0 1px 3px rgba(0,0,0,.3),
                  0 3px 5px rgba(0,0,0,.2),
                  0 5px 10px rgba(0,0,0,.25),
                  0 10px 10px rgba(0,0,0,.2),
                  0 20px 20px rgba(0,0,0,.15)
                `,
                                }}
                            >
                                <span className="text-transparent bg-gradient-to-b from-yellow-200 via-orange-400 to-red-600 bg-clip-text">
                                    {char === " " ? "\u00A0" : char}
                                </span>
                            </span>
                        ))}
                </div>
            </div>
        </div>
    );
}

export function AnimatedSolarText4() {
    const phrases = ["SISAM DARGATECH TOGO", "SISAM DARGATECH BURKINA FASO"];

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
                    setCurrentPhraseIndex(
                        (prev) => (prev + 1) % phrases.length
                    );
                    setVisible("");
                }, 3000);
            }
        }, 130);

        return () => {
            clearInterval(interval);
            clearTimeout(timeoutId);
        };
    }, [currentPhraseIndex]);

    return (
        <div className="relative flex items-center justify-center">
            <div className="relative">
                <div className="text-lg font-black tracking-widest uppercase md:text-xl lg:text-2xl">
                    {phrases[currentPhraseIndex]
                        .split("")
                        .map((char, index) => (
                            <span
                                key={index}
                                className={`inline-block transition-all duration-500 bg-gradient-to-b from-yellow-200 via-orange-400 to-red-600 bg-clip-text text-transparent ${
                                    index < visible.length
                                        ? "opacity-100 scale-100 blur-0"
                                        : "opacity-0 scale-50 blur-sm"
                                }`}
                            >
                                {char === " " ? "\u00A0" : char}
                            </span>
                        ))}
                </div>
            </div>
        </div>
    );
}
