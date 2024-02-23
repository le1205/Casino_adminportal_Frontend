import { Helmet } from 'react-helmet-async';
// @mui
import { alpha } from '@mui/material/styles';
import { Container, Box } from '@mui/material';
// components
import { useSettingsContext } from '../../../../components/settings';
// routes
import { PATH_DASHBOARD } from '../../../../routes/paths';

import CustomBreadcrumbs from '../../../../components/custom-breadcrumbs';
import PreparingContent from '../../../../components/preparing';

// ----------------------------------------------------------------------

export default function SettingAccountStatusPage() {
  const { themeStretch } = useSettingsContext();

  return (
    <>
      <Helmet>
        <title> Blank Page </title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'xl'}>
        <CustomBreadcrumbs
          heading="accountStatus"
          links={[
            { name: 'dashboard', href: PATH_DASHBOARD.root },
            { name: 'setting', href: PATH_DASHBOARD.setting.root },
            { name: 'account', href: PATH_DASHBOARD.setting.account.root },
            { name: 'Status' },
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
