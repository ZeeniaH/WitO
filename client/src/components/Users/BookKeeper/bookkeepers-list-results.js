import React, { useEffect, useState } from "react";
import { BASE_URL } from "config";
import { setLoading } from "redux/actionCreators/loadingActionCreators";
import { useDispatch } from "react-redux";
import Pagination from "../../../utils/Pagination";
import { useTranslation } from 'react-i18next';


export const BookKeepersListResults = ({ bookKeeperQuery }) => {
	const [users, setUsers] = useState();
	const { t } = useTranslation();
	const user = JSON.parse(localStorage.getItem("user"));
	const dispatch = useDispatch();

	const fetchUsers = async () => {
		dispatch(setLoading(true));
		const response = await fetch(`${BASE_URL}/bookkeeper`, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${user.tokens.access.token}`,
			},
		});
		const json = await response.json();
		if (response.ok) {
			setUsers(json.results);
		}
		dispatch(setLoading(false));
	};
	useEffect(() => {
		fetchUsers();
	}, []);

	const searchUsers = async (bookKeeperQuery) => {
		if (bookKeeperQuery) {
			dispatch(setLoading(true));
			const response = await fetch(`${BASE_URL}/bookkeeper?accountStatus=${bookKeeperQuery}`, {
				method: "GET",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${user.tokens.access.token}`,
				},
			});
			const json = await response.json();
			if (response.ok) {
				setUsers(json);
			}
			dispatch(setLoading(false));
		} else {
			fetchUsers();
		}
	};
	useEffect(() => {
		searchUsers(bookKeeperQuery);
	}, [bookKeeperQuery]);

	return (
		<Pagination
			headings={[
				{ title: t('BookKeeper Name') },
				{ title: t('Email') },
				{ title: t('Account Status') },
				{ title: t('Actions'), align: "right" },
			]}
			data={users}
			moduleName="bookkeeper"
			cellData={[
				{
					dataType: "avatarWithText",
					dataKey: ["avatarUrl", "name", "name"],
				},
				{
					dataType: "text",
					dataKey: "email",
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
						view: false,
						edit: true,
						delete: true,
					},
				},
			]}
			fetchData={fetchUsers}
			navigateLayer="dashboard"
		/>
	);
};
