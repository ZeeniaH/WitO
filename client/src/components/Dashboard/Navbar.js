import React from "react";
import PropTypes from "prop-types";
import { Link, NavLink } from "react-router-dom";
import { List, ListItem, ListItemIcon, ListItemText } from "@mui/material";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import SettingsIcon from "@mui/icons-material/Settings";
import TableChartIcon from "@mui/icons-material/TableChart";
import ClearAllIcon from "@mui/icons-material/ClearAll";
import DashboardIcon from "@mui/icons-material/Dashboard";
import styles from "./navbar.module.scss";

const Navbar = (props) => {
	const [open, setOpen] = React.useState(false);

	const handleClick = () => {
		setOpen(!open);
	};

	const items = [
		{
			primary: "Dashboard",
			to: "#",
			icon: <DashboardIcon />,
		},
		{
			primary: "Companies",
			to: "#",
			icon: <PeopleAltIcon />,
		},
		{
			primary: "Settings",
			to: "#",
			icon: <SettingsIcon />,
		},
		{
			primary: "Book Keepers",
			to: "#",
			icon: <TableChartIcon />,
		},
		{
			primary: "Workers",
			to: "#",
			icon: <ClearAllIcon />,
		},
	];

	const [add_class, set_add_class] = React.useState(false);
	return (
		<div className={styles.navbar}>
			<List
				component="nav"
				aria-labelledby="nested-list-subheader"
				subheader={
					<div className={styles.subheader}>
						<div
							className={styles.logo}
							styles={{ fontSize: "16px", fontWeight: "600" }}
						>
							Admin Panel
						</div>
						<div
							className={styles.mobileMenu}
							onClick={() => {
								set_add_class(!add_class);
							}}
						></div>
					</div>
				}
			>
				{items.map((item) => (
					<NavLink to={item.to} exact className={`${add_class ? " show" : ""}`}>
						<ListItem button>
							<ListItemIcon>{item.icon}</ListItemIcon>
							<ListItemText primary={item.primary} />
						</ListItem>
					</NavLink>
				))}
			</List>
		</div>
	);
};

Navbar.propTypes = {};

export default Navbar;
