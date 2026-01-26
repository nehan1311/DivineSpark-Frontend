import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { motion } from 'framer-motion';

const ThemeToggle: React.FC = () => {
    const { theme, toggleTheme } = useTheme();

    return (
        <button
            onClick={toggleTheme}
            className={`
        relative p-2 rounded-full transition-colors duration-200
        ${theme === 'light'
                    ? 'bg-[#E3E9DF] hover:bg-[#D1D9CD] text-[#1A3C34]'
                    : 'bg-[#1A3C34] hover:bg-[#2C4E46] text-[#E3E9DF] border border-[#2C4E46]'
                }
      `}
            aria-label="Toggle theme"
            title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        >
            <motion.div
                initial={false}
                animate={{ rotate: theme === 'dark' ? 180 : 0 }}
                transition={{ duration: 0.5, type: "spring" }}
            >
                {theme === 'light' ? (
                    <Sun size={20} className="stroke-2" />
                ) : (
                    <Moon size={20} className="stroke-2" />
                )}
            </motion.div>
        </button>
    );
};

export default ThemeToggle;
