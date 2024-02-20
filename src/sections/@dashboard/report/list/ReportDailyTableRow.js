import PropTypes from 'prop-types';
// @mui
import {
  TableRow,
  TableCell,
  Typography,
} from '@mui/material';

// ----------------------------------------------------------------------

ReportDailyTableRow.propTypes = {
  row: PropTypes.object,
  selected: PropTypes.bool,
  onEditRow: PropTypes.func,
};

export default function ReportDailyTableRow({ row, selected, onEditRow }) {
  // eslint-disable-next-line no-unsafe-optional-chaining
  const holdingPoint = row?.deposit - row?.withdraw;
  // eslint-disable-next-line no-unsafe-optional-chaining
  const totalBet = row?.bet_slot + row?.bet_live;
  // eslint-disable-next-line no-unsafe-optional-chaining
  const totalWin = row?.win_live + row?.win_slot;
  // eslint-disable-next-line no-unsafe-optional-chaining
  const totalRolling = row?.rolling_live + row?.rolling_slot;
  // eslint-disable-next-line no-unsafe-optional-chaining
  const totalLoosing = row?.loosing_live + row?.loosing_slot;

  return (
    <TableRow hover selected={selected}>
        <TableCell align="center">
          <Typography variant="body2">
            {row?.date}
          </Typography>
        </TableCell>

        <TableCell align="center">
          <Typography variant="body2">
            {row?.username}
          </Typography>
        </TableCell>

        <TableCell align="center">
          <Typography variant="body2">
            {row?.deposit}
          </Typography>
        </TableCell>

        <TableCell align="center">
          <Typography variant="body2">
          {row?.withdraw}
          </Typography>
        </TableCell>

        <TableCell align="center">
          <Typography variant="body2">
            {holdingPoint}
          </Typography>
        </TableCell>

        <TableCell align="center">
          <Typography variant="body2">
            {row?.bet_live}
          </Typography>
        </TableCell>

        <TableCell align="center">
          <Typography variant="body2">
            {row?.bet_slot}
          </Typography>
        </TableCell>

        <TableCell align="center">
          <Typography variant="body2">
            {totalBet}
          </Typography>
        </TableCell>

        <TableCell align="center">
          <Typography variant="body2">
            {row?.win_live}
          </Typography>
        </TableCell>

        <TableCell align="center">
          <Typography variant="body2">
            {row?.win_slot}
          </Typography>
        </TableCell>

        <TableCell align="center">
          <Typography variant="body2">
            {totalWin}
          </Typography>
        </TableCell>

        <TableCell align="center">
          <Typography variant="body2">
            {row?.rolling_live}
          </Typography>
        </TableCell>

        <TableCell align="center">
          <Typography variant="body2">
            {row?.rolling_slot}
          </Typography>
        </TableCell>

        <TableCell align="center">
          <Typography variant="body2">
            {totalRolling}
          </Typography>
        </TableCell>

        <TableCell align="center">
          <Typography variant="body2">
            {row?.loosing_live}
          </Typography>
        </TableCell>

        <TableCell align="center">
          <Typography variant="body2">
            {row?.loosing_slot}
          </Typography>
        </TableCell>

        <TableCell align="center">
          <Typography variant="body2">
            {totalLoosing}
          </Typography>
        </TableCell>
        
      </TableRow>
  );
}
