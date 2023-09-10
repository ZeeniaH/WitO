import { createContext, useReducer } from "react";

export const BookkeeperContext = createContext();

export const bookkeeperReducer = (state, action) => {
  switch (action.type) {
    case "SET_BOOKKEEPER":
      return { action };
    case "CREATE_BOOKKEEPER":
      return;
    case "DELETE_BOOKKEEPER":
      return;
    default:
      return state;
  }
};

export const useBookkeeperContext = ({ children }) => {
  const [state, dispatch] = useReducer(bookkeeperReducer, {
    bookkeeper: null,
  });

  return (
    <BookkeeperContext.Provider value={{ ...state, dispatch }}>
      {children}
    </BookkeeperContext.Provider>
  );
};
