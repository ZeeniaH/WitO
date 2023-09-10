import React, { useState } from "react";
import { Button, Grid, TextField, FormHelperText, Stack } from "@mui/material";
import { Box } from "@mui/system";
import dayjs from "dayjs";
import styles from "./userList.module.scss";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { useAuthContext } from "../../../hooks/useAuthContext";
import { useNavigate } from "react-router-dom";

// third party
import * as Yup from "yup";
import { Formik } from "formik";
import { BASE_URL } from "config";
import { setLoading } from "redux/actionCreators/loadingActionCreators";
import { useDispatch } from "react-redux";

const index = () => {
	const { user } = useAuthContext();

	const navigate = useNavigate();
	const dispatch = useDispatch();

	const [datePicker, setDatePicker] = useState(dayjs("2014-08-18T21:11:54"));

	return (
		<>
			<Box
				sx={{
					width: "100%",
					minHeight: "100vh",
				}}
				className={styles.userrFormSection}
			>
				<Grid container spacing={2}>
					<Grid item xs={12}>
						<Box className={styles.rightSideSection}>
							<Box component={"h2"}>Add New Userr</Box>
							<Box className={styles.addUserrFieldsBody}>
								<Box className={styles.userrFields}>
									<Formik
										enableReinitialize={true}
										initialValues={{
											selectCompany: "",
											email: "",
											// personalNumber: "",
											telephoneNumber: "",
											firstName: "",
											lastName: "",
											datePicker: datePicker,
											placeOfBirth: "",
											nationalities: "",
											houseNumber: "",
											postCode: "",
											taxId: "",
											taxClass: "",
											socialSecurityNumber: "",
											healthInsurance: "",
											children: "",
											bankAccountNumber: "",
											nameOfBank: "",
											submit: null,
										}}
										validationSchema={Yup.object().shape({
											selectCompany: Yup.string()
												.max(50,"maximum 50 characters")
												.required("Company Name is required"),
											email: Yup.string()
												.email("Must be a valid email")
												.max(50,"maximum 50 characters")
												.required("Email is required"),
											// personalNumber: Yup.string()
											// 	.max(50,"maximum 50 characters")
											// 	.required("Phone Number required"),
											firstName: Yup.string()
												.max(50,"maximum 50 characters")
												.required("First Name required"),
											lastName: Yup.string()
												.max(50,"maximum 50 characters")
												.required("Last Name required"),
											telephoneNumber: Yup.string()
												.max(50,"maximum 50 characters")
												.required("Telephone Number is required"),
											datePicker: Yup.string()
												.max(50,"maximum 50 characters")
												.required("Date of Birth is required"),
											placeOfBirth: Yup.string()
												.max(50,"maximum 50 characters")
												.required("Place of birth is required"),
											houseNumber: Yup.string()
												.max(50,"maximum 50 characters")
												.required("House Number is required"),
											postCode: Yup.string()
												.max(50,"maximum 50 characters")
												.required("Postal Code is required"),
											taxId: Yup.string()
												.max(50,"maximum 50 characters")
												.required("Tax Id is required"),
											taxClass: Yup.string()
												.max(50,"maximum 50 characters")
												.required("Tax Class is required"),
											socialSecurityNumber: Yup.string()
												.max(50,"maximum 50 characters")
												.required("Social Security Number is required"),
											healthInsurance: Yup.string()
												.max(50,"maximum 50 characters")
												.required("Health Insurance is required"),
											children: Yup.string()
												.max(50,"maximum 50 characters")
												.required("Number of children is required"),
											bankAccountNumber: Yup.string()
												.max(50,"maximum 50 characters")
												.required("Bank account number is required"),
											nameOfBank: Yup.string()
												.max(50,"maximum 50 characters")
												.required("Name of bank is required"),
										})}
										onSubmit={async (
											values,
											{ setErrors, setStatus, setSubmitting }
										) => {
											dispatch(setLoading(true));
											const nationalities = values.nationalities
												.split(",")
												.map((item) => item.trim());
											const userr = {
												selectCompany: values.selectCompany,
												email: values.email,
												// personalNumber: values.personalNumber,
												telephoneNumber: values.telephoneNumber,
												firstName: values.firstName,
												lastName: values.lastName,
												placeOfBirth: values.placeOfBirth,
												// nationalities: nationalities,
												houseNumber: values.houseNumber,
												postCode: values.postCode,
												taxId: values.taxId,
												taxClass: values.taxClass,
												socialSecurityNumber: values.socialSecurityNumber,
												healthInsurance: values.healthInsurance,
												children: values.children,
												bankAccountNumber: values.bankAccountNumber,
												nameOfBank: values.nameOfBank,
											};

											const response = await fetch(
												`${BASE_URL}/userr/add-new-userr`,
												{
													method: "POST",
													headers: {
														"Content-Type": "application/json",
														Authorization: `Bearer ${user.tokens.access.token}`,
													},
													body: JSON.stringify(userr),
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
												navigate("/dashboard/users");
											}
											dispatch(setLoading(false));
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
															<TextField
																id="selectCompany"
																label="Company Name"
																type="text"
																value={values.selectCompany}
																onBlur={handleBlur}
																onChange={handleChange}
																error={Boolean(
																	touched.selectCompany &&
																	errors.selectCompany
																)}
															/>
															{touched.selectCompany &&
																errors.selectCompany && (
																	<FormHelperText
																		error
																		id="standard-weight-helper-text-selectCompany"
																	>
																		{errors.selectCompany}
																	</FormHelperText>
																)}
														</Stack>
													</Grid>
													{/* <Grid item xs={12}>
														<Stack spacing={1}>
															<TextField
																id="personalNumber"
																label="Personal Number: (Unique)"
																type="tel"
																value={values.personalNumber}
																onBlur={handleBlur}
																onChange={handleChange}
																error={Boolean(
																	touched.personalNumber &&
																	errors.personalNumber
																)}
															/>
															{touched.personalNumber &&
																errors.personalNumber && (
																	<FormHelperText
																		error
																		id="standard-weight-helper-text-personalNumber"
																	>
																		{errors.personalNumber}
																	</FormHelperText>
																)}
														</Stack>
													</Grid> */}
													<Grid item xs={12}>
														<Stack spacing={1}>
															<TextField
																id="firstName"
																label="First Name"
																type="text"
																value={values.firstName}
																onBlur={handleBlur}
																onChange={handleChange}
																error={Boolean(
																	touched.firstName &&
																	errors.firstName
																)}
															/>
															{touched.firstName &&
																errors.firstName && (
																	<FormHelperText
																		error
																		id="standard-weight-helper-text-firstName"
																	>
																		{errors.firstName}
																	</FormHelperText>
																)}
														</Stack>
													</Grid>
													<Grid item xs={12}>
														<Stack spacing={1}>
															<TextField
																id="lastName"
																label="Last Name"
																type="text"
																value={values.lastName}
																onBlur={handleBlur}
																onChange={handleChange}
																error={Boolean(
																	touched.lastName &&
																	errors.lastName
																)}
															/>
															{touched.lastName &&
																errors.lastName && (
																	<FormHelperText
																		error
																		id="standard-weight-helper-text-lastName"
																	>
																		{errors.lastName}
																	</FormHelperText>
																)}
														</Stack>
													</Grid>
													<Grid item xs={12}>
														<Stack spacing={1}>
															<TextField
																id="telephoneNumber"
																label="Telephone Number"
																type="tel"
																value={values.telephoneNumber}
																onBlur={handleBlur}
																onChange={handleChange}
																error={Boolean(
																	touched.telephoneNumber &&
																	errors.telephoneNumber
																)}
															/>
															{touched.telephoneNumber &&
																errors.telephoneNumber && (
																	<FormHelperText
																		error
																		id="standard-weight-helper-text-telephoneNumber"
																	>
																		{errors.telephoneNumber}
																	</FormHelperText>
																)}
														</Stack>
													</Grid>
													<Grid item xs={12}>
														<Stack spacing={1}>
															<LocalizationProvider
																dateAdapter={AdapterDayjs}
															>
																<DatePicker
																	disableFuture
																	label="Responsive"
																	openTo="year"
																	views={["year", "month", "day"]}
																	value={values.datePicker}
																	onChange={(newValue) => {
																		setDatePicker(newValue);
																		handleChange;
																	}}
																	renderInput={(params) => (
																		<TextField {...params} />
																	)}
																/>
																{touched.datePicker &&
																	errors.datePicker && (
																		<FormHelperText
																			error
																			id="standard-weight-helper-text-datePicker"
																		>
																			{errors.datePicker}
																		</FormHelperText>
																	)}
															</LocalizationProvider>
														</Stack>
													</Grid>
													<Grid item xs={12}>
														<Stack spacing={1}>
															<TextField
																id="placeOfBirth"
																label="Place of Birth"
																type="text"
																value={values.placeOfBirth}
																onBlur={handleBlur}
																onChange={handleChange}
																error={Boolean(
																	touched.placeOfBirth &&
																	errors.placeOfBirth
																)}
															/>
															{touched.placeOfBirth &&
																errors.placeOfBirth && (
																	<FormHelperText
																		error
																		id="standard-weight-helper-text-placeOfBirth"
																	>
																		{errors.placeOfBirth}
																	</FormHelperText>
																)}
														</Stack>
													</Grid>
													<Grid item xs={12}>
														<Stack spacing={1}>
															<TextField
																id="nationalities"
																label="Nationalities"
																type="text"
																value={values.nationalities}
																onBlur={handleBlur}
																onChange={handleChange}
																error={Boolean(
																	touched.nationalities &&
																	errors.nationalities
																)}
															/>
															{touched.nationalities &&
																errors.nationalities && (
																	<FormHelperText
																		error
																		id="standard-weight-helper-text-nationalities"
																	>
																		{errors.nationalities}
																	</FormHelperText>
																)}
														</Stack>
													</Grid>
													<Grid item xs={12}>
														<Stack spacing={1}>
															<TextField
																id="houseNumber"
																label="Street / House Number"
																type="text"
																value={values.houseNumber}
																onBlur={handleBlur}
																onChange={handleChange}
																error={Boolean(
																	touched.houseNumber &&
																	errors.houseNumber
																)}
															/>
															{touched.houseNumber &&
																errors.houseNumber && (
																	<FormHelperText
																		error
																		id="standard-weight-helper-text-houseNumber"
																	>
																		{errors.houseNumber}
																	</FormHelperText>
																)}
														</Stack>
													</Grid>
													<Grid item xs={12}>
														<Stack spacing={1}>
															<TextField
																id="postCode"
																label="Postal Code / Place"
																type="text"
																value={values.postCode}
																onBlur={handleBlur}
																onChange={handleChange}
																error={Boolean(
																	touched.postCode &&
																	errors.postCode
																)}
															/>
															{touched.postCode &&
																errors.postCode && (
																	<FormHelperText
																		error
																		id="standard-weight-helper-text-postCode"
																	>
																		{errors.postCode}
																	</FormHelperText>
																)}
														</Stack>
													</Grid>
													<Grid item xs={12}>
														<Stack spacing={1}>
															<TextField
																id="taxId"
																label="Tax ID"
																type="text"
																value={values.taxId}
																onBlur={handleBlur}
																onChange={handleChange}
																error={Boolean(
																	touched.taxId && errors.taxId
																)}
															/>
															{touched.taxId && errors.taxId && (
																<FormHelperText
																	error
																	id="standard-weight-helper-text-taxId"
																>
																	{errors.taxId}
																</FormHelperText>
															)}
														</Stack>
													</Grid>
													<Grid item xs={12}>
														<Stack spacing={1}>
															<TextField
																id="taxClass"
																label="Tax Class"
																type="text"
																value={values.taxClass}
																onBlur={handleBlur}
																onChange={handleChange}
																error={Boolean(
																	touched.taxClass &&
																	errors.taxClass
																)}
															/>
															{touched.taxClass &&
																errors.taxClass && (
																	<FormHelperText
																		error
																		id="standard-weight-helper-text-taxClass"
																	>
																		{errors.taxClass}
																	</FormHelperText>
																)}
														</Stack>
													</Grid>
													<Grid item xs={12}>
														<Stack spacing={1}>
															<TextField
																id="socialSecurityNumber"
																label="Social Security Number"
																type="text"
																value={values.socialSecurityNumber}
																onBlur={handleBlur}
																onChange={handleChange}
																error={Boolean(
																	touched.socialSecurityNumber &&
																	errors.socialSecurityNumber
																)}
															/>
															{touched.socialSecurityNumber &&
																errors.socialSecurityNumber && (
																	<FormHelperText
																		error
																		id="standard-weight-helper-text-socialSecurityNumber"
																	>
																		{
																			errors.socialSecurityNumber
																		}
																	</FormHelperText>
																)}
														</Stack>
													</Grid>
													<Grid item xs={12}>
														<Stack spacing={1}>
															<TextField
																id="healthInsurance"
																label="Health Insurance"
																type="text"
																value={values.healthInsurance}
																onBlur={handleBlur}
																onChange={handleChange}
																error={Boolean(
																	touched.healthInsurance &&
																	errors.healthInsurance
																)}
															/>
															{touched.healthInsurance &&
																errors.healthInsurance && (
																	<FormHelperText
																		error
																		id="standard-weight-helper-text-healthInsurance"
																	>
																		{errors.healthInsurance}
																	</FormHelperText>
																)}
														</Stack>
													</Grid>
													<Grid item xs={12}>
														<Stack spacing={1}>
															<TextField
																id="children"
																label="Children, if so, how much"
																type="text"
																value={values.children}
																onBlur={handleBlur}
																onChange={handleChange}
																error={Boolean(
																	touched.children &&
																	errors.children
																)}
															/>
															{touched.children &&
																errors.children && (
																	<FormHelperText
																		error
																		id="standard-weight-helper-text-children"
																	>
																		{errors.children}
																	</FormHelperText>
																)}
														</Stack>
													</Grid>
													<Grid item xs={12}>
														<Stack spacing={1}>
															<TextField
																id="bankAccountNumber"
																label="Bank Account Number"
																type="text"
																value={values.bankAccountNumber}
																onBlur={handleBlur}
																onChange={handleChange}
																error={Boolean(
																	touched.bankAccountNumber &&
																	errors.bankAccountNumber
																)}
															/>
															{touched.bankAccountNumber &&
																errors.bankAccountNumber && (
																	<FormHelperText
																		error
																		id="standard-weight-helper-text-bankAccountNumber"
																	>
																		{errors.bankAccountNumber}
																	</FormHelperText>
																)}
														</Stack>
													</Grid>
													<Grid item xs={12}>
														<Stack spacing={1}>
															<TextField
																id="nameOfBank"
																label="Name of the Bank"
																type="text"
																value={values.nameOfBank}
																onBlur={handleBlur}
																onChange={handleChange}
																error={Boolean(
																	touched.nameOfBank &&
																	errors.nameOfBank
																)}
															/>
															{touched.nameOfBank &&
																errors.nameOfBank && (
																	<FormHelperText
																		error
																		id="standard-weight-helper-text-nameOfBank"
																	>
																		{errors.nameOfBank}
																	</FormHelperText>
																)}
														</Stack>
													</Grid>
													<Grid item xs={12}>
														<Stack spacing={1}>
															<Button
																sx={{
																	width: "100%",
																	p: "0",
																	border: "1px solid #bbb5b5",
																}}
																variant="outlined"
																component="label"
															>
																<Box className={styles.fileSelect}>
																	<Box
																		className={
																			styles.fileSelectButton
																		}
																	>
																		Userr Picture
																	</Box>
																	<Box
																		className={
																			styles.fileSelectName
																		}
																	></Box>
																</Box>
																<input
																	hidden
																	accept="image/*"
																	multiple
																	type="file"
																/>
															</Button>
														</Stack>
													</Grid>
													<Grid item xs={12}>
														<Stack spacing={1}>
															<TextField
																id="email"
																label="E-mail"
																type="email"
																value={values.email}
																onBlur={handleBlur}
																onChange={handleChange}
																error={Boolean(
																	touched.email && errors.email
																)}
															/>
															{touched.email && errors.email && (
																<FormHelperText
																	error
																	id="standard-weight-helper-text-email"
																>
																	{errors.email}
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
															Add New Userr
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
		</>
	);
};
export default index;
