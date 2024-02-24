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
import KeyboardDoubleArrowUpIcon from '@mui/icons-material/KeyboardDoubleArrowUp';
import KeyboardDoubleArrowDownIcon from '@mui/icons-material/KeyboardDoubleArrowDown';
// components
import Iconify from '../../../../components/iconify';
import MenuPopover from '../../../../components/menu-popover';
import ConfirmDialog from '../../../../components/confirm-dialog';


// ----------------------------------------------------------------------

ReportTableRow.propTypes = {
  row: PropTypes.object,
  display:PropTypes.bool,
  count:PropTypes.number,
  selected: PropTypes.bool,
  onEditRow: PropTypes.func,
  onDeleteRow: PropTypes.func,
  onSelectRow: PropTypes.func,
  onClickDownArrow: PropTypes.func,
  onClickUpArrow: PropTypes.func,
};

export default function ReportTableRow({ row, display, selected, onEditRow, onSelectRow, onDeleteRow, onClickDownArrow, onClickUpArrow, count}) {
  const data = row;
  const {role} = row;

  const [openConfirm, setOpenConfirm] = useState(false);

  const [openPopover, setOpenPopover] = useState(null);

  // eslint-disable-next-line no-unsafe-optional-chaining
  const holdingPoint = data?.live_main + data?.slot_main || 0;
  // eslint-disable-next-line no-unsafe-optional-chaining
  const totalBet = data?.bet_live + data?.bet_slot || 0;
  // eslint-disable-next-line no-unsafe-optional-chaining
  const totalWin = data?.win_live + data?.win_slot || 0;
  // eslint-disable-next-line no-unsafe-optional-chaining
  const totalRolling = data?.bet_money_live + data?.bet_money_slot || 0;
  // eslint-disable-next-line no-unsafe-optional-chaining
  const totalLoosing = data?.lose_money_live + data?.lose_money_slot || 0;
  // eslint-disable-next-line no-unsafe-optional-chaining
  const totalBalance = data?.balance_live + data?.balance_slot || 0;

  

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
      <TableRow key={data?._id} hover selected={selected} 
          sx={{
            ...(display === true && {
              display: 'table-row',
            }),
            ...(display === false && {
              display: 'none',
            }),
          }}
      >
        <TableCell align="left"
          sx={{
              ...(role?.order ===1 && {
                pl: 0,
              }),
              ...(role?.order ===2 && {
                pl: 1,
              }),
              ...(role?.order ===3 && {
                pl: 2,
              }),
              ...(role?.order ===4 && {
                pl: 3,
              }),
              ...(role?.order ===5 && {
                pl: 4,
              }),
              ...(role?.order ===6 && {
                pl: 5,
              }),
          }}>
          <Stack direction="row"
            alignItems="center">
            <Typography variant="body2">
              {data?.username}
            </Typography>
          </Stack>
          <Stack direction="row"
            alignItems="center">
            <Typography variant="body2">
              {data?.role.name}
            </Typography>
            <Typography variant="body2">
              ({data?.total_user})
            </Typography>
          </Stack>
          <Stack direction="row"
            alignItems="right"
            justifyContent="flex-end"
            sx={{
              mt: 1,
              height: 58,
              ...(data?.total_user > 0 && {
                height: 38,
              }),
            }}>
              {data?.expand === false && data?.total_user >0 && <KeyboardDoubleArrowDownIcon onClick={onClickDownArrow} color='success' />}
              {data?.expand === true && data?.total_user >0 && <KeyboardDoubleArrowUpIcon onClick={onClickUpArrow} color='warning' />}
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
              {data?.balanceMain?.toLocaleString()}
            </Typography>
          </Stack>
          <Stack direction="row"
            alignItems="center"
            justifyContent="space-between">
            <Typography variant="body2">
              Holding Point:
            </Typography>
            <Typography variant="body2">
              {holdingPoint?.toLocaleString() || 0}
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
              {data?.total_deposit?.toLocaleString() || 0}
            </Typography>
          </Stack>
          <Stack direction="row"
            alignItems="center"
            justifyContent="space-between">
            <Typography variant="body2">
              User Widthraw:
            </Typography>
            <Typography variant="body2">
              {data?.total_withdraw?.toLocaleString() || 0}
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
              {data?.bet_live?.toLocaleString()}
            </Typography>
          </Stack>
          <Stack direction="row"
            alignItems="center"
            justifyContent="space-between">
            <Typography variant="body2">
              Win:
            </Typography>
            <Typography variant="body2">
              {data?.win_live?.toLocaleString()}
            </Typography>
          </Stack>
          <Stack direction="row"
            alignItems="center"
            justifyContent="space-between">
            <Typography variant="body2">
              Rolling:
            </Typography>
            <Typography variant="body2">
              {data?.bet_money_live?.toLocaleString()}
            </Typography>
          </Stack>
          <Stack direction="row"
            alignItems="center"
            justifyContent="space-between">
            <Typography variant="body2">
              Losing:
            </Typography>
            <Typography variant="body2">
              {data?.lose_money_live?.toLocaleString()}
            </Typography>
          </Stack>
          <Stack direction="row"
            alignItems="center"
            justifyContent="space-between">
            <Typography variant="body2">
              Balance:
            </Typography>
            <Typography variant="body2" color='text.warn'>
              {data?.balance_live?.toLocaleString()}
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
              {data?.bet_slot?.toLocaleString()}
            </Typography>
          </Stack>
          <Stack direction="row"
            alignItems="center"
            justifyContent="space-between">
            <Typography variant="body2">
              Win:
            </Typography>
            <Typography variant="body2">
              {data?.win_slot?.toLocaleString()}
            </Typography>
          </Stack>
          <Stack direction="row"
            alignItems="center"
            justifyContent="space-between">
            <Typography variant="body2">
              Rolling:
            </Typography>
            <Typography variant="body2">
              {data?.bet_money_slot?.toLocaleString()}
            </Typography>
          </Stack>
          <Stack direction="row"
            alignItems="center"
            justifyContent="space-between">
            <Typography variant="body2">
              Losing:
            </Typography>
            <Typography variant="body2">
              {data?.lose_money_slot?.toLocaleString()}
            </Typography>
          </Stack>
          <Stack direction="row"
            alignItems="center"
            justifyContent="space-between">
            <Typography variant="body2">
              Balance:
            </Typography>
            <Typography variant="body2" color='text.warn'>
              {data?.balance_slot?.toLocaleString()}
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
              {totalBet?.toLocaleString()}
            </Typography>
          </Stack>
          <Stack direction="row"
            alignItems="center"
            justifyContent="space-between">
            <Typography variant="body2">
              Win:
            </Typography>
            <Typography variant="body2">
              {totalWin?.toLocaleString()}
            </Typography>
          </Stack>
          <Stack direction="row"
            alignItems="center"
            justifyContent="space-between">
            <Typography variant="body2">
              Rolling:
            </Typography>
            <Typography variant="body2">
              {totalRolling?.toLocaleString()}
            </Typography>
          </Stack>
          <Stack direction="row"
            alignItems="center"
            justifyContent="space-between">
            <Typography variant="body2">
              Losing:
            </Typography>
            <Typography variant="body2">
              {totalLoosing?.toLocaleString()}
            </Typography>
          </Stack>
          <Stack direction="row"
            alignItems="center"
            justifyContent="space-between">
            <Typography variant="body2">
              Balance:
            </Typography>
            <Typography variant="body2" color='text.warn'>
              {totalBalance?.toLocaleString()}
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
