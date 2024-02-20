import PropTypes from 'prop-types';
// @mui
import { Stack, InputAdornment, TextField, Button } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
// components
import Iconify from '../../../../components/iconify';

// ----------------------------------------------------------------------

const INPUT_WIDTH = 200;

BetTotalTableToolbar.propTypes = {
  isFiltered: PropTypes.bool,
  filterName: PropTypes.string,
  onFilterName: PropTypes.func,
  onFilterRole: PropTypes.func,
  onResetFilter: PropTypes.func,
  onFilterEndDate: PropTypes.func,
  onFilterService: PropTypes.func,
  onFilterStartDate: PropTypes.func,
  onClickSearch: PropTypes.func,
  filterEndDate: PropTypes.instanceOf(Date),
  filterStartDate: PropTypes.instanceOf(Date),
  optionsRole: PropTypes.arrayOf(PropTypes.string),
};

export default function BetTotalTableToolbar({
  isFiltered,
  filterName,
  optionsRole,
  onFilterName,
  onResetFilter,
  onFilterEndDate,
  onFilterStartDate,
  filterEndDate,
  filterStartDate,
  onClickSearch,
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
        label="Start date"
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
      />

      <TextField
        fullWidth
        value={filterName}
        onChange={onFilterName}
        placeholder="Input User ID to Search..."
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
            </InputAdornment>
          ),
        }}
        sx={{
          maxWidth: { sm: 480 },
          textTransform: 'capitalize',
        }}
      />
      
      <Button
        variant="contained"
        onClick={onClickSearch}
        startIcon={<Iconify icon="eva:search-fill"/>}
      >
        Search
      </Button>

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
