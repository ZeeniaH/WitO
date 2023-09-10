import React, { useEffect, useState } from "react";
import { BASE_URL } from "config";
import { setLoading } from "redux/actionCreators/loadingActionCreators";
import { useDispatch } from "react-redux";
import Pagination from "utils/Pagination";
import { useTranslation } from 'react-i18next';

export const VehiclesListResults = ({ searchVehicleQuery, companyId }) => {
	const [vehicles, setVehicles] = useState();
	// const { user } = useAuthContext();
	const user = JSON.parse(localStorage.getItem("user"));
	const dispatch = useDispatch();
	const { t } = useTranslation();

	const fetchVehicles = async () => {
		dispatch(setLoading(true));
		const response = await fetch(`${BASE_URL}/vehicle/vehicles/${companyId}`, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${user.tokens.access.token}`,
			},
		});
		const json = await response.json();
		if (response.ok) {
			setVehicles(json);
			console.log(json);
		}
		dispatch(setLoading(false));
	};

	useEffect(() => {
		fetchVehicles();
	}, []);

	const searchVehicles = async (searchVehicleQuery) => {
		if (searchVehicleQuery) {
			dispatch(setLoading(true));
			const response = await fetch(`${BASE_URL}/vehicle?licensePlate=${searchVehicleQuery}`, {
				method: "GET",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${user.tokens.access.token}`,
				},
			});
			const json = await response.json();
			if (response.ok) {
				setVehicles(json);
			}

			dispatch(setLoading(false));
		} else {
			fetchVehicles();
		}
	};

	useEffect(() => {
		searchVehicles(searchVehicleQuery);
	}, [searchVehicleQuery]);

	const isBookKeeper = user?.user?.role === "BookKeeper";

	return (
		<Pagination
			headings={[
				// { title: "Car Maker" },
				{ title: t('Maker') },
				{ title: t('Model') },
				{ title: t('License Plate') },
				{ title: t('Actions'), align: "right" },
			]}
			data={vehicles}
			moduleName="vehicle"
			cellData={[
				// {
				// 	dataType: "avatarWithText",
				// 	dataKey: ["carImage[0]", "selectCompany", "selectCompany"],
				// },
				// {
				// 	dataType: "text",
				// 	dataKey: "carMaker"
				// },
				{
					dataType: "text",
					dataKey: "makeName",
				},
				{
					dataType: "text",
					dataKey: "model",
				},
				{
					dataType: "text",
					dataKey: "licensePlate",
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
			fetchData={fetchVehicles}
			navigateLayer="home"
			companyId={companyId}
		/>
	);
};
