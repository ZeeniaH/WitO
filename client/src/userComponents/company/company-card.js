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
import React, { useEffect, useRef } from "react";
import IconButton from "@mui/material/IconButton";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import VisibilityIcon from "@mui/icons-material/Visibility";
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
import styles from "./companyCard.module.scss";
import SlideToggle from "react-slide-toggle";
import { useConfirm } from "material-ui-confirm";
import { setLoading } from "redux/actionCreators/loadingActionCreators";
import { useDispatch } from "react-redux";
import { useState } from "react";
import { useTranslation } from 'react-i18next';


export const CompanyCard = ({ company, fetchCompanies, companyCardRef, index, ...rest }) => {
	const [anchorEl, setAnchorEl] = React.useState(null);
	const user = JSON.parse(localStorage.getItem("user"));
	const confirm = useConfirm();
	const dispatch = useDispatch();
	const [companyId, setCompanyId] = useState();
	const slideToggleRef = useRef(null);
	const [toggleFunction, setToggleFunction] = useState();
	const { t } = useTranslation();
	// const companyId = company.id;

	const handleToggle = (expandCollapse) => {
		// setToggleFunction(toggle);
		if (expandCollapse == "toggle") {
			if (slideToggleRef.current) {
				slideToggleRef.current.toggle();
			}
			return "toggle";
		} else if (expandCollapse == "EXPANDED") {
			if (slideToggleRef.current.state.toggleState == "EXPANDED") {
				slideToggleRef.current.toggle();
			}
		}
	};
	useEffect(() => {
		if (slideToggleRef.current) {
			companyCardRef.current[index] = slideToggleRef.current;
		}
	}, [slideToggleRef]);

	useEffect(() => {
		setCompanyId(company.id);
	}, []);

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
		<Box className={styles.companyBox}>
			<SlideToggle
				ref={slideToggleRef}
				collapsed
				duration={800}
				render={({ toggle, setCollapsibleElement, progress }) => (
					<>
						{
							user?.user?.role === "CompanyOwner" ?
								<Box
									sx={{
										textAlign: "right",
										p: 2,
									}}
								>
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
												to={`/home/company/${companyId}`}
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
												to={`/home/edit-company/${companyId}`}
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
								</Box>
								: ""}
						<Box
							className={styles.companyContent}
							onClick={() => {
								handleToggle("toggle");
							}}
						>
							<Box className={styles.companyImage}>
								<Avatar
									sx={{
										width: "90px",
										height: "90px",
									}}
									className={styles.companyAvatar}
									alt="Company"
									src={company.companyLogo}
									variant="square"
								/>
							</Box>
							<Box className={styles.companyTitle}>
								<Box component={"h2"}>{company.companyName}</Box>
							</Box>
						</Box>
						<Box className={styles.dropDownMenu} ref={setCollapsibleElement}>
							<ul>
								<li>
									<Link to={`/home/vehicle-list/${companyId}`}>{t('Vehicles')}</Link>
								</li>
								<li>
									<Link to={`/home/worker-list/${companyId}`}>{t('Workers')}</Link>
								</li>
								<li>
									<Link to={`/home/appointments-list/${companyId}`}>{t('Appointments')}</Link>
								</li>
								<li>
									<Link to={`/home/calendar/${companyId}`}>{t('Calendar')}</Link>
								</li>
								<li>
									<a href={`/home/archive/${companyId}`}>{t('Archive')}</a>
								</li>
								{user?.user?.role === "CompanyOwner" ?
									<li>
										<Link to={`/home/bookkeepers/${companyId}`}>{t('BookKeepers')}</Link>
									</li>
									: ""}
							</ul>
						</Box>
					</>
				)}
			/>
		</Box>
	);
};

CompanyCard.propTypes = {
	company: PropTypes.object.isRequired,
};
