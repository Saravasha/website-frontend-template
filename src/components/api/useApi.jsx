import { useEffect, useState } from "react";
import axios from "axios";
import useEnv from "../hooks/useEnv";

const useApi = () => {
  const { environment } = useEnv();

  const [assets, setAssets] = useState([]);
  const [pages, setPages] = useState([]);
  const [colors, setColors] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const apiBase = import.meta.env.VITE_DOTNET_API_BASE;
  const assetUrl = `${apiBase}${import.meta.env.VITE_DOTNET_ASSET_API_URL_TARGET}`;
  const pageUrl = `${apiBase}${import.meta.env.VITE_DOTNET_PAGE_API_URL_TARGET}`;
  const colorUrl = `${apiBase}${import.meta.env.VITE_DOTNET_COLOR_API_URL_TARGET}`;

  const directApi = apiBase;

  const isDev = environment !== "production";

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
      const [fetchedAssets, fetchedPages, fetchedColors] = await Promise.all([
        safeFetch(assetUrl, "Assets"),
        safeFetch(pageUrl, "Pages"),
        safeFetch(colorUrl, "Colors"),
      ]);

      setAssets(fetchedAssets);
      setPages(fetchedPages);
      setColors(fetchedColors);
      setLoading(false);
    };

    fetchAll();
  }, [assetUrl, pageUrl, colorUrl]);

  return { assets, pages, colors, directApi, isLoading, hasError };
};

export default useApi;
