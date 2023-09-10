import React, { useState, useEffect } from 'react';
import { Box, Container, Button, Tooltip, Stack, FormHelperText } from '@mui/material';
import Layout from '../../pwa-layout';
import { BASE_URL } from 'config';
import { useAuthContext } from 'hooks/useAuthContext';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import StopIcon from '@mui/icons-material/Stop';
import { useDispatch } from "react-redux";
import { setLoading } from "redux/actionCreators/loadingActionCreators";
import ReactSelectMui from "utils/ReactSelectMui";
import { useTranslation } from 'react-i18next';


function Index() {
    const [startTime, setStartTime] = useState(null);
    const [trackedTime, setTrackedTime] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [vehicles, setVehicles] = useState([]);
    const [vehicle, setVehicle] = useState({});
    const [selectedDropdownVehicle, setSelectedDropdownVehicle] = useState(null);
    const [vehicleDropdownError, setVehicleDropdownError] = useState(false);
    const dispatch = useDispatch();
    const { user } = useAuthContext();
    const { t } = useTranslation();


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
    useEffect(() => {
        const storedStartTime = localStorage.getItem('startTime');
        const storedElapsedTime = localStorage.getItem('trackedTime');
        const storedIsPlaying = localStorage.getItem('isPlaying');

        if (storedStartTime && storedElapsedTime) {
            setStartTime(parseInt(storedStartTime));
            setTrackedTime(parseInt(storedElapsedTime));
            if (storedIsPlaying == 'true') {
                setIsPlaying(storedIsPlaying === 'true');
            }
        } else {
            setStartTime(0);
            setTrackedTime(0);
            setIsPlaying(false);
        }
    }, []);

    useEffect(() => {
        if (startTime !== null && isPlaying) {
            const interval = setInterval(() => {
                setTrackedTime(Date.now() - startTime);
            }, 1000);

            return () => clearInterval(interval);
        }
    }, [startTime, isPlaying]);

    useEffect(() => {
        if (startTime !== null) {
            localStorage.setItem('startTime', startTime);
            localStorage.setItem('trackedTime', trackedTime);
            localStorage.setItem('isPlaying', isPlaying);
        }
    }, [startTime, trackedTime, isPlaying]);

    const handleStart = () => {
        if (!isPlaying) {
            if (selectedDropdownVehicle) {
                setStartTime(Date.now() - trackedTime);
                setIsPlaying(true);
                setVehicleDropdownError(false);
                localStorage.setItem('isPlaying', true);
            } else {
                setVehicleDropdownError(true);
            }
        }
    };

    const handlePause = () => {
        if (startTime !== null) {
            setTrackedTime(Date.now() - startTime);
            setIsPlaying(false);
            localStorage.setItem('isPlaying', false);
        }
    };

    const handleStop = async () => {
        if (!startTime || !selectedDropdownVehicle) return; // Don't do anything if the time is not started or no vehicle is selected

        // dispatch(setLoading(true));

        const currentTime = Date.now();
        setTrackedTime(Date.now() - startTime);

        const trackedTimeDetails = {
            companyId: user.user.companyId,
            startTime: startTime,
            timeTracked: trackedTime,
            endTime: currentTime,
            licensePlate: vehicle.licensePlate,

        };

        const response = await fetch(`${BASE_URL}/trackTime/${user.user.id}/time`, {
            method: 'POST',
            body: JSON.stringify(trackedTimeDetails),
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${user.tokens.access.token}`,
            },
        });

        const json = await response.json();
        console.log(json);
        if (response.ok) {
            setStartTime(0);
            setTrackedTime(0);
            setIsPlaying(false);
            localStorage.removeItem('startTime');
            localStorage.removeItem('trackedTime');
            localStorage.removeItem('isPlaying');
        }
        // dispatch(setLoading(false));
    };

    const formatTime = (time) => {
        const hours = Math.floor(time / 3600000)
            .toString()
            .padStart(2, '0');
        const minutes = Math.floor((time % 3600000) / 60000)
            .toString()
            .padStart(2, '0');
        const seconds = Math.floor((time % 60000) / 1000)
            .toString()
            .padStart(2, '0');
        return `${hours}:${minutes}:${seconds}`;
    };

    return (
        <>
            <Layout />
            <Box sx={{ textAlign: 'center' }}>
                <Container maxWidth="sm">
                    <Box sx={{ marginTop: "35px" }}>
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
                                    {t('Please select a Vehicle')}
                                </FormHelperText>
                            )}
                        </Stack>

                    </Box>
                    <Box sx={{ textAlign: 'center', pt: '60px', pb: '40px' }}>
                        <Box sx={{ fontWeight: 'bold', fontFamily: 'initial' }} component="h4">
                            {t('Ready to Focus?')}
                        </Box>
                        <Box
                            sx={{
                                fontSize: '50px',
                                color: '#7206ef',
                                maxWidth: '200px',
                                m: 'auto',
                                // textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)',
                            }}
                        >
                            {formatTime(trackedTime)}
                        </Box>
                    </Box>
                    {!isPlaying ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                            <Tooltip title="Play">
                                <Box
                                    onClick={handleStart}
                                    sx={{
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        width: '70px',
                                        height: '70px',
                                        border: '1px solid #7206ef',
                                        borderRadius: '50px',
                                        backgroundColor: '#7206ef',
                                        boxShadow:
                                            '0px 19px 38px rgba(0, 0, 0, 0.3), 0px 15px 12px rgba(0, 0, 0, 0.22)',
                                    }}
                                    disabled={!selectedDropdownVehicle} // Disable the button when no vehicle is selected
                                >
                                    <PlayArrowIcon style={{ color: '#ffff', fontSize: '50px' }} />
                                </Box>
                            </Tooltip>
                        </Box>
                    ) : (
                        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                            <Tooltip title="Pause">
                                <Box
                                    onClick={handlePause}
                                    sx={{
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        width: '70px',
                                        height: '70px',
                                        border: '1px solid #dd1006b5',
                                        borderRadius: '50px',
                                        backgroundColor: '#dd1006b5',
                                        boxShadow:
                                            '0px 19px 38px rgba(0, 0, 0, 0.3), 0px 15px 12px rgba(0, 0, 0, 0.22)',
                                    }}
                                    disabled={!selectedDropdownVehicle} // Disable the button when no vehicle is selected
                                >
                                    <PauseIcon style={{ color: '#ffff', fontSize: '50px' }} />
                                </Box>
                            </Tooltip>
                        </Box>
                    )}
                    <Box sx={{ display: 'flex', justifyContent: 'center', py: '20px' }}>
                        <Tooltip title="Stop">
                            <Box
                                onClick={handleStop}
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    width: '70px',
                                    height: '70px',
                                    border: '1px solid #7206ef',
                                    borderRadius: '50px',
                                    backgroundColor: '#7206ef',
                                    boxShadow:
                                        '0px 19px 38px rgba(0, 0, 0, 0.3), 0px 15px 12px rgba(0, 0, 0, 0.22)',
                                }}
                                disabled={!startTime || !selectedDropdownVehicle} // Disable the button when the time is not started or no vehicle is selected
                            >
                                <StopIcon style={{ color: '#ffff', fontSize: '50px' }} />
                            </Box>
                        </Tooltip>
                    </Box>
                </Container>
            </Box>
        </>
    );
}

export default Index;
