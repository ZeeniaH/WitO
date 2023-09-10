import React, { useEffect, useState } from "react";
import { BASE_URL } from "config";
import { setLoading } from "redux/actionCreators/loadingActionCreators";
import { useDispatch } from "react-redux";
import Pagination from "utils/Pagination";
import { Badge } from "@mui/material";
import { useTranslation } from 'react-i18next';

export const OfferRequestListResults = ({ offerRequestQuery, companyId }) => {
	const [bookKeeper, setBookKeeper] = useState();
	const user = JSON.parse(localStorage.getItem("user"));
	const dispatch = useDispatch();
	const { t } = useTranslation();

	const fetchBookkeepers = async () => {
		dispatch(setLoading(true));
		const response = await fetch(`${BASE_URL}/company/offer-request/${companyId}`, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${user.tokens.access.token}`,
			},
		});
		const json = await response.json();
		if (response.ok) {
			setBookKeeper(json);
		}
		dispatch(setLoading(false));
	};
	useEffect(() => {
		fetchBookkeepers();
	}, []);

	return (
		<Pagination
			headings={[
				{ title: t('BookKeeper Name') },
				{ title: t('BookKeeper Email') },
				{ title: t('Message') },
				{ title: t('Request Status') },
				{ title: t('Manage'), align: "right" },
			]}
			data={bookKeeper}
			moduleName="bookKeeper"
			cellData={[
				{
					dataType: "text",
					dataKey: "bookKeeperName",
					renderCell: (rowData) => (
						<Badge badgeContent={rowData.badgeContent} color={rowData.badgeColor}>
							{rowData.bookKeeperName}
						</Badge>
					),
				},
				{
					dataType: "email",
					dataKey: "bookKeeperEmail",
					renderCell: (rowData) => (
						<Badge badgeContent={rowData.badgeContent} color={rowData.badgeColor}>
							{rowData.bookKeeperEmail}
						</Badge>
					),
				},
				{
					dataType: "text",
					dataKey: "requestMessage",
					renderCell: (rowData) => (
						<Badge badgeContent={rowData.badgeContent} color={rowData.badgeColor}>
							{rowData.requestMessage}
						</Badge>
					),
				},
				{
					dataType: "chip",
					dataKey: "requestStatus",
					renderCell: (rowData) => (
						<Badge badgeContent={rowData.badgeContent} color={rowData.badgeColor}>
							{rowData.requestStatus}
						</Badge>
					),
				},
				{
					align: "right",
					dataType: "actions",
					dataKey: "requestId",
					actions: {
						withdraw: true,
					}
				},
			]}
			fetchData={fetchBookkeepers}
			navigateLayer="home"
			companyId={companyId}
		/>
	);
};
