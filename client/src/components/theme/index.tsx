import { useLayoutEffect } from "react";
import { useRecoilState } from "recoil";

// hooks
import { useStore } from "@/hooks/useStore";

// icons
import { IoSunny } from "react-icons/io5";
import { MdDarkMode } from "react-icons/md";

// constants
import { THEME_OPTIONS } from "@/constants";
import { join } from "@/utils";

type ThemeToggleProps = {
  className?: string;
  iconClassName?: string;
};

const ThemeToggle = ({
  className = "",
  iconClassName = "",
}: ThemeToggleProps) => {
  const { themeAtom } = useStore();
  const [theme, setTheme] = useRecoilState(themeAtom);

  useLayoutEffect(() => {
    const localTheme = localStorage.getItem("theme") || theme;
    const validNewTheme = Object.values(THEME_OPTIONS).find(
      theme => theme === localTheme
    );
    document.documentElement.classList.remove(
      THEME_OPTIONS.LIGHT,
      THEME_OPTIONS.DARK
    );
    document.documentElement.classList.add(validNewTheme || theme);
    setTheme(validNewTheme || theme);
  }, [theme, setTheme]);

  const toggleTheme = () => {
    const newTheme =
      theme === THEME_OPTIONS.LIGHT ? THEME_OPTIONS.DARK : THEME_OPTIONS.LIGHT;
    localStorage.setItem("theme", newTheme);
    setTheme(newTheme);
  };

  const themeIcon =
    theme === THEME_OPTIONS.LIGHT ? (
      <IoSunny className={join(iconClassName, "h-5 w-5")} />
    ) : (
      <MdDarkMode className={join(iconClassName, "h-5 w-5")} />
    );

  return (
    <button
      className={join(className, "p-2 rounded-lg text-black bg-accent")}
      onClick={toggleTheme}>
      {themeIcon}
    </button>
  );
};

export default ThemeToggle;
