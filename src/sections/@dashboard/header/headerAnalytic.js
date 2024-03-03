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
// ----------------------------------------------------------------------

HeaderAnalytic.propTypes = {
  title: PropTypes.string,
  color: PropTypes.string,
  key: PropTypes.string,
  price: PropTypes.number,
  handleClick: PropTypes.func,
};

export default function HeaderAnalytic({ title, color, price, handleClick, key }) {
  const theme = useTheme();
  
  const { translate } = useLocales();
  return (
    
    <Grid key={key} item xs={2} sx={{minWidth:180}}>
      <Box
        borderLeft={2}
        borderColor={color}
        sx={{
          py: 3,
          textAlign: 'center',
          borderWidth: 6,
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
            <Typography variant="subtitle1"  align="center">
              {`${translate(title)}`}
            </Typography>
    
            <Typography variant="subtitle1" align="center" sx={{ color }}>
              {price?.toLocaleString()}
            </Typography>
        </Stack>
        
      </Box>
    </Grid>
  );
}
