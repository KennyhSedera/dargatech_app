import {
    forwardRef,
    useEffect,
    useImperativeHandle,
    useRef,
    useState,
} from "react";

const InputImage = forwardRef(
    (
        {
            className = "",
            isFocused = false,
            selectedFile = null,
            selectedFiles = [],
            onLoadFile,
            onFocus,
            multiple = true,
            placeholder = null,
            ...props
        },
        ref
    ) => {
        const inputRef = useRef(null);
        const [filenames, setFilenames] = useState([]);

        const defaultPlaceholder = multiple
            ? "Sélectionner des images"
            : "Sélectionner une image";
        const displayPlaceholder = placeholder || defaultPlaceholder;

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
            if (multiple) {
                if (!selectedFiles || selectedFiles.length === 0) {
                    setFilenames([displayPlaceholder]);
                } else {
                    setFilenames(
                        selectedFiles.map((file) => file.name || file)
                    );
                }
            } else {
                if (!selectedFile) {
                    setFilenames([displayPlaceholder]);
                } else {
                    const fileName = selectedFile.name || selectedFile;
                    setFilenames([fileName]);
                }
            }
        }, [selectedFile, selectedFiles, multiple, displayPlaceholder]);

        const handleClick = () => {
            inputRef.current?.click();
            onFocus?.();
        };

        const handleFileChange = () => {
            const files = Array.from(inputRef.current?.files || []);
            if (files.length > 0) {
                setFilenames(files.map((file) => file.name));

                if (multiple) {
                    onLoadFile(files);
                } else {
                    onLoadFile(files[0]);
                }
            }
        };

        const hasFiles = multiple
            ? selectedFiles && selectedFiles.length > 0
            : selectedFile !== null && selectedFile !== undefined;

        return (
            <div>
                <div
                    onClick={handleClick}
                    className={`rounded-md h-11 flex items-center mt-1 border border-gray-300 shadow-sm
                        focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-700
                        dark:bg-gray-900 dark:text-gray-300 dark:focus:border-indigo-600
                        dark:focus:ring-indigo-600 cursor-pointer text-sm
                        ${hasFiles ? "" : "text-gray-500"} ${className}`}
                >
                    <span className="px-2 truncate">
                        {filenames.join(", ")}
                    </span>
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

InputImage.displayName = "InputImage";

export default InputImage;
