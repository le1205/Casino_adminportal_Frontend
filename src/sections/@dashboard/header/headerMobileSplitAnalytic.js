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

HeaderMobileSplitAnalytic.propTypes = {
  title: PropTypes.string,
  color: PropTypes.string,
  key: PropTypes.string,
  price: PropTypes.number,
  handleClick: PropTypes.func,
  belowPrice: PropTypes.number,
  belowTitle: PropTypes.string,
};

export default function HeaderMobileSplitAnalytic({ title, color, price, handleClick, key, belowPrice, belowTitle }) {
  const theme = useTheme();
  
  const { translate } = useLocales();
  return (
    
    <Grid key={key} item xs={6} 
      // sx={{flexBasis:`14.28% !important`, minWidth:'140px',}}>
      sx={{flexBasis:'7.14% !important',minWidth:'120px', }}>
      <Box
        borderLeft={2}
        borderColor={color}
        sx={{
          textAlign: 'center',
          borderWidth: 4,
          boxShadow: theme.customShadows.z8,
          textTransform: 'capitalize',
          minHeight:'66px',
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
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="center"
          sx={{
            backgroundColor:'lightgray',
          }}
        >
            <Typography variant="body2"  align="center" color='error' sx={{ pr:2}}>
              {`${translate(belowTitle)}`}
            </Typography>
    
            <Typography variant="body2" align="center" >
              {toNumberString(belowPrice)}
            </Typography>
        </Stack>
        
      </Box>
    </Grid>
  );
}
