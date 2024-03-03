import PropTypes from 'prop-types';
// @mui
import {
  Stack,
  Tooltip,
  TableRow,
  TableCell,
  Typography,
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import LocalParkingIcon from '@mui/icons-material/LocalParking';
import KeyIcon from '@mui/icons-material/Key';
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';
// locales
import { useLocales } from '../../../../locales';

// utils
import { fKoreanDate } from '../../../../utils/formatTime';

// ----------------------------------------------------------------------

UserTableRow.propTypes = {
  row: PropTypes.object,
  index: PropTypes.number,
  page: PropTypes.number,
  selected: PropTypes.bool,
  onSelectMoney: PropTypes.func,
  onSelectRemove: PropTypes.func,
  onSelectChangePassword: PropTypes.func,
  onSelectChangeStatus: PropTypes.func,
};

export default function UserTableRow({ row, selected, index,  onSelectMoney, onSelectRemove, onSelectChangePassword, onSelectChangeStatus, page }) {
  const { name, id, no, creator, role, cash,  inOut, totalLoose, lastDate, point } = row;
  const { translate } = useLocales();
  const dateString = fKoreanDate(lastDate) ;
  
  return (
      <TableRow hover selected={selected}>
        <TableCell align="left">{no}</TableCell>

        <TableCell>
          <Stack direction="row" alignItems="center" spacing={2}>
            <Typography variant="subtitle2" noWrap>
              {name}
            </Typography>
          </Stack>
        </TableCell>

        <TableCell align="left">{creator}</TableCell>

        <TableCell align="left" sx={{ textTransform: 'capitalize' }}>
          {role}
        </TableCell>

        <TableCell align="left" sx={{ textTransform: 'capitalize' }}>
          {cash.toLocaleString()}
        </TableCell>

        {/* <TableCell align="left">
          {point.toLocaleString()}
        </TableCell>

        <TableCell align="left" sx={{ textTransform: 'capitalize' }}>
          {inOut}
        </TableCell>

        <TableCell align="left" sx={{ textTransform: 'capitalize' }}>
          {totalLoose.toLocaleString()}
        </TableCell> */}

        <TableCell>
          <Stack direction="row" alignItems="center" spacing={2}>
            <Tooltip title={`${translate('changeUserStatus')}`}>
              <PersonIcon color="primary"  
                onClick={() => {
                  onSelectChangeStatus();
                }}
              />
            </Tooltip>
            
            <Tooltip title={`${translate('cashDepWith')}`}>
              <AttachMoneyIcon color="warning"  
                onClick={() => {
                  onSelectMoney();
                }}
              />
            </Tooltip>
            {/* <Tooltip title={`${translate('pointDepWith')}`}>
              <LocalParkingIcon color="secondary"/>
            </Tooltip> */}
            <Tooltip title={`${translate('changePassword')}`}>
              <KeyIcon color="error"
                onClick={() => {
                  onSelectChangePassword();
                }}
              />
            </Tooltip>
            <Tooltip title={`${translate('removeUser')}`}>
              <PersonRemoveIcon color="black" 
                onClick={() => {
                  onSelectRemove();
                }}
              />
            </Tooltip>
          </Stack>
        </TableCell>

        <TableCell align="left" sx={{ textTransform: 'capitalize' }}>
          {dateString}
        </TableCell>
      </TableRow>
  );
}
