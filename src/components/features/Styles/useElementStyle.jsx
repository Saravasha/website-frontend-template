import { useEffect, useState, useMemo } from "react";

function useDarkMode() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      const updateDarkMode = (e) => setIsDark(e.matches);

      setIsDark(mediaQuery.matches);
      mediaQuery.addEventListener("change", updateDarkMode);

      return () => mediaQuery.removeEventListener("change", updateDarkMode);
    }
  }, []);

  return isDark;
}

export default function useElementStyle(styles, styleName, isLoading) {
  const isDark = useDarkMode();

  return useMemo(() => {
    if (isLoading || !Array.isArray(styles)) return {};

    const normalizedName = styleName.trim().toLowerCase();

    // Try to identify the style type
    const typeKeywords = {
      background: "background",
      text: "text",
      font: "font",
    };

    const detectedType = Object.keys(typeKeywords).find((type) =>
      normalizedName.includes(type),
    );

    const style = styles.find(
      (s) => s.name.trim().toLowerCase() === normalizedName,
    );

    if (!style) {
      console.warn(`Style '${styleName}' not found`);
      return detectedType === "text"
        ? { color: "#ff00ff" }
        : detectedType === "background"
          ? { background: "#ff00ff" }
          : {};
    }

    switch (detectedType) {
      case "text":
        return {
          color: isDark ? style.darkStartColor : style.startColor,
        };
      case "background":
        return {
          background: `linear-gradient(to right, ${
            isDark
              ? `${style.darkStartColor}, ${style.darkEndColor}`
              : `${style.startColor}, ${style.endColor}`
          })`,
        };
      case "font":
        return {
          fontFamily: style.fontFamily || "inherit",
          fontWeight: style.fontWeight || "normal",
          fontSize: style.fontSize || "1rem",
        };
      default:
        console.warn(`Unknown style type for '${styleName}'`);
        return {};
    }
  }, [styles, styleName, isLoading, isDark]);
}

// Usage:

const navbarStyle = useElementStyle(
  styles,
  "Navbar Background Color",
  isLoading,
);
const fontStyle = useElementStyle(styles, "Navbar Font Style", isLoading);

// Combined use
<Link
  to={page.title}
  onClick={handleLinkClick}
  smooth={true}
  duration={500}
  offset={navbarOffset}
  spy={true}
  style={{ ...navbarStyle, ...fontStyle }}
>
  {page.title}
</Link>;
