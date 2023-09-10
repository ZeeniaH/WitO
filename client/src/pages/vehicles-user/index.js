import React, { useState } from "react";
import { Box, Container, Grid } from "@mui/material";
import { VehiclesListResults } from "../../userComponents/vehicles/vehicles-list-results";
import { VehiclesListToolbar } from "../../userComponents/vehicles/vehicles-list-toolbar";
import Header from "../../userComponents/Header";
import VehicleAsideBar from "../../userComponents/Vehicle/VehicleAsideBar";
import { useParams } from "react-router-dom";


const VehiclesUser = () => {
	const [searchVehicleQuery, setSearchVehicleQuery] = useState();
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
					<VehicleAsideBar companyId={params.id} />
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
							<VehiclesListToolbar setSearchVehicleQuery={setSearchVehicleQuery} companyId={params.id} />
							<Box sx={{ mt: 3 }}>
								<VehiclesListResults searchVehicleQuery={searchVehicleQuery} companyId={params.id} />
							</Box>
						</Container>
					</Box>
				</Grid>
			</Grid>
		</>
	);
};

export default VehiclesUser;
