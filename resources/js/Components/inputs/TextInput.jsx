import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

export default forwardRef(function TextInput(
    { type = 'text', className = '', isFocused = false, value, ...props },
    ref,
) {
    const localRef = useRef(null);
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === 'password';
    
    // Handle null/undefined values
    const safeValue = value === null || value === undefined ? '' : value;

    useImperativeHandle(ref, () => ({
        focus: () => localRef.current?.focus(),
    }));

    useEffect(() => {
        if (isFocused) {
            localRef.current?.focus();
        }
    }, [isFocused]);

    const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div className="relative flex items-center">
            <input
                {...props}
                value={safeValue}
                type={inputType}
                className={
                    'rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:focus:border-indigo-600 dark:focus:ring-indigo-600 ' +
                    (isPassword ? 'pr-10 ' : '') +
                    className
                }
                ref={localRef}
            />
            {isPassword && (
                <button
                    type="button"
                    className="absolute right-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                    onClick={togglePasswordVisibility}
                    tabIndex="-1"
                >
                    {!showPassword ? (
                        <EyeOff size={20} className="h-5 w-5" />
                    ) : (
                        <Eye size={20} className="h-5 w-5" />
                    )}
                </button>
            )}
        </div>
    );
});