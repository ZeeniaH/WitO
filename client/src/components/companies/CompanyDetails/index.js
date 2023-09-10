import React, { useState, useEffect } from "react";
import { Box, Container, Grid, Button } from "@mui/material";
import styles from "./companyDetails.module.scss";
import BusinessIcon from "@mui/icons-material/Business";
import { useParams, useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import Slide from "@mui/material/Slide";
import moment from "moment";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import useGoBack from '../../../hooks/useGoBack';


// third party
import { BASE_URL } from "config";
import { setLoading } from "redux/actionCreators/loadingActionCreators";
import { useDispatch } from "react-redux";
import { useTranslation } from 'react-i18next';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction='up' ref={ref} {...props} />;
});
function Index() {
  const { t } = useTranslation()
  const navigate = useNavigate();
  const [datePicker, setDatePicker] = useState(dayjs("2014-08-18T21:11:54"));

  const user = JSON.parse(localStorage.getItem("user"));

  const dispatch = useDispatch();
  const [company, setCompany] = useState();
  const params = useParams();
  useEffect(() => {
    const fetchCompany = async () => {
      dispatch(setLoading(true));
      const response = await fetch(`${BASE_URL}/company/${params.id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.tokens.access.token}`,
        },
      });
      const json = await response.json();
      if (response.ok) {
        setCompany(json);
      }
      dispatch(setLoading(false));
    };
    fetchCompany();
  }, []);
  const [open, setOpen] = React.useState(false);

  const handleDrawerClose = () => {
    setOpen(false);
  };
  const [openPopup, setOpenPopup] = React.useState(false);

  const handleClickOpenPopup = () => {
    setOpenPopup(true);
  };
  const handleClosePopup = () => {
    setOpenPopup(false);
  };
  return (
    <>

      <Container>
        <Box className={styles.companyDetailsSection}>
          <Button
            sx={{ fontSize: "12px", mb: "10px" }}
            variant="outlined"
            onClick={useGoBack}
            startIcon={<ArrowBackIcon />}
          >
            {t('Back')}
          </Button>
          <Box className={styles.companyHeading} component={"h1"}>
            {t('Company Details')}
          </Box>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Box className={styles.companyBox}>
                <Box className={styles.companyBoxContent}>
                  <Grid
                    className={styles.mobileResponsive}
                    container
                    spacing={2}
                  >
                    <Grid xs={"auto"}>
                      <Box>
                        <Box className={styles.companyBoxImage}>
                          <a
                            href={company?.companyLogo}
                            download="Company Logo"
                            target="_blank"
                            rel="noreferrer"
                          >
                            <img
                              src={company?.companyLogo}
                              alt="images"
                            ></img>
                          </a>
                        </Box>
                      </Box>
                    </Grid>
                    <Grid className={styles.companyBoxTitle} xs>
                      <Box>
                        <BusinessIcon />
                      </Box>
                      <Box component={"h3"}>{company?.companyName}</Box>
                    </Grid>
                  </Grid>
                </Box>
              </Box>
            </Grid>
          </Grid>

          <Box className={`${styles.companyBox} ${styles.companyBoxTwo}`}>
            <Box component={"h4"}>
              <h4>{t('Other Details')}</h4>
            </Box>
            <Grid container spacing={2}>
              <Grid item md={6}>
                <Box className={styles.companyBoxTwoContent}>
                  <table>
                    <tbody>
                      <tr>
                        <th>{t('Contact No')}</th>
                        <td>{company?.contactNo}</td>
                      </tr>
                      <tr className={styles.spacer}></tr>
                      <tr>
                        <th>{t('Email')}</th>
                        <td>{company?.email}</td>
                      </tr>
                      <tr className={styles.spacer}></tr>
                      <tr>
                        <th>{t('Street')}</th>
                        <td>{company?.street}</td>
                      </tr>
                      <tr className={styles.spacer}></tr>
                      <tr>
                        <th>{t('Zip')}</th>
                        <td>{company?.zip}</td>
                      </tr>
                      <tr className={styles.spacer}></tr>
                      <tr>
                        <th>{t('City')}</th>
                        <td>{company?.city}</td>
                      </tr>
                      <tr className={styles.spacer}></tr>
                      <tr>
                        <th>{t('Company Registration Number')}</th>
                        <td>{company?.companyRegistrationNumber}</td>
                      </tr>
                      <tr className={styles.spacer}></tr>
                      <tr>
                        <th>{t('Managing Director')}</th>
                        <td>{company?.managingDirector}</td>
                      </tr>
                    </tbody>
                  </table>
                </Box>
              </Grid>
              <Grid item md={6}>
                <Box className={styles.companyBoxTwoContent}>
                  <table>
                    <tbody>
                      <tr>
                        <th>{t('Tax Number')}</th>
                        <td>{company?.taxNumber}</td>
                      </tr>
                      <tr className={styles.spacer}></tr>
                      <tr>
                        <th>{t('Vat ID')}</th>
                        <td>{company?.vatID}</td>
                      </tr>
                      <tr className={styles.spacer}></tr>
                      <tr>
                        <th>{t('Partnership Agreement Dated')}</th>
                        <td>
                          {moment(company?.partnershipAgreementDated).format(
                            "DD-MM-YYYY"
                          )}
                        </td>
                      </tr>
                      <tr className={styles.spacer}></tr>
                      <tr>
                        <th>{t('Name of Bank')}</th>
                        <td>{company?.nameOfBank}</td>
                      </tr>
                      <tr className={styles.spacer}></tr>
                      <tr>
                        <th>{t('IBAN')}</th>
                        <td>{company?.iban}</td>
                      </tr>
                      <tr className={styles.spacer}></tr>
                      <tr>
                        <th>{t('BIC')}</th>
                        <td>{company?.bic}</td>
                      </tr>
                    </tbody>
                  </table>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </>
  );
}

export default Index;
