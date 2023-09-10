import React, { useState } from "react";
import { Box, Container } from "@mui/material";
import { WorkersListResults } from "../../components/workers/workers-list-results";
import { WorkersListToolbar } from "../../components/workers/workers-list-toolbar";
import { useParams } from "react-router-dom";

const Workers = () => {
	const [workerQuery, setWorkerQuery] = useState();
	const params = useParams();
	return (
		<>
			<Container
				sx={{
					paddingLeft: {
						xs: "80px",
						md: "16px"

					}
				}} maxWidth={false}>
				<WorkersListToolbar setWorkerQuery={setWorkerQuery} id={params.id} />
				<Box sx={{ mt: 3 }}>
					<WorkersListResults workerQuery={workerQuery} id={params.id} />
				</Box>
			</Container>
		</>
	);
};

export default Workers;
