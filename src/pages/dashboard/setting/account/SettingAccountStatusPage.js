import { Helmet } from 'react-helmet-async';
// @mui
import { alpha } from '@mui/material/styles';
import { Container, Typography, Box } from '@mui/material';
// components
import { useSettingsContext } from '../../../../components/settings';
// routes
import { PATH_DASHBOARD } from '../../../../routes/paths';

import CustomBreadcrumbs from '../../../../components/custom-breadcrumbs';

// ----------------------------------------------------------------------

export default function SettingAccountStatusPage() {
  const { themeStretch } = useSettingsContext();

  return (
    <>
      <Helmet>
        <title> Blank Page | Minimal UI</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'xl'}>
        <CustomBreadcrumbs
          heading="Account Status"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Seeting', href: PATH_DASHBOARD.setting.root },
            { name: 'Account', href: PATH_DASHBOARD.setting.account.root },
            { name: 'Status' },
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