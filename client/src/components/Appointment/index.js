import React, { useState } from "react";
import {
	Backdrop,
	Button,
	Divider,
	FormControl,
	Grid,
	InputLabel,
	MenuItem,
	Select,
	TextField,
} from "@mui/material";
import { Box } from "@mui/system";
import styles from "./appointment.module.scss";
import BusinessCenterIcon from "@mui/icons-material/BusinessCenter";

import SegmentSharpIcon from "@mui/icons-material/SegmentSharp";
import "react-select-search/style.css";
import Header from "../Header";
import AppointmentAsideBar from "./AppointmentAsideBar";
import { useAuthContext } from "../../hooks/useAuthContext";
import { setLoading } from "redux/actionCreators/loadingActionCreators";

import { BASE_URL } from "config";
import { useDispatch } from "react-redux";

const WorkersList = () => {
	const { user } = useAuthContext();
	const dispatch = useDispatch();

	const [error, setError] = useState(null);

	const [selectCompany, setSelectCompany] = useState("");
	const [selectCar, setSelectCar] = useState("");
	const [selectWorker, setSelectWorker] = useState("");
	const [appointmentStatus, setAppointmentStatus] = useState("");

	const options = [
		{ name: "Swedish", value: "sv" },
		{ name: "English", value: "en" },
		{
			type: "group",
			name: "Group name",
			items: [{ name: "Spanish", value: "es" }],
		},
	];

	const [open, setOpen] = useState(false);

	const handleDrawerClose = () => {
		setOpen(false);
	};
	const [company, setCompany] = useState("");

	const handleChange = (event) => {
		setCompany(event.target.value);
	};
	const [car, setCar] = React.useState("");

	const handleCarChange = (event) => {
		setCar(event.target.value);
	};
	const [worker, setWorker] = React.useState("");

	const handleWorkerChange = (event) => {
		setWorker(event.target.value);
	};

	const addAppointmentHandler = async (e) => {
		e.preventDefault();
		dispatch(setLoading(true));

		const appointment = {
			selectCar,
			selectCompany,
			selectWorker,
			appointmentStatus,
		};

		const response = await fetch(`${BASE_URL}/appointment/create-appointment`, {
			method: "POST",
			body: JSON.stringify(appointment),
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${user.tokens.access.token}`,
			},
		});
		const json = await response.json();
		if (!response.ok) {
			setError(json.error);
		}
		if (response.ok) {
			setError(null);
			setSelectCar("");
			setSelectCompany("");
			setSelectWorker("");
			setAppointmentStatus("");
		}
		dispatch(setLoading(false));
	};

	return (
		<>
			<Header></Header>
			<Grid position="relative" container spacing={2}>
				<Grid
					item
					xs={2}
					sx={{
						position: {
							md: "static",
							xs: "absolute",
						},
						left: "0",
						top: "0",
						zIndex: "2",
					}}
				>
					<AppointmentAsideBar></AppointmentAsideBar>
				</Grid>
				<Grid item xs={10}>
					<Backdrop open={open} onClick={handleDrawerClose} sx={{ zIndex: 1 }}></Backdrop>
					<Box
						sx={{
							width: "100%",
							minHeight: "100vh",
							py: 5,
							px: {
								xs: 3,
								md: 7,
								lg: 5,
							},
							pl: {
								xs: 10,
								md: "0",
							},
						}}
						className={styles.appointmentFormSection}
					>
						<Grid container spacing={2}>
							<Grid item xs={12}>
								<Box className={styles.rightSideSection}>
									<Box component={"h2"}>Add New Appointment</Box>
									<TextField
										className={styles.textField}
										id="outlined-input"
										label="Company Name"
										type="text"
										value={selectCompany}
										onChange={(e) => setSelectCompany(e.target.value)}
									/>
									<TextField
										className={styles.textField}
										id="outlined-input"
										label="Woker Name"
										type="text"
										value={selectWorker}
										onChange={(e) => setSelectWorker(e.target.value)}
									/>
									<TextField
										className={styles.textField}
										id="outlined-input"
										label="Select Car"
										type="text"
										value={selectCar}
										onChange={(e) => setSelectCar(e.target.value)}
									/>
									<TextField
										className={styles.textField}
										id="outlined-input"
										label="Appointment Status"
										type="text"
										value={appointmentStatus}
										onChange={(e) => setAppointmentStatus(e.target.value)}
									/>
									<Button
										sx={{ mt: "20px" }}
										variant="contained"
										onClick={addAppointmentHandler}
									>
										Add New Vehicle
									</Button>
								</Box>
							</Grid>
						</Grid>
					</Box>
				</Grid>
			</Grid>
		</>
	);
};
export default WorkersList;
