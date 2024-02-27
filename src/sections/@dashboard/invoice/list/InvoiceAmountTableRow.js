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

// ----------------------------------------------------------------------

InvoiceAmountTableRow.propTypes = {
  row: PropTypes.object,
  selected: PropTypes.bool,
  onSelectMoney: PropTypes.func,
};

export default function InvoiceAmountTableRow({ row, selected, onSelectMoney}) {
  const {_id, balance, creatorUsername, email, username } = row;
  const { translate } = useLocales();
  return (
    <TableRow hover selected={selected}>

        <TableCell align="center" >
          {}
        </TableCell>

        <TableCell align="center" >
          {creatorUsername}
        </TableCell>

        <TableCell align="center" >
          {username}
        </TableCell>

        <TableCell align="center">
          {balance}
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
