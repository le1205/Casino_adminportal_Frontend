// @mui
import {
    Typography,
  } from '@mui/material';

export const toNumberTag = (number, fixed = 5) => {
    if (!number || Number.isNaN(number)) {
        return '0';
    } 
        return <Typography variant="inherit">  {Math.trunc(number)?.toLocaleString()}</Typography>;
};

export const toNumberString = (number, fixed = 5) => {
    if (!number || Number.isNaN(number)) {
        return '0';
    } 
        return  Math.trunc(number)?.toLocaleString();
};
