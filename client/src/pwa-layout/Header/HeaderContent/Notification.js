import React, { useRef, useState, useEffect } from "react";

// material-ui
import { useTheme } from '@mui/material/styles';
import {
    Avatar,
    Badge,
    Box,
    ClickAwayListener,
    Divider,
    IconButton,
    List,
    ListItemButton,
    ListItemAvatar,
    ListItemText,
    ListItemSecondaryAction,
    Paper,
    Popper,
    Typography,
    useMediaQuery,
    Button,
    Grid
} from '@mui/material';
import EmailTwoToneIcon from '@mui/icons-material/EmailTwoTone';
import { BASE_URL } from "config";

// project import
import MainCard from 'components/MainCard';
import Transitions from 'components/@extended/Transitions';

// assets
import { BellOutlined, CloseOutlined, GiftOutlined, MessageOutlined, SettingOutlined, DeleteOutlined, } from '@ant-design/icons';

// sx styles
const avatarSX = {
    width: 36,
    height: 36,
    fontSize: '1rem'
};

const actionSX = {
    mt: '6px',
    ml: 1,
    top: 'auto',
    right: 'auto',
    alignSelf: 'flex-start',

    transform: 'none'
};

// ==============================|| HEADER CONTENT - NOTIFICATION ||============================== //

const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? "PM" : "AM";
    return `${hours % 12}:${minutes.toString().padStart(2, "0")} ${ampm}`;
};

