import PropTypes from 'prop-types';
import { useState } from 'react';
// @mui
import {
  Stack,
  Avatar,
  Button,
  Checkbox,
  TableRow,
  MenuItem,
  TableCell,
  IconButton,
  Typography,
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import LocalParkingIcon from '@mui/icons-material/LocalParking';
// components
import Label from '../../../../components/label';
import Iconify from '../../../../components/iconify';
import MenuPopover from '../../../../components/menu-popover';
import ConfirmDialog from '../../../../components/confirm-dialog';

// ----------------------------------------------------------------------

BetTotalTableRow.propTypes = {
  row: PropTypes.object,
  selected: PropTypes.bool,
  onEditRow: PropTypes.func,
  onDeleteRow: PropTypes.func,
  onSelectRow: PropTypes.func,
  onSelectMoney: PropTypes.func,
};

export default function BetTotalTableRow({ row, selected, onEditRow, onSelectRow, onDeleteRow, onSelectMoney }) {
  const {username, provider_name, game_title, tx_type, bet, win, balance,  create_at, category, id } = row;

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

        <TableCell align="center">{id}</TableCell>

        <TableCell align="center">{username}</TableCell>

        <TableCell>
          {game_title}
        </TableCell>

        <TableCell align="center">{category}</TableCell>

        <TableCell align="center" sx={{ textTransform: 'capitalize' }}>
          {game_title}
        </TableCell>

        <TableCell align="center" sx={{ textTransform: 'capitalize' }}>
          {id}
        </TableCell>

        <TableCell align="center">
          {create_at}
        </TableCell>

        <TableCell align="center">
          0
        </TableCell>

        <TableCell align="center">
          {bet}
        </TableCell>

        <TableCell align="center">
          {win}
        </TableCell>

        <TableCell align="center">
          {winLose}
        </TableCell>

        <TableCell align="center">
          {balance}
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
