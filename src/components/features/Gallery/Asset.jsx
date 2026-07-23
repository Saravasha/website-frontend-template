import React from "react";
import { useData } from "../../api/ApiContext";

const Asset = ({ asset }) => {
  const { directApi } = useData();

  const joinUrl = (...parts) =>
    parts
      .filter(Boolean)
      .map((part) => String(part).replace(/^\/+|\/+$/g, ""))
      .join("/");

  const isImage = asset.type === "Image";
  const isVideo = asset.type === "Video";
  const isAudio = asset.type === "Audio";
  const isDocument = asset.type === "Document";
  const isText = asset.type === "Text";

  const fileUrl = asset.fileUrl
    ? `${directApi}/${joinUrl(asset.fileUrl)}`
    : null;
  const streamUrl = `${directApi}/${joinUrl("Asset", "Stream", asset.id)}`;
  const thumbnailUrl = asset.thumbnailUrl
    ? `${directApi}/${joinUrl(asset.thumbnailUrl)}`
    : null;

  if (!fileUrl) return <div className="text-red-500">Missing Asset File</div>;

  return (
    <div className="relative w-full flex items-center justify-center cursor-pointer">
      {/* Image Asset */}
      {isImage && (
        <img
          alt={asset.name}
          src={fileUrl}
          loading="lazy"
          className="max-w-full h-auto rounded shadow justify-center align-middle"
        />
      )}

      {/* Audio Support */}
      {isAudio && (
        <div className="flex flex-col items-center justify-center bg-blue-200 rounded p-4">
          <span className="text-gray-500 text-xl">{asset.name}</span>
          <audio controls src={streamUrl} className="w-full">
            Your browser does not support the audio element.
          </audio>
        </div>
      )}

      {/* Document Support */}
      {isDocument && (
        <div className="flex flex-col items-center justify-center p-4">
          <div className="bg-gray-400 border-2 border-dotted rounded-xl w-full h-full flex items-center justify-center p-4">
            <span className="text-gray-500">{asset.name}</span>
          </div>
        </div>
      )}

      {/* Text Support */}
      {isText && (
        <div className="flex flex-col items-center justify-center p-4">
          <div className="bg-gray-200 border-2 border-dashed rounded-xl w-full h-full flex items-center justify-center p-4">
            <span className="text-gray-500">{asset.name}</span>
          </div>
        </div>
      )}

      {/* Video Asset with Thumbnail */}
      {isVideo && thumbnailUrl && (
        <div className="relative">
          <img
            alt={`Thumbnail for ${asset.name}`}
            src={thumbnailUrl}
            loading="lazy"
            className="max-w-full h-auto rounded shadow"
          />
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="bg-black bg-opacity-50 rounded-full p-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-8 h-8 text-white"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          </div>
        </div>
      )}

      {/* Video Fallback if no thumbnail */}
      {isVideo && !thumbnailUrl && (
        <video
          controls
          src={streamUrl}
          className="max-w-full h-auto rounded shadow"
          preload="none"
        >
          Your browser does not support the video tag.
        </video>
      )}

      {/* Unknown Type */}
      {!isImage && !isVideo && !isAudio && !isDocument && !isText && (
        <div className="text-gray-500 text-sm">
          Unsupported asset type: {asset.type}
        </div>
      )}
    </div>
  );
};

export default Asset;
