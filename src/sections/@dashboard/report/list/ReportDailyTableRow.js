import PropTypes from 'prop-types';
// @mui
import {
  TableRow,
  TableCell,
  Typography,
} from '@mui/material';
import moment from 'moment';

// ----------------------------------------------------------------------

ReportDailyTableRow.propTypes = {
  row: PropTypes.object,
  selected: PropTypes.bool,
  onEditRow: PropTypes.func,
};

export default function ReportDailyTableRow({ row, selected, onEditRow }) {
  // eslint-disable-next-line no-unsafe-optional-chaining
  const holdingPoint = row?.deposit - row?.withdraw || 0;
  // eslint-disable-next-line no-unsafe-optional-chaining
  const totalBet = row?.bet_slot + row?.bet_live || 0;
  // eslint-disable-next-line no-unsafe-optional-chaining
  const totalWin = row?.win_live + row?.win_slot || 0;
  // eslint-disable-next-line no-unsafe-optional-chaining
  const totalRolling = row?.balance_live + row?.balance_slot || 0;
  // eslint-disable-next-line no-unsafe-optional-chaining
  const totalLoosing = row?.lose_money_live + row?.lose_money_slot || 0;
  // eslint-disable-next-line no-unsafe-optional-chaining
  const settlementLive = row?.bet_live - row?.win_live - row?.balance_live || 0;
  // eslint-disable-next-line no-unsafe-optional-chaining
  const settlementSlot = row?.bet_slot - row?.win_slot - row?.balance_slot || 0;
  const settlementTotal = totalBet - totalWin - totalRolling;
  
  const data = moment(row?.date).format('YYYY-MM-DD') || '';

  return (
    <TableRow hover selected={selected}>
        <TableCell align="center">
          <Typography variant="body2">
            {data}
          </Typography>
        </TableCell>

        {/* <TableCell align="center">
          <Typography variant="body2">
            {row?.username}
          </Typography>
        </TableCell> */}

        <TableCell align="center">
          <Typography variant="body2">
            {row?.deposit?.toLocaleString()}
          </Typography>
        </TableCell>

        <TableCell align="center">
          <Typography variant="body2">
          {row?.withdraw?.toLocaleString()}
          </Typography>
        </TableCell>

        <TableCell align="center">
          <Typography variant="body2">
            {holdingPoint?.toLocaleString()}
          </Typography>
        </TableCell>

        <TableCell align="center">
          <Typography variant="body2">
            {row?.bet_live?.toLocaleString()}
          </Typography>
        </TableCell>

        <TableCell align="center">
          <Typography variant="body2">
            {row?.bet_slot?.toLocaleString()}
          </Typography>
        </TableCell>

        <TableCell align="center">
          <Typography variant="body2">
            {totalBet?.toLocaleString()}
          </Typography>
        </TableCell>

        <TableCell align="center">
          <Typography variant="body2">
            {row?.win_live?.toLocaleString()}
          </Typography>
        </TableCell>

        <TableCell align="center">
          <Typography variant="body2">
            {row?.win_slot?.toLocaleString()}
          </Typography>
        </TableCell>

        <TableCell align="center">
          <Typography variant="body2">
            {totalWin?.toLocaleString()}
          </Typography>
        </TableCell>

        <TableCell align="center">
          <Typography variant="body2">
            {row?.balance_live?.toLocaleString()}
          </Typography>
        </TableCell>

        <TableCell align="center">
          <Typography variant="body2">
            {row?.balance_slot?.toLocaleString()}
          </Typography>
        </TableCell>

        <TableCell align="center">
          <Typography variant="body2">
            {totalRolling?.toLocaleString()}
          </Typography>
        </TableCell>

        <TableCell align="center">
          <Typography variant="body2">
            {settlementLive?.toLocaleString()}
          </Typography>
        </TableCell>

        <TableCell align="center">
          <Typography variant="body2">
            {settlementSlot?.toLocaleString()}
          </Typography>
        </TableCell>

        <TableCell align="center">
          <Typography variant="body2">
            {settlementTotal?.toLocaleString()}
          </Typography>
        </TableCell>

        <TableCell align="center">
          <Typography variant="body2">
            {row?.lose_money_live?.toLocaleString()}
          </Typography>
        </TableCell>

        <TableCell align="center">
          <Typography variant="body2">
            {row?.lose_money_slot?.toLocaleString()}
          </Typography>
        </TableCell>

        <TableCell align="center">
          <Typography variant="body2">
            {totalLoosing?.toLocaleString()}
          </Typography>
        </TableCell>
        
      </TableRow>
  );
}
