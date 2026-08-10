import { useData } from "../api/ApiContext.jsx";
import useColors from "../features/Colors/useColors.jsx";
import useFonts from "../features/Fonts/useFonts.jsx";

export default function Header() {
  const headerTextColor = useColors("Header Text") || {};
  const headerTextFont = useFonts("Website Title Header Text Font") || {};
  const { settings, isLoading } = useData();
  const appName = settings.branding.appName;

  return (
    <div className="flex italic  justify-center font-thin ">
      {/* MULTI-COMMITTER:PROTECTED:START HeaderText */}
      <h1
        className="m-4 p-4 text-shadow-2xl w-full text-center !text-6xl sm:!text-[8rem] text-wrap select-none  hover:animate-pulse drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)]"
        style={{ ...headerTextColor, ...headerTextFont }}
      >
        {!isLoading ? appName : "__PROJECT_NAME__"}
      </h1>
      {/* MULTI-COMMITTER:PROTECTED:END HeaderText */}
    </div>
  );
}
