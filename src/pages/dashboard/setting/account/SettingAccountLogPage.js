import { Helmet } from 'react-helmet-async';
// @mui
import { alpha } from '@mui/material/styles';
import { Container, Typography, Box } from '@mui/material';
// routes
import { PATH_DASHBOARD } from '../../../../routes/paths';
// components
import { useSettingsContext } from '../../../../components/settings';

import CustomBreadcrumbs from '../../../../components/custom-breadcrumbs';

// ----------------------------------------------------------------------

export default function SettingAccountLogPage() {
  const { themeStretch } = useSettingsContext();

  return (
    <>
      <Helmet>
        <title> Blank Page </title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'xl'}>
      <CustomBreadcrumbs
          heading="log"
          links={[
            { name: 'dashboard', href: PATH_DASHBOARD.root },
            { name: 'setting', href: PATH_DASHBOARD.setting.root },
            { name: 'account', href: PATH_DASHBOARD.setting.account.root },
            { name: 'log' },
          ]}
        />

        <Box
          sx={{
            mt: 5,
            width: 1,
            height: 320,
            borderRadius: 2,
            bgcolor: (theme) => alpha(theme.palette.grey[500], 0.04),
            border: (theme) => `dashed 1px ${theme.palette.divider}`,
          }}
        />
      </Container>
    </>
  );
}
