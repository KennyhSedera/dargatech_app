import useTheme from '@/hooks/useTheme';
import React, { useEffect } from 'react'

const MainLayout = ({ children }) => {
    const { theme, setTheme } = useTheme();
    useEffect(() => {
        setTheme(theme || 'light')
    }, [theme])

    return (
        <div className="relative h-screen w-full bg-gray-100 bg-[url('/images/bg.jpg')] bg-no-repeat bg-cover bg-center dark:bg-gray-900 dark:text-white flex items-center justify-center overflow-y-auto">
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black/80"></div>
            {children}
        </div>

    )
}

export default MainLayout;
