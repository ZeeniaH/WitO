import React, { useEffect, useState } from "react";
import { BASE_URL } from "config";
import { setLoading } from "redux/actionCreators/loadingActionCreators";
import { useDispatch } from "react-redux";
import Pagination from "utils/Pagination";
import { Badge } from "@mui/material";
import { useTranslation } from 'react-i18next';


export const HiredBookKeeperListResults = ({ hiredBookKeeperQuery, companyId }) => {
	const [bookKeepers, setBookKeepers] = useState();
	const user = JSON.parse(localStorage.getItem("user"));
	const dispatch = useDispatch();
	const { t } = useTranslation();

	const fetchBookKeepers = async () => {
		dispatch(setLoading(true));
		const response = await fetch(`${BASE_URL}/company/bookkeeper/${companyId}`, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${user.tokens.access.token}`,
			},
		});
		const json = await response.json();
		console.log("list", json)
		if (response.ok) {
			setBookKeepers(json);
		}
		dispatch(setLoading(false));
	};
	useEffect(() => {
		fetchBookKeepers();
	}, []);

	return (
		<Pagination
			headings={[
				{ title: t('BookKeeper Name') },
				{ title: t('BookKeeper Email') },
				{ title: t('Phone Number') },
				{ title: t('Manage'), align: "right" },
			]}
			data={bookKeepers}
			moduleName="company"
			cellData={[
				{
					dataType: "text",
					dataKey: "name",
					renderCell: (rowData) => (
						<Badge badgeContent={rowData.badgeContent} color={rowData.badgeColor}>
							{rowData.name}
						</Badge>
					),
				},
				{
					dataType: "email",
					dataKey: "email",
					renderCell: (rowData) => (
						<Badge badgeContent={rowData.badgeContent} color={rowData.badgeColor}>
							{rowData.email}
						</Badge>
					),
				},
				{
					dataType: "text",
					dataKey: "phoneNumber",
					renderCell: (rowData) => (
						<Badge badgeContent={rowData.badgeContent} color={rowData.badgeColor}>
							{rowData.phoneNumber}
						</Badge>
					),
				},
				{
					align: "right",
					dataType: "actions",
					dataKey: "id",
					actions: {
						terminate: true,
					}
				},
			]}
			fetchData={fetchBookKeepers}
			navigateLayer="home"
			companyId={companyId}
		/>
	);
};
