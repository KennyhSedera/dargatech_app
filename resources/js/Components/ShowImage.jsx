import React from "react";

const ShowImage = ({ selectedImage, setSelectedImage }) => {
    return (
        selectedImage && (
            <div
                className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95 backdrop-blur-sm animate-in fade-in"
                onClick={() => setSelectedImage(null)}
            >
                <div className="relative max-w-6xl max-h-full duration-300 animate-in zoom-in-95">
                    <img
                        src={`/${selectedImage}`}
                        alt="Photo agrandie"
                        className="object-contain max-w-full max-h-screen shadow-2xl rounded-2xl"
                        onClick={(e) => e.stopPropagation()}
                    />
                    <button
                        className="absolute px-4 py-2 text-white transition rounded-full bg-white/10 backdrop-blur-md top-4 right-4 hover:bg-white/20 hover:scale-110"
                        onClick={() => setSelectedImage(null)}
                    >
                        X
                    </button>
                    <div className="absolute hidden px-6 py-3 text-sm text-white -translate-x-1/2 rounded-full sm:block bottom-4 left-1/2 bg-white/10 backdrop-blur-md">
                        Cliquez n'importe où pour fermer
                    </div>
                </div>
            </div>
        )
    );
};

export default ShowImage;
