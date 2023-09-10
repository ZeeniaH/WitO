import React, { useEffect, useState } from "react";
import { BASE_URL } from "config";
import { setLoading } from "redux/actionCreators/loadingActionCreators";
import { useDispatch } from "react-redux";
import Pagination from "utils/Pagination";
import { useTranslation } from 'react-i18next';

export const AppointmentsListResults = ({ appointmentQuery, companyId }) => {
	const [appointments, setAppointments] = useState();
	// const { user } = useAuthContext();
	const user = JSON.parse(localStorage.getItem("user"));
	const dispatch = useDispatch();
	const { t } = useTranslation();

	const fetchAppointments = async () => {
		dispatch(setLoading(true));
		const response = await fetch(`${BASE_URL}/appointment/appointments/${companyId}`, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${user.tokens.access.token}`,
			},
		});
		const json = await response.json();
		if (response.ok) {
			setAppointments(json);
		}
		dispatch(setLoading(false));
	};
	useEffect(() => {
		fetchAppointments();
	}, []);

	const searchAppointments = async (appointmentQuery) => {
		if (appointmentQuery) {
			const response = await fetch(
				`${BASE_URL}/appointment?selectWorker=${appointmentQuery}`,
				{
					method: "GET",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${user.tokens.access.token}`,
					},
				}
			);
			const json = await response.json();
			if (response.ok) {
				setAppointments(json);
			}
		} else {
			fetchAppointments();
		}
	};
	useEffect(() => {
		searchAppointments(appointmentQuery);
	}, [appointmentQuery]);
	const isBookKeeper = user?.user?.role === "BookKeeper";
	return (
		<Pagination
			headings={[
				{ title: t('Worker Name') },
				{ title: t('Company') },
				{ title: t('Status') },
				{ title: t('Actions'), align: "right" },
			]}
			data={appointments}
			moduleName="appointment"
			cellData={[
				{
					dataType: "avatarWithText",
					dataKey: ["avatarUrl", "selectWorker", "selectWorker"],
				},
				{
					dataType: "avatarWithText",
					dataKey: ["avatarUrl", "selectCompany", "selectCompany"],
				},
				{
					dataType: "chip",
					dataKey: "appointmentStatus",
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
			fetchData={fetchAppointments}
			navigateLayer="home"
			companyId={companyId}
		/>
	);
};
