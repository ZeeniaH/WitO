import { lazy } from "react";

// project import
import Loadable from "components/Loadable";
import MainLayout from "layout/MainLayout";
import RequireAuth from "components/auth/RequireAuth";
import NotFound from "pages/notFound/index";
import Home from "components/Home";

// render - dashboard
const DashboardDefault = Loadable(lazy(() => import("pages/dashboard")));
const CompanyOwners = Loadable(lazy(() => import("pages/company-owners")));
const Workers = Loadable(lazy(() => import("pages/workers")));
const WorkerDetails = Loadable(lazy(() => import("../components/Worker/WorkerDetails")));
const WorkerForm = Loadable(lazy(() => import("../components/Worker/WorkerForm")));
const WorkerEditForm = Loadable(lazy(() => import("../components/Worker/WorkerEditForm")));
const Vehicles = Loadable(lazy(() => import("pages/vehicles")));
const VehicleDetails = Loadable(lazy(() => import("../components/Vehicle/VehicleDetails")));
const VehicleForm = Loadable(lazy(() => import("../components/Vehicle/VehicleForm")));
const VehicleEditForm = Loadable(lazy(() => import("../components/Vehicle/VehicleEditForm")));
const AddCompany = Loadable(lazy(() => import("../components/companies/AddCompany")));
const CompanyEditForm = Loadable(lazy(() => import("../components/companies/CompanyEditForm")));
const CompanyDetails = Loadable(lazy(() => import("../components/companies/CompanyDetails")));
const Invoice = Loadable(lazy(() => import("../components/Invoice")));
const Scheduler = Loadable(lazy(() => import("../components/Scheduler")));
const Archive = Loadable(lazy(() => import("../components/Archive/Dashboard/Home")));
const FolderAdminComponent = Loadable(lazy(() => import("../components/Archive/Dashboard/FolderAdminComponent")));
const FolderComponent = Loadable(lazy(() => import("../components/Archive/Dashboard/FolderComponent")));
const FileComponent = Loadable(lazy(() => import("../components/Archive/Dashboard/FileComponent")));
const PricingPlans = Loadable(lazy(() => import("../components/PricingPlans")));
const Settings = Loadable(lazy(() => import("pages/settings")));
const FileManager = Loadable(lazy(() => import("../components/FileManager")));
const Users = Loadable(lazy(() => import("pages/users")));
const BookKeepers = Loadable(lazy(() => import("pages/book-keepers")));
const BookKeeperEditForm = Loadable(lazy(() => import("../components/Users/BookKeeper/BookKeeperEditForm")));
const AuthRegister = Loadable(lazy(() => import("pages/authentication/auth-forms/AuthRegister")));
const UserEditForm = Loadable(lazy(() => import("../components/Users/UserEditForm")));
const Appointments = Loadable(lazy(() => import("pages/appointments")));
const AppointmentDetails = Loadable(lazy(() => import("../components/Appointment/AppointmentDetails")));
const AppointmentForm = Loadable(lazy(() => import("../components/Appointment/AppointmentForm")));
const AppointmentEditForm = Loadable(lazy(() => import("../components/Appointment/AppointmentEditForm")));
const Profile = Loadable(lazy(() => import("../components/Profile")));

const AdminRoutes = {
	path: "dashboard",
	element: (
		<RequireAuth>
			<MainLayout />
		</RequireAuth>
	),

	children: [
		{
			path: "default",
			element: <DashboardDefault />,
		},
		{
			path: "company-owners",
			element: <CompanyOwners />,
		},
		{
			path: "book-keepers",
			element: <BookKeepers />,
		},
		{
			path: "workers",
		},
		{
			path: "workers/:id",
			element: <Workers />,
		},
		{
			path: "worker/:id",
			element: <WorkerDetails />,
		},
		{
			path: "add-worker/:id",
			element: <WorkerForm />,
		},
		{
			path: "edit-worker/:id",
			element: <WorkerEditForm />,
		},
		{
			path: "settings",
			element: <Settings />,
		},
		{
			path: "vehicles/:id",
			element: <Vehicles />,
		},
		{
			path: "vehicle/:id",
			element: <VehicleDetails />,
		},
		{
			path: "add-vehicle/:id",
			element: <VehicleForm />,
		},
		{
			path: "edit-vehicle/:id",
			element: <VehicleEditForm />,
		},
		{
			path: "add-company",
			element: <AddCompany />,
		},
		{
			path: "edit-company/:id",
			element: <CompanyEditForm />,
		},
		{
			path: "company/:id",
			element: <CompanyDetails />
		},
		{
			path: "calendar",
			element: <Scheduler />,
		},
		{
			path: "pricing-plans",
			element: <PricingPlans />,
		},
		{
			path: "archive/:id",
			element: <Archive />,
		},
		{
			path: "archive/folder/admin/:folderId",
			element: <FolderAdminComponent />,
		},
		{
			path: "archive/:companyId/folder/:folderId",
			element: <FolderComponent />,
		},
		{
			path: "archive/file/:fileId",
			element: <FileComponent />,
		},
		{
			path: "archive/file-manager",
			element: <FileManager />,
		},
		{
			path: "invoice",
			element: <Invoice />,
		},
		{
			path: "not-found",
			element: <NotFound />,
		},
		{
			path: "bookkeepers",
			element: <BookKeepers />,
		},
		,
		{
			path: "edit-bookkeeper/:id",
			element: <BookKeeperEditForm />,
		},
		{
			path: "users",
			element: <Users />,
		},
		{
			path: "users/add-user",
			element: <AuthRegister />,
		},
		{
			path: "edit-user/:id",
			element: <UserEditForm />,
		},
		{
			path: "appointments/:id",
			element: <Appointments />,
		},
		{
			path: "appointment/:id",
			element: <AppointmentDetails />,
		},
		{
			path: "add-appointment/:id",
			element: <AppointmentForm />,
		},
		{
			path: "edit-appointment/:id",
			element: <AppointmentEditForm />,
		},
		{
			path: "user-profile",
			element: <Profile />,
		},
	],
};

export default AdminRoutes;
