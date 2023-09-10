import { lazy } from "react";

// project import
import Loadable from "components/Loadable";
const Profile = Loadable(lazy(() => import("../pages/PwaProfile")));
const DataExport = Loadable(lazy(() => import("../pages/data-export")));
const CountDown = Loadable(lazy(() => import("../pages/count-down")));
const DataWorker = Loadable(lazy(() => import("../pages/data-worker-export")));
const Scheduler = Loadable(lazy(() => import("../pages/pwa-Scheduler")));
const Camera = Loadable(lazy(() => import("../userComponents/cam-scanner")));
const UserCompanyOwnerData = Loadable(lazy(() => import("../userComponents/UserCompanyOwnerData")));

const ShareData = Loadable(lazy(() => import("../pages/pwa-company-worker-data")));
const FolderAdminComponent = Loadable(
	lazy(() => import("../pwaComponent/Archive/Dashboard/FolderAdminComponent"))
);
const FolderComponent = Loadable(
	lazy(() => import("../pwaComponent/Archive/Dashboard/FolderComponent"))
);
const FileComponent = Loadable(
	lazy(() => import("../pwaComponent/Archive/Dashboard/FileComponent"))
);

const Invoice = Loadable(lazy(() => import("../pwaComponent/Invoice")));
const Setting = Loadable(lazy(() => import("../pages/pwaSettings")));


const PwaRoutes = {
	path: "pwa",
	children: [
		{
			path: "invoice",
			element: <Invoice />,
		},
		{
			path: "user-profile",
			element: <Profile />,
		},
		{
			path: "data-export",
			element: <DataExport />,
		},
		{
			path: "work-time",
			element: <CountDown />,
		},
		{
			path: "data-worker",
			element: <DataWorker />,
		},
		{
			path: "scheduler/:companyId/worker/:workerId",
			element: <Scheduler />,
		},
		{
			path: "cam-scanner",
			element: <Camera />,
		},
		{
			path: "owner-data",
			element: <UserCompanyOwnerData />,
		},

		{
			path: "share-data/:id",
			element: <ShareData />,
		},
		{
			path: "archive/folder/admin/:folderId",
			element: <FolderAdminComponent />,
		},
		{
			path: "archive/folder/:folderId",
			element: <FolderComponent />,
		},
		{
			path: "archive/file/:fileId",
			element: <FileComponent />,
		},
		{
			path: "setting",
			element: <Setting />,
		},
	],
};

export default PwaRoutes;
