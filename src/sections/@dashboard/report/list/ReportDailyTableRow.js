import PropTypes from 'prop-types';
// @mui
import {
  TableRow,
  TableCell,
  Typography,
} from '@mui/material';
import moment from 'moment';
import { toNumberTag, toNumberString } from '../../../../utils/convert';

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
  const totalRolling = row?.bet_money_live + row?.bet_money_slot || 0;
  // eslint-disable-next-line no-unsafe-optional-chaining
  const totalLoosing = row?.lose_money_live + row?.lose_money_slot || 0;
  // eslint-disable-next-line no-unsafe-optional-chaining
  const settlementLive = row?.balance_live || 0;
  // eslint-disable-next-line no-unsafe-optional-chaining
  const settlementSlot = row?.balance_slot || 0;
  const settlementTotal = settlementLive + settlementSlot;
  
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
            {toNumberString(row?.deposit)}
          </Typography>
        </TableCell>

        <TableCell align="center">
          <Typography variant="body2">
            {toNumberString(row?.withdraw)}
          </Typography>
        </TableCell>

        <TableCell align="center">
          <Typography variant="body2">
            {toNumberString(holdingPoint)}
          </Typography>
        </TableCell>

        <TableCell align="center">
          <Typography variant="body2">
            {toNumberString(row?.bet_live)}
          </Typography>
        </TableCell>

        <TableCell align="center">
          <Typography variant="body2">
            {toNumberString(row?.bet_slot)}
          </Typography>
        </TableCell>

        <TableCell align="center">
          <Typography variant="body2">
            {toNumberString(totalBet)}
          </Typography>
        </TableCell>

        <TableCell align="center">
          <Typography variant="body2">
            {toNumberString(row?.win_live)}
          </Typography>
        </TableCell>

        <TableCell align="center">
          <Typography variant="body2">
            {toNumberString(row?.win_slot)}
          </Typography>
        </TableCell>

        <TableCell align="center">
          <Typography variant="body2">
            {toNumberString(totalWin)}
          </Typography>
        </TableCell>

        <TableCell align="center">
          <Typography variant="body2">
            {toNumberString(row?.bet_money_live)}
          </Typography>
        </TableCell>

        <TableCell align="center">
          <Typography variant="body2">
            {toNumberString(row?.bet_money_slot)}
          </Typography>
        </TableCell>

        <TableCell align="center">
          <Typography variant="body2">
            {toNumberString(totalRolling)}
          </Typography>
        </TableCell>

        <TableCell align="center">
          <Typography variant="body2">
            {toNumberString(settlementLive)}
          </Typography>
        </TableCell>

        <TableCell align="center">
          <Typography variant="body2">
            {toNumberString(settlementSlot)}
          </Typography>
        </TableCell>

        <TableCell align="center">
          <Typography variant="body2">
            {toNumberString(settlementTotal)}
          </Typography>
        </TableCell>

        <TableCell align="center">
          <Typography variant="body2">
            {toNumberString(row?.lose_money_live)}
          </Typography>
        </TableCell>

        <TableCell align="center">
          <Typography variant="body2">
            {toNumberString(row?.lose_money_slot)}
          </Typography>
        </TableCell>

        <TableCell align="center">
          <Typography variant="body2">
            {toNumberString(totalLoosing)}
          </Typography>
        </TableCell>
        
      </TableRow>
  );
}
