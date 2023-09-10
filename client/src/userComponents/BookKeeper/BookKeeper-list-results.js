import React, { useEffect, useState } from "react";
import { BASE_URL } from "config";
import { setLoading } from "redux/actionCreators/loadingActionCreators";
import { useDispatch } from "react-redux";
import Pagination from "utils/Pagination";
import { useTranslation } from 'react-i18next';


export const BookKeeperListResults = ({ bookKeeperQuery, companyId }) => {
	const [bookKeeper, setBookKeeper] = useState();
	const user = JSON.parse(localStorage.getItem("user"));
	const dispatch = useDispatch();
	const { t } = useTranslation();
	const fetchBookKeepers = async () => {
		dispatch(setLoading(true));
		const responsee = await fetch(`${BASE_URL}/company/bookkeeper/${companyId}`, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${user.tokens.access.token}`,
			},
		});
		const jsonn = await responsee.json();
		console.log("list", jsonn)
		if (responsee.ok) {
			if (jsonn.results.length == 0) {
				const response = await fetch(`${BASE_URL}/bookkeeper/approved/?companyId=${companyId}`, {
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
				}
			} else {
				setBookKeeper(null);
			}
		}
		dispatch(setLoading(false));
	};
	useEffect(() => {
		fetchBookKeepers();
	}, []);

	const searchBookKeepers = async (bookKeeperQuery) => {
		if (bookKeeperQuery) {
			dispatch(setLoading(true));
			const response = await fetch(`${BASE_URL}/bookkeeper/approved/?name=${bookKeeperQuery}&?companyId=${companyId}`, {
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
		} else {
			fetchBookKeepers();
		}
	};
	useEffect(() => {
		searchBookKeepers(bookKeeperQuery);
	}, [bookKeeperQuery]);

	return (
		<Pagination
			headings={[
				{ title: t('BookKeeper Name') },
				{ title: t('Email') },
				{ title: t('Phone Number') },
				{ title: t('Account Status') },
				{ title: t('Mange'), align: "right" },

			]}
			data={bookKeeper}
			moduleName="bookKeeper"
			cellData={[
				{
					dataType: "text",
					dataKey: "name"
				},
				{
					dataType: "email",
					dataKey: "email",
				},
				{
					dataType: "text",
					dataKey: "phoneNumber",
				},
				{
					dataType: "chip",
					dataKey: "accountStatus",
				},

				{
					align: "right",
					dataType: "actions",
					dataKey: "id",
					actions: {
						hire: true,
					},
				},
			]}
			fetchData={fetchBookKeepers}
			navigateLayer="home"
			companyId={companyId}
		/>
	);
};
