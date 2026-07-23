import { useData } from "../../api/ApiContext";
import { useEffect, useState, useRef } from "react";

const AssetRenderer = ({ asset, className = "" }) => {
  const { directApi } = useData();

  const [resolvedAsset, setResolvedAsset] = useState(asset);
  const [renderedText, setRenderedText] = useState("");
  const renderRef = useRef(null);
  
  const joinUrl = (base, path) =>
    `${base.replace(/\/+$/, "")}/${path.replace(/^\/+/, "")}`;


  useEffect(() => {

  if (!renderRef.current)
    return;


  const images =
    renderRef.current.querySelectorAll("img");


  images.forEach(img => {

    img.onerror = () => {
      img.remove();
    };

  });


}, [renderedText]);
  // Fetch full asset if only id was provided
  useEffect(() => {
    if (!asset) return;

    if (asset.type) {
      setResolvedAsset(asset);
      return;
    }

    fetch(`${directApi}/Asset/${asset.id}`)
      .then((r) => {
        if (!r.ok) throw new Error();
        return r.json();
      })
      .then(setResolvedAsset)
      .catch(() => setResolvedAsset(null));
  }, [asset, directApi]);

  if (!resolvedAsset) return null;

  const fileUrl = resolvedAsset.fileUrl
    ? joinUrl(directApi, resolvedAsset.fileUrl)
    : null;

  const streamUrl = `${directApi}/Asset/Stream/${resolvedAsset.id}`;

  const renderUrl = `${directApi}/Asset/Render/${resolvedAsset.id}`;

  const type = resolvedAsset.type?.toLowerCase();

  // Render markdown/text
  useEffect(() => {
    if (type !== "text") {
      setRenderedText("");
      return;
    }

    fetch(renderUrl)
      .then((r) => {
        if (!r.ok) throw new Error();

        return r.text();
      })
      .then(setRenderedText)
      .catch(() => setRenderedText("<p>Unable to render document.</p>"));
  }, [type, renderUrl]);

  switch (type) {
    case "image":
      return (
        <img
          src={fileUrl}
          alt={resolvedAsset.name}
          className={className}
          onError={(e) => e.currentTarget.remove()}
        />
      );

    case "video":
      return (
        <video controls preload="metadata" className={className}>
          <source src={streamUrl} type="video/mp4" />
        </video>
      );

    case "audio":
      return <audio controls src={streamUrl} className={className} />;

    case "document":
      return (
        <iframe
          src={fileUrl}
          title={resolvedAsset.name}
          className={className, "w-full h-[600px]"}
        />
      );

    case "text":
      return (
        <div
  ref={renderRef}
  className={`asset-render ${className}`}
  dangerouslySetInnerHTML={{
    __html: renderedText,
  }}
/>
      );

    default:
      return null;
  }
};

export default AssetRenderer;
