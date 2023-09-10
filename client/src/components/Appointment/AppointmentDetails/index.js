import React, { useEffect, useState } from "react";
import { Backdrop, Box, Button, Container, Grid } from "@mui/material";
import styles from "./appointmentDetails.module.scss";
import BusinessIcon from "@mui/icons-material/Business";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import DirectionsCarFilledIcon from "@mui/icons-material/DirectionsCarFilled";
import Header from "../../Header";
import AppointmentAsideBar from "../AppointmentAsideBar";
import PopUpModal from "../../DeletePopUp";
import Slide from "@mui/material/Slide";
import AppointmentEditForm from "../AppointmentEditForm";
import { useParams } from "react-router-dom";
import { BASE_URL } from "config";
import { setLoading } from "redux/actionCreators/loadingActionCreators";
import { useDispatch } from "react-redux";
import { useTranslation } from 'react-i18next';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import useGoBack from '../../../hooks/useGoBack';



const Transition = React.forwardRef(function Transition(props, ref) {
	return <Slide direction="up" ref={ref} {...props} />;
});

function Index() {
	const [appointment, setAppointment] = useState({});
	const params = useParams();
	const dispatch = useDispatch();
	// const { user } = useAuthContext();
	const user = JSON.parse(localStorage.getItem("user"));
	const { t } = useTranslation();

	useEffect(() => {
		const fetchAppointment = async () => {
			dispatch(setLoading(true));
			const response = await fetch(`${BASE_URL}/appointment/${params.id}`, {
				method: "GET",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${user.tokens.access.token}`,
				},
			});
			const json = await response.json();
			console.log(json);
			if (response.ok) {
				setAppointment(json);
			}
			dispatch(setLoading(false));
		};
		fetchAppointment();
	}, []);

	const getStatusColor = () => {
		if (appointment.appointmentStatus === "completed") {
			return "#52c41a";
		}
		else if (appointment.appointmentStatus === "pending") {
			return "#7206ef";
		} else if (appointment.appointmentStatus === "cancelled") {
			return "#ff4d4f";
		} return "";
	};

	return (
		<>
			<Container>
				<Box className={styles.appointmentsDetailsSection}>
					<Grid sx={{ display: "flex", justifyContent: "space-between" }} container spacing={2}>
						<Grid item md={6} xs={12}>
							<Button
								sx={{ fontSize: "12px", mb: "10px" }}
								variant="outlined"
								onClick={useGoBack}
								startIcon={<ArrowBackIcon />}
							>
								{t('Back')}
							</Button>
							<Box className={styles.appointmentHeading} component={"h1"}>
								{t('Appointment Details')}
							</Box>
						</Grid>
						<Grid item md={6} xs={12}>
							<Box
								className={styles.accountStatus}>
								<Box component={"h4"}>{t('Appointment Status')} :</Box>
								<Box sx={{ ml: "10px" }} component={"h6"} style={{ textTransform: "capitalize", backgroundColor: getStatusColor() }}>  {appointment.appointmentStatus}</Box>
							</Box>
						</Grid>
					</Grid>
					<Box
						className={`${styles.appointmentBox} ${styles.appointmentBoxTwo}`}
					>
						<Box className={styles.boxTile} component={"h4"}>{t('Company Details')}</Box>
						<Grid container spacing={2}>
							<Grid item md={6}>
								<Box className={styles.appointmentBoxTwoContent}>
									<table>
										<tbody>
											<tr>
												<th>{t('Company')}</th>
												<td>{appointment.selectCompany}</td>
											</tr>
											<tr className={styles.spacer}></tr>
											<tr>
												<th>{t('Address')}</th>
												<td>{appointment?.companyId?.street}, {appointment?.companyId?.zip}, {appointment?.companyId?.city}</td>
											</tr>
										</tbody>
									</table>
								</Box>
							</Grid>
							<Grid item md={6}>
								<Box className={styles.appointmentBoxTwoContent}>
									<table>
										<tbody>
											<tr>
												<th>{t('Email')}</th>
												<td>{appointment?.companyId?.email}</td>
											</tr>
											<tr className={styles.spacer}></tr>
											<tr>
												<th>{t('Contact No')}.</th>
												<td>{appointment?.companyId?.contactNo}</td>
											</tr>
										</tbody>
									</table>
								</Box>
							</Grid>
						</Grid>
					</Box>
					<Box
						className={`${styles.appointmentBox} ${styles.appointmentBoxTwo}`}
					>
						<Box className={styles.boxTile} component={"h4"}>{t('Vehicle Details')}</Box>
						<Grid container spacing={2}>
							<Grid item md={6}>
								<Box className={styles.appointmentBoxTwoContent}>
									<table>
										<tbody>
											<tr>
												<th>{t('Name')}</th>
												<td>{appointment?.vehicleId?.makeName}</td>
											</tr>
											<tr className={styles.spacer}></tr>
											<tr>
												<th>{t('Model')}</th>
												<td>{appointment?.vehicleId?.model}</td>
											</tr>
										</tbody>
									</table>
								</Box>
							</Grid>
							<Grid item md={6}>
								<Box className={styles.appointmentBoxTwoContent}>
									<table>
										<tbody>
											<tr>
												<th>{t('License Plate')}</th>
												<td>{appointment?.vehicleId?.licensePlate}</td>
											</tr>
											<tr className={styles.spacer}></tr>
											<tr>
												<th>{t('Mileage')}s</th>
												<td>{appointment?.vehicleId?.mileage}</td>
											</tr>
										</tbody>
									</table>
								</Box>
							</Grid>
						</Grid>
					</Box>
					<Box
						className={`${styles.appointmentBox} ${styles.appointmentBoxTwo}`}
					>
						<Box className={styles.boxTile} component={"h4"}>{t('Worker Details')}</Box>
						<Grid container spacing={2}>
							<Grid item md={6}>
								<Box className={styles.appointmentBoxTwoContent}>
									<table>
										<tbody>
											<tr>
												<th>{t('Worker Name')}</th>
												<td>{appointment?.selectWorker}</td>
											</tr>
											<tr className={styles.spacer}></tr>
											<tr>
												<th>{t('Personal Numbers')}</th>
												<td>{appointment?.workerId?.personalNumber}</td>
											</tr>
											<tr className={styles.spacer}></tr>
											<tr>
												<th>{t('Phone Number')}</th>
												<td>{appointment?.workerId?.phoneNumber}</td>
											</tr>

										</tbody>
									</table>
								</Box>
							</Grid>
							<Grid item md={6}>
								<Box className={styles.appointmentBoxTwoContent}>
									<table>
										<tbody>
											<tr>
												<th>{t('Tax ID')}</th>
												<td>{appointment?.workerId?.taxId}</td>
											</tr>
											<tr className={styles.spacer}></tr>
											<tr>
												<th>{t('Name of the Bank')}</th>
												<td>{appointment?.workerId?.nameOfBank}</td>
											</tr>
											<tr className={styles.spacer}></tr>
											<tr>
												<th>{t('Email')}</th>
												<td>{appointment?.workerId?.email}</td>
											</tr>
										</tbody>
									</table>
								</Box>
							</Grid>
						</Grid>
					</Box>
					<Box
						className={`${styles.appointmentBox} ${styles.appointmentBoxTwo}`}
					>
						<Box className={styles.boxTile} component={"h4"}>{t('Further Details')}</Box>
						<Grid container spacing={2}>
							<Grid item md={6}>
								<Box className={styles.appointmentBoxTwoContent}>
									<table>
										<tbody>
											<tr>
												<th> {t('Description')}</th>
												<td>{appointment?.appointmentDescription}</td>
											</tr>
										</tbody>
									</table>
								</Box>
							</Grid>
						</Grid>
					</Box>
				</Box>
			</Container>
		</>
	);
}

export default Index;
