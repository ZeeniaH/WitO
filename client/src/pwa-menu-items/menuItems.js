// assets
import { DashboardOutlined } from "@ant-design/icons";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import SettingsIcon from "@mui/icons-material/Settings";
import ClearAllIcon from "@mui/icons-material/ClearAll";
import DashboardIcon from "@mui/icons-material/Dashboard";
import BookOnlineIcon from "@mui/icons-material/BookOnline";

const user = JSON.parse(localStorage.getItem("user"));
const userId = user ? user?.user.id : null;

// icons
const icons = {
	DashboardOutlined,
	PeopleAltIcon,
	SettingsIcon,
	ClearAllIcon,
	DashboardIcon,
	BookOnlineIcon,
};

// ==============================|| MENU ITEMS - DASHBOARD ||============================== //

const menuItems = {
	id: "group-menuItems",
	// title: "Navigation",
	type: "group",
	children: [
		{
			id: "profile",
			title: "Profile",
			type: "item",
			url: "/pwa/user-profile",
			// icon: icons.DashboardIcon,
			breadcrumbs: false,
		},
		{
			id: "workTime",
			title: "Work Time",
			type: "item",
			url: "/pwa/work-time",
			// icon: icons.PeopleAltIcon,
			breadcrumbs: false,
		},
		{
			id: "import",
			title: "Import/Damage/Export",
			type: "item",
			url: "/pwa/data-export",
			// icon: icons.PeopleAltIcon,
			breadcrumbs: false,
		},
		{
			id: "calender",
			title: "Calender",
			type: "item",
			url: `/pwa/scheduler/${user.user.companyId}/worker/${userId}`,
			// icon: icons.BookOnlineIcon,
			breadcrumbs: false,
		},
		{
			id: "carInformation",
			title: "Car Information",
			type: "item",
			url: "/pwa/owner-data",
			// icon: icons.PeopleAltIcon,
			breadcrumbs: false,
		},
		{
			id: "shareData",
			title: "Share Data",
			type: "item",
			url: `/pwa/share-data/${userId}`,
			// icon: icons.PeopleAltIcon,
			breadcrumbs: false,
		},
		{
			id: "settings",
			title: "Settings",
			type: "item",
			url: `/pwa/setting/`,
			// icon: icons.PeopleAltIcon,
			breadcrumbs: false,
		},
	],
};

export default menuItems;
