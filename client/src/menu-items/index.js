// project import
import pages from "./pages";
import dashboard from "./dashboard";
import utilities from "./utilities";
import support from "./support";
import sidebarItems from "./menuItems";
import services from "./services";
// import adminMenus from "./adminMenus";
// import companyOwnerMenus from "./companyOwnerMenus";
// import workerMenus from "./workerMenus";

// ==============================|| MENU ITEMS ||============================== //

const user = JSON.parse(localStorage.getItem("user"));
const role = user?.user?.role;
let menus;
// switch (role) {
// 	case "Admin":
// 		menus = [adminMenus, companyOwnerMenus, workerMenus];
// 		break;
// 	case "CompanyOwner":
// 		menus = [companyOwnerMenus, workerMenus];
// 		break;
// 	case "Worker":
// 		menus = [workerMenus];
// 		break;
// 	default:
// 		break;
// }
const menuItems = {
	// items: [sidebarItems, services],
	items: [sidebarItems],
};

export default menuItems;
