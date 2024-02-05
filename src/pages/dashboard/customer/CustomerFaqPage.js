import { Helmet } from 'react-helmet-async';
// @mui
import { Box, Container, Typography } from '@mui/material';
// sections
import { FaqsHero, FaqsCategory, FaqsList, FaqsForm } from '../../../sections/faqs';
import CustomBreadcrumbs from '../../../components/custom-breadcrumbs';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';

// ----------------------------------------------------------------------

export default function CustomerFaqPage() {
  return (
    <>
      <Helmet>
        <title> Faqs | Minimal UI</title>
      </Helmet>

      <Container sx={{ pt: 15, pb: 10, position: 'relative' }}>
        <CustomBreadcrumbs
          heading="FAQ"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Customer Center', href: PATH_DASHBOARD.customer.root },
            { name: 'Faq' },
          ]}
        />
        <FaqsCategory />

        <Typography variant="h3" sx={{ mb: 5 }}>
          Frequently asked questions
        </Typography>

        <Box
          gap={10}
          display="grid"
          gridTemplateColumns={{
            xs: 'repeat(1, 1fr)',
            md: 'repeat(2, 1fr)',
          }}
        >
          <FaqsList />

          <FaqsForm />
        </Box>
      </Container>
    </>
  );
}
