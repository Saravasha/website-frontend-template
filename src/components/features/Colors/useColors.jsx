import { useEffect, useState, useMemo } from "react";

import { useData } from "../../api/ApiContext";

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

export default function useColors(colorName) {
  const { colors, isLoading } = useData();
  const isDark = useDarkMode();

  return useMemo(() => {
    if (isLoading || !Array.isArray(colors)) return {};

    const normalizedColorName = colorName.trim().toLowerCase();
    const colorTypes = ["Background", "Text", "Fill"];
    const colorType = colorTypes.find((type) =>
      normalizedColorName.includes(type.toLowerCase()),
    );

    const color = colors.find(
      (c) => c.name.trim().toLowerCase() === normalizedColorName,
    );

    if (!color) {
      console.warn(`Color '${colorName}' not found`);
      return colorType === "Text"
        ? { color: "#ff00ff" }
        : colorType === "Fill"
          ? { fill: "#ff00ff" }
          : { background: "#ff00ff" };
    }

    if (colorType === "Text") {
      return {
        color: isDark ? color.darkStartColor : color.startColor,
        opacity: isDark ? color.darkOpacity : color.opacity,
      };
    }

    if (colorType === "Fill") {
      return {
        fill: isDark ? color.darkStartColor : color.startColor,
        opacity: isDark ? color.darkOpacity : color.opacity,
      };
    }

    if (colorType === "Background") {
      return {
        background: `linear-gradient(to right, ${
          isDark
            ? `${color.darkStartColor}, ${color.darkEndColor}`
            : `${color.startColor}, ${color.endColor}`
        })`,
        opacity: isDark ? color.darkOpacity : color.opacity,
      };
    }

    console.warn(`Unknown color type for '${colorName}'`);
    return {};
  }, [colors, colorName, isLoading, isDark]);
}
