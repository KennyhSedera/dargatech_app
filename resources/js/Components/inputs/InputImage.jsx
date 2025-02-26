import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';

const InputImage = forwardRef(({ className = '', isFocused = false, selectedFile, onLoadFile, onFocus, ...props }, ref) => {
    const inputRef = useRef(null);
    const [filename, setFilename] = useState('Sélectionner une image');

    useImperativeHandle(ref, () => ({
        focus: () => inputRef.current?.focus(),
        click: () => inputRef.current?.click(),
        getFiles: () => inputRef.current?.files,
    }));

    useEffect(() => {
        if (isFocused) {
            inputRef.current?.focus();
        }
    }, [isFocused]);

    useEffect(() => {
        if (!selectedFile) {
            setFilename('Sélectionner une image');
        }
    }, [selectedFile]);

    const handleClick = () => {
        inputRef.current?.click();
        onFocus();
    };

    const handleFileChange = () => {
        const file = inputRef.current?.files?.[0];
        if (file) {
            setFilename(file.name);
            onLoadFile(file);
        }
    };

    return (
        <div>
            <div
                onClick={handleClick}
                className={`rounded-md line-clamp-1 px-2 py-2 border border-gray-300 shadow-sm
                    focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-700
                    dark:bg-gray-900 dark:text-gray-300 dark:focus:border-indigo-600
                    dark:focus:ring-indigo-600 cursor-pointer
                    ${selectedFile ? '' : 'text-gray-500'} ${className}`}
            >
                {filename}
            </div>
            <input
                {...props}
                type="file"
                ref={inputRef}
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
            />
        </div>
    );
});

export default InputImage;
