// assets
import { DashboardOutlined } from "@ant-design/icons";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import SettingsIcon from "@mui/icons-material/Settings";
import ClearAllIcon from "@mui/icons-material/ClearAll";
import DashboardIcon from "@mui/icons-material/Dashboard";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import ArchiveIcon from "@mui/icons-material/Archive";
import SellIcon from "@mui/icons-material/Sell";

// icons
const icons = {
	DashboardOutlined,
	PeopleAltIcon,
	SettingsIcon,
	ClearAllIcon,
	DashboardIcon,
	CalendarMonthIcon,
	ArchiveIcon,
	SellIcon,
};

// ==============================|| MENU ITEMS - DASHBOARD ||============================== //

const workerMenus = {
	id: "group-workerMenus",
	title: "Worker Menus",
	type: "group",
	children: [
		{
			id: "settings",
			title: "Settings",
			type: "item",
			url: "/dashboard/settings",
			icon: icons.SettingsIcon,
			breadcrumbs: false,
		},
		{
			id: "calendar",
			title: "Calendar",
			type: "item",
			url: "/dashboard/calendar",
			icon: icons.CalendarMonthIcon,
			breadcrumbs: false,
		},
		{
			id: "archive",
			title: "Archive",
			type: "item",
			url: "/dashboard/archive",
			icon: icons.ArchiveIcon,
			breadcrumbs: false,
		},
		{
			id: "pricing-plans",
			title: "Pricing Plans",
			type: "item",
			url: "/dashboard/pricing-plans",
			icon: icons.SellIcon,
			breadcrumbs: false,
		},
	],
};

export default workerMenus;
