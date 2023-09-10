import { lazy } from "react";

// project import
import Loadable from "../components/Loadable";

// render - login
const AuthLogin = Loadable(lazy(() => import("../pages/authentication/Login")));
const RegisterBookKeeper = Loadable(lazy(() => import("../pages/register-book-keeper")));
const CompanyOwnerRegister = Loadable(lazy(() => import("../pages/register-company-owner")));
const HireBookKeeper = Loadable(lazy(() => import("../pages/login-hire-bookKeeper")));
const ForgotPassword = Loadable(lazy(() => import("../pages/authentication/auth-forms/AuthForgotPassword")));
const ResetPassword = Loadable(lazy(() => import("../pages/authentication/auth-forms/AuthResetPassword")));

// ==============================|| AUTH ROUTING ||============================== //

// const LoginRoutes = {
// 	path: "/",
// 	element: <AuthLogin />
// }

const LoginRoutes = {
	path: "/",
	children: [
		{
			path: "",
			element: <AuthLogin />,
		},
		{
			path: "register-book-keeper",
			element: <RegisterBookKeeper />,
		},
		{
			path: "hire-book-Keeper",
			element: <HireBookKeeper />
		},
		{
			path: "forgot-password",
			element: <ForgotPassword />
		},
		{
			path: "reset-password",
			element: <ResetPassword />
		},
		{
			path: "register-companyowner",
			element: <CompanyOwnerRegister />,
		},
	],
};

export default LoginRoutes;
