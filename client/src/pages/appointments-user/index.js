import React, { useState } from "react";
import { Box, Container, Grid } from "@mui/material";
import { AppointmentsListResults } from "../../userComponents/Appointments/appointments-list-results";
import { AppointmentsListToolbar } from "../../userComponents/Appointments/appointments-list-toolbar";
import Header from "../../userComponents/Header";
import AppointmentAsideBar from "../../userComponents/Appointment/AppointmentAsideBar";
import { useParams } from "react-router-dom";

const AppointmentsUser = () => {
	const [appointmentQuery, setAppointmentQuery] = useState();
	const params = useParams();
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
					<Box sx={{ mt: "20px" }}>
						<Container
							sx={{
								paddingLeft: {
									xs: "80px",
									md: "16px",
								},
							}}
							maxWidth={false}
						>
							<AppointmentsListToolbar setAppointmentQuery={setAppointmentQuery} companyId={params.id} />
							<Box sx={{ mt: 3 }}>
								<AppointmentsListResults appointmentQuery={appointmentQuery} companyId={params.id} />
							</Box>
						</Container>
					</Box>
				</Grid>
			</Grid>
		</>
	);
};

export default AppointmentsUser;
