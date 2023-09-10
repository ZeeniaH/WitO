import React, { useState } from "react";
import { Box, Container } from "@mui/material";
import { UsersListResults } from "../../components/Users/users-list-results";
import { UsersListToolbar } from "../../components/Users/users-list-toolbar";

const Users = () => {
	const [userQuery, setUserQuery] = useState();
	return (
		<>
			<Container
				sx={{
					paddingLeft: {
						xs: "80px",
						md: "16px"

					}
				}} maxWidth={false}>
				<UsersListToolbar setUserQuery={setUserQuery} />
				<Box sx={{ mt: 3 }}>
					<UsersListResults userQuery={userQuery} />
				</Box>
			</Container>
		</>
	);
};

export default Users;
