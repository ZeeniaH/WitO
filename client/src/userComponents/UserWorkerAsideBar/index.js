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
  Box,
} from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import PersonIcon from "@mui/icons-material/Person";
import SegmentSharpIcon from "@mui/icons-material/SegmentSharp";

import { Link } from "react-router-dom";

import InputBase from "@mui/material/InputBase";
import SearchIcon from "@mui/icons-material/Search";
import { alpha } from "@mui/material/styles";

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(1),
    width: "auto",
  },
}));
const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));
const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      width: "15ch",
    },
  },
}));

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));
// const steps = ["  Worker Time", " Worker Data", " Export data to workers"];
const steps = ["  Worker Time", " Export data to workers"];
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
    // 1: <PersonIcon />,
    // 2: <SegmentSharpIcon />,
    // 3: <PersonIcon />,
    // 4: <PersonIcon />,
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
              padding: {
                xs: "10px 0",
              },
            }}
          >

            {/* {steps.map((label, index) => (
              <Step
                key={label}
                completed={completed[index]}
                sx={{
                  p: "5px 15px",
                  width: "100%",
                }}
              >
                <Link to='/home/worker-details' style={{ textDecoration: "none" }}>
                  <StepButton
                    color='inherit'
                    // onClick={handleStep(index)}
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
                      }}
                    >
                      {label}
                    </StepLabel>
                  </StepButton>
                </Link>
              </Step>
            ))} */}
            <Step
              // completed={completed[index]}
              sx={{
                p: "5px 15px",
                width: "100%",
              }}
            >
              <Link to='/worker/worker-time' style={{ textDecoration: 'none' }}>
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

                    }}

                  >
                    Worker Time
                  </StepLabel>
                </StepButton>
              </Link>
            </Step>
            {/* <Step
              // completed={completed[index]}
              sx={{
                p: "5px 15px",
                width: "100%",
              }}
            >
              <Link to='/worker/worker-data' style={{ textDecoration: 'none' }}>
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
                    }}
                  >
                    Worker Data
                  </StepLabel>
                </StepButton>
              </Link>
            </Step> */}
            <Step
              // completed={completed[index]}
              sx={{
                p: "5px 15px",
                width: "100%",
              }}
            >
              <Link to='/worker/data-worker' style={{ textDecoration: 'none' }}>
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
                    }}
                  >
                    Export data to worker
                  </StepLabel>
                </StepButton>
              </Link>
            </Step>
            <Step
              sx={{
                p: "5px 15px",
                width: "100%",
                display: {
                  lg: "none",
                },
              }}
            >
              {/* <Button
												color="secondary"
												variant="contained"
												sx={{
													bottom: "15px",
													right: "15px",
													minWidth: "unset",
													borderRadius: "50%",
												}}
											>
												<VisibilityIcon />
											</Button> */}
            </Step>
          </Stepper>
        </Drawer>
      </ClickAwayListener>
      {/* <Stepper
							nonLinear
							activeStep={activeStep}
							sx={{
								flexDirection: "column",
								alignItems: "flex-start",
								padding: "30px 0 0 15px",
							}}
						>
							{steps.map((label, index) => (
								<Step
									key={label}
									completed={completed[index]}
									sx={{ p: "5px 15px", width: "100%" }}
								>
									<StepButton
										color="inherit"
										onClick={handleStep(index)}
										sx={{
											justifyContent: "flex-start",
											p: "5px 15px",
											m: "-5px -15px",
										}}
									>
										<StepLabel StepIconComponent={ColorlibStepIcon}>
											{label}
										</StepLabel>
									</StepButton>
								</Step>
							))}
						</Stepper> */}
    </>
  );
}

export default Index;
