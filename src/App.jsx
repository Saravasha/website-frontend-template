import React, { useEffect, useState } from "react";
import Footer from "./components/layout/Footer.jsx";
import Header from "./components/layout/Header.jsx";
import ComingSoon from "./components/ComingSoon.jsx";
import Navbar from "./components/layout/Navbar.jsx";
import Main from "./components/layout/Main.jsx";
import { AnimatePresence } from "framer-motion";

import ArtGallery from "./components/features/Gallery/ArtGallery.jsx";
import { SocialMedia } from "./components/layout/SocialMedia.jsx";

import { useData } from "./components/api/ApiContext.jsx";
import LoadingScreen from "./components/LoadingScreen.jsx";
import useColors from "./components/features/Colors/useColors.jsx";
import LifecycleHeader from "./components/lifecycle/LifecycleHeader.jsx";
import ErrorScreen from "./components/ErrorScreen.jsx";
import SiteMetadata from "./components/utilities/SiteMetadata.jsx";

function App() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { environment, isLoading, hasError } = useData();
  const bgColor = useColors("Background Color") || {};

  return (
    <>
      {isLoading ? (
        <AnimatePresence>
          <LoadingScreen key="loading" />
        </AnimatePresence>
      ) : hasError ? (
        <ErrorScreen />
      ) : (
        <div key="main" style={bgColor}>
          <SiteMetadata />
          <LifecycleHeader environment={environment} />
          <Navbar isModalVisible={isModalVisible} />
          <Header />
          <ComingSoon />
          <Main />
          <SocialMedia />
          <ArtGallery
            isModalVisible={isModalVisible}
            setIsModalVisible={setIsModalVisible}
          />
          <Footer />
        </div>
      )}
    </>
  );
}

export default App;
