import React, { useEffect, useState } from "react";
import { BASE_URL } from "config";
import { setLoading } from "redux/actionCreators/loadingActionCreators";
import { useDispatch } from "react-redux";
import Pagination from "utils/Pagination";

export const WorkersListResults = ({ workerQuery }) => {
	const [workers, setWorkers] = useState();
	// const { user } = useAuthContext();
	const user = JSON.parse(localStorage.getItem("user"));
	const dispatch = useDispatch();

	const fetchWorkers = async () => {
		dispatch(setLoading(true));
		const response = await fetch(`${BASE_URL}/worker/`, {
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
			const response = await fetch(`${BASE_URL}/worker?name=${workerQuery}`, {
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

	return (
		<Pagination
			headings={[
				{ title: "Worker Name" },
				{ title: "Social Security Number" },
				{ title: "Tax Class" },
				{ title: "Health Insurance" },
				{ title: "Actions", align: "right" },
			]}
			data={workers}
			moduleName="worker"
			cellData={[
				{
					dataType: "avatarWithText",
					dataKey: ["workerPicture", "selectCompany", "name"],
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
						edit: true,
						delete: true,
					},
				},
			]}
			fetchData={fetchWorkers}
			navigateLayer="home"
		/>
	);
};
