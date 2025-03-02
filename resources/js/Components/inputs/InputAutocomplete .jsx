import React, { useState, forwardRef, useEffect, useImperativeHandle, useRef } from 'react';

const InputAutocomplete = forwardRef(
    ({ data = [], className = '', isFocused = false, defaultValue = null, onSelect, onFocus, ...props }, ref) => {
        const [inputValue, setInputValue] = useState('');
        const [filteredData, setFilteredData] = useState([]);
        const [showSuggestions, setShowSuggestions] = useState(false);
        const autocompleteRef = useRef(null);
        const wrapperRef = useRef(null);

        useImperativeHandle(ref, () => ({
            focus: () => autocompleteRef.current?.focus(),
        }));

        useEffect(() => {
            if (defaultValue) {
                const defaultItem = data.find((item) => item.id === defaultValue);
                if (defaultItem) {
                    setInputValue(defaultItem.nom || defaultItem.title);
                }
            }
        }, [defaultValue, data]);

        useEffect(() => {
            if (isFocused) {
                autocompleteRef.current?.focus();
            }
        }, [isFocused]);

        useEffect(() => {
            if (inputValue) {
                const filtered = data.filter((item) =>
                    (item.nom || item.title || '').toLowerCase().includes(inputValue.toLowerCase())
                );
                setFilteredData(filtered);
                setShowSuggestions(true);
            } else {
                setFilteredData([]);
                setShowSuggestions(false);
            }
        }, [inputValue, data]);

        useEffect(() => {
            function handleClickOutside(event) {
                if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                    setShowSuggestions(false);
                }
            }

            document.addEventListener('mousedown', handleClickOutside);
            return () => {
                document.removeEventListener('mousedown', handleClickOutside);
            };
        }, []);

        const handleSelect = (selectedItem) => {
            setInputValue(selectedItem.nom || selectedItem.title);
            setShowSuggestions(false);
            if (onSelect) {
                onSelect(selectedItem);
            }
        };

        return (
            <div className="relative" ref={wrapperRef}>
                <input
                    {...props}
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    className={
                        'rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:focus:border-indigo-600 dark:focus:ring-indigo-600 ' +
                        className
                    }
                    ref={autocompleteRef}
                    onFocus={() => (setShowSuggestions(true), onFocus())}
                />
                {showSuggestions && filteredData.length > 0 && (
                    <ul className="absolute z-50 mt-1 w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md shadow-lg max-h-48 overflow-y-auto">
                        {filteredData.map((item) => (
                            <li
                                key={item.id}
                                className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                                onMouseDown={() => handleSelect(item)}
                            >
                                {item.nom || item.title}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        );
    }
);

export default InputAutocomplete;
