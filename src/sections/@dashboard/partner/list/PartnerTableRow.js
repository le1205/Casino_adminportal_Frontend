import PropTypes from 'prop-types';
import { useState } from 'react';
// @mui
import {
  Stack,
  Button,
  TableRow,
  TableCell,
  Typography,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
// locales
import { useLocales } from '../../../../locales';

// ----------------------------------------------------------------------

PartnerTableRow.propTypes = {
  row: PropTypes.object,
  selected: PropTypes.bool,
  onSelectRow: PropTypes.func,
  onSelectMove: PropTypes.func,
};

export default function PartnerTableRow({ row, selected, onSelectMove, onSelectRow, }) {
  const { translate } = useLocales();
  const theme = useTheme();
  
  const {id, name, roleName, roleOrder, slotRolling, slotLoosing, deposit, withdraw, userCount, user, userMoney, userPoint, userId, totalBet, totalWin, } = row;

   return (
    <TableRow hover selected={selected}>

        <TableCell align="center">
          <Typography variant="subtitle2" noWrap>
            {name}
          </Typography>
        </TableCell>
        <TableCell align="center">
          <Typography variant="body2"
              sx={{
                ...(roleOrder ===1 && {
                  color: theme.palette.info.main,
                }),
                ...(roleOrder ===2 && {
                  color: theme.palette.warning.main,
                }),
                ...(roleOrder ===3 && {
                  color: theme.palette.success.main,
                }),
                ...(roleOrder ===4 && {
                  color: theme.palette.common.main,
                }),
                ...(roleOrder ===5 && {
                  color: theme.palette.primary.main,
                }),
                ...(roleOrder ===6 && {
                  color: theme.palette.secondary.main,
                }),
            }}>
              {roleName}
            </Typography>

        </TableCell>

        <TableCell align="center">
          <Typography variant="subtitle3" noWrap>
            {slotRolling?.toLocaleString()}
          </Typography>
        </TableCell>

        <TableCell align="center">
          <Typography variant="subtitle3" noWrap>
            {slotLoosing?.toLocaleString()}
          </Typography>
        </TableCell>

        <TableCell align="center">
          <Typography variant="subtitle3" noWrap>
            {deposit?.toLocaleString()}
          </Typography>
        </TableCell>

        <TableCell align="center">
          <Typography variant="subtitle3"  noWrap>
            {withdraw?.toLocaleString()}
          </Typography>
        </TableCell>

        <TableCell align="center">
          <Typography variant="subtitle3"  noWrap>
            {userCount?.toLocaleString()}
          </Typography>
        </TableCell>

        <TableCell align="center">
          <Typography variant="subtitle3"  noWrap>
            {userMoney?.toLocaleString()}
          </Typography>
        </TableCell>

        <TableCell align="center">
          <Typography variant="subtitle3"  noWrap>
            {userPoint?.toLocaleString()}
          </Typography>
        </TableCell>

        <TableCell align="center">
            <Button color="info" variant="soft" size="small"  onClick={onSelectMove}>
            {`${translate('move')}`}
            </Button>
        </TableCell>

        {/* <TableCell align="center">
            <Button variant="contained" color="warning" size="small"> 
                save
            </Button>
        </TableCell> */}

      </TableRow>
  );
}
