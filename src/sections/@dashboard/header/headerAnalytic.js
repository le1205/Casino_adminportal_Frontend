import PropTypes from 'prop-types';
import { Stack, Typography, Box, Card } from '@mui/material';
// ----------------------------------------------------------------------

HeaderAnalytic.propTypes = {
  title: PropTypes.string,
  color: PropTypes.string,
  price: PropTypes.number,
  handleClick: PropTypes.func,
};

export default function HeaderAnalytic({ title, color, price, handleClick }) {
  return (
    <Stack
      direction="row"
      alignItems="center"
      justifyContent="center"
      sx={{ width: 0.5, minWidth: 85 }}
    >

      <Card spacing={0.5} sx={{ px: 0.5 }} style={{cursor:'pointer'}} onClick={handleClick}>
        <Typography variant="h8">{title}</Typography>

        <Typography variant="subtitle2" sx={{ color }}>
          {price}
        </Typography>
      </Card>
    </Stack>
  );
}
