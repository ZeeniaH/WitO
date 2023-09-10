import React, { useState, useEffect } from 'react';
import styles from "./UserCompanyOwnerData.module.scss";
import { Box, Container, Grid, Stack } from '@mui/material/index';
import ReactSelectMui from "utils/ReactSelectMui";
import Layout from "../../pwa-layout";
import { useAuthContext } from "../../hooks/useAuthContext";
import DirectionsCarFilledIcon from "@mui/icons-material/DirectionsCarFilled";
import BusinessIcon from "@mui/icons-material/Business";
import moment from "moment";
import { useDispatch } from "react-redux";
import { setLoading } from "redux/actionCreators/loadingActionCreators";
import { useParams } from "react-router-dom";
import { useTranslation } from 'react-i18next';


// third party
import { BASE_URL } from "config";

function index() {
    const [vehicles, setVehicles] = useState([]);
    const [vehicle, setVehicle] = useState({});
    const [selectedDropdownVehicle, setSelectedDropdownVehicle] = useState(null);
    const [vehicleDropdownError, setVehicleDropdownError] = useState(false);
    const dispatch = useDispatch();
    const { t } = useTranslation();

    const user = JSON.parse(localStorage.getItem("user"));

    useEffect(() => {
        // Retrieve the selected vehicle from local storage
        const selectedVehicle = JSON.parse(localStorage.getItem("selectedVehicle"));
        if (selectedVehicle) {
            setSelectedDropdownVehicle(selectedVehicle);
        }

        fetch(`${BASE_URL}/vehicle/vehicles/${user?.user.companyId}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${user.tokens.access.token}`,
            },
        })
            .then((res) => res.json())
            .then((data) => {
                setVehicles(
                    data?.map((vehicle) => ({
                        label: vehicle.licensePlate,
                        value: vehicle.id,
                    }))
                );
            });
    }, []);

    console.log(vehicles);
    const handleSelectVehicleDropdown = (selectedOption) => {
        setSelectedDropdownVehicle(selectedOption);
        setVehicleDropdownError(false);
        // Store the selected vehicle in local storage
        localStorage.setItem("selectedVehicle", JSON.stringify(selectedOption));
    };

    useEffect(() => {
        const fetchVehicle = async () => {
            dispatch(setLoading(true));
            const response = await fetch(`${BASE_URL}/vehicle/${selectedDropdownVehicle.value}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${user.tokens.access.token}`,
                },
            });
            const json = await response.json();
            console.log(json);
            if (response.ok) {
                setVehicle(json);
            }
            dispatch(setLoading(false));
        };
        selectedDropdownVehicle && fetchVehicle();
    }, [selectedDropdownVehicle]);

    return (
        <>
            <Layout />
            <Box className={styles.vehicleManagerSection}>
                <Container className={styles.vehicleManagerHeading}>
                    <Box sx={{ mb: "10px" }}>
                        <Box component={"h2"}>{t("Working On Vehicle")}</Box>
                    </Box>
                    <Box>
                        <Grid container spacing={3}>
                            <Grid item xs={12}>
                                <Stack spacing={1}>
                                    <ReactSelectMui
                                        label={t("Select Vehicle by License Plate")}
                                        options={vehicles}
                                        handleSelectDropdown={handleSelectVehicleDropdown}
                                        selectedDropdown={selectedDropdownVehicle}
                                    />
                                    {vehicleDropdownError && (
                                        <FormHelperText
                                            error
                                            id="standard-weight-helper-text-selectVehicle"
                                        >
                                            {t("Please select a Vehicle")}
                                        </FormHelperText>
                                    )}
                                </Stack>
                            </Grid>
                        </Grid>
                    </Box>
                </Container>
                {selectedDropdownVehicle && (
                    <Box className={styles.vehiclesDetailsSection}>
                        <Box className={styles.vehicleHeading} component={"h1"}>
                            {t("Vehicle Details")}
                        </Box>
                        <Grid container spacing={2}>
                            <Grid item md={6} xs={12}>
                                <Box className={styles.vehicleBox}>
                                    <Box className={styles.vehicleBoxContent}>
                                        <Grid className={styles.mobileResponsive} container spacing={2}>
                                            <Grid item md={"auto"}>
                                                <Box>
                                                    <Box className={styles.vehicleBoxImage}>
                                                        <a
                                                            href={vehicle?.companyLogo}
                                                            download="Company Logo"
                                                            target="_blank"
                                                            rel="noreferrer"
                                                        >
                                                            <img src={vehicle?.companyLogo} alt="images"></img>
                                                        </a>
                                                    </Box>
                                                </Box>
                                            </Grid>
                                            <Grid item className={styles.vehicleBoxTitle} md>
                                                <Box>
                                                    <BusinessIcon />
                                                </Box>
                                                <Box sx={{ fontSize: "20px" }} component={"h3"}>
                                                    {vehicle.selectCompany}
                                                </Box>
                                            </Grid>
                                        </Grid>
                                    </Box>
                                </Box>
                            </Grid>
                            <Grid item md={6} xs={12}>
                                <Box className={styles.vehicleBox}>
                                    <Box className={styles.vehicleBoxContent}>
                                        <Grid className={styles.mobileResponsive} container spacing={2}>
                                            <Grid item md={"auto"}>
                                                <Box>
                                                    <Box className={styles.vehicleBoxImage}>
                                                        <a
                                                            href={vehicle.carImage}
                                                            download="vehicle"
                                                            target="_blank"
                                                            rel="noreferrer"
                                                        >
                                                            <img src={vehicle.carImage} alt="images"></img>
                                                        </a>
                                                    </Box>
                                                </Box>
                                            </Grid>
                                            <Grid item className={styles.vehicleBoxTitle} md>
                                                <Box>
                                                    <DirectionsCarFilledIcon />
                                                </Box>
                                                <Box sx={{ fontSize: "20px" }} component={"h3"}>
                                                    {vehicle.makeName}
                                                </Box>
                                            </Grid>
                                        </Grid>
                                    </Box>
                                </Box>
                            </Grid>
                        </Grid>
                        <Box className={`${styles.vehicleBox} ${styles.vehicleBoxTwo}`}>
                            <Box component={"h4"}>{t("Other Details")}</Box>
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <Box className={styles.vehicleBoxTwoContent}>
                                        <table>
                                            <tbody>
                                                <tr>
                                                    <th>{t("Model")}</th>
                                                    <td>{vehicle.model}</td>
                                                </tr>
                                                <tr className={styles.spacer}></tr>
                                                <tr>
                                                    <th>{t("License Plate")}</th>
                                                    <td>{vehicle.licensePlate}</td>
                                                </tr>
                                                <tr className={styles.spacer}></tr>
                                                <tr>
                                                    <th>{t("Registered City")}</th>
                                                    <td>{vehicle.registeredCity}</td>
                                                </tr>
                                                <tr className={styles.spacer}></tr>
                                                <tr>
                                                    <th>{t("Car Maker")}</th>
                                                    <td>{vehicle.carMaker}</td>
                                                </tr>
                                                <tr className={styles.spacer}></tr>
                                                {/* <tr>
                                                    <th>Vehicle Identification Number</th>
                                                    <td>{vehicle.vehicleIdentificationNumber}</td>
                                                </tr>
                                                <tr className={styles.spacer}></tr>
                                                <tr>
                                                    <th>First Registration Date</th>
                                                    <td>{moment(vehicle.firstRegistrationDate).format("DD-MM-YYYY")}</td>

                                                </tr> */}
                                                <tr>
                                                    <th>{t("Color")}</th>
                                                    <td>{vehicle.color}</td>
                                                </tr>
                                                <tr className={styles.spacer}></tr>
                                                <tr>
                                                    <th>{t("Insurance")}</th>
                                                    <td>{vehicle.insurance}</td>
                                                </tr>
                                                <tr className={styles.spacer}></tr>
                                                <tr>
                                                    <th>{t("Policy Number")}</th>
                                                    <td>{vehicle.policyNumber}</td>
                                                </tr>
                                                <tr className={styles.spacer}></tr>
                                                <tr>
                                                    <th>{t("Fuel")}</th>
                                                    <td>{vehicle.fuel}</td>
                                                </tr>
                                                <tr className={styles.spacer}></tr>
                                                <tr>
                                                    <th>{t("Km Stand")}</th>
                                                    <td>{vehicle.kmStand}</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </Box>
                                </Grid>
                                <Grid item xs={12}>
                                    <Box className={styles.vehicleBoxTwoContent}>
                                        <table>
                                            <tbody>
                                                <tr>
                                                    <th>{t("Car Images")}</th>
                                                    <td className={styles.carImages}>
                                                        {vehicle.carImage &&
                                                            vehicle.carImage.length > 0 &&
                                                            vehicle.carImage?.map((carImages, index) => (
                                                                <a href={carImages} key={index} target="_blank">
                                                                    <img src={carImages} alt="images"></img>
                                                                </a>
                                                            ))}
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </Box>
                                </Grid>
                                {/* <Grid item xs={12}>
                                                <Box className={styles.vehicleBoxTwoContent}>
                                                    <table>
                                                        <tbody>
                                                            <tr>
                                                                <th>Damage Image/s</th>
                                                                <td className={styles.carImages}>
                                                                    {vehicle.carDamageImages &&
                                                                        vehicle.carDamageImages.length >
                                                                            0 &&
                                                                        vehicle.carDamageImages.map(
                                                                            (carDamageImage, index) => (
                                                                                <a
                                                                                    href={carDamageImage}
                                                                                    key={index}
                                                                                    target="_blank"
                                                                                >
                                                                                    <img
                                                                                        src={carDamageImage}
                                                                                        alt="images"
                                                                                    ></img>
                                                                                </a>
                                                                            )
                                                                        )}
                                                                </td>
                                                            </tr>
                                                        </tbody>
                                                    </table>
                                                </Box>
                                            </Grid> */}
                            </Grid>
                        </Box>
                    </Box>
                )}
            </Box>
        </>
    );
}

export default index;
