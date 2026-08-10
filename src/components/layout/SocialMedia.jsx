import React from "react";
import { useData } from "../api/ApiContext";
import { InstagramIcon, FacebookIcon, TwitterIcon } from "./socialMediaIcons";
import useColors from "../features/Colors/useColors";
import useFonts from "../features/Fonts/useFonts";

export const SocialMedia = () => {
  const { colors, fonts, settings, isLoading } = useData();
  const colorInStyle = useColors("Social Media Header Text") || {};
  const fontInStyle = useFonts("Social Media Header Text") || {};
  const socialLinks = [
    {
      key: "instagram",
      visible: settings.socialMedia.instagramVisible,
      url: settings.socialMedia.instagramUrl,
      icon: InstagramIcon,
      color: useColors("Instagram Background Icon Color"),
      fill: useColors("Instagram Fill Icon Color"),
    },
    {
      key: "facebook",
      visible: settings.socialMedia.facebookVisible,
      url: settings.socialMedia.facebookUrl,
      icon: FacebookIcon,
      color: useColors("Facebook Background Icon Color"),
      fill: useColors("Facebook Fill Icon Color"),
    },
    {
      key: "twitter",
      visible: settings.socialMedia.twitterVisible,
      url: settings.socialMedia.twitterUrl,
      icon: TwitterIcon,
      color: useColors("Twitter Background Icon Color"),
      fill: useColors("Twitter Fill Icon Color"),
    },
  ];

  return (
    <div
      id="SocialMedia"
      className="SocialMedia gap-4 flex flex-col text-center justify-center py-10 m-4 select-none rounded shadow-2xl"
    >
      {/* header */}
      <h1
        className="SocialMediaText block font-thin !text-5xl sm:!text-[5vw] hover:animate-pulse py-5 drop-shadow-[0_1.2px_1.2px_rgba(0,3,3,0.8)]"
        style={{ ...colorInStyle, ...fontInStyle }}
      >
        {settings.socialMedia.headerText}
      </h1>
      <div className="flex gap-[2vw] justify-center">
        {socialLinks
          .filter((x) => x.visible && x.url)
          .map(({ key, url, icon: Icon, color, fill }) => (
            <a
              key={key}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="social-icon"
            >
              <Icon
                style={{
                  ...color,
                  ...fill,
                }}
              />
            </a>
          ))}
      </div>
    </div>
  );
};
