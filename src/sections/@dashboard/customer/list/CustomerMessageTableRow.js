import PropTypes from 'prop-types';
import { useState } from 'react';
// @mui
import {
  Tooltip,
  TableRow,
  TableCell,
} from '@mui/material';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import EditNoteIcon from '@mui/icons-material/EditNote';
import DeleteSweepIcon from '@mui/icons-material/DeleteSweep';
// components
import Label from '../../../../components/label';
// locales
import { useLocales } from '../../../../locales';
// utils
import {parseJson } from '../../../../auth/utils';
import { fKoreanDate } from '../../../../utils/formatTime';

// ----------------------------------------------------------------------

CustomerMessageTableRow.propTypes = {
  row: PropTypes.object,
  selected: PropTypes.bool,
  onSelectEdit: PropTypes.func,
  onSelectRemove: PropTypes.func,
};

export default function CustomerMessageTableRow({ row, selected, onSelectEdit, onSelectRemove}) {
  const {_id,  status, title, userId, createdAt } = row;
  const { translate } = useLocales();
  const loginUser = parseJson(localStorage.getItem('user') || "");
  return (
    <TableRow hover selected={selected}>
        <TableCell align="center" >
          {fKoreanDate(createdAt)}
        </TableCell>

        <TableCell align="center" >
          {userId?.username}
        </TableCell>

        <TableCell align="center">
          {title}
        </TableCell>

        <TableCell align="center">
          <Label
            variant="soft"
            color={(status === 'reading' && 'error') ||  'success'}
          >
            {`${translate(status?.toLowerCase())}`}
          </Label>
        </TableCell>

        <TableCell align="center">
          
          <Tooltip title={`${translate('edit')}`}>
            <EditNoteIcon color="success"  
              sx={{ ml: 1, cursor:"pointer" }} 
              onClick={() => {
                onSelectEdit();
              }}
            />
          </Tooltip>
          <Tooltip title={`${translate('remove')}`}>
            <DeleteSweepIcon color="error" 
              sx={{ ml: 1, cursor:"pointer"}} 
              onClick={() => {
                onSelectRemove();
              }}
            />
          </Tooltip>
        </TableCell>
      </TableRow>
  );
}
