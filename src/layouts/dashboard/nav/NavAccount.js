import { Link as RouterLink } from 'react-router-dom';
import { useEffect, useState } from 'react';
// @mui
import { styled, alpha, useTheme } from '@mui/material/styles';
import { Box, Link, Typography, Stack } from '@mui/material';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// locales
import { useLocales } from '../../../locales';

// utils
import { parseJson } from '../../../auth/utils';
// api
import { apiWithGetData } from '../../../utils/api';
// url
import { getUserPointUrl, getVirutalAmountUrl, userBalanceUrl } from '../../../utils/urlList';

// ----------------------------------------------------------------------

const StyledRoot = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(2, 2.5),
  borderRadius: Number(theme.shape.borderRadius) * 1.5,
  backgroundColor: alpha(theme.palette.grey[500], 0.12),
}));

// ----------------------------------------------------------------------

export default function NavAccount() {
  const theme = useTheme();
  const { translate } = useLocales();

  const [balance, setBalance] = useState(0);
  const [point, setPoint] = useState(0);

  const user = parseJson(localStorage.getItem('user') || '');
  const userBalance = () => {
    try {
      if(user.username === process.env.REACT_APP_ADMIN_HEADCOACH || user.username === process.env.REACT_APP_ADMIN_DEVELOPER){
        const url = userBalanceUrl + user._id;
        const headers = {};
        apiWithGetData(url, {}, headers).then((response) => {
          setBalance(response?.balance?.toLocaleString() || 0);
        });
      }
      else {
        const url = getVirutalAmountUrl; 
        const headers = {};
        apiWithGetData(url, {}, headers).then((response) => {
          setBalance(response?.amount?.toLocaleString() || 0);
        });
      }
     
    } catch (error) {
      console.log(error);
    }
  };
  const getUsePoint = () => {
    try {
      const url = getUserPointUrl;
      const headers = {};
      apiWithGetData(url, {}, headers).then((response) => {
        setPoint(response?.total?.toLocaleString() || 0);
      });
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    userBalance();
    getUsePoint();
    const optimer = setInterval(userBalance, 3000);
    const optimer1 = setInterval(getUsePoint, 20000);

    return () => {
      clearInterval(optimer);
      clearInterval(optimer1);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  return (
    <Link component={RouterLink} to={PATH_DASHBOARD.user.account} underline="none" color="inherit">
      <StyledRoot>
        <Box sx={{ ml: 1, minWidth: 0 }}>
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Typography variant="subtitle2" noWrap sx={{ color: 'text.secondary' }}>
              {`${translate(user?.role)}`}
            </Typography>
            <Typography variant="subtitle1" noWrap sx={{ pl: 6 }}>
              {user?.username}
            </Typography>
          </Stack>

          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Typography variant="subtitle2" noWrap sx={{ color: 'text.secondary' }}>
              {`${translate('credit')}`}
            </Typography>
            <Typography variant="subtitle2" noWrap sx={{ color: theme.palette.warning.main }}>
              {balance}
            </Typography>
          </Stack>
          {process.env.REACT_APP_ADMIN_HEADCOACH !== user.username && (
            <Stack direction="row" alignItems="center" justifyContent="space-between">
              <Typography variant="subtitle2" noWrap sx={{ color: 'text.secondary' }}>
                {`${translate('point')}`}
              </Typography>
              <Typography variant="subtitle2" noWrap sx={{ color: theme.palette.success.main }}>
                {point}
              </Typography>
            </Stack>
          )}
        </Box>
      </StyledRoot>
    </Link>
  );
}
