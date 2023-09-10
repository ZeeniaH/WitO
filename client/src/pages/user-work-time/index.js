import React, { useState } from "react";
import { Box, Container, Grid } from "@mui/material";
import { WorkerTimeListResults } from "../../userComponents/WorkTimes/work-time-list-results";
import { WorkerTimeListToolbar } from "../../userComponents/WorkTimes/work-time-list-toolbar";
import Header from "../../userComponents/Header"
import WorkerAsideBar from "../../userComponents/Worker/WorkerAsideBar";
import { useParams } from "react-router-dom";

const WorkTime = () => {
	const [workerQuery, setWorkerQuery] = useState();
	const params = useParams();
	return (
		<>
			<Header />
			<Grid position="relative" container spacing={2}>
				<Grid item xs>
					<Box sx={{ mt: "20px" }}>
						<Container maxWidth={false}>
							<WorkerTimeListToolbar setWorkerQuery={setWorkerQuery} id={params.companyId} />
							<Box sx={{ mt: 3 }}>
								<WorkerTimeListResults workerQuery={workerQuery} companyId={params.companyId} workerId={params.workerId} />
							</Box>
						</Container>
					</Box>
				</Grid>
			</Grid>
		</>
	);
};

export default WorkTime;
