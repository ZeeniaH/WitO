import PropTypes from "prop-types";
import {
	Avatar,
	Box,
	Card,
	CardContent,
	Divider,
	Grid,
	Typography,
	CardHeader,
	Popover,
	Button,
	MenuList,
	MenuItem,
	ListItemIcon,
} from "@mui/material";
import { Clock as ClockIcon } from "../../icons/clock";
import { Download as DownloadIcon } from "../../icons/download";
import React from "react";
import IconButton from "@mui/material/IconButton";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import DraftsIcon from "@mui/icons-material/Drafts";
import SendIcon from "@mui/icons-material/Send";
import PriorityHighIcon from "@mui/icons-material/PriorityHigh";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import EngineeringIcon from "@mui/icons-material/Engineering";
import BookOnlineIcon from "@mui/icons-material/BookOnline";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import ArchiveIcon from "@mui/icons-material/Archive";
import { Link } from "react-router-dom";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { BASE_URL } from "config";
import { useConfirm } from "material-ui-confirm";
import { setLoading } from "redux/actionCreators/loadingActionCreators";
import { useDispatch } from "react-redux";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { useTranslation } from 'react-i18next';

export const CompanyCard = ({ company, fetchCompanies, ...rest }) => {
	const { t } = useTranslation();
	const [anchorEl, setAnchorEl] = React.useState(null);
	const user = JSON.parse(localStorage.getItem("user"));
	const confirm = useConfirm();
	const dispatch = useDispatch();

	const companyId = company.id;

	const handleClick = (event) => {
		setAnchorEl(event.currentTarget);
	};

	const handleClose = () => {
		setAnchorEl(null);
	};

	const open = Boolean(anchorEl);
	const id = open ? "simple-popover" : undefined;

	const handleDelete = async (id) => {
		confirm({
			description: "Are you sure you want to delete this item? You can not undo this action.",
			confirmationText: "yes",
			cancellationText: "No",
		})
			.then(async () => {
				dispatch(setLoading(true));
				const response = await fetch(`${BASE_URL}/company/${id}`, {
					method: "DELETE",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${user.tokens.access.token}`,
					},
				});
				// const json = await response.json();
				if (response.ok) {
					fetchCompanies();
					handleClose();
				}
				dispatch(setLoading(false));
			})
			.catch(() => { });
	};

	return (
		<Card
			sx={{
				display: "flex",
				flexDirection: "column",
				height: "100%",
			}}
			{...rest}
		>
			<CardHeader
				action={
					<>
						<IconButton
							aria-label="settings"
							aria-describedby={id}
							variant="contained"
							onClick={handleClick}
						>
							<MoreVertIcon />
						</IconButton>
						<Popover
							id={id}
							open={open}
							anchorEl={anchorEl}
							onClose={handleClose}
							anchorOrigin={{
								vertical: "bottom",
								horizontal: "right",
							}}
							transformOrigin={{
								vertical: "top",
								horizontal: "right",
							}}
						>
							<MenuList>
								<Link
									to={`/dashboard/vehicles/${companyId}`}
									style={{ textDecoration: "none", color: "inherit" }}
								>
									<MenuItem>
										<ListItemIcon>
											<DirectionsCarIcon fontSize="small" />
										</ListItemIcon>
										<Typography variant="inherit">{t('Vehicles')}</Typography>
									</MenuItem>
								</Link>
								<Link
									to={`/dashboard/workers/${companyId}`}
									style={{ textDecoration: "none", color: "inherit" }}
								>
									<MenuItem>
										<ListItemIcon>
											<EngineeringIcon fontSize="small" />
										</ListItemIcon>
										<Typography variant="inherit">{t('Workers')}</Typography>
									</MenuItem>
								</Link>
								<Link to={`/dashboard/appointments/${companyId}`}
									style={{ textDecoration: "none", color: "inherit" }}
								>
									<MenuItem>
										<ListItemIcon>
											<BookOnlineIcon fontSize="small" />
										</ListItemIcon>
										<Typography variant="inherit">{t('Appointments')}</Typography>
									</MenuItem>
								</Link>

								<a href={`/dashboard/archive/${companyId}`} style={{ textDecoration: "none", color: "inherit" }}>
									<MenuItem>
										<ListItemIcon>
											<ArchiveIcon fontSize="small" />
										</ListItemIcon>
										<Typography variant="inherit">{t('Archive')}</Typography>
									</MenuItem>
								</a>

								<Link
									to={`/dashboard/company/${companyId}`}
									style={{ textDecoration: "none", color: "inherit" }}
								>
									<MenuItem>
										<ListItemIcon>
											<VisibilityIcon fontSize="small" />
										</ListItemIcon>
										<Typography variant="inherit">{t('View')}</Typography>
									</MenuItem>
								</Link>
								<Link
									to={`/dashboard/edit-company/${companyId}`}
									style={{ textDecoration: "none", color: "inherit" }}
								>
									<MenuItem>
										<ListItemIcon>
											<EditIcon fontSize="small" />
										</ListItemIcon>
										<Typography variant="inherit">{t('Edit')}</Typography>
									</MenuItem>
								</Link>
								<MenuItem onClick={() => handleDelete(companyId)}>
									<ListItemIcon>
										<DeleteIcon fontSize="small" />
									</ListItemIcon>
									<Typography variant="inherit">{t('Delete')}</Typography>
								</MenuItem>
							</MenuList>
						</Popover>
					</>
				}
			></CardHeader >
			<CardContent>
				<Box
					sx={{
						display: "flex",
						justifyContent: "center",
						pb: 3,

					}}
				>
					<Avatar sx={{
						width: "90px",
						height: "90px",
					}} alt="Company" src={company.companyLogo} variant="square" />
				</Box>
				<Typography align="center" color="textPrimary" gutterBottom variant="h5">
					{company.companyName}
				</Typography>
				{/* <Typography
        align="center"
        color="textPrimary"
        variant="body1"
      >
        {company.description}
      </Typography> */}
			</CardContent>
			<Box sx={{ flexGrow: 1 }} />
			<Divider />
			<Box sx={{ p: 2 }}>
				<Grid container spacing={2} sx={{ justifyContent: "space-between" }}>
					<Grid
						item
						sx={{
							alignItems: "center",
							display: "flex",
						}}
					>
						{/* <ClockIcon color="action" /> */}
						<Typography
							color="textSecondary"
							display="inline"
							sx={{ pl: 1 }}
							variant="body2"
						>
							{company.businessRegistration}
						</Typography>
					</Grid>
					{/* <Grid
					item
					sx={{
						alignItems: "center",
						display: "flex",
					}}
				>
					<DownloadIcon color="action" />
					<Typography
						color="textSecondary"
						display="inline"
						sx={{ pl: 1 }}
						variant="body2"
					>
						{company.totalDownloads} Downloads
					</Typography>
				</Grid> */}
				</Grid>
			</Box>
		</Card >
	);
};

CompanyCard.propTypes = {
	company: PropTypes.object.isRequired,
};
