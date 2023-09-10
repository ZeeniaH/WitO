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
import useGoBack from '../../../../hooks/useGoBack';


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
	const { user } = useAuthContext();
	const [userr, setUserr] = useState();
	const [accountCurrentStatus, setAccountCurrentStatus] = useState("");
	const params = useParams();

	const navigate = useNavigate();
	const dispatch = useDispatch();

	useEffect(() => {
		const fetchUser = async () => {
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
				setAccountCurrentStatus(json.accountStatus);
			}
			dispatch(setLoading(false));
		};
		fetchUser();
	}, []);

	const handleAccountStatusChange = (event) => {
		setAccountCurrentStatus(event.target.value);
	};

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
								accountStatus: userr.accountStatus,
								submit: null,
							}
							: {
								name: "",
								email: "",
								accountStatus: "",
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
						accountStatus: Yup.string()
							.max(50, t("maximum 50 characters"))
							.required(t("Account Status is required")),
					})}
					onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
						dispatch(setLoading(true));
						const userr = {
							name: values.name,
							email: values.email,
							accountStatus: accountCurrentStatus,
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
							navigate("/dashboard/bookkeepers");
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
									<FormControl fullWidth>
										<InputLabel id="demo-simple-select-label">
											{t('Account Status')}
										</InputLabel>
										<Select
											labelId="demo-simple-select-label"
											id="demo-simple-select"
											value={accountCurrentStatus}
											label="Account Status"
											onChange={
												handleAccountStatusChange
											}
											displayEmpty
										>
											<MenuItem value={"pending"}>
												{t('Pending')}
											</MenuItem>
											<MenuItem value={"denied"}>
												{t('Denied')}
											</MenuItem>
											<MenuItem value={"approved"}>
												{t('Approved')}
											</MenuItem>
										</Select>
									</FormControl>
								</Grid>
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
