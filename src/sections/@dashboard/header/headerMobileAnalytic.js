import PropTypes from 'prop-types';
import { Stack, 
  Typography, 
  Grid, 
  Box,
} from '@mui/material';
import { useTheme, } from '@mui/material/styles';

// locales
import { useLocales } from '../../../locales';
// utils
import {toNumberString } from '../../../utils/convert';
// ----------------------------------------------------------------------

HeaderMobileAnalytic.propTypes = {
  title: PropTypes.string,
  color: PropTypes.string,
  key: PropTypes.string,
  price: PropTypes.number,
  handleClick: PropTypes.func,
  isDesktop: PropTypes.bool,
};

export default function HeaderMobileAnalytic({ title, color, price, handleClick, key, isDesktop }) {
  const theme = useTheme();
  
  const { translate } = useLocales();
  return (
    
    <Grid key={key} item xs={6} 
      // sx={{flexBasis:`14.28% !important`, minWidth:'140px',}}>
      sx={{flexBasis:'7.14% !important',minWidth:'120px'}}>
      <Box
        borderLeft={2}
        borderColor={color}
        sx={{
          py: 1,
          textAlign: 'center',
          borderWidth: 4,
          boxShadow: theme.customShadows.z8,
          textTransform: 'capitalize',
        }}
        style={{cursor:'pointer'} } 
        onClick={handleClick}
      >
        <Stack
          direction="column"
          alignItems="center"
          justifyContent="center"
        >
            <Typography variant="body2"  align="center">
              {`${translate(title)}`}
            </Typography>
    
            <Typography variant="body2" align="center" sx={{ color }}>
              {toNumberString(price)}
            </Typography>
        </Stack>
        
      </Box>
    </Grid>
  );
}
