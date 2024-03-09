import PropTypes from 'prop-types';
// @mui
import {
  TableRow,
  TableCell,
} from '@mui/material';
// components
import Label from '../../../../components/label';
// locales
import { useLocales } from '../../../../locales';
// utils
import {parseJson } from '../../../../auth/utils';
// utils
import { fKoreanDate } from '../../../../utils/formatTime';

// ----------------------------------------------------------------------

InvoiceWithdrawTableRow.propTypes = {
  row: PropTypes.object,
  pendingCount: PropTypes.number,
  selected: PropTypes.bool,
  onSelectAccept: PropTypes.func,
  onSelectCancel: PropTypes.func,
};

export default function InvoiceWithdrawTableRow({ row, selected, onSelectAccept, onSelectCancel, pendingCount}) {
  const {_id, amount, userId, creatorId, createdAt, status } = row;
  const { translate } = useLocales();
  const loginUser = parseJson(localStorage.getItem('user') || "");
  return (
    <TableRow hover selected={selected}>
        <TableCell align="center" >
          {creatorId?.username === process.env.REACT_APP_ADMIN_DEVELOPER ? '관리자' : creatorId?.username }
        </TableCell>

        <TableCell align="center" >
          {userId?.username}
        </TableCell>

        <TableCell align="center">
          {amount?.toLocaleString()}
        </TableCell>

        <TableCell align="center" >
          {fKoreanDate(createdAt)}
        </TableCell>

        <TableCell align="center"  sx={{ textTransform: 'capitalize' }}>
        
          <Label
            variant="soft"
            color={(status === 'Cancel' && 'error') || (status === 'Pending' && 'warning') || 'success'}
          >
            {`${translate(status?.toLowerCase())}`}
          </Label>
        </TableCell>

        <TableCell align="center">
          {status?.toLowerCase() === 'pending' && 
            <Label
              variant="soft"
              color="success" 
              sx={{ cursor: 'pointer' }}
              onClick={() => {
                onSelectAccept();
              }}
            >
              {`${translate('accept')}`}
            </Label>
          }
          {status?.toLowerCase() === 'pending' && 
            <Label
              variant="soft"
              color='error'
              sx={{ cursor: 'pointer', ml:2 }}
              onClick={() => {
                onSelectCancel();
              }}
            >
              {`${translate('cancel')}`}
            </Label>
          }
        </TableCell>
      </TableRow>
  );
}
