import PropTypes from 'prop-types';
import { useState } from 'react';
// @mui
import {
  Stack,
  Avatar,
  Button,
  Switch,
  TableRow,
  MenuItem,
  TableCell,
  IconButton,
  Typography,
} from '@mui/material';
// components
import Label from '../../../../components/label';
import Iconify from '../../../../components/iconify';
import MenuPopover from '../../../../components/menu-popover';
import ConfirmDialog from '../../../../components/confirm-dialog';

// ----------------------------------------------------------------------

PartnerTableRow.propTypes = {
  row: PropTypes.object,
  selected: PropTypes.bool,
  onEditRow: PropTypes.func,
  onDeleteRow: PropTypes.func,
  onSelectRow: PropTypes.func,
};

export default function PartnerTableRow({ row, selected, onEditRow, onSelectRow, onDeleteRow }) {
  const {id, name, level, slotRolling, slotLoosing, moneySend, moneyReceive, partner, user, money, point, role, createPartner, createUser, isVerified, status } = row;

  const [openConfirm, setOpenConfirm] = useState(false);

  const [openPopover, setOpenPopover] = useState(null);

  const handleOpenConfirm = () => {
    setOpenConfirm(true);
  };

  const handleCloseConfirm = () => {
    setOpenConfirm(false);
  };

  const handleOpenPopover = (event) => {
    setOpenPopover(event.currentTarget);
  };

  const handleClosePopover = () => {
    setOpenPopover(null);
  };

  return (
    <>
      <TableRow hover selected={selected}>
        {/* <TableCell padding="checkbox">
          <Checkbox checked={selected} onClick={onSelectRow} />
        </TableCell> */}

        <TableCell align="left">{id}</TableCell>

        <TableCell>
          <Stack direction="row" alignItems="center" spacing={2}>
            <Typography variant="subtitle2" noWrap>
              {name}
            </Typography>
          </Stack>
        </TableCell>

        <TableCell>
          <Stack direction="row" alignItems="center" spacing={2}>
            <Typography variant="subtitle3" noWrap>
              {level}
            </Typography>
          </Stack>
        </TableCell>

        <TableCell align="left">{slotRolling}</TableCell>

        <TableCell align="left">{slotLoosing}</TableCell>

        <TableCell>
          <Stack direction="row" alignItems="center" spacing={2}>
            <Switch  checked={(moneySend === 1)} />
          </Stack>
        </TableCell>

        <TableCell>
          <Stack direction="row" alignItems="center" spacing={2}>
            <Switch  checked={(moneyReceive === 1)} />
          </Stack>
        </TableCell>

        <TableCell align="left">{partner}</TableCell>

        <TableCell align="left">{user}</TableCell>
        
        <TableCell align="left">{money}</TableCell>
        
        <TableCell align="left">{point}</TableCell>

        <TableCell align="left">
          {(createPartner === 1 )&& 
            <Button color="info" variant="soft" size="small"  >
                move
            </Button>
           }
        </TableCell>

        <TableCell align="left">
          {(createUser === 1 )&& 
            <Button variant="contained" color="success" size="small" >
                move
            </Button>
          }
        </TableCell>

        <TableCell align="left">
            <Button variant="contained" color="warning" size="small"> 
                save
            </Button>
        </TableCell>

        {/* <TableCell align="right">
          <IconButton color={openPopover ? 'inherit' : 'default'} onClick={handleOpenPopover}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell> */}
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
