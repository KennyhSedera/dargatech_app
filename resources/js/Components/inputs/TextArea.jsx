import React, { forwardRef } from 'react';

const TextArea = forwardRef(({ className = '', readOnly = false, ...props }, ref) => {
    return (
        <textarea
            {...props}
            readOnly={readOnly}
            className={
                'rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:focus:border-indigo-600 dark:focus:ring-indigo-600 ' +
                (readOnly ? 'bg-gray-100 cursor-not-allowed ' : '') +
                className
            }
            ref={ref}
        />
    );
});

TextArea.displayName = 'TextArea';

export default TextArea; 