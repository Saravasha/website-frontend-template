import DOMPurify from "dompurify";
import { useData } from "../../api/ApiContext";
import useColors from "../Colors/useColors";

export const Page = ({ page }) => {
  const { directApi } = useData();
  const colorInStyle = useColors("Page Header Text Color") || {};
  const colorInStyleContent = useColors("Content Header Text Color") || {};
  const colorInStylePageBody = useColors("Page Body Text Color") || {};
  const colorInStyleContentBody = useColors("Content Body Text Color") || {};

  const joinUrl = (...parts) =>
    parts
      .filter(Boolean)
      .map((part) => String(part).replace(/^\/+|\/+$/g, ""))
      .join("/");

  const isEmptyHtml = (html) => {
    if (!html) return true;

    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = html;

    // Check for meaningful text
    const text = tempDiv.textContent || tempDiv.innerText || "";
    const cleanedText = text.replace(/\s|&nbsp;/g, "");
    if (cleanedText.length > 0) return false;

    // Check for meaningful non-text content
    const hasMedia = tempDiv.querySelector(
      "img, video, audio, iframe, object, embed",
    );

    return !hasMedia;
  };

  const prependApiUrlToMedia = (htmlContent) => {
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = htmlContent;

    // Images
    tempDiv.querySelectorAll("img").forEach((img) => {
      const src = img.getAttribute("src");
      if (
        src &&
        !src.startsWith("http://") &&
        !src.startsWith("https://") &&
        !src.startsWith("//")
      ) {
        img.setAttribute("src", joinUrl(src));
      }
      if (!img.hasAttribute("alt")) img.setAttribute("alt", "");
      if (!img.hasAttribute("loading")) img.setAttribute("loading", "lazy");
    });

    // Audio
    tempDiv.querySelectorAll("audio").forEach((audio) => {
      const source = audio.querySelector("source");
      if (source) {
        const src = source.getAttribute("src");
        if (
          src &&
          !src.startsWith("http://") &&
          !src.startsWith("https://") &&
          !src.startsWith("//")
        ) {
          source.setAttribute("src", joinUrl(src));
        }
      }
    });

    // Video
    tempDiv.querySelectorAll("video").forEach((video) => {
      // Update poster image if needed
      const poster = video.getAttribute("poster");
      if (
        poster &&
        !poster.startsWith("http://") &&
        !poster.startsWith("https://") &&
        !poster.startsWith("//")
      ) {
        video.setAttribute("poster", joinUrl(poster));
      }

      // Update nested source tag
      const source = video.querySelector("source");
      if (source) {
        const src = source.getAttribute("src");
        if (
          src &&
          !src.startsWith("http://") &&
          !src.startsWith("https://") &&
          !src.startsWith("//")
        ) {
          source.setAttribute("src", joinUrl(src));
        }
      }
    });

    return tempDiv.innerHTML;
  };

  return (
    <div
      className="Page bg-white/30 backdrop-blur-sm flex flex-col gap-4 rounded  shadow-2xl font-thin w-full [&_*]:w-full hover:shadow-2xl flex-grow h-full "
      key={`page-${page.id}`}
      id={`page-${page.id}`}
    >
      {/* page title */}
      <h2
        className="PageTitle italic text-ellipsis text-shadow-2xs w-full flex text-center justify-center items-center align-middle bg-transparent/10 drop-shadow-[0_1.2px_1.2px_rgba(0,3,3,0.8)] font-thin flex-grow h-full"
        style={colorInStyle}
      >
        {page.title}
      </h2>
      {/* page container */}
      {page.container && !isEmptyHtml(page.container) && (
        <div
          className="PageContainer max-w-full gap-4 italic text-center text-shadow-2xs justify-center items-center drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)] [&_PageContainer_p_img]:w-100 flex flex-grow h-full w-full [&_*]:m-2 p-4"
          dangerouslySetInnerHTML={{
            __html: DOMPurify.sanitize(prependApiUrlToMedia(page.container)),
          }}
          style={colorInStylePageBody}
        ></div>
      )}
      {
        page.contents &&
          page.contents.length > 0 &&
          // <div className="Contents flex flex-col bg-transparent gap-4 justify-center items-center flex-grow w-full p-4">
          // {
          page.contents.map((content) => (
            <div
              className="Contents flex flex-col bg-transparent gap-4 justify-center items-center flex-grow w-full p-4"
              key={`content-${page.id}-${content.id}`}
              id={`content-${page.id}-${content.id}`}
            >
              <h3
                className="ContentTitle italic text-shadow-2xs text-center  bg-transparent/10  justify-center items-center flex flex-grow w-full drop-shadow-[0_1.2px_1.2px_rgba(0,3,3,0.8)] p-4"
                style={colorInStyleContent}
              >
                {content.title}
              </h3>
              {/* content date */}
              {content.dateString && (
                <h4
                  className="ContentContainerDateString italic text-shadow-2xs text-center pt-4 justify-center items-center flex  flex-grow w-full drop-shadow-[0_1.2px_1.2px_rgba(0,3,3,0.8)]"
                  style={colorInStyleContent}
                >
                  {content.dateString}
                </h4>
              )}
              {/* content container */}
              {content.container && (
                <div
                  className="ContentContainer italic text-center text-shadow-2xs flex flex-col drop-shadow-[0_1.2px_1.2px_rgba(0,3,3,1)] gap-4 bg-inherit justify-items-center justify-center items-center p-4 flex-grow w-full "
                  dangerouslySetInnerHTML={{
                    __html: DOMPurify.sanitize(
                      prependApiUrlToMedia(content.container),
                    ),
                  }}
                  style={colorInStyleContentBody}
                ></div>
              )}
            </div>
          ))
        // }
        // </div>
      }
    </div>
  );
};
