import { Helmet } from 'react-helmet-async';
import { Container, Grid, Button } from '@mui/material';
// components
import { useSettingsContext } from '../../components/settings';
// sections
import {
  AppWelcome,
} from '../../sections/@dashboard/general/app';
// utils
import {parseJson } from '../../auth/utils';
// assets
import { SeoIllustration } from '../../assets/illustrations';

// ----------------------------------------------------------------------

export default function GeneralAppPage() {
  const { user } = parseJson(localStorage.getItem('user') || "");

  const { themeStretch } = useSettingsContext();

  return (
    <>
      <Helmet>
        <title> General: App </title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'xl'}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <AppWelcome
              title={`Welcome back! \n ${user?.displayName}`}
              description="dashboard."
              img={
                <SeoIllustration
                  sx={{
                    p: 3,
                    width: 360,
                    margin: { xs: 'auto', md: 'inherit' },
                  }}
                />
              }
              action={<Button variant="contained">Go Now</Button>}
            />
          </Grid>
        </Grid>
      </Container>
    </>
  );
}
