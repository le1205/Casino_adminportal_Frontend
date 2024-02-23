import PropTypes from 'prop-types';
import { useState } from 'react';
// @mui
import {
  Stack,
  Button,
  TableRow,
  Switch,
  TableCell,
  Typography,
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import LocalParkingIcon from '@mui/icons-material/LocalParking';
// components
import Iconify from '../../../../components/iconify';
import MenuPopover from '../../../../components/menu-popover';
import ConfirmDialog from '../../../../components/confirm-dialog';
// locales
import { useLocales } from '../../../../locales';

// utils
import { convertLocalDateTime } from '../../../../utils/convert';
// ----------------------------------------------------------------------

UserConnectingTableRow.propTypes = {
  row: PropTypes.object,
  selected: PropTypes.bool,
  onEditRow: PropTypes.func,
  onDeleteRow: PropTypes.func,
  onSelectRow: PropTypes.func,
  onSelectMoney: PropTypes.func,
};

export default function UserConnectingTableRow({ row, selected, onEditRow, onSelectRow, onDeleteRow, onSelectMoney }) {
  const {_id, ip, username, company, role, cash,  lastDate, isVerified,  status, lastGame} = row;
  
  const { translate } = useLocales();

  const [openConfirm, setOpenConfirm] = useState(false);
  
  const dateString = convertLocalDateTime(lastDate) ;

  const handleCloseConfirm = () => {
    setOpenConfirm(false);
  };


  return (
    <>
      <TableRow hover selected={selected}>
        <TableCell align="left">{username}</TableCell>

        <TableCell>
          <Stack direction="row" alignItems="center" spacing={2}>
            <Typography variant="subtitle2" noWrap>
              {company}
            </Typography>
          </Stack>
        </TableCell>

        <TableCell align="left">{cash.toLocaleString()}</TableCell>

        <TableCell align="left" sx={{ textTransform: 'capitalize' }}>
          {dateString}
        </TableCell>

        <TableCell align="left" sx={{ textTransform: 'capitalize' }}>
          {ip}
        </TableCell>

        <TableCell align="left">
          {0}
        </TableCell>

        <TableCell align="left" sx={{ textTransform: 'capitalize' }}>
          {lastGame}
        </TableCell>

        <TableCell align="left" sx={{ textTransform: 'capitalize' }}>
          <Switch  checked={isVerified} />
        </TableCell>

        <TableCell align="left" sx={{ textTransform: 'capitalize' }}>
            <Switch  checked={status} />
        </TableCell>

        <TableCell align="left" sx={{ textTransform: 'capitalize' }}>
          <Button variant="contained" color="warning" size="small"> 
            {`${translate('bettingList')}`}
          </Button>
        </TableCell>

        <TableCell align="left" sx={{ textTransform: 'capitalize' }}>
          <Button variant="contained" color="error" size="small"> 
            {`${translate('logout')}`}
          </Button>
        </TableCell>

      </TableRow>

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
