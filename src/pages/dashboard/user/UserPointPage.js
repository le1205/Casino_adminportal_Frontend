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

export default function UserPointPage() {

  const { themeStretch } = useSettingsContext();

  return (
    <>
      <Helmet>
        <title> Admin Portal </title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'xl'}>
        <CustomBreadcrumbs
          heading="managePoint"
          links={[
            { name: 'dashboard', href: PATH_DASHBOARD.root },
            { name: 'user', href: PATH_DASHBOARD.user.root },
            { name: 'Points' },
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

