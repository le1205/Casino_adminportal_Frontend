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

// ----------------------------------------------------------------------

InvoiceTableRow.propTypes = {
  row: PropTypes.object,
  selected: PropTypes.bool,
  onEditRow: PropTypes.func,
};

export default function InvoiceTableRow({ row, selected, onEditRow, }) {
  const {_id,  createdAt, currentBalance, beforeBalance, type, user, amount, agent, role } = row;
  const dateString = fKoreanDate(createdAt) ;
  const userName = user[0]?.username || "";

  const loginUser = parseJson(localStorage.getItem('user') || "");

  return (
    <TableRow hover selected={selected}>

        {/* <TableCell align="center">{}</TableCell>

        <TableCell align="center">{}</TableCell>

        <TableCell  align="center">
          {}
        </TableCell>

        <TableCell align="center">{}</TableCell> */}

        <TableCell align="center" >
        {agent?.username === process.env.REACT_APP_ADMIN_DEVELOPER || agent?.username === process.env.REACT_APP_ADMIN_HEADCOACH ? '관리자' : agent?.username }
        </TableCell>

        <TableCell align="center" >
          {userName}
        </TableCell>

        <TableCell align="center" >
          {role?.name}
        </TableCell>

        <TableCell align="center">
          {amount?.toLocaleString()}
        </TableCell>

        <TableCell align="center">
          {beforeBalance?.toLocaleString()}
        </TableCell>

        <TableCell align="center">
          {currentBalance > 0 ? currentBalance.toLocaleString() : 0}
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
