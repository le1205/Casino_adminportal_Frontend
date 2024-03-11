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
import {parseJson } from '../../../../auth/utils';
import { toNumberString } from '../../../../utils/convert';

// ----------------------------------------------------------------------

InvoiceAdminTableRow.propTypes = {
  row: PropTypes.object,
  selected: PropTypes.bool,
  onEditRow: PropTypes.func,
};

export default function InvoiceAdminTableRow({ row, selected, onEditRow, }) {
  const {_id,  createdAt, currentBalance, beforeBalance, type, userId, amount, agent, role } = row;
  const dateString = fKoreanDate(createdAt) ;
  const userName = userId?.username || "";

  const loginUser = parseJson(localStorage.getItem('user') || "");

  return (
    <TableRow hover selected={selected}>

        {/* <TableCell align="center" >
          {userName}
        </TableCell> */}

        <TableCell align="center" >
          {userId?.rolesId?.title}
        </TableCell>

        <TableCell align="center">
          {toNumberString(amount)}
        </TableCell>

        <TableCell align="center">
          {beforeBalance > 0 ? toNumberString(beforeBalance) : 0}
        </TableCell>

        <TableCell align="center">
          {currentBalance > 0 ? toNumberString(currentBalance) : 0}
        </TableCell>
        

        <TableCell align="center">
          <Label
            variant="soft"
            color={(type === 'deposit' && 'success') || 'error'}
          >
            {(type === 'deposit' && '입금') || '출금'}
          </Label>
        </TableCell>

        <TableCell align="center">
          {dateString}
        </TableCell>

      </TableRow>
  );
}
