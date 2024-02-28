import PropTypes from 'prop-types';
import { useState } from 'react';
// @mui
import {
  Tooltip,
  TableRow,
  TableCell,
} from '@mui/material';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
// locales
import { useLocales } from '../../../../locales';
// utils
import {parseJson } from '../../../../auth/utils';

// ----------------------------------------------------------------------

InvoiceAmountTableRow.propTypes = {
  row: PropTypes.object,
  selected: PropTypes.bool,
  onSelectMoney: PropTypes.func,
};

export default function InvoiceAmountTableRow({ row, selected, onSelectMoney}) {
  const {_id, balance, creatorUsername, email, username } = row;
  const { translate } = useLocales();
  const loginUser = parseJson(localStorage.getItem('user') || "");
  return (
    <TableRow hover selected={selected}>
        <TableCell align="center" >
          {creatorUsername || loginUser?.username}
        </TableCell>

        <TableCell align="center" >
          {username}
        </TableCell>

        <TableCell align="center">
          {balance?.toLocaleString()}
        </TableCell>

        <TableCell align="center">
          
          <Tooltip title={`${translate('cashDepWith')}`}>
            <AttachMoneyIcon color="warning"  
              onClick={() => {
                onSelectMoney();
              }}
            />
          </Tooltip>
        </TableCell>
      </TableRow>
  );
}
