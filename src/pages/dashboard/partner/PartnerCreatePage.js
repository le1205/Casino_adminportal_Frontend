import { Helmet } from 'react-helmet-async';
// @mui
import { Container } from '@mui/material';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// components
import { useSettingsContext } from '../../../components/settings';
import CustomBreadcrumbs from '../../../components/custom-breadcrumbs';
import PreparingContent from '../../../components/preparing';
// sections
import PartnerNewEditForm from '../../../sections/@dashboard/partner/PartnerNewEditForm';

// ----------------------------------------------------------------------

export default function PartnerCreatePage() {
  const { themeStretch } = useSettingsContext();

  return (
    <>
      <Helmet>
        <title> User: Create a new user </title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'xl'}>
        <CustomBreadcrumbs
          heading="partnerCreate"
          links={[
            {
              name: 'dashboard',
              href: PATH_DASHBOARD.root,
            },
            {
              name: 'partner',
              href: PATH_DASHBOARD.partner.root,
            },
            { name: 'create' },
          ]}
        />
        {/* <PartnerNewEditForm /> */}
        
          
        <PreparingContent
          title="preparing"
          sx={{
            '& span.MuiBox-root': { height: 200 },
          }}
        />
      </Container>
    </>
  );
}
