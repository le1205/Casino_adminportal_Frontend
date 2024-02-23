import { Helmet } from 'react-helmet-async';
// @mui
import {
  Box,
  Container,
} from '@mui/material';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';

import CustomBreadcrumbs from '../../../components/custom-breadcrumbs';
import PreparingContent from '../../../components/preparing';
import { useSettingsContext } from '../../../components/settings';

// ----------------------------------------------------------------------

export default function EggExchangePage() {

  const { themeStretch } = useSettingsContext();

  return (
    <>
      <Helmet>
        <title> Admin Portal </title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'xl'}>
        <CustomBreadcrumbs
          heading="PTWithdrawalList"
          links={[
            { name: 'dashboard', href: PATH_DASHBOARD.root },
            { name: 'pt', href: PATH_DASHBOARD.egg.root },
            { name: 'Exchange' },
          ]}
        />
        <Box
          sx={{
            mt: 5,
            width: 1,
            height: 320,
            borderRadius: 2,
            border: (theme) => `dashed 1px ${theme.palette.divider}`,
          }}>
          
          <PreparingContent
            title="preparing"
            sx={{
              '& span.MuiBox-root': { height: 200 },
            }}
          />
        </Box>
      </Container>
    </>
  );
}

