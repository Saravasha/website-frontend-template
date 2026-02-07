export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full max-w-screen overflow-x-hidden flex flex-wrap items-center justify-center rounded shadow-2xl">
      <span className="text-center text-xl sm:text-2xl md:text-3xl font-thin hover:text-green-700 hover:animate-pulse dark:text-white text-black m-4">
        &copy; __PROJECT_NAME__ {currentYear}
      </span>
    </footer>
  );
}
