// assets
import { DashboardOutlined } from "@ant-design/icons";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import SettingsIcon from "@mui/icons-material/Settings";
import ClearAllIcon from "@mui/icons-material/ClearAll";
import DashboardIcon from "@mui/icons-material/Dashboard";
import BookOnlineIcon from "@mui/icons-material/BookOnline";

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
	title: "Navigation",
	type: "group",
	children: [
		{
			id: "dashboard",
			title: "Dashboard",
			type: "item",
			url: "/dashboard/default",
			icon: icons.DashboardIcon,
			breadcrumbs: false,
		},
		{
			id: "company-owners",
			title: "Companies",
			type: "item",
			url: "/dashboard/company-owners",
			icon: icons.PeopleAltIcon,
			breadcrumbs: false,
		},
		// {
		// 	id: "appointments",
		// 	title: "Appointments",
		// 	type: "item",
		// 	url: "/dashboard/appointments",
		// 	icon: icons.BookOnlineIcon,
		// 	breadcrumbs: false,
		// },
		{
			id: "users",
			title: "Users",
			type: "item",
			url: "/dashboard/users",
			icon: icons.PeopleAltIcon,
			breadcrumbs: false,
		},
		{
			id: "bookkeepers",
			title: "BookKeepers",
			type: "item",
			url: "/dashboard/bookkeepers",
			icon: icons.PeopleAltIcon,
			breadcrumbs: false,
		},
		{
			id: "settings",
			title: "Settings",
			type: "item",
			url: "/dashboard/settings",
			icon: icons.SettingsIcon,
			breadcrumbs: false,
		},

		// {
		// 	id: "workers",
		// 	title: "Workers",
		// 	type: "item",
		// 	url: "/dashboard/workers",
		// 	icon: icons.DashboardOutlined,
		// 	breadcrumbs: false,
		// },
		// {
		// 	id: "book-keepers",
		// 	title: "Book Keepers",
		// 	type: "item",
		// 	url: "/dashboard/book-keepers",
		// 	icon: icons.DashboardOutlined,
		// 	breadcrumbs: false,
		// },
	],
};

export default menuItems;
