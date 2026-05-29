import {
    Moon,
    Sun,
} from "lucide-react";

import {
    useTheme,
} from "./ThemeProvider";

const ThemeToggle = () => {

    const {
        theme,
        toggleTheme,
    } = useTheme();

    return (

        <button
            onClick={toggleTheme}
            className="
                w-20 h-20
                rounded-3xl
                border border-white/10
                bg-white/5
                backdrop-blur-xl
                flex items-center justify-center
                hover:scale-105
                transition-all
            "
        >

            {theme === "dark" ? (

                <Sun size={30} />

            ) : (

                <Moon size={30} />

            )}

        </button>

    );
};

export default ThemeToggle;