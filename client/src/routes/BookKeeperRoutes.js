import { lazy } from "react";

// project import
import Loadable from "../components/Loadable";

// render - login
const RegisterBookKeeper = Loadable(lazy(() => import("../pages/register-book-keeper")));

// ==============================|| AUTH ROUTING ||============================== //

const BookKeeperRoutes = {
    path: "register-book-keeper",
    element: <RegisterBookKeeper />
}

export default BookKeeperRoutes;

