import { useEffect, useRef, useState } from "react";
import { Link as RouterLink, useNavigate, useParams } from "react-router-dom";
import { useTranslation } from 'react-i18next';

// material-ui
import {
	Box,
	Button,
	FormControl,
	FormHelperText,
	Grid,
	IconButton,
	InputAdornment,
	InputLabel,
	OutlinedInput,
	Stack,
	Typography,
	Select,
	MenuItem,
} from "@mui/material";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import useGoBack from '../../../hooks/useGoBack';


// third party
import * as Yup from "yup";
import { Formik } from "formik";

// project import
import AnimateButton from "components/@extended/AnimateButton";
import { strengthColor, strengthIndicator } from "utils/password-strength";

// assets
import { EyeOutlined, EyeInvisibleOutlined } from "@ant-design/icons";
import { useRegister } from "hooks/useRegister";
import { BASE_URL } from "config";
import { useAuthContext } from "hooks/useAuthContext";
import { setLoading } from "redux/actionCreators/loadingActionCreators";
import { useDispatch } from "react-redux";

const index = () => {
	const { t } = useTranslation();
	const [level, setLevel] = useState();
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);
	const { user } = useAuthContext();
	const [userr, setUserr] = useState();
	const params = useParams();

	const navigate = useNavigate();
	const dispatch = useDispatch();

	useEffect(() => {
		const fetchUserr = async () => {
			dispatch(setLoading(true));
			const response = await fetch(`${BASE_URL}/user/${params.id}`, {
				method: "GET",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${user.tokens.access.token}`,
				},
			});
			const json = await response.json();
			if (response.ok) {
				setUserr(json);
			}
			dispatch(setLoading(false));
		};
		fetchUserr();
	}, []);

	const handleClickShowPassword = () => {
		setShowPassword(!showPassword);
	};

	const handleMouseDownPassword = (event) => {
		event.preventDefault();
	};

	const changePassword = (value) => {
		const temp = strengthIndicator(value);
		setLevel(strengthColor(temp));
	};

	const handleClickShowConfirmPassword = () => {
		setShowConfirmPassword(!showConfirmPassword);
	};

	const handleMouseDownConfirmPassword = (event) => {
		event.preventDefault();
	};

	useEffect(() => {
		changePassword("");
	}, []);

	return (
		<>
			<Button
				sx={{ fontSize: "12px", mb: "10px" }}
				variant="outlined"
				onClick={useGoBack}
				startIcon={<ArrowBackIcon />}
			>
				{t('Back')}
			</Button>
			<Box sx={{ maxWidth: "500px", margin: "0 auto" }}>
				<Formik
					enableReinitialize={true}
					initialValues={
						userr
							? {
								name: userr.name,
								email: userr.email,
								password: userr.password,
								confirmPassword: userr.confirmPassword,
								role: userr.role,
								submit: null,
							}
							: {
								name: "",
								email: "",
								password: "",
								confirmPassword: "",
								role: "",
								submit: null,
							}
					}
					validationSchema={Yup.object().shape({
						name: Yup.string()
							.max(50, t("maximum 50 characters"))
							.required(t("Name required")),
						email: Yup.string()
							.email(t("Must be a valid email"))
							.max(50, t("maximum 50 characters"))
							.required(t("Email is required")),
						password: Yup.string()
							.max(50, t("maximum 50 characters"))
							.required(t("Password is required")),
						confirmPassword: Yup.string().oneOf(
							[Yup.ref("password"), null],
							t("Passwords must match")
						),
						role: Yup.string()
							.max(50, t("maximum 50 characters"))
							.required(t("Role is required")),
					})}
					onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
						dispatch(setLoading(true));
						const userr = {
							name: values.name,
							email: values.email,
							password: values.password,
						};

						const response = await fetch(`${BASE_URL}/user/${params.id}`, {
							method: "PATCH",
							headers: {
								"Content-Type": "application/json",
								Authorization: `Bearer ${user.tokens.access.token}`,
							},
							body: JSON.stringify(userr),
						});
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
										<InputLabel htmlFor="name-signup">{t('Name')}</InputLabel>
										<OutlinedInput
											id="name-login"
											type="name"
											value={values.name}
											name="name"
											onBlur={handleBlur}
											onChange={handleChange}
											placeholder=""
											fullWidth
											error={Boolean(touched.name && errors.name)}
										/>
										{touched.name && errors.name && (
											<FormHelperText error id="helper-text-name-signup">
												{t(errors.name)}
											</FormHelperText>
										)}
									</Stack>
								</Grid>
								<Grid item xs={12}>
									<Stack spacing={1}>
										<InputLabel htmlFor="email-signup">
											{t('Email Address')}
										</InputLabel>
										<OutlinedInput
											fullWidth
											error={Boolean(touched.email && errors.email)}
											id="email-login"
											type="email"
											value={values.email}
											name="email"
											onBlur={handleBlur}
											onChange={handleChange}
											placeholder=""
											inputProps={{}}
										/>
										{touched.email && errors.email && (
											<FormHelperText error id="helper-text-email-signup">
												{t(errors.email)}
											</FormHelperText>
										)}
									</Stack>
								</Grid>
								<Grid item xs={12}>
									<Stack spacing={1}>
										<InputLabel htmlFor="password-signup">{t('Password')}</InputLabel>
										<OutlinedInput
											fullWidth
											error={Boolean(touched.password && errors.password)}
											id="password-signup"
											type={showPassword ? "text" : "password"}
											name="password"
											onBlur={handleBlur}
											onChange={(e) => {
												handleChange(e);
												changePassword(e.target.value);
											}}
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
											placeholder=""
										/>
										{touched.password && errors.password && (
											<FormHelperText error id="helper-text-password-signup">
												{t(errors.password)}
											</FormHelperText>
										)}
									</Stack>
									<FormControl fullWidth sx={{ mt: 2 }}>
										<Grid container spacing={2} alignItems="center">
											<Grid item>
												<Box
													sx={{
														backgroundColor: level?.color,
														width: 85,
														height: 8,
														borderRadius: "7px",
													}}
												/>
											</Grid>
											<Grid item>
												<Typography variant="subtitle1" fontSize="0.75rem">
													{t(errors.label)}
												</Typography>
											</Grid>
										</Grid>
									</FormControl>
								</Grid>
								<Grid item xs={12}>
									<Stack spacing={1}>
										<InputLabel htmlFor="confirmPassword-signup">
											{t('Confirm Password')}
										</InputLabel>
										<OutlinedInput
											fullWidth
											error={Boolean(
												touched.confirmPassword && errors.confirmPassword
											)}
											id="confirmPassword-signup"
											type={showConfirmPassword ? "text" : "password"}
											name="confirmPassword"
											onBlur={handleBlur}
											onChange={(e) => {
												handleChange(e);
											}}
											endAdornment={
												<InputAdornment position="end">
													<IconButton
														aria-label="toggle password visibility"
														onClick={handleClickShowConfirmPassword}
														onMouseDown={handleMouseDownConfirmPassword}
														edge="end"
														size="large"
													>
														{showConfirmPassword ? (
															<EyeOutlined />
														) : (
															<EyeInvisibleOutlined />
														)}
													</IconButton>
												</InputAdornment>
											}
											placeholder=""
										/>
										{touched.confirmPassword && errors.confirmPassword && (
											<FormHelperText
												error
												id="helper-text-confirmPassword-signup"
											>
												{t(errors.confirmPassword)}
											</FormHelperText>
										)}
									</Stack>
								</Grid>
								{/* <Grid item xs={12}>
									<Stack spacing={1}>
										<InputLabel htmlFor="role-signup">Role</InputLabel>
										<Select
											fullWidth
											error={Boolean(touched.role && errors.role)}
											id="role-login"
											type="role"
											value={values.role}
											name="role"
											onBlur={handleBlur}
											onChange={handleChange}
										>
											<MenuItem value={"Admin"}>Admin</MenuItem>
											<MenuItem value={"CompanyOwner"}>
												Company Owner
											</MenuItem>
											<MenuItem value={"BookKeeper"}>BookKeeper</MenuItem>
											<MenuItem value={"Worker"}>Worker</MenuItem>
										</Select>
										{touched.role && errors.role && (
											<FormHelperText error id="helper-text-role-signup">
												{errors.role}
											</FormHelperText>
										)}
									</Stack>
								</Grid> */}
								{errors.submit && (
									<Grid item xs={12}>
										<FormHelperText error>{t(errors.submit)}</FormHelperText>
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
											{t('Update User')}
										</Button>
									</AnimateButton>
								</Grid>
							</Grid>
						</form>
					)}
				</Formik>
			</Box>
		</>
	);
};
export default index;
