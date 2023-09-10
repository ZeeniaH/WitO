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
import { Upload as UploadIcon } from "../../icons/upload";
import { Download as DownloadIcon } from "../../icons/download";
import { Link } from "react-router-dom";

export const WorkersListToolbar = ({ setWorkerQuery }) => (
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
				Workers
			</Typography>
			<Box sx={{ m: 1 }}>
				{/* <Button
            startIcon={(<UploadIcon fontSize="small" />)}
            sx={{ mr: 1 }}
          >
            Import
          </Button>
          <Button
            startIcon={(<DownloadIcon fontSize="small" />)}
            sx={{ mr: 1 }}
          >
            Export
          </Button> */}
				<Link to="/home/add-worker" style={{ textDecoration: "none" }}>
					<Button color="primary" variant="contained">
						Add New Worker
					</Button>
				</Link>
			</Box>
		</Box>
		<Box sx={{ mt: 3 }}>
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
							placeholder="Search By Worker Name"
							variant="outlined"
							onChange={(e) => setWorkerQuery(e.target.value)}
						/>
					</Box>
				</CardContent>
			</Card>
		</Box>
	</Box>
);
