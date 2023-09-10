// assets
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import { DashboardOutlined } from "@ant-design/icons";

// icons
const icons = {
	PeopleAltIcon,
	DashboardOutlined,
};

// ==============================|| MENU ITEMS - DASHBOARD ||============================== //

const adminMenus = {
	id: "group-adminMenus",
	title: "Admin Menus",
	type: "group",
	children: [
		{
			id: "dashboard",
			title: "Dashboard",
			type: "item",
			url: "/dashboard/default",
			icon: icons.DashboardOutlined,
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
	],
};

export default adminMenus;
