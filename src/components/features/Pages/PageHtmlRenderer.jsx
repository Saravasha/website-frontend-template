import { useEffect, useState } from "react";
import { useData } from "../../api/ApiContext";

const PageHtmlRenderer = ({ html, className, style }) => {
  const { directApi } = useData();

  const [content, setContent] = useState("");

  const joinUrl = (base, path) =>
    `${base.replace(/\/+$/, "")}/${path.replace(/^\/+/, "")}`;

  const transformMediaUrls = (htmlContent) => {
    const wrapper = document.createElement("div");
    wrapper.innerHTML = htmlContent;

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

      img.setAttribute("loading", "lazy");

      if (!img.hasAttribute("alt")) {
        img.setAttribute("alt", "");
      }
    });

    wrapper
      .querySelectorAll("audio source")
      .forEach((s) => makeAbsolute(s, "src"));

    wrapper.querySelectorAll("video").forEach((v) => {
      makeAbsolute(v, "poster");
    });

    wrapper
      .querySelectorAll("video source")
      .forEach((s) => makeAbsolute(s, "src"));

    wrapper.querySelectorAll("iframe").forEach((iframe) => {
      makeAbsolute(iframe, "src");
      iframe.classList.add("w-full", "min-h-[600px]");
    });

    wrapper.querySelectorAll("a").forEach((a) => {
      makeAbsolute(a, "href");
    });

    return wrapper.innerHTML;
  };

  useEffect(() => {
    if (!html) {
      setContent("");
      return;
    }
    const render = async () => {
      const wrapper = document.createElement("div");
      wrapper.innerHTML = html;

      const figures = wrapper.querySelectorAll(
        "figure.asset-text[data-asset-id]",
      );

      for (const figure of figures) {
        const assetId = figure.dataset.assetId;

        try {
          const response = await fetch(`${directApi}/Asset/Render/${assetId}`);

          if (!response.ok) continue;

          const rendered = await response.text();

          const container = figure.querySelector(".asset-render");

          if (container) {
            container.innerHTML = rendered;
          } else {
            figure.insertAdjacentHTML("beforeend", rendered);
          }
        } catch (err) {
          console.warn(`Unable to render asset ${assetId}`, err);
        }
      }

      setContent(transformMediaUrls(wrapper.innerHTML));
    };

    render();
  }, [html, directApi]);

  useEffect(() => {
    document.querySelectorAll(".asset-render img").forEach((img) => {
      img.onerror = () => img.remove();
    });
  }, [content]);

  if (!content) return null;

  return (
    <div
      className={className}
      style={style}
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
};

export default PageHtmlRenderer;
