import React, { useState } from "react";
import { Box, Container, Grid } from "@mui/material";
import { WorkerDataListResults } from "../../userComponents/WorkerData/worker-data-list-results";
import { WorkerDataListToolbar } from "../../userComponents/WorkerData/worker-data-list-toolbar";
import Header from "../../userComponents/Header";
import WorkerAsideBar from "../../userComponents/Worker/WorkerAsideBar";
import { useParams } from "react-router-dom";

const WorkerUser = () => {
	const [workerQuery, setWorkerQuery] = useState();
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
					<WorkerAsideBar companyId={params.id} />
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
							<WorkerDataListToolbar setWorkerQuery={setWorkerQuery} companyId={params.id} />
							<Box sx={{ mt: 3 }}>
								<WorkerDataListResults workerQuery={workerQuery} companyId={params.id} />
							</Box>
						</Container>
					</Box>
				</Grid>
			</Grid>
		</>
	);
};

export default WorkerUser;
