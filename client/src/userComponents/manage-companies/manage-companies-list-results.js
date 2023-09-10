import React, { useEffect, useState } from "react";
import { BASE_URL } from "config";
import { setLoading } from "redux/actionCreators/loadingActionCreators";
import { useDispatch } from "react-redux";
import Pagination from "utils/Pagination";
import { Badge } from "@mui/material";

export const ManageCompanyListResults = ({ offerRequestQuery }) => {
	const [bookKeeper, setBookKeeper] = useState();
	const user = JSON.parse(localStorage.getItem("user"));
	const bookKeeperId = user?.user?.id;

	const dispatch = useDispatch();

	const fetchWorkers = async () => {
		dispatch(setLoading(true));
		const response = await fetch(`${BASE_URL}/bookKeeper/${bookKeeperId}`, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${user.tokens.access.token}`,
			},
		});
		const json = await response.json();
		console.log(json)
		if (response.ok) {
			setBookKeeper(json);
		}
		dispatch(setLoading(false));
	};
	useEffect(() => {
		fetchWorkers();
	}, []);
	return (
		<Pagination
			headings={[
				{ title: "Company Name" },
				{ title: "Company Email" },
				{ title: "Contact No" },
				{ title: "Tax Number" },
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
					dataKey: "contactNo",
					renderCell: (rowData) => (
						<Badge badgeContent={rowData.badgeContent} color={rowData.badgeColor}>
							{rowData.contactNo}
						</Badge>
					),
				},
				{
					dataType: "text",
					dataKey: "taxNumber",
					renderCell: (rowData) => (
						<Badge badgeContent={rowData.badgeContent} color={rowData.badgeColor}>
							{rowData.contactNo}
						</Badge>
					),
				},
				{
					align: "right",
					dataType: "actions",
					dataKey: "_id",
					actions: {
						remove: true,
					}
				},
			]}
			fetchData={fetchWorkers}
			navigateLayer="home"
		/>
	);
};
