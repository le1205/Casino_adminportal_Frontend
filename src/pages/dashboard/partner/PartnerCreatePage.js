import { Helmet } from 'react-helmet-async';
// @mui
import { Container } from '@mui/material';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// components
import { useSettingsContext } from '../../../components/settings';
import CustomBreadcrumbs from '../../../components/custom-breadcrumbs';
// sections
import PartnerNewEditForm from '../../../sections/@dashboard/partner/PartnerNewEditForm';

// ----------------------------------------------------------------------

export default function PartnerCreatePage() {
  const { themeStretch } = useSettingsContext();

  return (
    <>
      <Helmet>
        <title> User: Create a new user | Minimal UI</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'xl'}>
        <CustomBreadcrumbs
          heading="Create a new partner"
          links={[
            {
              name: 'Dashboard',
              href: PATH_DASHBOARD.root,
            },
            {
              name: 'Partner',
              href: PATH_DASHBOARD.partner.root,
            },
            { name: 'Create' },
          ]}
        />
        <PartnerNewEditForm />
      </Container>
    </>
  );
}
