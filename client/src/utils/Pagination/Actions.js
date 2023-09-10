import React, { useState } from "react";
import { Typography, Popover, MenuList, MenuItem, ListItemIcon, StepButton, StepLabel, styled } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { Link } from "react-router-dom";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { BASE_URL } from "config";
import { useConfirm } from "material-ui-confirm";
import { setLoading } from "redux/actionCreators/loadingActionCreators";
import { useDispatch } from "react-redux";
import VisibilityIcon from '@mui/icons-material/Visibility';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import CheckCircleSharpIcon from '@mui/icons-material/CheckCircleSharp';
import CancelSharpIcon from '@mui/icons-material/CancelSharp';
import ImportExportIcon from '@mui/icons-material/ImportExport';
import AccessTimeFilledIcon from '@mui/icons-material/AccessTimeFilled';
import EventIcon from '@mui/icons-material/Event';
import { useTranslation } from 'react-i18next';

function Actions({ itemId, fetchData, moduleName, actions, navigateLayer, companyId, requestFromCompanyId, }) {
	const [anchorEl, setAnchorEl] = useState();
	const { t } = useTranslation();
	const user = JSON.parse(localStorage.getItem("user"));
	const confirm = useConfirm();
	const dispatch = useDispatch();

	const handleClick = (event) => {
		setAnchorEl(event.currentTarget);
	};

	const handleClose = () => {
		setAnchorEl(null);
	};

	const handleDelete = async (id) => {
		confirm({
			description: "Are you sure you want to delete this item? You can not undo this action.",
			confirmationText: "yes",
			cancellationText: "No",
		})
			.then(async () => {
				dispatch(setLoading(true));
				if (moduleName == 'user' || moduleName == 'bookkeeper') {
					const response = await fetch(`${BASE_URL}/user/${id}`, {
						method: "DELETE",
						headers: {
							"Content-Type": "application/json",
							Authorization: `Bearer ${user.tokens.access.token}`,
						},
					});
					// const json = await response.json();
					if (response.ok) {
						fetchData();
						handleClose();
					}
				} else {
					const response = await fetch(`${BASE_URL}/${moduleName}/${companyId}/${moduleName}s/${id}`, {
						method: "DELETE",
						headers: {
							"Content-Type": "application/json",
							Authorization: `Bearer ${user.tokens.access.token}`,
						},
					});
					// const json = await response.json();
					if (response.ok) {
						fetchData();
						handleClose();
					}
				}
				dispatch(setLoading(false));
			})
			.catch(() => { });
	};

	const handleHire = async (id) => {
		confirm({
			description: "Are you sure you want to Hire this BookKeeper?",
			confirmationText: "yes",
			cancellationText: "No",
		})
			.then(async () => {
				dispatch(setLoading(true));
				var raw = {
					bookKeeperId: id,
					companyId: companyId,
					message: "hire"
				};
				const response = await fetch(`${BASE_URL}/company/hire-bookkeeper`, {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${user.tokens.access.token}`,
					},
					body: JSON.stringify(raw),
				});
				// const json = await response.json();
				if (response.ok) {
					fetchData();
					handleClose();
				}
				dispatch(setLoading(false));
			})
			.catch(() => { });
	};

	const handleAccept = async (id) => {
		confirm({
			description: "Are you sure you want to Accept this Hire Request?",
			confirmationText: "yes",
			cancellationText: "No",
		})
			.then(async () => {
				dispatch(setLoading(true));
				var raw = {
					companyId: requestFromCompanyId
				};
				const response = await fetch(`${BASE_URL}/bookkeeper/${user.user.id}/confirm-hire-requests/${id}`, {
					method: "PATCH",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${user.tokens.access.token}`,
					},
					body: JSON.stringify(raw),
				});
				// const json = await response.json();
				if (response.ok) {
					fetchData();
					handleClose();
				}
				dispatch(setLoading(false));
			})
			.catch(() => { });
	};

	const handleReject = async (id) => {
		confirm({
			description: "Are you sure you want to Reject this Hire Request? You can not undo this action.",
			confirmationText: "yes",
			cancellationText: "No",
		})
			.then(async () => {
				dispatch(setLoading(true));
				var raw = {
					companyId: requestFromCompanyId
				};
				const response = await fetch(`${BASE_URL}/bookkeeper/reject-hire-requests/${id}`, {
					method: "PATCH",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${user.tokens.access.token}`,
					},
					body: JSON.stringify(raw),
				});
				// const json = await response.json();
				if (response.ok) {
					fetchData();
					handleClose();
				}
				dispatch(setLoading(false));
			})
			.catch(() => { });
	};

	const handleWithdraw = async (id) => {
		confirm({
			description: "Are you sure you want to Withdraw this Hire Request? You can not undo this action.",
			confirmationText: "yes",
			cancellationText: "No",
		})
			.then(async () => {
				dispatch(setLoading(true));
				const response = await fetch(`${BASE_URL}/company/request/${companyId}/${id}`, {
					method: "DELETE",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${user.tokens.access.token}`,
					},
				});
				// const json = await response.json();
				if (response.ok) {
					fetchData();
					handleClose();
				}
				dispatch(setLoading(false));
			})
			.catch(() => { });
	};

	const handleRemove = async (id) => {
		confirm({
			description: "Are you sure you want to resign from this company? You can not undo this action.",
			confirmationText: "yes",
			cancellationText: "No",
		})
			.then(async () => {
				dispatch(setLoading(true));
				var raw = {
					companyId: id
				};
				const response = await fetch(`${BASE_URL}/bookkeeper/remove/${user.user.id}`, {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${user.tokens.access.token}`,
					},
					body: JSON.stringify(raw),
				});
				// const json = await response.json();
				if (response.ok) {
					fetchData();
					handleClose();
				}
				dispatch(setLoading(false));
			})
			.catch(() => { });
	};

	const open = Boolean(anchorEl);
	const id = open ? "simple-popover" : undefined;
	return (
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
					{actions && actions.view && (
						<Link
							to={`/${navigateLayer}/${moduleName}/${itemId}`}
							style={{ textDecoration: "none", color: "inherit" }}
						>
							<MenuItem color="theme.primary">
								<ListItemIcon>
									<VisibilityIcon fontSize="small" />
								</ListItemIcon>
								<Typography variant="inherit">{t('View')}</Typography>
							</MenuItem>
						</Link>
					)}
					{actions && actions.WorkerTime && (
						<Link to={`/home/worker-list/${companyId}/worker-time/${itemId}`} style={{ textDecoration: 'none' }}>
							<MenuItem>
								<ListItemIcon>
									<AccessTimeFilledIcon fontSize="small" />
								</ListItemIcon>
								<Typography sx={{ color: "rgb(38, 38, 38)" }} variant="inherit">
									{t('Worker Time')}
								</Typography>
							</MenuItem>
						</Link>
					)}
					{/* {actions && actions.WorkerData && (
						<Link to={`/home/worker-list/${companyId}/worker-data/${itemId}`} style={{ textDecoration: 'none' }}>
							<MenuItem>
								<ListItemIcon>
									<DocumentScannerIcon fontSize="small" />
								</ListItemIcon>
								<Typography sx={{ color: "rgb(38, 38, 38)" }} variant="inherit">
									Worker Data
								</Typography>
							</MenuItem>
						</Link>
					)} */}
					{actions && actions.ExportDataToWorker && (
						<Link to={`/home/worker-list/${companyId}/data-worker/${itemId}`} style={{ textDecoration: 'none' }}>
							<MenuItem>
								<ListItemIcon>
									<ImportExportIcon fontSize="small" />
								</ListItemIcon>
								<Typography sx={{ color: "rgb(38, 38, 38)" }} variant="inherit">
									{t('Export data to worker')}
								</Typography>
							</MenuItem>
						</Link>
					)}

					{actions && actions.calendar && (
						<Link to={`/home/calendar/${companyId}/worker/${itemId}`} style={{ textDecoration: 'none' }}>
							<MenuItem>
								<ListItemIcon>
									<EventIcon fontSize="small" />
								</ListItemIcon>
								<Typography sx={{ color: "rgb(38, 38, 38)" }} variant="inherit">
									{t('Calendar')}
								</Typography>
							</MenuItem>
						</Link>
					)}

					{actions && actions.edit && (
						<Link
							to={`/${navigateLayer}/edit-${moduleName}/${itemId}`}
							style={{ textDecoration: "none", color: "inherit" }}
						>
							<MenuItem>
								<ListItemIcon>
									<EditIcon fontSize="small" />
								</ListItemIcon>
								<Typography variant="inherit">{t('Edit')}</Typography>
							</MenuItem>
						</Link>
					)}
					{actions && actions.hire && (
						<Link
							to={`#`}
							style={{ textDecoration: "none", color: "inherit" }}
						>
							<MenuItem onClick={() => handleHire(itemId)}>
								<ListItemIcon>
									<PersonAddIcon fontSize="small" />
								</ListItemIcon>
								<Typography variant="inherit">{t('Hire')}</Typography>
							</MenuItem>
						</Link>
					)}
					{user?.user?.role === 'BookKeeper' ? null : (
						actions && actions.delete && (
							<MenuItem onClick={() => handleDelete(itemId)}>
								<ListItemIcon>
									<DeleteIcon fontSize="small" />
								</ListItemIcon>
								<Typography variant="inherit">{t('Delete')}</Typography>
							</MenuItem>
						)
					)}
					{actions && actions.accept && (
						<MenuItem onClick={() => handleAccept(itemId)}>
							<ListItemIcon>
								<CheckCircleSharpIcon fontSize="small" />
							</ListItemIcon>
							<Typography variant="inherit">{t('Accept')}</Typography>
						</MenuItem>
					)}
					{actions && actions.reject && (
						<MenuItem onClick={() => handleReject(itemId)}>
							<ListItemIcon>
								<CancelSharpIcon fontSize="small" />
							</ListItemIcon>
							<Typography variant="inherit">Reject</Typography>
						</MenuItem>
					)}
					{actions && actions.withdraw && (
						<MenuItem onClick={() => handleWithdraw(itemId)}>
							<ListItemIcon>
								<CancelSharpIcon fontSize="small" />
							</ListItemIcon>
							<Typography variant="inherit">{t('Withdraw')}</Typography>
						</MenuItem>
					)}
					{actions && actions.terminate && (
						<MenuItem onClick={() => handleDelete(itemId)}>
							<ListItemIcon>
								<CancelSharpIcon fontSize="small" />
							</ListItemIcon>
							<Typography variant="inherit">{t('Terminate')}</Typography>
						</MenuItem>
					)}
					{actions && actions.remove && (
						<MenuItem onClick={() => handleRemove(itemId)}>
							<ListItemIcon>
								<CancelSharpIcon fontSize="small" />
							</ListItemIcon>
							<Typography variant="inherit">{t('Resign')}</Typography>
						</MenuItem>
					)}

				</MenuList>
			</Popover>
		</>
	);
}

export default Actions;
