import localforage from "localforage";
import { useEffect } from "react";

export default function useLocalForage() {
  useEffect(() => {
    const handleBeforeUnload = () => {
      localforage.clear().then(() => {
        console.log("LocalForage cleared before app exit");
      });
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);
}
