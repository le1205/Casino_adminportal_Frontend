import PropTypes from 'prop-types';
// @mui
import { Stack, InputAdornment, TextField, Button, MenuItem } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
// components
import Iconify from '../../../../components/iconify';

// ----------------------------------------------------------------------

const INPUT_WIDTH = 200;

BetTotalTableToolbar.propTypes = {
  isFiltered: PropTypes.bool,
  filterRole: PropTypes.string,
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
  filterRole,
  onFilterRole,
  optionsRole,
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
      <TextField
        fullWidth
        select
        label="User"
        value={filterRole}
        onChange={onFilterRole}
        SelectProps={{
          MenuProps: {
            PaperProps: {
              sx: {
                maxHeight: 260,
              },
            },
          },
        }}
        sx={{
          maxWidth: { sm: 240 },
          textTransform: 'capitalize',
        }}
      >
        {optionsRole.map((option) => (
          <MenuItem
            key={option?.name}
            value={option?.name}
            sx={{
              mx: 1,
              borderRadius: 0.75,
              typography: 'body2',
              textTransform: 'capitalize',
            }}
          >
            {option?.name}
          </MenuItem>
        ))}
      </TextField>

      <DatePicker
        label="Select date"
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

      {/* <DatePicker
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
