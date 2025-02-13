import useTheme from '@/hooks/useTheme';
import React, { useEffect } from 'react'

const MainLayout = ({ children }) => {
    const { theme, setTheme } = useTheme();
    useEffect(() => {
        setTheme(theme || 'light')
    }, [theme])

    return (
        <div className='h-screen w-full bg-gray-100 dark:bg-gray-900 dark:text-white flex items-center justify-center'>
            {children}
        </div>
    )
}

export default MainLayout
