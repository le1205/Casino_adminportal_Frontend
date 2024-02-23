import PropTypes from 'prop-types';
// @mui
import { Typography, Stack } from '@mui/material';
// locales
import { useLocales } from '../../locales';
//
import Image from '../image';

// ----------------------------------------------------------------------

PreparingContent.propTypes = {
  sx: PropTypes.object,
  img: PropTypes.string,
  title: PropTypes.string,
  description: PropTypes.string,
};

export default function PreparingContent({ title, description, img, sx, ...other }) {
  const { translate } = useLocales();
  return (
    <Stack
      alignItems="center"
      justifyContent="center"
      sx={{
        height: 1,
        textAlign: 'center',
        p: (theme) => theme.spacing(8, 2),
        ...sx,
      }}
      {...other}
    >
      <Image
        disabledEffect
        alt="empty content"
        src={img || '/assets/illustrations/illustration_empty_cart.svg'}
        sx={{ height: 300, mb: 3 }}
      />

      <Typography variant="h4" gutterBottom>
        {`${translate(title)}`}
      </Typography>

      {description && (
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          {description}
        </Typography>
      )}
    </Stack>
  );
}
