import {
	Box,
	Button,
	Card,
	CardContent,
	TextField,
	InputAdornment,
	SvgIcon,
	Typography,
} from "@mui/material";
import { Search as SearchIcon } from "../../icons/search";
import { Link } from "react-router-dom";

export const BookKeeperHireRequestListToolbar = ({ setBookKeeperQuery, companyId }) => (
	<Box>
		<Box
			sx={{
				alignItems: "center",
				display: "flex",
				justifyContent: "space-between",
				flexWrap: "wrap",
				m: -1,
			}}
		>
			<Typography sx={{ m: 1 }} variant="h4">
				Hire Requests
			</Typography>
			{/* <Box sx={{ m: 1 }}>
				<Link to={`/home/bookkeepers/${companyId}`} style={{ textDecoration: "none" }}>
					<Button color="primary" variant="contained">
						Hired BookKeepers
					</Button>
				</Link>
			</Box> */}
		</Box>
		{/* <Box sx={{ mt: 3 }}>
			<Card>
				<CardContent>
					<Box sx={{ maxWidth: 500 }}>
						<TextField
							fullWidth
							InputProps={{
								startAdornment: (
									<InputAdornment position="start">
										<SvgIcon color="action" fontSize="small">
											<SearchIcon />
										</SvgIcon>
									</InputAdornment>
								),
							}}
							placeholder="Search By BookKeeper Account Status"
							variant="outlined"
							onChange={(e) => setBookKeeperQuery(e.target.value)}
						/>
					</Box>
				</CardContent>
			</Card>
		</Box> */}
	</Box>
);
