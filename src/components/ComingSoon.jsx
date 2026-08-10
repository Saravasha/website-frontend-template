import React, { useState, useEffect } from "react";
import { useData } from "./api/ApiContext.jsx";

export default function ComingSoon() {
  const [homeImg, setHomeImg] = useState();
  const { isLoading, settings, directApi } = useData();

  // HomeImg
  useEffect(() => {
    if (
      isLoading ||
      !settings?.branding?.homescreenAsset?.fileUrl ||
      !directApi
    ) {
      return;
    }
    setHomeImg(`${settings?.branding?.homescreenAsset?.fileUrl}`);
  }, [isLoading, settings, directApi]);

  return (
    <div className="ComingSoonBody relative justify-center flex w-full h-full p-10">
      <img src={homeImg} className="rounded-full w-full h-auto " alt="ph" />
      {/* <p className="absolute inset-0 italic flex justify-center align-middle text-shadow-rose-200 text-red-50  text-8xl pt-5">
        Gosheh Art
      </p> */}
      {/* <p className="absolute inset-0 italic flex justify-center items-center-safe text-shadow-rose-200 text-red-50  text-4xl">
        Coming soon...
      </p> */}
    </div>
  );
}
