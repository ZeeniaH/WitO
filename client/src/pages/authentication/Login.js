
// material-ui
import { Grid, Stack, Typography, Box, Select, MenuItem } from '@mui/material';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { useTranslation } from 'react-i18next';
import enTranslation from "../../en.json";
import deTranslation from "../../de.json";

// project import
import AuthLogin from './auth-forms/AuthLogin';
import AuthWrapper from './AuthWrapper';

// ================================|| LOGIN ||================================ //
const resources = {
    en: {
        translation: enTranslation
    },
    de: {
        translation: deTranslation
    }
};

i18n
    .use(initReactI18next)
    .init({
        resources,
        lng: localStorage.getItem('selectedLanguage') || "en", // Get the stored language or default to 'en'
        fallbackLng: "en",
        interpolation: {
            escapeValue: false
        }
    });

const Login = () => {
    const { t } = useTranslation();
    const { i18n } = useTranslation();

    const changeLanguage = (lng) => {
        i18n.changeLanguage(lng);
        localStorage.setItem('selectedLanguage', lng); // Store the selected language in local storage
    };
    return (
        <>

            <AuthWrapper>

                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <Box sx={{ display: "flex", justifyContent: "end", }}>
                            <Select
                                sx={{ color: "#000", borderColor: "unset" }}
                                value={i18n.language}
                                onChange={(event) => changeLanguage(event.target.value)}
                                inputProps={{
                                    'aria-label': 'language-select',
                                }}
                            >
                                <MenuItem value="de">
                                    <img
                                        src="/images/germany.png"
                                        alt="Germany"
                                        style={{ width: "20px", height: "auto", marginRight: "5px" }}
                                    />
                                    de
                                </MenuItem>
                                <MenuItem value="en">
                                    <img
                                        src="/images/england.png"
                                        alt="England"
                                        style={{ width: "20px", height: "auto", marginRight: "5px" }}
                                    />
                                    en
                                </MenuItem>
                            </Select>
                        </Box>
                        <Stack direction="row" justifyContent="center" alignItems="baseline" sx={{ mb: { xs: -0.5, sm: 0.5 } }}>
                            <Typography variant="h3">{t('Login')}</Typography>
                            {/* <Typography component={Link} to="/register" variant="body1" sx={{ textDecoration: 'none' }} color="primary">
                        Don&apos;t have an account?
                    </Typography> */}
                        </Stack>
                    </Grid>
                    <Grid item xs={12}>
                        <AuthLogin />
                    </Grid>
                </Grid>
            </AuthWrapper></>
    )
}

export default Login;
