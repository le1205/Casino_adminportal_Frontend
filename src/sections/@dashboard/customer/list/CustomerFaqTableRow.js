import PropTypes from 'prop-types';
// @mui
import {
  Tooltip,
  TableRow,
  TableCell,
} from '@mui/material';
import EditNoteIcon from '@mui/icons-material/EditNote';
import DeleteSweepIcon from '@mui/icons-material/DeleteSweep';
// components
import Label from '../../../../components/label';
// locales
import { useLocales } from '../../../../locales';
// utils
import { fKoreanDate } from '../../../../utils/formatTime';

// ----------------------------------------------------------------------

CustomerFaqTableRow.propTypes = {
  row: PropTypes.object,
  selected: PropTypes.bool,
  onSelectEdit: PropTypes.func,
  onSelectRemove: PropTypes.func,
};

export default function CustomerFaqTableRow({ row, selected, onSelectEdit, onSelectRemove}) {
  const {title, userId, createdAt, replyDes } = row;
  const { translate } = useLocales();
  return (
    <TableRow hover selected={selected}>
        <TableCell align="center" width="20%">
          {fKoreanDate(createdAt)}
        </TableCell>

        <TableCell align="center" width="20%" >
          {userId?.username}
        </TableCell>

        <TableCell align="center" width="40%">
          {title}
        </TableCell>

        <TableCell align="center" width="10%">
          <Label
            variant="soft"
            color={(replyDes) ? 'success' : 'warning'}
          >
            {replyDes ? `${translate('answerComplete')}` : `${translate('received')}`}
          </Label>
        </TableCell>

        <TableCell align="center" width="10%">
          <Tooltip title={`${translate('edit')}`}>
            <EditNoteIcon color="success"  
              sx={{ ml: 1, cursor:"pointer" }} 
              onClick={() => {
                onSelectEdit();
              }}
            />
          </Tooltip>
          <Tooltip title={`${translate('remove')}`}>
            <DeleteSweepIcon color="error" 
              sx={{ ml: 1, cursor:"pointer"}} 
              onClick={() => {
                onSelectRemove();
              }}
            />
          </Tooltip>
        </TableCell>
      </TableRow>
  );
}