const Notification = () => {
    const theme = useTheme();
    const matchesXs = useMediaQuery(theme.breakpoints.down("md"));

    const user = JSON.parse(localStorage.getItem('user'));

    const anchorRef = useRef(null);
    const [notifications, setNotifications] = useState([]);
    const [open, setOpen] = useState(false);
    const handleToggle = () => {
        setOpen((prevOpen) => !prevOpen);
    };

    const handleClose = (event) => {
        if (anchorRef.current && anchorRef.current.contains(event.target)) {
            return;
        }
        setOpen(false);
    };

    const iconBackColorOpen = "#fffff";
    const iconBackColor = "#fffff";

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const response = await fetch(`${BASE_URL}/notify/notifies/${user.user.id}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${user.tokens.access.token}`,
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    console.log("data", data.notifications)
                    setNotifications(data.notifications.reverse());
                    console.log("notifications", notifications)
                } else {
                    console.error('Failed to fetch notifications:', response.statusText);
                }
            } catch (error) {
                console.error('An error occurred while fetching notifications:', error);
            }
        };

        fetchNotifications();
    }, []);

    const handleDeleteNotification = async (notificationId) => {
        try {
            const response = await fetch(`${BASE_URL}/notify/remove/${notificationId}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${user.tokens.access.token}`,
                },
            });

            if (response.ok) {
                // Update the notifications list after deletion
                setNotifications((prevNotifications) =>
                    prevNotifications.filter((notification) => notification._id !== notificationId)
                );
            } else {
                console.error("Failed to delete notification:", response.statusText);
            }
        } catch (error) {
            console.error("An error occurred while deleting notification:", error);
        }
    };

    const getNotificationCount = () => {
        return notifications.length;
    };

    const handleClearAllNotifications = async () => {
        try {
            const response = await fetch(`${BASE_URL}/notify/remove-all`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${user.tokens.access.token}`,
                },
            });

            if (response.ok) {
                // Clear the notifications array in state
                setNotifications([]);
            } else {
                console.error("Failed to clear notifications:", response.statusText);
            }
        } catch (error) {
            console.error("An error occurred while clearing notifications:", error);
        }
    };


    return (
        <Box sx={{ flexShrink: 0, ml: 0.75 }}>
            <IconButton
                disableRipple
                color="secondary"
                sx={{ color: 'text.primary', backgroundColor: open ? iconBackColorOpen : iconBackColor }}
                aria-label="open profile"
                ref={anchorRef}
                aria-controls={open ? 'profile-grow' : undefined}
                aria-haspopup="true"
                onClick={handleToggle}
            >
                <Badge sx={{
                    '& .css-1xi8k71-MuiBadge-badge': {
                        color: "#fff",
                        backgroundColor: "#5e27ff"
                    }
                }} badgeContent={getNotificationCount()} color="primary">
                    <BellOutlined />
                </Badge>
            </IconButton>
            <Popper
                placement={matchesXs ? 'bottom' : 'bottom-end'}
                open={open}
                anchorEl={anchorRef.current}
                role={undefined}
                transition
                disablePortal
                popperOptions={{
                    modifiers: [
                        {
                            name: 'offset',
                            options: {
                                offset: [matchesXs ? -5 : 0, 9]
                            }
                        }
                    ]
                }}
            >
                {({ TransitionProps }) => (
                    <Transitions type="fade" in={open} {...TransitionProps}>
                        <Paper
                            sx={{
                                boxShadow: theme.customShadows.z1,
                                width: '100%',
                                width: '95vw',
                                maxWidth: 500,
                            }}
                        >
                            <ClickAwayListener onClickAway={handleClose}>
                                <MainCard
                                    title="Notification"
                                    elevation={0}
                                    border={false}
                                    content={false}
                                    secondary={
                                        <IconButton size="small" onClick={handleToggle}>
                                            <CloseOutlined />
                                        </IconButton>
                                    }
                                >
                                    <Box sx={{ maxHeight: 400, overflow: "auto" }}>
										<List
											component="nav"
											sx={{
												p: 0,
												"& .MuiListItemButton-root": {
													py: 0.5,
													"& .MuiAvatar-root": avatarSX,
													"& .MuiListItemSecondaryAction-root": {
														...actionSX,
														position: "relative",
													},
												},
											}}
										>
											{notifications.map((notification) => (
												<React.Fragment key={notification._id}>
													<ListItemButton sx={{ alignItems: "inherit", }}>
														<Grid container>
															<Grid item xs={6}>
																<Box sx={{ display: "flex" }}>
																	<ListItemAvatar>
																		<Avatar
																			sx={{
																				color: "success.main",
																				backgroundColor: "success.lighter",
																			}}
																		>
																			<EmailTwoToneIcon />
																		</Avatar>
																	</ListItemAvatar>
																	<ListItemText
																		primary={
																			<Typography variant="h6" sx={{ mr: "25px" }}>
																				<Typography
																					component="span"
																				>
																					{notification.heading}
																				</Typography>
																			</Typography>
																		}
																		secondary={notification.createdAt ? formatTime(notification.createdAt) : ""}
																	/>
																</Box>
															</Grid>
															<Grid item xs={6}>
																<Box sx={{ display: "flex" }}>
																	<ListItemText
																		primary={
																			<Typography variant="h6">
																				<Typography
																					component="span"
																					variant="subtitle1"
																				>
																					{notification.message}
																				</Typography>
																			</Typography>
																		}
																	/>
																	<ListItemSecondaryAction >
																		<IconButton style={{ padding: "0", alignItems: "baseLine", height: "auto" }}
																			size="large"
																			onClick={() => handleDeleteNotification(notification._id)}
																		>
																			<DeleteOutlined />
																		</IconButton>
																	</ListItemSecondaryAction>
																</Box>
															</Grid>
														</Grid>
													</ListItemButton>
													<Divider />
												</React.Fragment>
											))}
											{
												notifications.length === 0 ? " " : (
													<ListItemButton >
														<ListItemText
															sx={{ display: "flex", justifyContent: "center", mt: "15px" }}
															primary={
																<Button
																	variant="contained"
																	color="error"
																	startIcon={<DeleteOutlined />}
																	onClick={handleClearAllNotifications}
																>
																	Clear All
																</Button>
															}
														/>
													</ListItemButton>)
											}
										</List>
									</Box>
                                </MainCard>
                            </ClickAwayListener>
                        </Paper>
                    </Transitions>
                )}
            </Popper>
        </Box>
    );
};

export default Notification;
