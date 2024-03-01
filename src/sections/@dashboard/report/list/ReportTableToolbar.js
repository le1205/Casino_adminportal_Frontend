import PropTypes from 'prop-types';
// @mui
import { Stack, TextField, InputAdornment, Button } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
// components
import Iconify from '../../../../components/iconify';

// ----------------------------------------------------------------------

const INPUT_WIDTH = 200;

ReportTableToolbar.propTypes = {
  isFiltered: PropTypes.bool,
  filterName: PropTypes.string,
  onResetFilter: PropTypes.func,
  onFilterName: PropTypes.func,
  onClickToday: PropTypes.func,
  onClickThisWeek: PropTypes.func,
  onClickLastWeek: PropTypes.func,
  onClickThisMonth: PropTypes.func,
  onClickLastMonth: PropTypes.func,
  onFilterStartDate: PropTypes.func,
  onClickSearch: PropTypes.func,
  filterStartDate: PropTypes.instanceOf(Date),
  optionsRole: PropTypes.arrayOf(PropTypes.string),
};

export default function ReportTableToolbar({
  isFiltered,
  filterName,
  onResetFilter,
  onFilterStartDate,
  onFilterName,
  filterStartDate,
  onClickToday,
  onClickThisWeek,
  onClickLastWeek,
  onClickThisMonth,
  onClickLastMonth,
}) {
  return (
    <Stack
      spacing={2}
      alignItems="center"
      direction={{
        xs: 'column',
        sm: 'row',
      }}
      sx={{ px: 2.5, py: 3 }}
    >
      
      <DatePicker
        label="Date"
        value={filterStartDate}
        onChange={onFilterStartDate}
        renderInput={(params) => (
          <TextField
            {...params}
            fullWidth
            sx={{
              maxWidth: { md: INPUT_WIDTH },
            }}
          />
        )}
      />
{/* 
      <DatePicker
        label="End date"
        value={filterEndDate}
        onChange={onFilterEndDate}
        renderInput={(params) => (
          <TextField
            {...params}
            fullWidth
            sx={{
              maxWidth: { md: INPUT_WIDTH },
            }}
          />
        )}
      /> */}
      
      <Button
        variant="contained"
        onClick={onClickToday}
      >
        오늘
      </Button>
      
      <Button
        variant="contained"
        onClick={onClickThisWeek}      >
        이번 주
      </Button>
      
      <Button
        variant="contained"
        onClick={onClickLastWeek}
      >
        지난 주
      </Button>
      
      <Button
        variant="contained"
        onClick={onClickThisMonth}
      >
        이번 달
      </Button>
      
      <Button
        variant="contained"
        onClick={onClickLastMonth}
      >
        지난 달
      </Button>

      <TextField
        fullWidth
        value={filterName}
        onChange={onFilterName}
        placeholder="Search id..."
        sx={{
          maxWidth: { md: INPUT_WIDTH },
        }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
            </InputAdornment>
          ),
        }}
      />

      {isFiltered && (
        <Button
          color="error"
          sx={{ flexShrink: 0 }}
          onClick={onResetFilter}
          startIcon={<Iconify icon="eva:trash-2-outline" />}
        >
          Clear
        </Button>
      )}
    </Stack>
  );
}
