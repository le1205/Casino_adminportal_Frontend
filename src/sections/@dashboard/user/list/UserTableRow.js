import PropTypes from 'prop-types';
// @mui
import {
  Stack,
  TableRow,
  TableCell,
  Typography,
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import LocalParkingIcon from '@mui/icons-material/LocalParking';

// utils
import { convertLocalDateTime } from '../../../../utils/convert';

// ----------------------------------------------------------------------

UserTableRow.propTypes = {
  row: PropTypes.object,
  selected: PropTypes.bool,
  onEditRow: PropTypes.func,
  onSelectRow: PropTypes.func,
  onSelectMoney: PropTypes.func,
};

export default function UserTableRow({ row, selected, onEditRow, onSelectRow,  onSelectMoney }) {
  const { name, id, company, role, cash,  inOut, totalLoose, lastDate, point } = row;
  const dateString = convertLocalDateTime(lastDate) ;
  
  return (
      <TableRow hover selected={selected}>
        <TableCell align="left">{id}</TableCell>

        <TableCell>
          <Stack direction="row" alignItems="center" spacing={2}>
            <Typography variant="subtitle2" noWrap>
              {name}
            </Typography>
          </Stack>
        </TableCell>

        <TableCell align="left">{company}</TableCell>

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
            <PersonIcon color="primary"/>
            <AttachMoneyIcon color="warning"  
                onClick={() => {
                  onSelectMoney();
                }}/>
            <LocalParkingIcon color="error"/>
          </Stack>
        </TableCell>

        <TableCell align="left" sx={{ textTransform: 'capitalize' }}>
          {dateString}
        </TableCell>
      </TableRow>
  );
}
