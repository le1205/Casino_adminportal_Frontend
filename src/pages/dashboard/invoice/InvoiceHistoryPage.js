import { Helmet } from 'react-helmet-async';
import { Link as RouterLink, } from 'react-router-dom';
// @mui
import {
  Box,
  Button,
  Container,
} from '@mui/material';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';

import CustomBreadcrumbs from '../../../components/custom-breadcrumbs';
import Iconify from '../../../components/iconify';
import { useSettingsContext } from '../../../components/settings';
import PreparingContent from '../../../components/preparing';

// ----------------------------------------------------------------------

export default function InvoiceHistoryPage() {

  const { themeStretch } = useSettingsContext();

  return (
    <>
      <Helmet>
        <title> Admin Portal </title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'xl'}>

        <CustomBreadcrumbs
          heading="cashHistory"
          links={[
            {
              name: 'dashboard',
              href: PATH_DASHBOARD.root,
            },
            {
              name: 'invoices',
              href: PATH_DASHBOARD.invoice.root,
            },
            {
              name: 'History',
            },
          ]}
          action={
            <Button
              component={RouterLink}
              to={PATH_DASHBOARD.invoice.new}
              variant="contained"
              startIcon={<Iconify icon="eva:plus-fill" />}
            >
              New Invoice
            </Button>
          }
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

