import { useCallback } from "react";
import { scroller } from "react-scroll";
import useEnv from "../../hooks/useEnv";

export default function useRetryScrollTo() {
  const { environment } = useEnv();

  const isInViewport = useCallback((el) => {
    if (!el) return false;
    const rect = el.getBoundingClientRect();
    const buffer = 20;
    return rect.bottom >= 0 - buffer && rect.top <= window.innerHeight + buffer;
  }, []);

  const retryScrollTo = useCallback(
    (target, options = {}, maxRetries = 15, delay = 500) => {
      let attempts = 0;

      function scrollAttempt() {
        const element =
          document.getElementById(target) ||
          document.querySelector(`[name="${target}"]`);

        if (!element) {
          if (attempts < maxRetries) {
            attempts++;
            setTimeout(scrollAttempt, delay);
          } else {
            if (environment !== "production") {
              console.warn(
                `[retryScrollTo] Element "${target}" not found after ${maxRetries} attempts.`,
              );
            }
          }
          return;
        }

        scroller.scrollTo(target, options);

        setTimeout(() => {
          const stillNotVisible = !isInViewport(element);
          if (stillNotVisible && attempts < maxRetries) {
            attempts++;
            scrollAttempt();
          } else if (stillNotVisible) {
            if (environment !== "production") {
              console.warn(
                `[retryScrollTo] "${target}" still not in view after ${attempts} attempts.`,
              );
            }
          } else {
            if (environment !== "production") {
              console.log(
                `[retryScrollTo] Scrolled to "${target}" on attempt ${attempts}.`,
              );
            }
          }
        }, 1000);
      }

      scrollAttempt();
    },
    [environment, isInViewport],
  );

  return retryScrollTo;
}
