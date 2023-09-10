import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

// material-ui
import {
	Button,
	Checkbox,
	Divider,
	FormControlLabel,
	FormHelperText,
	Grid,
	// Link,
	IconButton,
	InputAdornment,
	InputLabel,
	OutlinedInput,
	Stack,
	Typography,
} from "@mui/material";

// third party
import * as Yup from "yup";
import { Formik } from "formik";

// project import
import FirebaseSocial from "./FirebaseSocial";
import AnimateButton from "components/@extended/AnimateButton";

// assets
import { EyeOutlined, EyeInvisibleOutlined } from "@ant-design/icons";
import { useAuthContext } from "hooks/useAuthContext";
import { BASE_URL } from "config";
import { setLoading } from "redux/actionCreators/loadingActionCreators";
import { useDispatch } from "react-redux";
import { useTranslation } from 'react-i18next';
// ============================|| FIREBASE - LOGIN ||============================ //

const AuthLogin = () => {
	const { t } = useTranslation();
	const user = JSON.parse(localStorage.getItem("user"));
	const [checked, setChecked] = useState(false);
	const reduxDispatch = useDispatch();

	const [showPassword, setShowPassword] = React.useState(false);
	const handleClickShowPassword = () => {
		setShowPassword(!showPassword);
	};

	const handleMouseDownPassword = (event) => {
		event.preventDefault();
	};

	const { dispatch } = useAuthContext();
	const navigate = useNavigate();
	const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
	useEffect(() => {
		if (user?.user?.role === "Admin") {
			navigate("/dashboard/default");
		} else if (user?.user?.role === "CompanyOwner") {
			navigate("/home/default");
		} else if (user?.user?.role === "BookKeeper") {
			navigate("/home/default");
		} else if (user?.user?.role === "Worker") {
			navigate("/pwa/user-profile");
		}
	}, [user]);

	return (
		<>
			<Formik
				initialValues={{
					email: "",
					password: "",
					submit: null,
				}}
				validationSchema={Yup.object().shape({
					email: Yup.string()
						.email(t("Must be a valid email"))
						.max(50, t("maximum 50 characters"))
						.required(t("Email is required")),
					password: Yup.string()
						.max(50, t("maximum 50 characters"))
						.required(t("Password is required")),
				})}
				onSubmit={async (
					values,
					{ setErrors, setStatus, setSubmitting }
				) => {
					reduxDispatch(setLoading(true));
					setSubmitting(true);

					const { email, password } = values;
					const response = await fetch(`${BASE_URL}/auth/login`, {
						method: "POST",
						headers: { "Content-Type": "application/json" },
						body: JSON.stringify({ email, password }),
					});
					const json = await response.json();
					if (!response.ok) {
						setStatus({ success: false });
						setErrors({ submit: json.message });
						setSubmitting(false);
					}
					if (response.ok) {
						localStorage.setItem("user", JSON.stringify(json));
						localStorage.removeItem("selectedVehicle");

						dispatch({ type: "LOGIN", payload: json });
						setStatus({ success: true });
						setSubmitting(false);
						if (json?.user?.role === "Admin") {
							navigate("/dashboard/default");
						} else if (json?.user?.role === "CompanyOwner") {
							navigate("/home/default");
						} else if (json?.user?.role === "BookKeeper") {
							navigate("/home/default");
						} else if (json?.user?.role === "Worker" && isMobile) {
							navigate("/pwa/user-profile");
						}
						// else if (json?.user?.role === "Worker" && !isMobile) {
						// 	setErrors({ submit: "Worker login is not allowed in web" });
						// 	setSubmitting(false);
						// }
						// else if (
						// 	["Admin", "BookKeeper"].includes(json?.user?.role) &&
						// 	isMobile
						// ) {
						// 	setErrors({
						// 		submit: "Admin, and BookKeeper login is not allowed in mobile PWA app",
						// 	});
						// 	setSubmitting(false);
						// }
					}
					reduxDispatch(setLoading(false));
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
									<InputLabel htmlFor="email-login">{t('Email Address')}</InputLabel>
									<OutlinedInput
										id="email-login"
										type="email"
										value={values.email}
										name="email"
										onBlur={handleBlur}
										onChange={handleChange}
										placeholder={t('Enter email address')}
										fullWidth
										error={Boolean(touched.email && errors.email)}
									/>
									{touched.email && errors.email && (
										<FormHelperText
											error
											id="standard-weight-helper-text-email-login"
										>
											{errors.email}
										</FormHelperText>
									)}
								</Stack>
							</Grid>
							<Grid item xs={12}>
								<Stack spacing={1}>
									<InputLabel htmlFor="password-login">{t('Password')}</InputLabel>
									<OutlinedInput
										fullWidth
										error={Boolean(touched.password && errors.password)}
										id="-password-login"
										type={showPassword ? "text" : "password"}
										value={values.password}
										name="password"
										onBlur={handleBlur}
										onChange={handleChange}
										endAdornment={
											<InputAdornment position="end">
												<IconButton
													aria-label="toggle password visibility"
													onClick={handleClickShowPassword}
													onMouseDown={handleMouseDownPassword}
													edge="end"
													size="large"
												>
													{showPassword ? (
														<EyeOutlined />
													) : (
														<EyeInvisibleOutlined />
													)}
												</IconButton>
											</InputAdornment>
										}
										placeholder={t('Enter Password')}
									/>
									{touched.password && errors.password && (
										<FormHelperText
											error
											id="standard-weight-helper-text-password-login"
										>
											{errors.password}
										</FormHelperText>
									)}
								</Stack>
							</Grid>

							<Grid item xs={12} sx={{ mt: -1 }}>
								<Stack
									direction="row"
									justifyContent="space-between"
									alignItems="center"
									spacing={2}
								>
									<FormControlLabel
										control={
											<Checkbox
												checked={checked}
												onChange={(event) =>
													setChecked(event.target.checked)
												}
												name="checked"
												color="primary"
												size="small"
											/>
										}
										label={
											<Typography variant="h6">{t('Keep me sign in')}</Typography>
										}
									/>
									<Link
										variant="h6"
										to="/forgot-password"
										style={{ color: "#7206ef" }}
									>
										{t('Forgot Password?')}
									</Link>
								</Stack>
							</Grid>
							{errors.submit && (
								<Grid item xs={12}>
									<FormHelperText error>{errors.submit}</FormHelperText>
								</Grid>
							)}
							<Grid item xs={12}>
								<AnimateButton>
									<Button
										disableElevation
										disabled={isSubmitting}
										fullWidth
										size="large"
										type="submit"
										variant="contained"
										color="primary"
									>
										{t('Login')}
									</Button>
								</AnimateButton>
							</Grid>
							<Grid item xs={12}>
								<Divider style={{ borderColor: "#7e7a7a", width: "250px", margin: "auto" }} />
							</Grid>
							<Grid item xs={12}>
								<AnimateButton>
									<Link to="/register-book-keeper" style={{ textDecoration: "none" }}>
										<Button
											fullWidth
											size="large"
											variant="contained"
											color="primary"
										>
											{t('Register BookKeeper')}
										</Button>
									</Link>
								</AnimateButton>
							</Grid>
							<Grid item xs={12}>
								<AnimateButton>
									<Link to="/register-companyowner" style={{ textDecoration: "none" }}>
										<Button
											fullWidth
											size="large"
											variant="contained"
											color="primary"
										>
											{t('Register CompanyOwner')}
										</Button>
									</Link>
								</AnimateButton>
							</Grid>
						</Grid>
					</form>
				)}
			</Formik >
		</>
	);
};

export default AuthLogin;