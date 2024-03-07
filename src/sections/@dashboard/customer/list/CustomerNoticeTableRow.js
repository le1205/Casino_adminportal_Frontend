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

CustomerNoticeTableRow.propTypes = {
  row: PropTypes.object,
  selected: PropTypes.bool,
  onSelectEdit: PropTypes.func,
  onSelectRemove: PropTypes.func,
  onSelectStatus: PropTypes.func,
};

export default function CustomerNoticeTableRow({ row, selected, onSelectEdit, onSelectRemove, onSelectStatus}) {
  const { id,  status, title, userId, createdAt } = row;
  const { translate } = useLocales();
  const loginUser = parseJson(localStorage.getItem('user') || "");
  return (
    <TableRow hover selected={selected}>
        <TableCell align="center" width="20%">
          {fKoreanDate(createdAt)}
        </TableCell>

        <TableCell align="center" width="60%">
          {title}
        </TableCell>

        <TableCell align="center" width="10%">
          <Label
            variant="soft"
            sx={{ width: "50px", cursor:"pointer" }} 
            onClick={() => {
              onSelectStatus();
            }}
            color={(status === 'reading') ? 'success' : 'warning'}
          >
            {(status === 'reading') ? `${translate('waiting')}` : `${translate('posted')}`}
          </Label>
        </TableCell>

        <TableCell align="center" width="10%">
          
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
