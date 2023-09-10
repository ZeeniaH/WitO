import { lazy } from "react";
import Loadable from "components/Loadable";
import RequireAuth from "components/auth/RequireAuth";

const CompanyOwnerPricing = Loadable(lazy(() => import("pages/register-company-owner/CompanyOwnerPricing")));
const Home = Loadable(lazy(() => import("userComponents/Home")));
const Vehicle = Loadable(lazy(() => import("userComponents/Vehicle/VehicleForm")));
const VehicleDetails = Loadable(lazy(() => import("userComponents/Vehicle/VehicleDetails")));
const EditVehicle = Loadable(lazy(() => import("userComponents/Vehicle/VehicleEditForm")));
const Worker = Loadable(lazy(() => import("userComponents/Worker/WorkerForm")));
const Appointment = Loadable(lazy(() => import("userComponents/Appointment/AppointmentForm")));
const AppointmentDetails = Loadable(lazy(() => import("userComponents/Appointment/AppointmentDetails")));
const EditAppointment = Loadable(lazy(() => import("userComponents/Appointment/AppointmentEditForm")));
const Calendar = Loadable(lazy(() => import("../pages/calendar-user")));
const WorkerDetails = Loadable(lazy(() => import("userComponents/Worker/WorkerDetails")));
const VehiclesUser = Loadable(lazy(() => import("pages/vehicles-user")));
const WorkerUser = Loadable(lazy(() => import("pages/worker-user")));
const EditWorker = Loadable(lazy(() => import("userComponents/Worker/WorkerEditForm")));
const AppointmentsUser = Loadable(lazy(() => import("pages/appointments-user")));
const Company = Loadable(lazy(() => import("userComponents/companies/AddCompany")));
const EditCompany = Loadable(lazy(() => import("userComponents/companies/CompanyEditForm")));
const CompanyDetails = Loadable(lazy(() => import("userComponents/companies/CompanyDetails")));
const PricingPlans = Loadable(lazy(() => import("userComponents/PricingPlans")));
const Invoice = Loadable(lazy(() => import("userComponents/Invoice/Invoice.js")));
const InvoiceDetails = Loadable(lazy(() => import("userComponents/InvoiceDetails/InvoiceDetails")));

const Archive = Loadable(lazy(() => import("userComponents/Archive/Dashboard/Home")));
const FolderAdminComponent = Loadable(lazy(() => import("userComponents/Archive/Dashboard/FolderAdminComponent")));
const FolderComponent = Loadable(lazy(() => import("userComponents/Archive/Dashboard/FolderComponent")));
const FileComponent = Loadable(lazy(() => import("userComponents/Archive/Dashboard/FileComponent")));
const Profile = Loadable(lazy(() => import("userComponents/Profile")));
const FileManager = Loadable(lazy(() => import("../components/FileManager")));
const HireBookKeeper = Loadable(lazy(() => import("../pages/bookKeeper-hire")));
const HireRequest = Loadable(lazy(() => import("../pages/hire-request")));
const ManageOfferRequests = Loadable(lazy(() => import("../pages/manage-offer-request")));
const ManageHiredBookKeepers = Loadable(lazy(() => import("../pages/manage-hired-bookkeepers")));
const ManageCompanies = Loadable(lazy(() => import("../pages/manage-companies")));
const Setting = Loadable(lazy(() => import("../pages/userSettings")));
const ProfileEditForm = Loadable(lazy(() => import("userComponents/Profile/ProfileEditForm")));

const DataWorker = Loadable(lazy(() => import("../pages/company-worker-data")));
const WorkerTime = Loadable(lazy(() => import("../pages/user-work-time")));
const WorkerData = Loadable(lazy(() => import("../pages/user-data")));
const WorkerTimeEditForm = Loadable(lazy(() => import("../userComponents/WorkTime/WorkerTimeEditForm")));

