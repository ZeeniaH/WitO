import 'date-fns';
import React from 'react';
import Grid from '@mui/material/Grid';
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

export default function MaterialUIPickers({ setSelectedDate, selectedDate }) {
  // The first commit of Material-UI


  const handleDateChange = (date) => {
    setSelectedDate(date.toISOString());
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Grid container justifyContent="space-around" style={{ width: '97%', paddingLeft: '10px', paddingBottom: '15px' }}>
        <DatePicker
          fullWidth
          disableToolbar
          variant="outline"
          format="MM/dd/yyyy"
          margin="normal"
          id="date-picker-inline"
          label="Date paid"
          value={selectedDate}
          onChange={handleDateChange}
          KeyboardButtonProps={{
            'aria-label': 'change date',
          }}
        />
      </Grid>
    </LocalizationProvider>

  );
}
