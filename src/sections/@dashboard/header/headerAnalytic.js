import PropTypes from 'prop-types';
import { Stack, 
  Typography, 
  Grid, 
  Paper,
  Box,
} from '@mui/material';
import { useTheme, } from '@mui/material/styles';

// locales
import { useLocales } from '../../../locales';
// utils
import {toNumberString } from '../../../utils/convert';
// ----------------------------------------------------------------------

HeaderAnalytic.propTypes = {
  title: PropTypes.string,
  color: PropTypes.string,
  key: PropTypes.string,
  price: PropTypes.number,
  handleClick: PropTypes.func,
  isAgent: PropTypes.bool,
  isMargin: PropTypes.bool,
};

export default function HeaderAnalytic({ title, color, price, handleClick, key, isAgent, isMargin  }) {
  const theme = useTheme();
  
  const { translate } = useLocales();
  return (
    
    <Grid key={key} item xs={2} 
      sx={{flexBasis: isAgent ? `24% !important` : `16% !important`, minWidth:'140px', maxWidth: isAgent? `24% !important` : '16%', marginLeft:isMargin? '25px' : '0px', marginRight:isMargin? '25px' : '0px'}}>
      <Box
        borderLeft={2}
        borderColor={color}
        sx={{
          py: 3,
          textAlign: 'center',
          borderWidth: 6,
          boxShadow: theme.customShadows.z8,
          textTransform: 'capitalize',
          maxHeight: '96px'
        }}
        style={{cursor:'pointer'} } 
        onClick={handleClick}
      >
        <Stack
          direction="column"
          alignItems="center"
          justifyContent="center"
        >
            <Typography variant="subtitle1"  align="center">
              {`${translate(title)}`}
            </Typography>
    
            <Typography variant="subtitle1" align="center" sx={{ color }}>
              {toNumberString(price)}
            </Typography>
        </Stack>
        
      </Box>
    </Grid>
  );
}
