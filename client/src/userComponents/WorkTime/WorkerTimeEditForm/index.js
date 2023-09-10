import React, { useEffect, useState } from "react";
import { Button, Grid, TextField, FormHelperText, Stack, Container, FormControl, FormLabel, RadioGroup, FormControlLabel, Radio } from "@mui/material";
import { Box } from "@mui/system";
import styles from "./workerTimeEditForm.module.scss";
import { useNavigate, useParams } from "react-router-dom";
import Header from "../../Header";
import * as Yup from "yup";
import { Formik } from "formik";
import { setLoading } from "redux/actionCreators/loadingActionCreators";
import { useDispatch } from "react-redux";
import useNumberOnly from "hooks/useNumberOnly";
import { BASE_URL } from 'config';
import socketIOClient from 'socket.io-client';

const index = () => {
	const [trackedTime, setTrackedTime] = useState();
	const params = useParams();

	const navigate = useNavigate();
	const dispatch = useDispatch();

	const user = JSON.parse(localStorage.getItem("user"));

	useEffect(() => {
		const fetchWorker = async () => {
			dispatch(setLoading(true));
			const response = await fetch(`${BASE_URL}/trackTime/${params.id}`, {
				method: "GET",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${user.tokens.access.token}`,
				},
			});
			const json = await response.json();
			if (response.ok) {
				setTrackedTime(json);
			}
			dispatch(setLoading(false));
		};
		fetchWorker();
	}, []);

	return (
		<>
			<Header />
			<Container maxWidth="sm">
				<Box
					sx={{
						width: "100%",
						minHeight: "100vh",
						paddingLeft: {
							xs: "80px",
							md: "16px",
						},
					}}
					className={styles.workerEditFormSection}
				>
					<Box className={styles.rightSideSection}>
						<Box component={"h2"}>Add/Remove Tracked Time</Box>
						<Box className={styles.editWorkerFieldsBody}>
							<Box className={styles.editWorkerFields}>
								<Formik
									enableReinitialize={true}
									initialValues={{
										hours: "0",
										minutes: "0",
										timeType: "add",
										submit: null,
									}}
									validationSchema={Yup.object().shape({
										hours: Yup.string().required("Number of Hours is required")
											.test("valid-hours", "Hours should not be greater than 12", (value) => {
												if (value) {
													const minutes = parseInt(value, 10);
													return minutes >= 0 && minutes <= 12;
												}
												return true; // Allow empty field (optional)
											})
											.max(2, "Hours cannot exceed 2 characters"),
										minutes: Yup.string().required("Number of Minutes is required")
											.test("valid-minutes", "Minutes should not be greater than 59", (value) => {
												if (value) {
													const minutes = parseInt(value, 10);
													return minutes >= 0 && minutes <= 59;
												}
												return true; // Allow empty field (optional)
											})
											.max(2, "Minutes cannot exceed 2 characters"),
									})}
									onSubmit={async (
										values,
										{ setErrors, setStatus, setSubmitting }
									) => {
										dispatch(setLoading(true));

										const originalDate = new Date(trackedTime.timeTracked);
										const hoursToAdd = parseInt(values.hours);
										const minutesToAdd = parseInt(values.minutes);

										if (values.timeType === "add") {
											originalDate.setHours(originalDate.getHours() + hoursToAdd);
											originalDate.setMinutes(originalDate.getMinutes() + minutesToAdd);
										} else if (values.timeType === "remove") {
											originalDate.setHours(originalDate.getHours() - hoursToAdd);
											originalDate.setMinutes(originalDate.getMinutes() - minutesToAdd);
										}

										const updatedDateString = originalDate.toString();

										const minValidDate = new Date("1970-01-01");
										if (originalDate < minValidDate) {
											setErrors({
												minutes: "Updated time cannot be earlier than January 1, 1970",
											});
											setErrors({ submit: "Hours and minutes should not less than tracked hours and minutes." });
											setSubmitting(false);
											dispatch(setLoading(false));
											return;
										}

										const updatedTrackedTime = {
											timeTracked: updatedDateString
										};

										const response = await fetch(
											`${BASE_URL}/trackTime/${trackedTime.workerId}/trackTimes/${params.id}`,
											{
												method: "PATCH",
												headers: {
													"Content-Type": "application/json",
													Authorization: `Bearer ${user.tokens.access.token}`,
												},
												body: JSON.stringify(updatedTrackedTime),
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

											const notifyResponse = await fetch(`${BASE_URL}/notify/create`, {
												method: "POST",
												headers: {
													"Content-Type": "application/json",
													Authorization: `Bearer ${user.tokens.access.token}`,
												},
												body: JSON.stringify({
													isRead: false,
													message: `Edited by ${user.user.name}`,
													heading: "Track Time",
													icon: "time",
													companyId: trackedTime.companyId,
													workerId: user.user.id
												}),
											});
											const notifyJson = await notifyResponse.json();
											if (!notifyResponse.ok) {
												console.error('Failed to create notification:', notifyJson.message);
											}

											navigate(`/home/worker-list/${trackedTime.companyId}/worker-time/${trackedTime.workerId}`);

										}
										dispatch(setLoading(false));
									}}
								>
									{({
										errors,
										handleBlur,
										handleChange,
										setFieldValue,
										handleSubmit,
										isSubmitting,
										touched,
										values,
									}) => (
										<form noValidate onSubmit={handleSubmit}>
											<Grid container spacing={3}>
												<Grid item xs={6}>
													<Stack spacing={1}>
														<TextField
															id="hours"
															label="Hours"
															type="text"
															value={values.hours}
															onBlur={handleBlur}
															onChange={(e) => {
																useNumberOnly(setFieldValue, "hours", e);
															}}
															error={Boolean(touched.hours && errors.hours)}
														/>
														{touched.hours && errors.hours && (
															<FormHelperText
																error
																id="standard-weight-helper-text-hours"
															>
																{errors.hours}
															</FormHelperText>
														)}
													</Stack>
												</Grid>
												<Grid item xs={6}>
													<Stack spacing={1}>
														<TextField
															id="minutes"
															label="Minutes"
															type="text"
															value={values.minutes}
															onBlur={handleBlur}
															onChange={(e) => {
																useNumberOnly(setFieldValue, "minutes", e);
															}}
															error={Boolean(touched.minutes && errors.minutes)}
														/>
														{touched.minutes && errors.minutes && (
															<FormHelperText
																error
																id="standard-weight-helper-text-minutes"
															>
																{errors.minutes}
															</FormHelperText>
														)}
													</Stack>
												</Grid>
												<Grid item xs={12}>
													<FormControl component="fieldset" error={Boolean(touched.timeType && errors.timeType)}>
														<FormLabel component="legend">Time Type</FormLabel>
														<RadioGroup
															row
															aria-label="time-action"
															name="timeType"
															value={values.timeType}
															onChange={handleChange}
														>
															<FormControlLabel value="add" control={<Radio />} label="Add Time" />
															<FormControlLabel value="remove" control={<Radio />} label="Remove Time" />
														</RadioGroup>
														{touched.timeType && errors.timeType && (
															<FormHelperText error>{errors.timeType}</FormHelperText>
														)}
													</FormControl>
												</Grid>
												<Grid item xs={12}>
													{errors.submit && (
														<Grid item xs={12}>
															<FormHelperText error>{errors.submit}</FormHelperText>
														</Grid>
													)}
													<Button
														type="submit"
														disabled={isSubmitting}
														sx={{ mt: "20px", mr: 2 }}
														variant="contained"
													>
														Submit
													</Button>
												</Grid>
											</Grid>
										</form>
									)}
								</Formik>
							</Box>
						</Box>
					</Box>
				</Box>
			</Container>
		</>
	);
};

export default index;
