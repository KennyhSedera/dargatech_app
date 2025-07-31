import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';

const InputImage = forwardRef(
    ({ className = '', isFocused = false, selectedFiles = [], onLoadFile, onFocus, multiple = true, ...props }, ref) => {
        const inputRef = useRef(null);
        const [filenames, setFilenames] = useState(['Sélectionner des images']);

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
            if (!selectedFiles || selectedFiles.length === 0) {
                setFilenames(['Sélectionner des images']);
            }
        }, [selectedFiles]);

        const handleClick = () => {
            inputRef.current?.click();
            onFocus?.();
        };

        const handleFileChange = () => {
            const files = Array.from(inputRef.current?.files || []);
            if (files.length > 0) {
                setFilenames(files.map(file => file.name));
                onLoadFile(files);
            }
        };

        return (
            <div>
                <div
                    onClick={handleClick}
                    className={`rounded-md px-2 py-2 border border-gray-300 shadow-sm
                        focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-700
                        dark:bg-gray-900 dark:text-gray-300 dark:focus:border-indigo-600
                        dark:focus:ring-indigo-600 cursor-pointer text-sm
                        ${selectedFiles.length > 0 ? '' : 'text-gray-500'} ${className}`}
                >
                    {filenames.join(', ')}
                </div>
                <input
                    {...props}
                    type="file"
                    ref={inputRef}
                    accept="image/*"
                    multiple={multiple}
                    className="hidden"
                    onChange={handleFileChange}
                />
            </div>
        );
    }
);

export default InputImage;
