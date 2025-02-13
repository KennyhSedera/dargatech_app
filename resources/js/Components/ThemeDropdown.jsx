import React, { useEffect, useState } from 'react'
import Dropdown from './Dropdown'
import { RiMoonClearFill } from 'react-icons/ri'
import useTheme from '@/hooks/useTheme';
import { MdMonitor } from 'react-icons/md';
import { TbSunFilled } from 'react-icons/tb';

const ThemeDropdown = () => {
    const themes = [
        { icon: TbSunFilled, title: 'light', label: 'Claire' },
        { icon: RiMoonClearFill, title: 'dark', label: 'Sombre' },
        { icon: MdMonitor, title: 'system', label: 'Systeme' },
    ]
    const { theme, setTheme } = useTheme();
    const [currentTheme, setCurrentTheme] = useState(themes.find(t => t.title === theme));

    const handleChangeTheme = (theme) => {
        setCurrentTheme(theme);
        setTheme(theme.title);
    }

    return (
        <div className="relative">
            <Dropdown>
                <Dropdown.Trigger>
                    <button
                        type="button"
                        className="w-9 h-9 flex items-center rounded-full justify-center bg-gray-200 dark:bg-gray-900"
                    >
                        <currentTheme.icon className='text-lg' />
                    </button>
                </Dropdown.Trigger>

                <Dropdown.Content width='auto' contentClasses='border border-gray-400/20'>
                    {themes.map((item, i) => (
                        <Dropdown.Item key={i} onClick={() => handleChangeTheme(item)} className={currentTheme.title === item.title ? 'bg-gray-100 dark:bg-gray-800' : ''}>
                            <item.icon className="text-lg" /> {item.label}
                        </Dropdown.Item>
                    ))}
                </Dropdown.Content>
            </Dropdown>
        </div>
    )
}

export default ThemeDropdown
