import PropTypes from 'prop-types';
import { useState } from 'react';
// @mui
import {
  Button,
  TableRow,
  MenuItem,
  TableCell,
} from '@mui/material';
// components
import Label from '../../../../components/label';
import Iconify from '../../../../components/iconify';
import MenuPopover from '../../../../components/menu-popover';
import ConfirmDialog from '../../../../components/confirm-dialog';
// utils
import {parseJson } from '../../../../auth/utils';

// ----------------------------------------------------------------------

BetTotalTableRow.propTypes = {
  row: PropTypes.object,
  selected: PropTypes.bool,
  onEditRow: PropTypes.func,
  onDeleteRow: PropTypes.func,
  onSelectRow: PropTypes.func,
};

export default function BetTotalTableRow({ row, selected, onEditRow, onSelectRow, onDeleteRow, }) {
  const {username, round_id, provider_name, game_title, tx_type, bet, win, balance,  create_at, category, id, agent } = row;
  const { loginUser } = parseJson(localStorage.getItem('user') || "");

  const [openConfirm, setOpenConfirm] = useState(false);

  const [openPopover, setOpenPopover] = useState(null);

  const winLose = win - bet;

  const handleOpenConfirm = () => {
    setOpenConfirm(true);
  };

  const handleCloseConfirm = () => {
    setOpenConfirm(false);
  };

  const handleClosePopover = () => {
    setOpenPopover(null);
  };

  return (
    <>
      <TableRow hover selected={selected}>
        <TableCell align="center">{agent?.username || loginUser?.username }</TableCell>

        <TableCell align="center">{username}</TableCell>

        <TableCell align="center">{id}</TableCell>

        <TableCell>
          {provider_name}
        </TableCell>

        <TableCell align="center">{category}</TableCell>

        <TableCell align="center" sx={{ textTransform: 'capitalize' }}>
          {game_title}
        </TableCell>

        <TableCell align="center" sx={{ textTransform: 'capitalize' }}>
          {round_id}
        </TableCell>

        <TableCell align="center">
          {create_at}
        </TableCell>
{/* 
        <TableCell align="center">
          0
        </TableCell> */}

        <TableCell align="center">
          {bet.toLocaleString()}
        </TableCell>

        <TableCell align="center">
          {win.toLocaleString()}
        </TableCell>

        <TableCell align="center">
          {winLose.toLocaleString()}
        </TableCell>

        <TableCell align="center">
          {balance.toLocaleString()}
        </TableCell>

        <TableCell align="center">
          <Label
            variant="soft"
            color={(tx_type === 'bet' && 'error') || 'success'}
          >
            {tx_type}
          </Label>
        </TableCell>

      </TableRow>

      <MenuPopover
        open={openPopover}
        onClose={handleClosePopover}
        arrow="right-top"
        sx={{ width: 140 }}
      >
        <MenuItem
          onClick={() => {
            handleOpenConfirm();
            handleClosePopover();
          }}
          sx={{ color: 'error.main' }}
        >
          <Iconify icon="eva:trash-2-outline" />
          Delete
        </MenuItem>

        <MenuItem
          onClick={() => {
            onEditRow();
            handleClosePopover();
          }}
        >
          <Iconify icon="eva:edit-fill" />
          Edit
        </MenuItem>
      </MenuPopover>

      <ConfirmDialog
        open={openConfirm}
        onClose={handleCloseConfirm}
        title="Delete"
        content="Are you sure want to delete?"
        action={
          <Button variant="contained" color="error" onClick={onDeleteRow}>
            Delete
          </Button>
        }
      />
    </>
  );
}
