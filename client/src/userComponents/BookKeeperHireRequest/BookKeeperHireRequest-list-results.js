import React, { useEffect, useState } from "react";
import { BASE_URL } from "config";
import { setLoading } from "redux/actionCreators/loadingActionCreators";
import { useDispatch } from "react-redux";
import Pagination from "utils/Pagination";
import { Badge } from "@mui/material";

export const BookKeeperHireRequestListResults = ({ bookKeeperQuery }) => {
	const [bookKeeper, setBookKeeper] = useState();
	const user = JSON.parse(localStorage.getItem("user"));
	const dispatch = useDispatch();

	const fetchHireRequests = async () => {
		dispatch(setLoading(true));
		const response = await fetch(`${BASE_URL}/bookkeeper/request`, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${user.tokens.access.token}`,
			},
		});
		const json = await response.json();
		console.log("BookKeepers", json)
		if (response.ok) {
			setBookKeeper(json);
			console.log(json)
		}
		dispatch(setLoading(false));
	};
	useEffect(() => {
		fetchHireRequests();
	}, []);

	// const searchWorkers = async (bookKeeperQuery) => {
	// 	if (bookKeeperQuery) {
	// 		dispatch(setLoading(true));
	// 		const response = await fetch(`${BASE_URL}/bookkeeper/request?accountStatus=${bookKeeperQuery}`, {
	// 			method: "GET",
	// 			headers: {
	// 				"Content-Type": "application/json",
	// 				Authorization: `Bearer ${user.tokens.access.token}`,
	// 			},
	// 		});
	// 		const json = await response.json();
	// 		console.log("json", json)
	// 		if (response.ok) {
	// 			setBookKeeper(json);
	// 		}
	// 		dispatch(setLoading(false));
	// 	} else {
	// 		fetchBookKeepers();
	// 	}
	// };
	// useEffect(() => {
	// 	searchWorkers(bookKeeperQuery);
	// }, [bookKeeperQuery]);

	return (
		<Pagination
			headings={[
				{ title: "Company Name" },
				{ title: "Company Email" },
				{ title: "Message" },
				{ title: "Request Status" },
				{ title: "Manage", align: "right" },
			]}
			data={bookKeeper}
			moduleName="bookKeeper"
			cellData={[
				{
					dataType: "text",
					dataKey: "companyName",
					renderCell: (rowData) => (
						<Badge badgeContent={rowData.badgeContent} color={rowData.badgeColor}>
							{rowData.companyName}
						</Badge>
					),
				},
				{
					dataType: "text",
					dataKey: "email",
					renderCell: (rowData) => (
						<Badge badgeContent={rowData.badgeContent} color={rowData.badgeColor}>
							{rowData.email}
						</Badge>
					),
				},
				{
					dataType: "text",
					dataKey: "message",
					renderCell: (rowData) => (
						<Badge badgeContent={rowData.badgeContent} color={rowData.badgeColor}>
							{rowData.message}
						</Badge>
					),
				},
				{
					dataType: "chip",
					dataKey: "status",
					renderCell: (rowData) => (
						<Badge badgeContent={rowData.badgeContent} color={rowData.badgeColor}>
							{rowData.status}
						</Badge>
					),
				},
				{
					align: "right",
					dataType: "actions",
					dataKey: "requestId",
					requestFromCompanyId: "companyId",
					actions: {
						accept: true,
						reject: true,
					}
				},
			]}
			fetchData={fetchHireRequests}
			navigateLayer="home"
		/>
	);
};
