import { useData } from "../../api/ApiContext";
import { useEffect, useState, useRef } from "react";

const AssetRenderer = ({ asset, className = "" }) => {
  const { directApi } = useData();

  const [resolvedAsset, setResolvedAsset] = useState(asset);
  const [renderedText, setRenderedText] = useState("");
  const renderRef = useRef(null);

  const joinUrl = (base, path) =>
    `${base.replace(/\/+$/, "")}/${path.replace(/^\/+/, "")}`;

  const makeMediaUrlsAbsolute = (html) => {
    const wrapper = document.createElement("div");
    wrapper.innerHTML = html;

    const makeAbsolute = (element, attribute) => {
      const value = element.getAttribute(attribute);

      if (
        value &&
        !value.startsWith("http://") &&
        !value.startsWith("https://") &&
        !value.startsWith("//")
      ) {
        element.setAttribute(attribute, joinUrl(directApi, value));
      }
    };

    wrapper.querySelectorAll("img").forEach((img) => {
      makeAbsolute(img, "src");
    });

    wrapper.querySelectorAll("audio").forEach((audio) => {
      makeAbsolute(audio, "src");
    });

    wrapper.querySelectorAll("audio source").forEach((source) => {
      makeAbsolute(source, "src");
    });

    wrapper.querySelectorAll("video").forEach((video) => {
      makeAbsolute(video, "src");
      makeAbsolute(video, "poster");
    });

    wrapper.querySelectorAll("video source").forEach((source) => {
      makeAbsolute(source, "src");
    });

    return wrapper.innerHTML;
  };

  // Fetch full asset if only an ID was provided
  useEffect(() => {
    if (!asset) {
      setResolvedAsset(null);
      return;
    }

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

  const type = resolvedAsset?.type?.toLowerCase();

  // Render text assets
  useEffect(() => {
    if (type !== "text" || !resolvedAsset?.id) {
      setRenderedText("");
      return;
    }

    const renderUrl = `${directApi}/Asset/Render/${resolvedAsset.id}`;

    fetch(renderUrl)
      .then((r) => {
        if (!r.ok) throw new Error();
        return r.text();
      })
      .then((html) => {
        const transformedHtml = makeMediaUrlsAbsolute(html);

        setRenderedText(transformedHtml);
      })
      .catch((err) => {
        console.error("Unable to render asset:", err);
        setRenderedText("<p>Unable to render document.</p>");
      });
  }, [type, resolvedAsset?.id, directApi]);

  // Remove broken images from rendered text
  useEffect(() => {
    if (!renderRef.current) return;

    const images = renderRef.current.querySelectorAll("img");

    images.forEach((img) => {
      img.onerror = () => img.remove();
    });
  }, [renderedText]);

  if (!resolvedAsset) return null;

  if (!directApi || !resolvedAsset) {
    return null;
  }
  const fileUrl = resolvedAsset.fileUrl || null;
  const streamUrl = `${directApi}/Asset/Stream/${resolvedAsset.id}`;

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
          className={`${className} w-full h-[800px]`}
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
