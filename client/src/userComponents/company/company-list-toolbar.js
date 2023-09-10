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
import { Link } from "react-router-dom";
import { Download as DownloadIcon } from "../../icons/download";
import { Search as SearchIcon } from "../../icons/search";
import { Upload as UploadIcon } from "../../icons/upload";
import { useTranslation } from 'react-i18next';

export const CompanyListToolbar = ({ setCompanyQuery }) => {
	const { t } = useTranslation();
	const user = JSON.parse(localStorage.getItem('user'));
	console.log("user", user)
	return (
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
					{t('Companies')}
				</Typography>
				<Box sx={{ m: 1 }}>
					{/* <Button startIcon={<UploadIcon fontSize="small" />} sx={{ mr: 1 }}>
					Import
				</Button>
				<Button startIcon={<DownloadIcon fontSize="small" />} sx={{ mr: 1 }}>
					Export
				</Button> */}
					{
						user?.user?.role === "CompanyOwner" ?
							<Link to="/home/add-company" style={{ textDecoration: "none" }}>
								<Button color="primary" variant="contained">
									{t('Add New Company')}
								</Button>
							</Link> : " "
					}
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
											<SvgIcon fontSize="small" color="action">
												<SearchIcon />
											</SvgIcon>
										</InputAdornment>
									),
								}}
								placeholder={t("Search By Company Name")}
								variant="outlined"
								onChange={(e) => setCompanyQuery(e.target.value)}
							/>
						</Box>
					</CardContent>
				</Card>
			</Box>
		</Box>
	)
};