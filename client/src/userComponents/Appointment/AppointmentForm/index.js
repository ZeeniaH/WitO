import React, { useState, useEffect } from "react";
import { Button, Grid, FormHelperText, Stack, OutlinedInput } from "@mui/material";
import { Box } from "@mui/system";
import styles from "./AppointmentForm.module.scss";
import { useAuthContext } from "../../../hooks/useAuthContext";
import { useNavigate, useParams } from "react-router-dom";
import Header from "../../Header";
import AppointmentAsideBar from "../AppointmentAsideBar";
import { useTranslation } from 'react-i18next';
import useGoBack from '../../../hooks/useGoBack';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import socketIOClient from 'socket.io-client';
import * as Yup from "yup";
import { Formik } from "formik";
import { BASE_URL } from "config";
import { setLoading } from "redux/actionCreators/loadingActionCreators";
import { useDispatch } from "react-redux";
import { FormControl, InputLabel, MenuItem } from "@mui/material/index";
import Select from "@mui/material/Select";
import ReactSelectMui from "utils/ReactSelectMui";

function AppointmentForm() {
	const { user } = useAuthContext();
	const { t } = useTranslation();
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const params = useParams();

	const [vehicles, setVehicles] = useState([]);
	const [selectedDropdownVehicle, setSelectedDropdownVehicle] = useState(null);
	const [vehicleDropdownError, setVehicleDropdownError] = useState(false);

	const [workers, setWorkers] = useState([]);
	const [selectedDropdownWorker, setSelectedDropdownWorker] = useState(null);
	const [workerDropdownError, setWorkerDropdownError] = useState(false);

	const [appointmentCurrentStatus, setAppointmentCurrentStatus] = useState("");

	const handleAppointmentChange = (event) => {
		setAppointmentCurrentStatus(event.target.value);
	};

	useEffect(() => {
		fetch(`${BASE_URL}/worker/workers/${params.id}`, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${user.tokens.access.token}`,
			},
		})
			.then((res) => res.json())
			.then((data) => {
				setWorkers(
					data.map((worker) => ({
						label: worker.firstName,
						value: worker.id,
					}))
				);
			});
	}, []);

	const handleSelectWorkerDropdown = (selectedOption) => {
		setSelectedDropdownWorker(selectedOption);
		setWorkerDropdownError(false);
	};

	useEffect(() => {
		fetch(`${BASE_URL}/vehicle/vehicles/${params.id}`, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${user.tokens.access.token}`,
			},
		})
			.then((res) => res.json())
			.then((data) => {
				setVehicles(
					data.map((vehicle) => ({
						label: vehicle.licensePlate,
						value: vehicle.id,
					}))
				);
			});
	}, []);

	const handleSelectVehicleDropdown = (selectedOption) => {
		setSelectedDropdownVehicle(selectedOption);
		setVehicleDropdownError(false);
	};

	return (
		<>
			<Header />
			<Grid position="relative" container spacing={2}>
				<Grid
					item
					xs={"auto"}
					sx={{
						position: {
							md: "static",
							xs: "absolute",
						},
						left: "0",
						top: "0",
						zIndex: "2",
						height: {
							xs: "100%",
							md: "unset",
						},
					}}
				>
					<AppointmentAsideBar companyId={params.id} />
				</Grid>
				<Grid item xs>
					<Box
						sx={{
							width: "100%",
							minHeight: "100vh",
							paddingLeft: {
								xs: "80px",
								md: "16px",
							},
						}}
						className={styles.appointmentFormSection}
					>
						<Grid container spacing={2}>
							<Grid item xs={12}>
								<Box className={styles.rightSideSection}>
									<Box>
										<Button
											sx={{ fontSize: "12px", mt: "15px" }}
											variant="outlined"
											onClick={useGoBack}
											startIcon={<ArrowBackIcon />}
										>
											{t('Back')}
										</Button>
									</Box>
									<Box className={styles.appointmentHeading} component={"h1"}>{t('Add New Appointment')}</Box>
									<Box className={styles.addAppointmentFieldsBody}>
										<Box className={styles.appointmentFields}>
											<Formik
												initialValues={{
													selectCar: "",
													selectWorker: "",
													appointmentStatus: "",
													appointmentDescription: "",
													submit: null,
												}}
												validationSchema={Yup.object().shape({
													appointmentDescription: Yup.string()
														.max(100, 'maximum 100 characters')
												})}
												onSubmit={async (
													values,
													{ setErrors, setStatus, setSubmitting }
												) => {
													if (!selectedDropdownVehicle) {
														setVehicleDropdownError(true);
													} else if (!selectedDropdownWorker) {
														setWorkerDropdownError(true);
													} else {
														dispatch(setLoading(true));
														const company = await fetch(`${BASE_URL}/company/${params.id}`, {
															method: "GET",
															headers: {
																"Content-Type": "application/json",
																Authorization: `Bearer ${user.tokens.access.token}`,
															},
														});
														const companyJson = await company.json();
														const appointment = {
															selectCompany: companyJson.companyName,
															vehicleId: selectedDropdownVehicle.value,
															selectCar: selectedDropdownVehicle.label,
															workerId: selectedDropdownWorker.value,
															selectWorker: selectedDropdownWorker.label,
															appointmentStatus: appointmentCurrentStatus,
															appointmentDescription: values.appointmentDescription
														};
														const response = await fetch(
															`${BASE_URL}/appointment/${params.id}/appointment`,
															{
																method: "POST",
																headers: {
																	"Content-Type": "application/json",
																	Authorization: `Bearer ${user.tokens.access.token}`,
																},
																body: JSON.stringify(appointment),
															}
														);
														const json = await response.json();

														if (!response.ok) {
															setStatus({ success: false });
															setErrors({ submit: json.message });
															setSubmitting(false);
														}
														if (response.ok) {
															setStatus({ success: true });
															setSubmitting(false);

															// Call the createNotify API after successful appointment creation
															const notifyResponse = await fetch(`${BASE_URL}/notify/create`, {
																method: "POST",
																headers: {
																	"Content-Type": "application/json",
																	Authorization: `Bearer ${user.tokens.access.token}`,
																},
																body: JSON.stringify({
																	isRead: false,
																	message: `Created by ${user.user.name}`,
																	heading: "Appointment",
																	icon: "appointment",
																	companyId: params.id,
																	workerId: json.workerId
																}),
															});
															const notifyJson = await notifyResponse.json();

															if (!notifyResponse.ok) {
																console.error('Failed to create notification:', notifyJson.message);
															}

															navigate(`/home/appointments-list/${params.id}`);

														}
														dispatch(setLoading(false));
													}
												}}
											>
												{({
													errors,
													handleBlur,
													handleChange,
													handleSubmit,
													isSubmitting,
													touched,
													values,
												}) => (
													<form noValidate onSubmit={handleSubmit}>
														<Grid container spacing={3}>
															<Grid item xs={12}>
																<Stack spacing={1}>
																	<ReactSelectMui
																		label={t('Select Vehicle by License Plate')}
																		options={vehicles}
																		handleSelectDropdown={
																			handleSelectVehicleDropdown
																		}
																		selectedDropdown={
																			selectedDropdownVehicle
																		}
																	/>
																	{vehicleDropdownError && (
																		<FormHelperText
																			error
																			id="standard-weight-helper-text-selectVehicle"
																		>
																			{t('Please select a Vehicle')}
																		</FormHelperText>
																	)}
																</Stack>
															</Grid>
															<Grid item xs={12}>
																<Stack spacing={1}>
																	<ReactSelectMui
																		label={t('Select Worker')}
																		options={workers}
																		handleSelectDropdown={
																			handleSelectWorkerDropdown
																		}
																		selectedDropdown={
																			selectedDropdownWorker
																		}
																	/>
																	{workerDropdownError && (
																		<FormHelperText
																			error
																			id="standard-weight-helper-text-selectWorker"
																		>
																			{t('Please select a Worker')}
																		</FormHelperText>
																	)}
																</Stack>
															</Grid>
															<Grid item xs={12}>
																<Stack spacing={1}>
																	<FormControl fullWidth>
																		<InputLabel id="demo-simple-select-label">
																			{t('Appointment Status')}
																		</InputLabel>
																		<Select
																			labelId="demo-simple-select-label"
																			id="demo-simple-select"
																			value={appointmentCurrentStatus}
																			label={t('Appointment Status')}
																			onChange={
																				handleAppointmentChange
																			}
																			displayEmpty
																		>
																			<MenuItem value={"completed"}>
																				{t('Completed')}
																			</MenuItem>
																			<MenuItem value={"pending"}>
																				{t('Pending')}
																			</MenuItem>
																			<MenuItem value={"cancelled"}>
																				{t('Cancelled')}
																			</MenuItem>
																		</Select>
																	</FormControl>
																</Stack>
															</Grid>
															<Grid item xs={12}>
																<Stack spacing={1}>
																	<InputLabel htmlFor="appointmentDescription-signup">
																		{t('Appointment Description')}
																	</InputLabel>
																	<OutlinedInput
																		fullWidth
																		error={Boolean(touched.appointmentDescription && errors.appointmentDescription)}
																		id="appointmentDescription"
																		type="appointmentDescription"
																		value={values.appointmentDescription}
																		name="appointmentDescription"
																		onBlur={handleBlur}
																		onChange={handleChange}
																		placeholder=""
																		inputProps={{}}
																	/>
																	{touched.appointmentDescription && errors.appointmentDescription && (
																		<FormHelperText error id="helper-text-appointmentDescription-signup">
																			{errors.appointmentDescription}
																		</FormHelperText>
																	)}
																</Stack>
															</Grid>
															<Grid item xs={12}>
																{errors.submit && (
																	<Grid item xs={12}>
																		<FormHelperText error>
																			{errors.submit}
																		</FormHelperText>
																	</Grid>
																)}
																<Button
																	type="submit"
																	disabled={isSubmitting}
																	sx={{ mt: "20px" }}
																	variant="contained"
																>
																	{t('Add New Appointment')}
																</Button>
															</Grid>
														</Grid>
													</form>
												)}
											</Formik>
										</Box>
									</Box>
								</Box>
							</Grid>
						</Grid>
					</Box>
				</Grid>
			</Grid>
		</>
	);
}

export default AppointmentForm;
