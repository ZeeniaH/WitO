import React, { useState } from "react";
import { Box, Container } from "@mui/material";
import { BookKeepersListResults } from "../../components/Users/BookKeeper/bookkeepers-list-results";
import { BookKeepersListToolbar } from "../../components/Users/BookKeeper/bookkeepers-list-toolbar";

const BookKeepers = () => {
	const [bookKeeperQuery, setBookKeeperQuery] = useState();
	return (
		<>
			<Container maxWidth={false}>
				<BookKeepersListToolbar setBookKeeperQuery={setBookKeeperQuery} />
				<Box sx={{ mt: 3 }}>
					<BookKeepersListResults bookKeeperQuery={bookKeeperQuery} />
				</Box>
			</Container>
		</>
	);
};

export default BookKeepers;
