import PropTypes from 'prop-types';
import { useState } from 'react';
// @mui
import {
  Stack,
  Button,
  TableRow,
  MenuItem,
  TableCell,
  Typography,
} from '@mui/material';
// components
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
  const { key, data, children, } = row;

  const [openConfirm, setOpenConfirm] = useState(false);

  const [openPopover, setOpenPopover] = useState(null);

  // eslint-disable-next-line no-unsafe-optional-chaining
  const [holdingPoint, setHoldingPoint] = useState(data?.live_main + data?.slot_main);
  

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

        <TableCell align="left">
          <Stack direction="row"
            alignItems="center">
            <Typography variant="body2">
              {data?.username}
            </Typography>
          </Stack>
          <Stack direction="row"
            alignItems="center">
            <Typography variant="body2">
              {data?.role.title}
            </Typography>
            <Typography variant="body2">
              ({data?.total_user})
            </Typography>
          </Stack>
        </TableCell>

        <TableCell align="left">
          <Stack direction="row"
            alignItems="center"
            justifyContent="space-between">
            <Typography variant="body2">
              Slot
            </Typography>
            <Typography variant="body2">
              R: {data?.slotRate}
            </Typography>
            <Typography variant="body2">
              L: {data?.loseSlotRate}
            </Typography>
          </Stack>
        </TableCell>

        <TableCell>
          <Stack direction="row"
            alignItems="center"
            justifyContent="space-between">
            <Typography variant="body2">
              Money:
            </Typography>
            <Typography variant="body2">
              {data?.balanceMain}
            </Typography>
          </Stack>
          <Stack direction="row"
            alignItems="center"
            justifyContent="space-between">
            <Typography variant="body2">
              Holding Point:
            </Typography>
            <Typography variant="body2">
              {holdingPoint}
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
              {data?.total_deposit}
            </Typography>
          </Stack>
          <Stack direction="row"
            alignItems="center"
            justifyContent="space-between">
            <Typography variant="body2">
              User Widthraw:
            </Typography>
            <Typography variant="body2">
              {data?.total_withdraw}
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
              {data?.bet_money_live_history}
            </Typography>
          </Stack>
          <Stack direction="row"
            alignItems="center"
            justifyContent="space-between">
            <Typography variant="body2">
              Win:
            </Typography>
            <Typography variant="body2">
              {data?.lose_money_liveadmin}
            </Typography>
          </Stack>
          <Stack direction="row"
            alignItems="center"
            justifyContent="space-between">
            <Typography variant="body2">
              Rolling:
            </Typography>
            <Typography variant="body2">
              {data?.bet_money_live}
            </Typography>
          </Stack>
          <Stack direction="row"
            alignItems="center"
            justifyContent="space-between">
            <Typography variant="body2">
              Losing:
            </Typography>
            <Typography variant="body2">
              {data?.total_money_count_losing_live}
            </Typography>
          </Stack>
          <Stack direction="row"
            alignItems="center"
            justifyContent="space-between">
            <Typography variant="body2">
              Balance:
            </Typography>
            <Typography variant="body2" color='text.warn'>
              {data?.total_money_count_live}
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
              {data?.bet_money_slot_history}
            </Typography>
          </Stack>
          <Stack direction="row"
            alignItems="center"
            justifyContent="space-between">
            <Typography variant="body2">
              Win:
            </Typography>
            <Typography variant="body2">
              {data?.lose_money_slotadmin}
            </Typography>
          </Stack>
          <Stack direction="row"
            alignItems="center"
            justifyContent="space-between">
            <Typography variant="body2">
              Rolling:
            </Typography>
            <Typography variant="body2">
              {data?.bet_money_slot}
            </Typography>
          </Stack>
          <Stack direction="row"
            alignItems="center"
            justifyContent="space-between">
            <Typography variant="body2">
              Losing:
            </Typography>
            <Typography variant="body2">
              {data?.total_money_count_losing_slot}
            </Typography>
          </Stack>
          <Stack direction="row"
            alignItems="center"
            justifyContent="space-between">
            <Typography variant="body2">
              Balance:
            </Typography>
            <Typography variant="body2" color='text.warn'>
              {data?.total_money_count_slot}
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
              {data?.sum_1}
            </Typography>
          </Stack>
          <Stack direction="row"
            alignItems="center"
            justifyContent="space-between">
            <Typography variant="body2">
              Win:
            </Typography>
            <Typography variant="body2">
              {data?.sum_2}
            </Typography>
          </Stack>
          <Stack direction="row"
            alignItems="center"
            justifyContent="space-between">
            <Typography variant="body2">
              Rolling:
            </Typography>
            <Typography variant="body2">
              {data?.sum_3}
            </Typography>
          </Stack>
          <Stack direction="row"
            alignItems="center"
            justifyContent="space-between">
            <Typography variant="body2">
              Losing:
            </Typography>
            <Typography variant="body2">
              {data?.sum_4}
            </Typography>
          </Stack>
          <Stack direction="row"
            alignItems="center"
            justifyContent="space-between">
            <Typography variant="body2">
              Balance:
            </Typography>
            <Typography variant="body2" color='text.warn'>
              {data?.sum_5}
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
