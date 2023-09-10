import React, { useState } from "react";
import { Box, Container } from "@mui/material";
import { AppointmentsListResults } from "../../components/Appointments/appointments-list-results";
import { AppointmentsListToolbar } from "../../components/Appointments/appointments-list-toolbar";
import { useParams } from "react-router-dom";

const Appointments = () => {
	const [appointmentQuery, setAppointmentQuery] = useState();
	const params = useParams();
	return (
		<>
			<Container maxWidth={false}>
				<AppointmentsListToolbar setAppointmentQuery={setAppointmentQuery} companyId={params.id} />
				<Box sx={{ mt: 3 }}>
					<AppointmentsListResults appointmentQuery={appointmentQuery} companyId={params.id} />
				</Box>
			</Container>
		</>
	);
};

export default Appointments;
