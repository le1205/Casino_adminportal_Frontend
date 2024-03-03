// @mui
import {
    Typography,
  } from '@mui/material';

export const toNumberTag = (number, fixed = 5) => {
    if (!number || Number.isNaN(number)) {
        return '0.00';
    } 
        return <Typography variant="inherit">  {number?.toLocaleString()}</Typography>;
};
