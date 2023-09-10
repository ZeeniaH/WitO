import React, { useState } from "react";
import Loader from "../Elements/Loader";
import { Grid } from "@mui/material";
import { useEffect } from "react";
import PieChart1 from "./PieChart1";
import PieChart2 from "./PieChart2";
import PieChart3 from "./PieChart3";

import Header from "../Header";
import { Container } from "@mui/system";
import DashBoard from "./DashboardLayout";
import Navbar from "./Navbar";

const Dashboard = () => {
  const [loader, setLoader] = useState(true);

  // if (localStorage.getItem("token") !== "success") {
  //   window.location.href = "/";
  // }

  useEffect(() => {
    setLoader(false);
  }, []);
  return (
    <>
      <Header />
      <Grid container spacing={2}>
        <Grid item xs={2}>
          <Navbar />
        </Grid>
        <Grid item xs={10}>
          <Container>
            {loader ? (
              <div className='loader-container'>
                <div className='loader'>
                  <Loader />
                </div>
              </div>
            ) : (
              <Grid container className='dashboard'>
                <Grid item xs={10} md={4} className='cards'>
                  <div className='card'>
                    {/* <div className="card-title">180deg</div> */}
                    <div className='card-body'>
                      <PieChart1 />
                    </div>
                  </div>
                </Grid>
                <Grid item xs={12} md={4} className='cards'>
                  <div className='card'>
                    {/* <div className="card-title">TwoLevel</div> */}
                    <div className='card-body'>
                      <PieChart2 />
                    </div>
                  </div>
                </Grid>
                <Grid item xs={12} md={4} className='cards'>
                  <div className='card'>
                    {/* <div className="card-title">RadialBar</div> */}
                    <div className='card-body'>
                      <PieChart3 />
                    </div>
                  </div>
                </Grid>

                <Grid item xs={12}>
                  <div className='card'>
                    <img src={"/images/banner.png"} alt='banner' />
                  </div>
                </Grid>

                <Grid item xs={12} md={3} className='cards'>
                  <div className='card'>
                    <div className='card-title'>
                      <div className='count-title'>users</div>
                    </div>
                    <div className='card-body'>
                      <div className='count'>7,470</div>
                    </div>
                  </div>
                </Grid>
                <Grid item xs={12} md={3} className='cards'>
                  <div className='card'>
                    <div className='card-title'>
                      <div className='count-title'>active</div>
                    </div>
                    <div className='card-body'>
                      <div className='count'>3,230</div>
                    </div>
                  </div>
                </Grid>
                <Grid item xs={12} md={3} className='cards'>
                  <div className='card'>
                    <div className='card-title'>
                      <div className='count-title'>online</div>
                    </div>
                    <div className='card-body'>
                      <div className='count'>1,212</div>
                    </div>
                  </div>
                </Grid>
                <Grid item xs={12} md={3} className='cards'>
                  <div className='card'>
                    <div className='card-title'>
                      <div className='count-title'>new user</div>
                    </div>
                    <div className='card-body'>
                      <div className='count'>45</div>
                    </div>
                  </div>
                </Grid>

                <Grid item xs={12}>
                  <div className='card'>
                    <img src={"/images/banner2.png"} alt='banner2' />
                  </div>
                </Grid>
              </Grid>
            )}
          </Container>
        </Grid>
      </Grid>
    </>
  );
};

export default Dashboard;
