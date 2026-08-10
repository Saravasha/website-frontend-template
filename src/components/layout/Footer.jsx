import { useData } from "../api/ApiContext.jsx";
import useColors from "../features/Colors/useColors.jsx";
import useFonts from "../features/Fonts/useFonts.jsx";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const headerTextColor = useColors("Footer Text") || {};
  const headerTextFont = useFonts("Website Title Footer Text Font") || {};
  const { settings, isLoading } = useData();
  const appName = settings.branding.appName;

  return (
    <footer className="w-full max-w-screen overflow-x-hidden flex flex-wrap items-center justify-center rounded shadow-2xl">
      <span
        className="text-center text-xl sm:text-2xl md:text-3xl select-none font-thin hover:text-green-700 hover:animate-pulse dark:text-white text-black m-4"
        style={{ ...headerTextColor, ...headerTextFont }}
      >
        &copy; {!isLoading ? appName : "__PROJECT_NAME__"} {currentYear}
      </span>
    </footer>
  );
}
