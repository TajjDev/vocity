import { useEffect } from "react";

function ReloadOnBack() {
  useEffect(() => {
    const handlePopState = () => {
      window.scrollTo(0, 0);
      window.location.reload();
    };
    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  return null;
}

export default ReloadOnBack;
