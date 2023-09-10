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
import { useTranslation } from 'react-i18next';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import useGoBack from '../../hooks/useGoBack';


export const UsersListToolbar = ({ setUserQuery }) => {
	const { t } = useTranslation();
	return (
		<Box>
			<Button
				sx={{ fontSize: "12px", mb: "10px" }}
				variant="outlined"
				onClick={useGoBack}
				startIcon={<ArrowBackIcon />}
			>
				{t('Back')}
			</Button>
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
					{t('Users')}
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
					<Link to="/dashboard/users/add-user" style={{ textDecoration: "none" }}>
						<Button color="primary" variant="contained">
							{t('Add New Admin')}
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
								placeholder={t('Search By User Role')}
								variant="outlined"
								onChange={(e) => setUserQuery(e.target.value)}
							/>
						</Box>
					</CardContent>
				</Card>
			</Box>
		</Box>
	)
};
