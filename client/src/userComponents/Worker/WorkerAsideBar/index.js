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
import { alpha } from "@mui/material/styles";
import { useTranslation } from 'react-i18next';

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
const steps = ["Add Worker", "Workers List"];
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
    2: <SegmentSharpIcon />,

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

function Index({ companyId }) {
  const { t } = useTranslation();
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
            <Step
              sx={{
                p: "5px 15px",
                width: "100%",
              }}
            >
              <Link to={`/home/add-worker/${companyId}`} style={{ textDecoration: 'none' }}>
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
                    {t('Add Worker')}
                  </StepLabel>
                </StepButton>
              </Link>
            </Step>
            <Step
              sx={{
                p: "5px 15px",
                width: "100%",
              }}
            >
              <Link to={`/home/worker-list/${companyId}`} style={{ textDecoration: 'none' }}>
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
                    {t('Worker List')}
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
