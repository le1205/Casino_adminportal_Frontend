import PropTypes from 'prop-types';
import { Stack, Typography, Box, Card } from '@mui/material';

// locales
import { useLocales } from '../../../locales';
// ----------------------------------------------------------------------

HeaderAnalytic.propTypes = {
  title: PropTypes.string,
  color: PropTypes.string,
  price: PropTypes.number,
  handleClick: PropTypes.func,
};

export default function HeaderAnalytic({ title, color, price, handleClick }) {
  
  
  const { translate } = useLocales();
  return (
    <Stack
      direction="row"
      alignItems="center"
      justifyContent="center"
    >
      <Card 
        direction="column"
        spacing={1} 
        sx={{ mx: 0.5, py:0.5, height:70, width: 90 }} 
        style={{cursor:'pointer'} } 
        onClick={handleClick}>

        <Typography variant="subtitle2"  align="center">
          {`${translate(title)}`}
          </Typography>

        <Typography variant="subtitle2" align="center" sx={{ color }}>
          {price?.toLocaleString()}
        </Typography>
      </Card>
    </Stack>
  );
}
