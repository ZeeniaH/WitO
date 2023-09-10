import React, { useState } from "react";
import { Box, Container } from "@mui/material";
import { VehiclesListResults } from "../../components/vehicles/vehicles-list-results";
import { VehiclesListToolbar } from "../../components/vehicles/vehicles-list-toolbar";
import { useParams } from "react-router-dom";

const Vehicles = () => {
	const [searchVehicleQuery, setSearchVehicleQuery] = useState();
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
				<VehiclesListToolbar setSearchVehicleQuery={setSearchVehicleQuery} companyId={params.id} />
				<Box sx={{ mt: 3 }}>
					<VehiclesListResults searchVehicleQuery={searchVehicleQuery} companyId={params.id} />
				</Box>
			</Container>
		</>
	);
};

export default Vehicles;
