import PropTypes from 'prop-types';
import { useState } from 'react';
// @mui
import {
  TableRow,
  TableCell,
} from '@mui/material';
// components
import Label from '../../../../components/label';
// utils
import { fKoreanDate } from '../../../../utils/formatTime';

// ----------------------------------------------------------------------

InvoiceTableRow.propTypes = {
  row: PropTypes.object,
  selected: PropTypes.bool,
  onEditRow: PropTypes.func,
};

export default function InvoiceTableRow({ row, selected, onEditRow, }) {
  const {_id, userId, createdAt, currentBalance, beforeBalance, type, user, amount } = row;
  const dateString = fKoreanDate(createdAt) ;

  return (
    <TableRow hover selected={selected}>

        {/* <TableCell align="center">{}</TableCell>

        <TableCell align="center">{}</TableCell>

        <TableCell  align="center">
          {}
        </TableCell>

        <TableCell align="center">{}</TableCell> */}

        <TableCell align="center" >
          {user?.username}
        </TableCell>

        <TableCell align="center" >
          {}
        </TableCell>

        <TableCell align="center" >
          {}
        </TableCell>

        <TableCell align="center">
          {amount?.toLocaleString()}
        </TableCell>

        <TableCell align="center">
          {beforeBalance?.toLocaleString()}
        </TableCell>

        <TableCell align="center">
          {currentBalance?.toLocaleString()}
        </TableCell>
        

        <TableCell align="center">
          <Label
            variant="soft"
            color={(type === 'deposit' && 'success') || 'error'}
          >
            {type}
          </Label>
        </TableCell>

        <TableCell align="center">
          {dateString}
        </TableCell>

      </TableRow>
  );
}
