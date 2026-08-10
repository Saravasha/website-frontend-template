import React, { useEffect, useState } from "react";
import AssetSearch from "./AssetSearch";
import Gallery from "./Gallery";
import { useData } from "../../api/ApiContext";

const ArtGallery = ({ isModalVisible, setIsModalVisible }) => {
  const { assets, directApi, isLoading } = useData();
  const [searchTerm, setSearchTerm] = useState("");
  const [foundAssets, setFoundAssets] = useState([]);

  const searchAsset = (value) => {
    setSearchTerm(value);
  };

  const resetSearch = () => {
    setSearchTerm("");
  };

  useEffect(() => {
    if (!searchTerm.trim()) {
      // Show all assets if searchTerm is empty
      setFoundAssets(assets);
      return;
    }

    const lowerSearch = searchTerm.toLowerCase();

    setFoundAssets(
      assets.filter((asset) => {
        const nameMatch = asset.name?.toLowerCase().includes(lowerSearch);
        const descriptionMatch = asset.description
          ? asset.description.toLowerCase().includes(lowerSearch)
          : false;
        const authorMatch = asset.author
          ? asset.author.toLowerCase().includes(lowerSearch)
          : false;
        const locationMatch = asset.location
          ? asset.location.toLowerCase().includes(lowerSearch)
          : false;
        const categoriesMatch = asset.categories
          ? asset.categories.some((cat) =>
              cat.name.toLowerCase().includes(lowerSearch),
            )
          : false;

        return (
          nameMatch ||
          descriptionMatch ||
          authorMatch ||
          locationMatch ||
          categoriesMatch
        );
      }),
    );
  }, [searchTerm, assets]);

  return (
    <div
      id="ArtGallery"
      className="ArtGallery flex flex-col justify-center font-thin m-4 rounded-2xl shadow-2xl relative"
    >
      {isLoading ? (
        <h1 className="font-thin justify-center flex mx-auto p-4 dark:text-white text-white">
          Loading...
        </h1>
      ) : (
        <>
          <h1 className="!text-5xl sm:!text-[5vw] font-thin m-4 mx-auto flex justify-center border-transparent select-none border-b p-4 dark:text-white text-white">
            Asset Gallery
          </h1>
          <AssetSearch
            searchAsset={searchAsset}
            resetSearch={resetSearch}
            searchTerm={searchTerm}
          />

          {foundAssets.length > 0 ? (
            <Gallery
              assets={foundAssets}
              directApi={directApi}
              isLoading={isLoading}
              isModalVisible={isModalVisible}
              setIsModalVisible={setIsModalVisible}
            />
          ) : (
            <h1 className="font-thin justify-center text-center flex mx-auto p-4 dark:text-white text-white">
              Could not find what you were looking for
            </h1>
          )}
        </>
      )}
    </div>
  );
};

export default ArtGallery;
