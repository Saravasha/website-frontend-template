import { useData } from "../api/ApiContext.jsx";
import { useEffect, useState } from "react";
import { applyFavicon as applyFavicon } from "./applyFavicon.jsx";
import { updateProjectName } from "./updateProjectName.jsx";

export default function SiteMetadata() {
  const { isLoading, settings, directApi } = useData();

  // Favicon
  useEffect(() => {
    if (isLoading || !settings?.branding?.faviconAsset?.fileUrl || !directApi) {
      return;
    }
    const url = `${settings.branding.faviconAsset.fileUrl}`;

    applyFavicon(url);
  }, [isLoading, settings, directApi]);

  // AppName
  useEffect(() => {
    if (isLoading || !settings || !directApi) return;

    if (settings?.branding?.faviconAsset?.appName) {
      updateFavicon(`${settings?.branding?.appName}`);
    }

    updateProjectName(settings?.branding?.appName);
  }, [isLoading, settings, directApi]);

  return null;
}
