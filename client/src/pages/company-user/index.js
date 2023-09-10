import React from "react";
import { Box, Container, Grid } from "@mui/material";
// import { WorkersListResults } from "../../userComponents/workers/workers-list-results";
import { CompanyListToolbar } from "../../userComponents/company/company-list-toolbar";
import Header from "../../userComponents/Header";
import CompanyAsideBar from "../../userComponents/companies/CompanyAsideBar";

const CompanyUser = () => {
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
					}}
				>
					<CompanyAsideBar />
				</Grid>
				<Grid item xs>
					<Box sx={{ mt: "20px" }}>
						<Container maxWidth={false}>
							<CompanyListToolbar />
							{/* <Box sx={{ mt: 3 }}>
								<WorkersListResults />
							</Box> */}
						</Container>
					</Box>
				</Grid>
			</Grid>
		</>
	);
};

export default CompanyUser;
