import { Helmet } from 'react-helmet-async';
// @mui
import {
  Box,
  Container,
} from '@mui/material';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';

import CustomBreadcrumbs from '../../../components/custom-breadcrumbs';
import { useSettingsContext } from '../../../components/settings';

// ----------------------------------------------------------------------

export default function ReportUserListPage() {

  const { themeStretch } = useSettingsContext();

  return (
    <>
      <Helmet>
        <title> Admin Portal </title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'xl'}>
        <CustomBreadcrumbs
          heading="User List"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Settlement', href: PATH_DASHBOARD.report.root },
            { name: 'User List' },
          ]}
        />
        <Box
          sx={{
            mt: 5,
            width: 1,
            height: 320,
            borderRadius: 2,
            border: (theme) => `dashed 1px ${theme.palette.divider}`,
          }}
        />
      </Container>
    </>
  );
}

