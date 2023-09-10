import React from "react";
import { HashRouter as Router, Route } from "react-router-dom";
import Dashboard from "./Dashboard";
// import Contact from "../Pages/Cantact/Contact";
// import Profile from "../Pages/Profile/Profile";
import Navbar from "./Navbar";
import { Grid, Switch } from "@mui/material";

// import TopHeader from "../TopHeader/TopHeader";
// import UnderConstruction from "../Pages/Underconstruction/UnderConstruction";
// import Elements from "../Pages/Elements/Elements";
// import Table from "../Pages/Table/Table";

const DashboardLayout = () => {
  return (
    <Grid container>
      {/* <Grid item xs={12}>
          <TopHeader />
        </Grid> */}

      <Grid item xs={2} className='navbar-main-container'>
        <Navbar />
      </Grid>
    </Grid>
  );
};

export default DashboardLayout;
