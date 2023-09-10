import React, { useEffect } from "react";
import { Container } from "react-bootstrap";
import { shallowEqual, useSelector } from "react-redux";
import { Route, Switch, useNavigate, useRouteMatch } from "react-router-dom";

import NavDashboard from "./NavDashboard";
import Home from "./Home";
import FolderAdminComponent from "./FolderAdminComponent";
import FolderComponent from "./FolderComponent";
import FileComponent from "./FileComponent";

const Dashboard = () => {
	const navigate = useNavigate();
	const { path } = useRouteMatch();
	console.log(path);
	const { isLoggedIn } = useSelector(
		(state) => ({
			isLoggedIn: state.auth.isLoggedIn,
		}),
		shallowEqual
	);
	useEffect(() => {
		if (!isLoggedIn) {
			navigate("/login");
		}
	}, [isLoggedIn]);
	return (
		<Container fluid className="px-0" style={{ overflowX: "hidden" }}>
			<NavDashboard />
		</Container>
	);
};

export default Dashboard;
