import { CompanyContext } from "../context/CompanyContext";
import { useContext } from "react";

export const useCompanyContext = () => {
  const context = useContext(CompanyContext);

  if (!context) {
    throw Error(
      "useCompanyContext must be used inside an companyContextProvider"
    );
  }

  return context;
};
