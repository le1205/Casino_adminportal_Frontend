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
import { useTheme } from '@mui/material/styles';
// locales
import { useLocales } from '../../../../locales';
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
  const { translate } = useLocales();
  const theme = useTheme();

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
            <Typography variant="body2"
              sx={{
                ...(role?.order ===1 && {
                  color: theme.palette.info.main,
                }),
                ...(role?.order ===2 && {
                  color: theme.palette.warning.main,
                }),
                ...(role?.order ===3 && {
                  color: theme.palette.success.main,
                }),
                ...(role?.order ===4 && {
                  color: theme.palette.common.main,
                }),
                ...(role?.order ===5 && {
                  color: theme.palette.primary.main,
                }),
                ...(role?.order ===6 && {
                  color: theme.palette.secondary.main,
                }),
            }}>
              ({data?.role.name})
            </Typography>
          </Stack>
          <Stack direction="row"
            alignItems="center">
            <Typography variant="body2">
              총관리
            </Typography>
            {data?.total_user > 0 && 
              <Typography variant="body2">
                ({data?.total_user})
              </Typography>
            }
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
              {data?.expand === false && data?.total_user >0 && <KeyboardDoubleArrowDownIcon onClick={onClickDownArrow} color='success' sx={{cursor: 'pointer'}}/>}
              {data?.expand === true && data?.total_user >0 && <KeyboardDoubleArrowUpIcon onClick={onClickUpArrow} color='warning' sx={{cursor: 'pointer'}}/>}
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

        <TableCell sx={{ textTransform: 'capitalize' }}>
          <Stack direction="row"
            alignItems="center"
            justifyContent="space-between">
            <Typography variant="body2">
              {`${translate('holdingMoney')}`}
            </Typography>
            <Typography variant="body2">
              {data?.balanceMain?.toLocaleString()}
            </Typography>
          </Stack>
          <Stack direction="row"
            alignItems="center"
            justifyContent="space-between">
            <Typography variant="body2">
              {`${translate('holdingPoint')}`}
            </Typography>
            <Typography variant="body2">
              {holdingPoint?.toLocaleString() || 0}
            </Typography>
          </Stack>
          <Stack direction="row"
            alignItems="center"
            justifyContent="space-between">
            <Typography variant="body2" sx={{ color: theme.palette.info.main }}>
              {`${translate('subHoldingMoney')}`}:
            </Typography>
            <Typography variant="body2" sx={{ color: theme.palette.info.main }}>
              0
            </Typography>
          </Stack>
          <Stack direction="row"
            alignItems="center"
            justifyContent="space-between">
            <Typography variant="body2" sx={{ color: theme.palette.info.main }}>
            {`${translate('subHoldingPoint')}`}:
            </Typography>
            <Typography variant="body2" sx={{ color: theme.palette.info.main }}>
              0
            </Typography>
          </Stack>
        </TableCell>

        <TableCell align="left" sx={{ textTransform: 'capitalize' }}>
          <Stack direction="row"
            alignItems="center"
            justifyContent="space-between">
            <Typography variant="body2">
              {`${translate('userDeposit')}`}
            </Typography>
            <Typography variant="body2">
              {data?.total_deposit?.toLocaleString() || 0}
            </Typography>
          </Stack>
          <Stack direction="row"
            alignItems="center"
            justifyContent="space-between">
            <Typography variant="body2">
              {`${translate('userWithdraw')}`}
            </Typography>
            <Typography variant="body2">
              {data?.total_withdraw?.toLocaleString() || 0}
            </Typography>
          </Stack>
          <Stack direction="row"
            alignItems="center"
            justifyContent="space-between">
            <Typography variant="body2">
              {`${translate('partnerDepMinWid')}`}
            </Typography>
            <Typography variant="body2">
              0
            </Typography>
          </Stack>
          <Stack direction="row"
            alignItems="center"
            justifyContent="space-between">
            <Typography variant="body2">
              {`${translate('depositMinWithdraw')}`}
            </Typography>
            <Typography variant="body2">
              0
            </Typography>
          </Stack>
        </TableCell>

        <TableCell align="left" sx={{ textTransform: 'capitalize' }}>
          
          <Stack direction="row"
            alignItems="center"
            justifyContent="space-between">
            <Typography variant="body2">
              {`${translate('betting')}`}:
            </Typography>
            <Typography variant="body2">
              {data?.bet_live?.toLocaleString()}
            </Typography>
          </Stack>
          <Stack direction="row"
            alignItems="center"
            justifyContent="space-between">
            <Typography variant="body2">
              {`${translate('win')}`}:
            </Typography>
            <Typography variant="body2">
              {data?.win_live?.toLocaleString()}
            </Typography>
          </Stack>
          <Stack direction="row"
            alignItems="center"
            justifyContent="space-between">
            <Typography variant="body2">
              {`${translate('rolling')}`}:
            </Typography>
            <Typography variant="body2">
              {data?.bet_money_live?.toLocaleString()}
            </Typography>
          </Stack>
          <Stack direction="row"
            alignItems="center"
            justifyContent="space-between">
            <Typography variant="body2">
              {`${translate('losing')}`}:
            </Typography>
            <Typography variant="body2">
              {data?.lose_money_live?.toLocaleString()}
            </Typography>
          </Stack>
          <Stack direction="row"
            alignItems="center"
            justifyContent="space-between">
            <Typography variant="body2">
              {`${translate('balance')}`}:
            </Typography>
            <Typography variant="body2" sx={{ color: theme.palette.info.main }}>
              {data?.balance_live?.toLocaleString()}
            </Typography>
          </Stack>
        </TableCell>

        <TableCell align="left" sx={{ textTransform: 'capitalize' }}>
          <Stack direction="row"
            alignItems="center"
            justifyContent="space-between">
            <Typography variant="body2">
              {`${translate('betting')}`}:
            </Typography>
            <Typography variant="body2">
              {data?.bet_slot?.toLocaleString()}
            </Typography>
          </Stack>
          <Stack direction="row"
            alignItems="center"
            justifyContent="space-between">
            <Typography variant="body2">
              {`${translate('win')}`}:
            </Typography>
            <Typography variant="body2">
              {data?.win_slot?.toLocaleString()}
            </Typography>
          </Stack>
          <Stack direction="row"
            alignItems="center"
            justifyContent="space-between">
            <Typography variant="body2">
              {`${translate('rolling')}`}:
            </Typography>
            <Typography variant="body2">
              {data?.bet_money_slot?.toLocaleString()}
            </Typography>
          </Stack>
          <Stack direction="row"
            alignItems="center"
            justifyContent="space-between">
            <Typography variant="body2">
              {`${translate('losing')}`}:
            </Typography>
            <Typography variant="body2">
              {data?.lose_money_slot?.toLocaleString()}
            </Typography>
          </Stack>
          <Stack direction="row"
            alignItems="center"
            justifyContent="space-between">
            <Typography variant="body2">
              {`${translate('balance')}`}:
            </Typography>
            <Typography variant="body2" sx={{ color: theme.palette.info.main }}>
              {data?.balance_slot?.toLocaleString()}
            </Typography>
          </Stack>
        </TableCell>

        <TableCell align="left" sx={{ textTransform: 'capitalize' }}>
          
          <Stack direction="row"
            alignItems="center"
            justifyContent="space-between">
            <Typography variant="body2">
              {`${translate('totalBet')}`}:
            </Typography>
            <Typography variant="body2">
              {totalBet?.toLocaleString()}
            </Typography>
          </Stack>
          <Stack direction="row"
            alignItems="center"
            justifyContent="space-between">
            <Typography variant="body2">
              {`${translate('totalWin')}`}:
            </Typography>
            <Typography variant="body2">
              {totalWin?.toLocaleString()}
            </Typography>
          </Stack>
          <Stack direction="row"
            alignItems="center"
            justifyContent="space-between">
            <Typography variant="body2">
              {`${translate('totalRollAmount')}`}:
            </Typography>
            <Typography variant="body2">
              {totalRolling?.toLocaleString()}
            </Typography>
          </Stack>
          <Stack direction="row"
            alignItems="center"
            justifyContent="space-between">
            <Typography variant="body2">
              {`${translate('totalLosing')}`}:
            </Typography>
            <Typography variant="body2">
              {totalLoosing?.toLocaleString()}
            </Typography>
          </Stack>
          <Stack direction="row"
            alignItems="center"
            justifyContent="space-between">
            <Typography variant="body2">
              {`${translate('totalBalance')}`}:
            </Typography>
            <Typography variant="body2" sx={{ color: theme.palette.info.main }}>
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
