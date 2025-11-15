import { hasLeadingSlash } from "@/constant";
import { ChevronRight } from "lucide-react";
import React, { useEffect, useState } from "react";

const ShowImage = ({ selectedImage, setSelectedImage, listImages = null }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const isGalleryMode =
        listImages && Array.isArray(listImages) && listImages.length > 0;

    useEffect(() => {
        if (isGalleryMode && selectedImage) {
            const index = listImages.findIndex((img) => img === selectedImage);
            if (index !== -1) {
                setCurrentIndex(index);
            }
        }
    }, [selectedImage, listImages, isGalleryMode]);

    const goToPrevious = (e) => {
        e.stopPropagation();
        setCurrentIndex((prev) => {
            const newIndex = prev === 0 ? listImages.length - 1 : prev - 1;
            setSelectedImage(listImages[newIndex]);
            return newIndex;
        });
    };

    const goToNext = (e) => {
        e.stopPropagation();
        setCurrentIndex((prev) => {
            const newIndex = prev === listImages.length - 1 ? 0 : prev + 1;
            setSelectedImage(listImages[newIndex]);
            return newIndex;
        });
    };

    useEffect(() => {
        if (!selectedImage || !isGalleryMode) return;

        const handleKeyDown = (e) => {
            if (e.key === "ArrowLeft") goToPrevious(e);
            if (e.key === "ArrowRight") goToNext(e);
            if (e.key === "Escape") setSelectedImage(null);
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [selectedImage, isGalleryMode, currentIndex]);

    const handleBackdropClick = () => {
        if (!isGalleryMode) {
            setSelectedImage(null);
        }
    };

    const currentImage = isGalleryMode
        ? listImages[currentIndex]
        : selectedImage;
    const formatImageSrc = (img) => `${hasLeadingSlash(img) ? "" : "/"}${img}`;

    return (
        selectedImage && (
            <div
                className="fixed inset-0 z-50 flex items-center justify-between p-4 bg-black/95 backdrop-blur-sm animate-in fade-in"
                onClick={handleBackdropClick}
            >
                <div className="z-50">
                    {isGalleryMode &&
                        listImages.length > 1 &&
                        currentIndex > 0 && (
                            <button
                                className="absolute flex items-center justify-center w-12 h-12 text-white transition -translate-y-1/2 rounded-full bg-white/10 backdrop-blur-md left-4 top-1/2 hover:bg-white/20 hover:scale-110"
                                onClick={goToPrevious}
                                title="Image précédente (←)"
                            >
                                <ChevronRight className="rotate-180" />
                            </button>
                        )}
                </div>
                <button
                    className="absolute flex items-center justify-center w-10 h-10 text-white transition rounded-full bg-white/10 backdrop-blur-md top-4 right-4 hover:bg-white/20 hover:scale-110"
                    onClick={() => setSelectedImage(null)}
                    title="Fermer (Esc)"
                >
                    <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                        />
                    </svg>
                </button>
                <div className="relative max-w-6xl max-h-full duration-300 animate-in zoom-in-95">
                    <img
                        src={formatImageSrc(currentImage)}
                        alt="Photo agrandie"
                        className="object-contain w-auto max-w-[85vw] md:min-w-[500px] shadow-2xl max-h-[90vh] rounded-2xl"
                        onClick={(e) => e.stopPropagation()}
                    />
                </div>

                {isGalleryMode && listImages.length > 1 && (
                    <>
                        <div className="absolute px-4 py-2 text-sm font-medium text-white -translate-x-1/2 rounded-full bg-white/10 backdrop-blur-md top-12 left-1/2">
                            {currentIndex + 1} / {listImages.length}
                        </div>
                    </>
                )}

                <div className="absolute hidden px-6 py-2 text-xs text-white -translate-x-1/2 rounded-full sm:block bottom-4 left-1/2 bg-white/10 backdrop-blur-md">
                    {isGalleryMode ? (
                        <span>
                            Utilisez les flèches ou boutons pour naviguer •
                            Cliquez X pour fermer
                        </span>
                    ) : (
                        <span>Cliquez n'importe où pour fermer</span>
                    )}
                </div>
                <div>
                    {isGalleryMode &&
                        listImages.length > 1 &&
                        currentIndex < listImages.length - 1 && (
                            <button
                                className="absolute flex items-center justify-center w-12 h-12 text-white transition -translate-y-1/2 rounded-full bg-white/10 backdrop-blur-md right-4 top-1/2 hover:bg-white/20 hover:scale-110"
                                onClick={goToNext}
                                title="Image suivante (→)"
                            >
                                <ChevronRight />
                            </button>
                        )}
                </div>
            </div>
        )
    );
};

export default ShowImage;
