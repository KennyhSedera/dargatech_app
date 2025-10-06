import React, { useState } from "react";
import Dropdown from "../inputs/Dropdown";
import { RiMoonClearFill } from "react-icons/ri";
import useTheme from "@/hooks/useTheme";
import { MdMonitor } from "react-icons/md";
import { TbSunFilled } from "react-icons/tb";

const ThemeDropdown = () => {
    const themes = [
        { icon: TbSunFilled, title: "light", label: "Claire" },
        { icon: RiMoonClearFill, title: "dark", label: "Sombre" },
        { icon: MdMonitor, title: "system", label: "Systeme" },
    ];
    const { theme, setTheme } = useTheme();
    const [currentTheme, setCurrentTheme] = useState(
        themes.find((t) => t.title === theme)
    );

    const handleChangeTheme = (theme) => {
        setCurrentTheme(theme);
        setTheme(theme.title);
    };

    return (
        <div className="relative">
            <Dropdown>
                <Dropdown.Trigger>
                    <button
                        type="button"
                        className="inline-flex items-center justify-center p-2 text-gray-400 transition duration-150 ease-in-out rounded-md w-9 h-9 hover:bg-gray-100 hover:text-gray-500 focus:bg-gray-100 focus:text-gray-500 focus:outline-none dark:text-gray-500 dark:hover:bg-gray-900 dark:hover:text-gray-400 dark:focus:bg-gray-900 dark:focus:text-gray-400"
                    >
                        <currentTheme.icon className="text-lg" />
                    </button>
                </Dropdown.Trigger>

                <Dropdown.Content
                    width="auto"
                    contentClasses="border border-gray-400/20"
                >
                    {themes.map((item, i) => (
                        <Dropdown.Item
                            key={i}
                            onClick={() => handleChangeTheme(item)}
                            className={
                                currentTheme.title === item.title
                                    ? "bg-gray-100 dark:bg-gray-800"
                                    : ""
                            }
                        >
                            <item.icon className="text-lg" /> {item.label}
                        </Dropdown.Item>
                    ))}
                </Dropdown.Content>
            </Dropdown>
        </div>
    );
};

export default ThemeDropdown;
