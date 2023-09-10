import { useContext } from "react";
import { BookkeeperContext } from "../context/BookkeeperContext";

export const useBookkeeperContext = () => {
  const context = useContext(BookkeeperContext);

  if (!context) {
    throw Error(
      "useBookkeeperContext must be used inside an BookkeeperContextProvider"
    );
  }

  return context;
};
