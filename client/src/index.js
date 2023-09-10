import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter } from "react-router-dom";
import { AuthContextProvider } from "./context/AuthContext";
import { CompanyContextProvider } from "./context/CompanyContext";

import "bootstrap/dist/css/bootstrap.min.css";
import "react-toastify/dist/ReactToastify.css";
import "./index.css";

//redux
import { applyMiddleware, combineReducers, createStore } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import thunk from "redux-thunk";
import { Provider } from "react-redux";

// reducers
import authReducer from "./redux/reducers/authReducer";
import filefolderReducer from "./redux/reducers/filefolderReducer";
import loadingReducer from "./redux/reducers/loadingReducer";
import menu from "./redux/reducers/menuReducer";
import clients from "./redux/reducers/clients";
import invoices from "./redux/reducers/invoices";

// confirm popup provider
import { ConfirmProvider } from "material-ui-confirm";

const reducers = combineReducers({
    auth: authReducer,
    filefolders: filefolderReducer,
    menu: menu,
    loadingReducer: loadingReducer,
    clients: clients,
    invoices: invoices,
});

const store = createStore(reducers, composeWithDevTools(applyMiddleware(thunk)));

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    <Provider store={store}>
        <AuthContextProvider>
            <CompanyContextProvider>
                <ConfirmProvider>
                    <BrowserRouter basename="/">
                        <App />
                    </BrowserRouter>
                </ConfirmProvider>
            </CompanyContextProvider>
        </AuthContextProvider>
    </Provider>
);

reportWebVitals();
