import PropTypes from 'prop-types';
import { useState } from 'react';
// @mui
import {
  Tooltip,
  TableRow,
  TableCell,
} from '@mui/material';
import EditNoteIcon from '@mui/icons-material/EditNote';
import DeleteSweepIcon from '@mui/icons-material/DeleteSweep';
// components
import Label from '../../../../components/label';
import Image from '../../../../components/image';
// locales
import { useLocales } from '../../../../locales';
// utils
import {parseJson } from '../../../../auth/utils';
import { fKoreanDate } from '../../../../utils/formatTime';

// ----------------------------------------------------------------------

CustomerBlogTableRow.propTypes = {
  row: PropTypes.object,
  selected: PropTypes.bool,
  onSelectEdit: PropTypes.func,
  onSelectRemove: PropTypes.func,
};

export default function CustomerBlogTableRow({ row, selected, onSelectEdit, onSelectRemove}) {
  const {image,  status, title, creatorId, createdAt } = row;
  const { translate } = useLocales();
  const loginUser = parseJson(localStorage.getItem('user') || "");
  return (
    <TableRow hover selected={selected}>

        <TableCell align="center" width="20%">
          {title}
        </TableCell>

        <TableCell align="center" width="15%">
          {creatorId?.username === process.env.REACT_APP_ADMIN_DEVELOPER || creatorId?.username === process.env.REACT_APP_ADMIN_HEADCOACH ? '관리자' : creatorId?.username }
        </TableCell>

        <TableCell align="center" width="15%">
          <Image
            src={image}
            sx ={{width:60, ml:10}}
          />
        </TableCell>

        <TableCell align="center" width="10%">
          <Label
            variant="soft"
            color={(status === 'hide' && 'error') ||  'success'}
          >
            {`${translate(status?.toLowerCase())}`}
          </Label>
        </TableCell>

        <TableCell align="center" width="20%">
          {fKoreanDate(createdAt)}
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
