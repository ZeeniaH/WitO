// assets
import { DashboardOutlined } from "@ant-design/icons";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import SettingsIcon from "@mui/icons-material/Settings";
import ClearAllIcon from "@mui/icons-material/ClearAll";
import DashboardIcon from "@mui/icons-material/Dashboard";

// icons
const icons = {
	DashboardOutlined,
	PeopleAltIcon,
	SettingsIcon,
	ClearAllIcon,
	DashboardIcon,
};

// ==============================|| MENU ITEMS - DASHBOARD ||============================== //

const companyOwnerMenus = {
	id: "group-companyOwnerMenus",
	title: "Company Owner Menus",
	type: "group",
	children: [
		{
			id: "users",
			title: "Users",
			type: "item",
			url: "/dashboard/users",
			icon: icons.PeopleAltIcon,
			breadcrumbs: false,
		},
		{
			id: "workers",
			title: "Workers",
			type: "item",
			url: "/dashboard/workers",
			icon: icons.PeopleAltIcon,
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

export default companyOwnerMenus;
