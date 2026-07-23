import React, { useEffect, useState } from "react";
import { useData } from "../../api/ApiContext";
import AssetRenderer from "./AssetRenderer";

const Modal = ({
  clickedAsset,
  setClickedAsset,
  onClose,
  handleRotationLeft,
  handleRotationRight,
}) => {
  const handleClick = (e) => {
    if (e.target.classList.contains("dismiss")) {
      setClickedAsset(null);
      onClose?.();
    }
  };

  useEffect(() => {
    const handleEscapeKey = (e) => {
      if (e.code === "Escape") {
        setClickedAsset(null);
        onClose?.();
      }
    };

    document.addEventListener("keydown", handleEscapeKey);
    return () => {
      document.removeEventListener("keydown", handleEscapeKey);
      document.body.style.overflow = "auto";
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = clickedAsset ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [clickedAsset]);

  if (!clickedAsset) return null;

  return (
    <div
      className="ModalContainer overlay dismiss fixed flex left-0 top-0 w-full z-50 bg-black h-full"
      onClick={handleClick}
    >
      <div className="ModalAsset absolute top-0 flex justify-center w-full h-full overflow-auto">
        <div className="flex relative flex-col ">
          <h4 className="m-4 text-[clamp(1rem,calc(2.5vw+1rem),2rem)] text-white text-center px-[20%]">
            {clickedAsset.name}
          </h4>
          <span className="text-white sm:text-lg lg:text-sm pb-2 text-center">
            {clickedAsset.dateString}
          </span>

          {/* Media */}
          <div className="flex justify-center w-full p-4">
            <AssetRenderer asset={clickedAsset} className="max-w-full h-auto" />
          </div>

          {/* Description and Categories */}
          <div className="flex flex-col items-center justify-center w-full">
            {clickedAsset.description && (
              <p className="text-white text-2xl font-thin text-center px-10 m-4">
                {clickedAsset.description}
              </p>
            )}
          </div>

          <div className="flex justify-center pb-4 flex-wrap">
            {clickedAsset.categories?.map((category) => (
              <div
                key={category.id}
                className="bg-gray-200 rounded-full p-2 m-1 text-sm font-semibold hover:bg-green-700 text-black"
              >
                {category.name}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Controls */}
      <svg
        onClick={handleClick}
        className="dismiss fixed w-[8vw] h-[8vw] md:w-[6vw] md:h-[6vw] lg:w-[4vw] lg:h-[4vw]  hover:animate-pulse right-[1vw] top-0 text-white cursor-pointer hover:bg-red-700 m-2 rounded"
        viewBox="0 0 24 24"
        fill="none"
      >
        <path
          className="dismiss"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M6 18L18 6M6 6l12 12"
        />
      </svg>

      <svg
        onClick={handleRotationLeft}
        className="fixed w-[8vw] h-[8vw] lg:w-[4vw] lg:h-[4vw] hover:animate-pulse bottom-1/2 text-white cursor-pointer hover:bg-amber-300 ml-1 rounded"
        viewBox="0 0 24 24"
        fill="none"
      >
        <path
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M15 19l-7-7 7-7"
        />
      </svg>

      <svg
        onClick={handleRotationRight}
        className="fixed w-[8vw] h-[8vw] lg:w-[4vw] lg:h-[4vw] hover:animate-pulse right-[1vw] bottom-1/2 text-white cursor-pointer hover:bg-amber-300 mr-1 rounded"
        viewBox="0 0 24 24"
        fill="none"
      >
        <path
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9 5l7 7-7 7"
        />
      </svg>
    </div>
  );
};

export default Modal;
