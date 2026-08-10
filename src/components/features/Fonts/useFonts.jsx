import { useEffect, useMemo } from "react";
import { useData } from "../../api/ApiContext";
export default function useFont(fontName) {
  const { fonts, isLoading } = useData();
  const getFontFamilyName = (filename) => {
    if (!filename) return "";
    return filename.replace(/\.[^/.]+$/, "");
  };
  const font = useMemo(() => {
    if (isLoading || !Array.isArray(fonts) || !fontName) {
      return null;
    }
    const normalizedFontName = getFontFamilyName(fontName).trim().toLowerCase();
    return (
      fonts.find((f) => {
        const apiFontName = getFontFamilyName(f.name).trim().toLowerCase();
        const assetFontName = getFontFamilyName(f.asset?.name)
          .trim()
          .toLowerCase();
        return (
          apiFontName === normalizedFontName ||
          assetFontName === normalizedFontName
        );
      }) ?? null
    );
  }, [fonts, fontName, isLoading]);
  const fontFamily = useMemo(() => {
    return getFontFamilyName(font?.asset?.name);
  }, [font]);
  useEffect(() => {
    if (!font?.asset?.name || !font?.asset?.fileUrl || !fontFamily) {
      return;
    }
    const styleId = `font-${font.id}`;
    if (document.getElementById(styleId)) {
      return;
    }
    const style = document.createElement("style");
    style.id = styleId;
    style.textContent = ` @font-face { font-family: "${fontFamily}"; src: url("${font.asset.fileUrl}"); font-style: ${font.style || "normal"}; font-weight: ${font.weight || 400}; } `;
    document.head.appendChild(style);
    return () => {
      document.getElementById(styleId)?.remove();
    };
  }, [font, fontFamily]);
  return useMemo(() => {
    if (!font || !fontFamily) {
      if (fontName) {
        console.warn(`Font '${fontName}' not found`);
      }
      return {};
    }
    return {
      fontFamily: `"${fontFamily}"`,
      fontStyle: font.style || "normal",
      fontWeight: font.weight || 400,
    };
  }, [font, fontFamily, fontName]);
}
