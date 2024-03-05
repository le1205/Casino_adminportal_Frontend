import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';
// @mui
import { Container } from '@mui/material';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// components
import { useSettingsContext } from '../../../components/settings';
import CustomBreadcrumbs from '../../../components/custom-breadcrumbs';
// sections
import UserNewEditForm from '../../../sections/@dashboard/user/UserNewEditForm';

// ----------------------------------------------------------------------

export default function UserCreatePage() {
  const { themeStretch } = useSettingsContext();
  const location = useLocation();
  
  return (
    <>
      <Helmet>
        <title> User: Create a new user </title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'xl'}>
        <CustomBreadcrumbs
          heading="createMember"
          links={[
            {
              name: 'dashboard',
              href: PATH_DASHBOARD.root,
            },
            {
              name: 'user',
              href: PATH_DASHBOARD.user.list,
            },
            { name: 'create' },
          ]}
        />
        <UserNewEditForm partner={location?.state}/>
      </Container>
    </>
  );
}
