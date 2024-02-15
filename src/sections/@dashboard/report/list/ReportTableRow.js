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

ReportTableRow.propTypes = {
  row: PropTypes.object,
  selected: PropTypes.bool,
  onEditRow: PropTypes.func,
  onDeleteRow: PropTypes.func,
  onSelectRow: PropTypes.func,
  onSelectMoney: PropTypes.func,
};

export default function ReportTableRow({ row, selected, onEditRow, onSelectRow, onDeleteRow, onSelectMoney }) {
  const {_id, name, id, no, company, role, cash,  inOut, totalLoose, lastDate, point } = row;

  const [openConfirm, setOpenConfirm] = useState(false);

  const [openPopover, setOpenPopover] = useState(null);

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

        <TableCell align="left">{name}</TableCell>

        <TableCell align="left">{id}</TableCell>

        <TableCell>
          <Stack direction="row"
            alignItems="center"
            justifyContent="space-between">
            <Typography variant="body2">
              Money:
            </Typography>
            <Typography variant="body2">
              0
            </Typography>
          </Stack>
          <Stack direction="row"
            alignItems="center"
            justifyContent="space-between">
            <Typography variant="body2">
              Holding Point:
            </Typography>
            <Typography variant="body2">
              0
            </Typography>
          </Stack>
          <Stack direction="row"
            alignItems="center"
            justifyContent="space-between">
            <Typography variant="body2">
              Sub Holding Money:
            </Typography>
            <Typography variant="body2">
              0
            </Typography>
          </Stack>
          <Stack direction="row"
            alignItems="center"
            justifyContent="space-between">
            <Typography variant="body2">
              Sub Holding Point:
            </Typography>
            <Typography variant="body2">
              0
            </Typography>
          </Stack>
        </TableCell>

        <TableCell align="left">
          <Stack direction="row"
            alignItems="center"
            justifyContent="space-between">
            <Typography variant="body2">
              User Deposit:
            </Typography>
            <Typography variant="body2">
              0
            </Typography>
          </Stack>
          <Stack direction="row"
            alignItems="center"
            justifyContent="space-between">
            <Typography variant="body2">
              User Widthraw:
            </Typography>
            <Typography variant="body2">
              0
            </Typography>
          </Stack>
          <Stack direction="row"
            alignItems="center"
            justifyContent="space-between">
            <Typography variant="body2">
              Partner Deposit-Withdraw:
            </Typography>
            <Typography variant="body2">
              0
            </Typography>
          </Stack>
          <Stack direction="row"
            alignItems="center"
            justifyContent="space-between">
            <Typography variant="body2">
              Deposit-Withdraw:
            </Typography>
            <Typography variant="body2">
              0
            </Typography>
          </Stack>
        </TableCell>

        <TableCell align="left">
          
          <Stack direction="row"
            alignItems="center"
            justifyContent="space-between">
            <Typography variant="body2">
              Betting:
            </Typography>
            <Typography variant="body2">
              0
            </Typography>
          </Stack>
          <Stack direction="row"
            alignItems="center"
            justifyContent="space-between">
            <Typography variant="body2">
              Win:
            </Typography>
            <Typography variant="body2">
              0
            </Typography>
          </Stack>
          <Stack direction="row"
            alignItems="center"
            justifyContent="space-between">
            <Typography variant="body2">
              Rolling:
            </Typography>
            <Typography variant="body2">
              0
            </Typography>
          </Stack>
          <Stack direction="row"
            alignItems="center"
            justifyContent="space-between">
            <Typography variant="body2">
              Losing:
            </Typography>
            <Typography variant="body2">
              0
            </Typography>
          </Stack>
          <Stack direction="row"
            alignItems="center"
            justifyContent="space-between">
            <Typography variant="body2">
              Balance:
            </Typography>
            <Typography variant="body2" color='text.warn'>
              0
            </Typography>
          </Stack>
        </TableCell>

        <TableCell align="left" >
          <Stack direction="row"
            alignItems="center"
            justifyContent="space-between">
            <Typography variant="body2">
              Betting:
            </Typography>
            <Typography variant="body2">
              0
            </Typography>
          </Stack>
          <Stack direction="row"
            alignItems="center"
            justifyContent="space-between">
            <Typography variant="body2">
              Win:
            </Typography>
            <Typography variant="body2">
              0
            </Typography>
          </Stack>
          <Stack direction="row"
            alignItems="center"
            justifyContent="space-between">
            <Typography variant="body2">
              Rolling:
            </Typography>
            <Typography variant="body2">
              0
            </Typography>
          </Stack>
          <Stack direction="row"
            alignItems="center"
            justifyContent="space-between">
            <Typography variant="body2">
              Losing:
            </Typography>
            <Typography variant="body2">
              0
            </Typography>
          </Stack>
          <Stack direction="row"
            alignItems="center"
            justifyContent="space-between">
            <Typography variant="body2">
              Balance:
            </Typography>
            <Typography variant="body2" color='text.warn'>
              0
            </Typography>
          </Stack>
        </TableCell>

        <TableCell align="left">
          
          <Stack direction="row"
            alignItems="center"
            justifyContent="space-between">
            <Typography variant="body2">
              Betting:
            </Typography>
            <Typography variant="body2">
              0
            </Typography>
          </Stack>
          <Stack direction="row"
            alignItems="center"
            justifyContent="space-between">
            <Typography variant="body2">
              Win:
            </Typography>
            <Typography variant="body2">
              0
            </Typography>
          </Stack>
          <Stack direction="row"
            alignItems="center"
            justifyContent="space-between">
            <Typography variant="body2">
              Rolling:
            </Typography>
            <Typography variant="body2">
              0
            </Typography>
          </Stack>
          <Stack direction="row"
            alignItems="center"
            justifyContent="space-between">
            <Typography variant="body2">
              Losing:
            </Typography>
            <Typography variant="body2">
              0
            </Typography>
          </Stack>
          <Stack direction="row"
            alignItems="center"
            justifyContent="space-between">
            <Typography variant="body2">
              Balance:
            </Typography>
            <Typography variant="body2" color='text.warn'>
              0
            </Typography>
          </Stack>
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