const UserRoutes = {
	path: "home",
	children: [
		{
			path: "default/:sessionId?",
			element: <RequireAuth><Home /></RequireAuth>,
		},
		{
			path: "pricing",
			element: <RequireAuth><CompanyOwnerPricing /></RequireAuth>,
		},
		{
			path: "add-vehicle/:id",
			element: <RequireAuth><Vehicle /></RequireAuth>,
		},
		{
			path: "edit-vehicle/:id",
			element: <RequireAuth><EditVehicle /></RequireAuth>,
		},
		{
			path: "vehicle/:id",
			element: <RequireAuth><VehicleDetails /></RequireAuth>,
		},
		{
			path: "vehicle-list/:id",
			element: <RequireAuth> <VehiclesUser /></RequireAuth>,
		},
		{
			path: "add-worker/:id",
			element: <RequireAuth> <Worker /></RequireAuth>,
		},
		{
			path: "edit-worker/:id",
			element: <RequireAuth><EditWorker /></RequireAuth>,
		},
		{
			path: "worker/:id",
			element: <RequireAuth><WorkerDetails /></RequireAuth>,
		},
		{
			path: "worker-list/:id",
			element: <RequireAuth> <WorkerUser /></RequireAuth>,
		},
		{
			path: "calendar/:companyId",
			element: <RequireAuth> <Calendar /></RequireAuth>,
		},
		{
			path: "calendar/:companyId/worker/:workerId",
			element: <RequireAuth> <Calendar /></RequireAuth>,
		},

		{
			path: "appointments-list/:id",
			element: <RequireAuth> <AppointmentsUser /></RequireAuth>,
		},
		{
			path: "add-appointment/:id",
			element: <RequireAuth> <Appointment /></RequireAuth>,
		},
		{
			path: "appointment/:id",
			element: <RequireAuth><AppointmentDetails /></RequireAuth>,
		},
		{
			path: "edit-appointment/:id",
			element: <RequireAuth> <EditAppointment /></RequireAuth>,
		},
		{
			path: "add-company",
			element: <RequireAuth> <Company /></RequireAuth>,
		},
		{
			path: "edit-company/:id",
			element: <RequireAuth><EditCompany /></RequireAuth>,
		},
		{
			path: "company/:id",
			element: <RequireAuth><CompanyDetails /></RequireAuth>,
		},
		{
			path: "pricing-plans",
			element: <RequireAuth><PricingPlans /></RequireAuth>,
		},
		{
			path: "invoice/:id",
			element: <RequireAuth> <Invoice /></RequireAuth>,
		},
		{
			path: "invoice-details/:id",
			element: <RequireAuth> <InvoiceDetails /></RequireAuth>,
		},
		{
			path: "archive/:id",
			element: <RequireAuth><Archive /></RequireAuth>,
		},
		{
			path: "archive/folder/admin/:folderId",
			element: <RequireAuth><FolderAdminComponent /></RequireAuth>,
		},
		{
			path: "archive/:companyId/folder/:folderId",
			element: <RequireAuth><FolderComponent /></RequireAuth>,
		},
		{
			path: "archive/file/:fileId",
			element: <RequireAuth><FileComponent /></RequireAuth>,
		},
		{
			path: "archive/file-manager",
			element: <RequireAuth><FileManager /></RequireAuth>,
		},
		{
			path: "user-profile",
			element: <RequireAuth><Profile /></RequireAuth>,
		},
		{
			path: "settings",
			element: <RequireAuth><Setting /></RequireAuth>,
		},
		{
			path: "edit-profile/:id",
			element: <RequireAuth><ProfileEditForm /></RequireAuth>,
		},
		{
			path: "manage-companies",
			element: <RequireAuth><ManageCompanies /></RequireAuth>,
		},
		{
			path: "hire-bookkeeper/:id",
			element: <RequireAuth><HireBookKeeper /></RequireAuth>,
		},
		{
			path: "bookkeepers/:id",
			element: <RequireAuth><ManageHiredBookKeepers /></RequireAuth>,
		},
		{
			path: "manage-offer-requests/:id",
			element: <RequireAuth><ManageOfferRequests /></RequireAuth>
		},
		{
			path: "manage-hired-bookkeeper",
			element: <RequireAuth><ManageHiredBookKeepers /></RequireAuth>
		},
		{
			path: "hire-request",
			element: <RequireAuth> <HireRequest /></RequireAuth>
		},
		{
			path: "worker-list/:companyId/data-worker/:workerId",
			element: <RequireAuth><DataWorker /></RequireAuth>,
		},
		{
			path: "worker-list/:companyId/worker-time/:workerId",
			element: <RequireAuth><WorkerTime /></RequireAuth>,
		},
		{
			path: "edit-trackTime/:id",
			element: <RequireAuth><WorkerTimeEditForm /></RequireAuth>,
		},
		{
			path: "worker-list/:id/worker-data/:id",
			element: <RequireAuth> <WorkerData /> </RequireAuth>,
		},

	],
};

export default UserRoutes;
