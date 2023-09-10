import { createContext, useReducer } from "react";

export const CompanyContext = createContext();

export const companyReducer = (state, action) => {
  switch (action.type) {
    case "SET_COMPANIES":
      return {
        company: action.payload,
      };
    case "CREATE_COMPANY":
      return {
        company: [action.payload, ...state.company],
      };
    case "DELETE_COMPANY":
      return {
        company: state.company.filter((c) => c._id !== action.payload._id),
      };
    default:
      return state;
  }
};

export const CompanyContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(companyReducer, {
    company: null,
  });

  return (
    <CompanyContext.Provider value={{ ...state, dispatch }}>
      {children}
    </CompanyContext.Provider>
  );
};
