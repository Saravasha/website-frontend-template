import React, { useState, useEffect } from "react";
import bgimg from "../assets/comingsoonimg3.jpg";
import { motion, AnimatePresence } from "framer-motion";

const LoadingScreen = () => {
  return (
    <motion.div
      className="w-screen h-screen flex bg-gradient-to-r from-green-900 to-green-500 flex-col gap-8 p-4 items-center justify-center shadow-2xl relative overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, y: -100 }}
      transition={{ duration: 1 }}
    >
      <span className="mt-8 text-[6vw] z-1 sm:text-7xl md:text-9xl font-thin text-white  text-center">
        __PROJECT_NAME__
      </span>
      <img
        className=" p-4 h-full  z-0 blur-xs top-0  flex justify-center  absolute "
        src={bgimg}
        alt="alt"
      />
      <span className="mt-8 text-[4vw] font-thin text-white animate-pulse text-center">
        Loading
      </span>
      <div className="flex items-center space-x-4 animate-bounce">
        <div className="w-6 h-6 bg-white rounded-full" />
        <div className="w-6 h-6 bg-white rounded-full delay-150 animate-delay" />
        <div className="w-6 h-6 bg-white rounded-full delay-300 animate-delay" />
      </div>
    </motion.div>
  );
};
export default LoadingScreen;
