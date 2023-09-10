import React, { useState } from "react";
import {
    ClickAwayListener,
    Divider,
    Drawer,
    IconButton,
    Step,
    StepButton,
    StepLabel,
    Stepper,
    styled,
} from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import PersonIcon from '@mui/icons-material/Person';
import EditTwoToneIcon from '@mui/icons-material/EditTwoTone';
import SettingsTwoToneIcon from '@mui/icons-material/SettingsTwoTone';
import { Link } from "react-router-dom";
import { useTranslation } from 'react-i18next';



const DrawerHeader = styled("div")(({ theme }) => ({
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
}));
// const steps = ["Add Vehicle", "Vehicles List", "Vehicle One", "Vehicle Two"];
const ColorlibStepIconRoot = styled("div")(({ theme, ownerState }) => ({
    zIndex: 1,
    display: "flex",
    borderRadius: "50%",
    justifyContent: "center",
    alignItems: "center",
}));

function ColorlibStepIcon(props) {
    const { active, completed, className } = props;

    const icons = {
        1: <PersonIcon />,
        2: <SettingsTwoToneIcon />,

    };

    return (
        <ColorlibStepIconRoot
            ownerState={{ completed, active }}
            className={className}
        >
            {icons[String(props.icon)]}
        </ColorlibStepIconRoot>
    );
}

function Index() {
    const [activeStep, setActiveStep] = useState(0);
    const [open, setOpen] = React.useState(false);
    const [completed, setCompleted] = useState({});
    const { t } = useTranslation();

    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };

    return (
        <>
            <ClickAwayListener onClickAway={handleDrawerClose}>
                <Drawer
                    variant='permanent'
                    open={open}
                    sx={{
                        boxShadow: "none",
                        transition: "all .3s ease",
                        width: {
                            md: "auto",
                            xs: open ? "100%" : "60px",
                            boxShadow: "0px 0px 12px 0px #d7d7d7;",
                        },
                        height: "100%",
                        ".MuiPaper-root": {
                            position: "static",
                            overflow: "hidden",
                        },
                        '& .css-18swi0r-MuiPaper-root-MuiDrawer-paper': {
                            backgroundColor: "#ffff"
                        },

                    }}
                >
                    <DrawerHeader

                        sx={{
                            display: {
                                md: "none",
                            },
                            minHeight: {
                                xs: "48px",
                            },


                        }}
                    >
                        <IconButton
                            color='inherit'
                            aria-label='open drawer'
                            onClick={handleDrawerOpen}
                            edge='start'
                            sx={{
                                float: {
                                    md: "right",
                                },
                                ...(open && {
                                    display: "none",
                                }),
                            }}
                        >
                            <ChevronRightIcon />
                        </IconButton>
                        <IconButton
                            onClick={handleDrawerClose}
                            sx={{
                                ...(!open && {
                                    display: "none",
                                }),
                            }}
                        >
                            <ChevronLeftIcon />
                        </IconButton>
                    </DrawerHeader>
                    <Divider />

                    <Stepper
                        nonLinear
                        activeStep={activeStep}
                        sx={{
                            flexDirection: "column",
                            alignItems: "flex-start",

                        }}
                    >


                        <Step
                            // completed={completed[index]}
                            sx={{
                                p: "5px 15px",
                                width: "100%",
                            }}
                        >
                            <Link to='/home/user-profile' style={{ textDecoration: 'none' }}>
                                <StepButton

                                    sx={{
                                        color: 'inherit',
                                        justifyContent: "flex-start",
                                        p: "10px 40px 10px 15px",
                                        m: "-5px -15px",
                                    }}
                                >
                                    <StepLabel
                                        StepIconComponent={ColorlibStepIcon}
                                        sx={{

                                            ".MuiStepLabel-labelContainer": {
                                                transition: "all .3s ease",
                                                opacity: {
                                                    md: 1,
                                                    xs: open ? "1" : "0",

                                                },


                                                ".MuiStepLabel-label": {
                                                    whiteSpace: "nowrap",
                                                },
                                            },
                                            ".MuiStepLabel-iconContainer": {
                                                transition: "all 300ms ease",
                                                paddingRight: "0",

                                                ".MuiSvgIcon-root": {
                                                    fontSize: {
                                                        md: "1.5rem",
                                                        xs: "1rem",
                                                    },
                                                    mr: "10px",
                                                },
                                            },
                                            // "& .css-1tjpqgh-MuiStepLabel-label.Mui-active": {
                                            //     color: "#fff"
                                            // }

                                        }}

                                    >
                                        {t('Profile')}
                                    </StepLabel>
                                </StepButton>
                            </Link>
                        </Step>

                        <Step
                            // completed={completed[index]}
                            sx={{
                                p: "5px 15px",
                                width: "100%",
                            }}
                        >
                            <Link to='/home/settings' style={{ textDecoration: 'none' }}>
                                <StepButton
                                    color='inherit'
                                    sx={{
                                        justifyContent: "flex-start",
                                        p: "10px 40px 10px 15px",
                                        m: "-5px -15px",
                                    }}
                                >
                                    <StepLabel
                                        StepIconComponent={ColorlibStepIcon}
                                        sx={{

                                            ".MuiStepLabel-labelContainer": {
                                                transition: "all .3s ease",
                                                opacity: {
                                                    md: 1,
                                                    xs: open ? "1" : "0",
                                                },

                                                ".MuiStepLabel-label": {
                                                    whiteSpace: "nowrap",
                                                },
                                            },
                                            ".MuiStepLabel-iconContainer": {
                                                transition: "all 300ms ease",
                                                paddingRight: "0",

                                                ".MuiSvgIcon-root": {
                                                    fontSize: {
                                                        md: "1.5rem",
                                                        xs: "1rem",
                                                    },
                                                    mr: "10px",
                                                },
                                            },
                                            "& .css-1tjpqgh-MuiStepLabel-label": {
                                                color: "#000"
                                            },
                                            "& .css-1tjpqgh-MuiStepLabel-label.Mui-active": {
                                                color: "#fff"
                                            }
                                        }}
                                    >
                                        {t('Settings')}
                                    </StepLabel>
                                </StepButton>
                            </Link>
                        </Step>



                    </Stepper>
                </Drawer>
            </ClickAwayListener>

        </>
    );
}

export default Index;
