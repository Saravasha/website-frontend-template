import { useEffect, useState } from "react";
import axios from "axios";
import useEnv from "../hooks/useEnv";

const useApi = () => {
  const { environment } = useEnv();

  const [assets, setAssets] = useState([]);
  const [pages, setPages] = useState([]);
  const [colors, setColors] = useState([]);
  const [fonts, setFonts] = useState([]);
  const [settings, setSettings] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const apiBase = import.meta.env.VITE_DOTNET_API_BASE;
  const assetsUrl = `${apiBase}${import.meta.env.VITE_DOTNET_ASSETS_API_URL_TARGET}`;
  const pagesUrl = `${apiBase}${import.meta.env.VITE_DOTNET_PAGES_API_URL_TARGET}`;
  const colorsUrl = `${apiBase}${import.meta.env.VITE_DOTNET_COLORS_API_URL_TARGET}`;
  const fontsUrl = `${apiBase}${import.meta.env.VITE_DOTNET_FONTS_API_URL_TARGET}`;
  const settingsUrl = `${apiBase}${import.meta.env.VITE_DOTNET_SETTINGS_API_URL_TARGET}`;

  const directApi = apiBase;

  const isDev = environment !== "production";

  const toDirectUrl = (fileUrl) => {
    if (!fileUrl) return fileUrl;

    return encodeURI(
      `${apiBase.replace(/\/$/, "")}/${fileUrl.replace(/^\//, "")}`,
    );
  };

  const normalizeFileUrl = (object) => {
    if (!object || typeof object !== "object") {
      return object;
    }

    if (Array.isArray(object)) {
      return object.map(normalizeFileUrl);
    }

    return Object.fromEntries(
      Object.entries(object).map(([key, value]) => {
        if (key === "fileUrl" && typeof value === "string") {
          return [
            key,
            encodeURI(
              `${apiBase.replace(/\/$/, "")}/${value.replace(/^\//, "")}`,
            ),
          ];
        }

        return [key, normalizeFileUrl(value)];
      }),
    );
  };

  const safeFetch = async (url, name) => {
    if (!url) {
      if (isDev) console.warn(`⚠️ ${name} API URL is not defined`);
      setHasError(true);
      return [];
    }

    try {
      const res = await axios.get(url);
      const data = res.data;

      if (typeof data !== "object" || data === null) {
        if (isDev) console.error(`❌ ${name}: Invalid JSON`, data);
        setHasError(true);
        return [];
      }

      return data;
    } catch (err) {
      if (isDev) {
        console.error(`❌ ${name} fetch failed:`, err?.message || err);
      }
      setHasError(true);
      return [];
    }
  };

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [
          fetchedAssets,
          fetchedPages,
          fetchedColors,
          fetchedFonts,
          fetchedSettings,
        ] = await Promise.all([
          safeFetch(assetsUrl, "Assets"),
          safeFetch(pagesUrl, "Pages"),
          safeFetch(colorsUrl, "Colors"),
          safeFetch(fontsUrl, "Fonts"),
          safeFetch(settingsUrl, "Settings"),
        ]);

        setAssets(normalizeFileUrl(fetchedAssets));
        setPages(normalizeFileUrl(fetchedPages));
        setColors(fetchedColors);
        setFonts(normalizeFileUrl(fetchedFonts));
        setSettings(normalizeFileUrl(fetchedSettings));
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, [assetsUrl, pagesUrl, colorsUrl, fontsUrl, settingsUrl]);

  return {
    assets,
    pages,
    colors,
    fonts,
    settings,
    directApi,
    isLoading,
    hasError,
  };
};

export default useApi;
