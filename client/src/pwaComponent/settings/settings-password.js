import { useState, useEffect } from 'react';
import { Box, Button, Grid, Stack, InputLabel, OutlinedInput, InputAdornment, IconButton, FormHelperText, FormControl, Typography, } from '@mui/material';
import { EyeOutlined, EyeInvisibleOutlined } from "@ant-design/icons";

import AnimateButton from "components/@extended/AnimateButton";
import { strengthColor, strengthIndicator } from "utils/password-strength";

// third party
import * as Yup from "yup";
import firebase from "API/firebase";
import { Formik } from "formik";

// assets
import { BASE_URL } from "config";
import { setLoading } from "redux/actionCreators/loadingActionCreators";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useTranslation } from 'react-i18next';

export const SettingsPassword = (props) => {
  const { t } = useTranslation();
  // const [values, setValues] = useState({
  //   password: '',
  //   confirm: ''
  // });
  const [level, setLevel] = useState();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?.user.id;
  const navigate = useNavigate();

  const dispatch = useDispatch();
  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const changePassword = (value) => {
    const temp = strengthIndicator(value);
    setLevel(strengthColor(temp));
  };

  const handleClickShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleMouseDownConfirmPassword = (event) => {
    event.preventDefault();
  };

  useEffect(() => {
    changePassword("");
  }, []);

  return (
    <>
      <Box sx={{ maxWidth: "500px" }}>
        <Formik
          enableReinitialize={true}
          initialValues={{
            password: "",
            confirmPassword: "",
          }}
          validationSchema={Yup.object().shape({
            password: Yup.string()
              .max(50, t("maximum 50 characters"))
              .required(t("Password is required")),
            confirmPassword: Yup.string().oneOf(
              [Yup.ref("password"), null],
              t("Passwords must match")
            ),
          })}
          onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
            setSubmitting(true);
            try {
              dispatch(setLoading(true));
              const { password, } = values;
              const response = await fetch(`${BASE_URL}/user/${userId}`, {
                method: "PATCH",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${user.tokens.access.token}`,
                },
                body: JSON.stringify({ password }),
              });
              const json = await response.json();
              if (!response.ok) {

                setStatus({ success: false });
                setErrors({ submit: json.message });
                setSubmitting(false);
              }
              if (response.ok) {
                // update loading state
                setStatus({ success: true });
                setSubmitting(false);
                navigate("/pwa/user-profile");
              }
              dispatch(setLoading(false));
            } catch (err) {
              console.error(err);
              setStatus({ success: false });
              setErrors({ submit: err.message });
              setSubmitting(false);
            }
          }}

        >
          {({
            errors,
            handleBlur,
            handleChange,
            handleSubmit,
            isSubmitting,
            touched,
            values,
          }) => (
            <form noValidate onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Stack spacing={1}>
                    <InputLabel htmlFor="password-signup">
                      {t('Update Password')}
                    </InputLabel>
                    <OutlinedInput
                      fullWidth
                      error={Boolean(touched.password && errors.password)}
                      id="password-signup"
                      type={showPassword ? "text" : "password"}
                      value={values.password}
                      name="password"
                      onBlur={handleBlur}
                      onChange={(e) => {
                        handleChange(e);
                        changePassword(e.target.value);
                      }}
                      endAdornment={
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={handleClickShowPassword}
                            onMouseDown={handleMouseDownPassword}
                            edge="end"
                            size="large"
                          >
                            {showPassword ? (
                              <EyeOutlined />
                            ) : (
                              <EyeInvisibleOutlined />
                            )}
                          </IconButton>
                        </InputAdornment>
                      }
                      placeholder=""
                    />

                    {touched.password && errors.password && (
                      <FormHelperText error id="helper-text-password-signup">
                        {t(errors.password)}
                      </FormHelperText>
                    )}
                  </Stack>
                </Grid>
                <Grid item xs={12}>
                  <Stack spacing={1}>
                    <InputLabel htmlFor="confirm-password-signup">
                      {t('Confirm Update Password')}
                    </InputLabel>
                    <OutlinedInput
                      fullWidth
                      error={Boolean(
                        touched.confirmPassword && errors.confirmPassword
                      )}
                      id="confirmPassword-signup"
                      type={showConfirmPassword ? "text" : "password"}
                      value={values.confirmPassword}
                      name="confirmPassword"
                      onBlur={handleBlur}
                      onChange={(e) => {
                        handleChange(e);
                      }}
                      endAdornment={
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={handleClickShowConfirmPassword}
                            onMouseDown={handleMouseDownConfirmPassword}
                            edge="end"
                            size="large"
                          >
                            {showConfirmPassword ? (
                              <EyeOutlined />
                            ) : (
                              <EyeInvisibleOutlined />
                            )}
                          </IconButton>
                        </InputAdornment>
                      }
                      placeholder=""
                    />
                    {touched.confirmPassword && errors.confirmPassword && (
                      <FormHelperText error id="helper-text-confirm-password-signup">
                        {t(errors.confirmPassword)}
                      </FormHelperText>
                    )}
                  </Stack>
                </Grid>

                <Grid item xs={12}>
                  {errors.submit && (
                    <Grid item xs={12}>
                      <FormHelperText error>
                        {t(errors.submit)}
                      </FormHelperText>
                    </Grid>
                  )}
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    sx={{ mt: "20px" }}
                    variant="contained"
                  >
                    {t('Update')}
                  </Button>
                </Grid>
              </Grid>
            </form>
          )}
        </Formik>
      </Box>
    </>
  );
};
