import React, { useEffect, useState } from "react";
import { BASE_URL } from "config";
import { setLoading } from "redux/actionCreators/loadingActionCreators";
import { useDispatch } from "react-redux";
import Pagination from "utils/Pagination";
import { useTranslation } from 'react-i18next';


export const WorkersListResults = ({ workerQuery, id }) => {
	const [workers, setWorkers] = useState();
	// const { user } = useAuthContext();
	const user = JSON.parse(localStorage.getItem("user"));
	const dispatch = useDispatch();
	const { t } = useTranslation();

	const fetchWorkers = async () => {
		dispatch(setLoading(true));
		const response = await fetch(`${BASE_URL}/worker/workers/${id}`, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${user.tokens.access.token}`,
			},
		});
		const json = await response.json();
		if (response.ok) {
			setWorkers(json);
		}
		dispatch(setLoading(false));
	};
	useEffect(() => {
		fetchWorkers();
	}, []);

	const searchWorkers = async (workerQuery) => {
		if (workerQuery) {
			dispatch(setLoading(true));
			const response = await fetch(`${BASE_URL}/worker/workers/${id}?firstName=${workerQuery}`, {
				method: "GET",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${user.tokens.access.token}`,
				},
			});
			const json = await response.json();
			if (response.ok) {
				setWorkers(json);
			}
			dispatch(setLoading(false));
		} else {
			fetchWorkers();
		}
	};
	useEffect(() => {
		searchWorkers(workerQuery);
	}, [workerQuery]);
	const isBookKeeper = user?.user?.role === "BookKeeper";
	return (
		<Pagination
			headings={[
				{ title: t("Worker Name") },
				{ title: t("Social Security Number") },
				{ title: t("Tax Class") },
				{ title: t("Health Insurance") },
				{ title: t("Actions"), align: "right" },
			]}
			data={workers}
			moduleName="worker"
			cellData={[
				{
					dataType: "avatarWithText",
					dataKey: ["workerPicture", "selectCompany", "firstName"],
				},
				{
					dataType: "text",
					dataKey: "socialSecurityNumber",
				},
				{
					dataType: "text",
					dataKey: "taxClass",
				},
				{
					dataType: "text",
					dataKey: "healthInsurance",
				},
				{
					align: "right",
					dataType: "actions",
					dataKey: "id",
					actions: {
						view: true,
						edit: isBookKeeper ? false : true,
						delete: true,
					},
				},
			]}
			fetchData={fetchWorkers}
			navigateLayer="dashboard"
			companyId={id}
		/>
	);
};
