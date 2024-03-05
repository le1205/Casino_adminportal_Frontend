import PropTypes from 'prop-types';
import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
// @mui
import { Box, Stack, Drawer, Tooltip } from '@mui/material';
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';
// routes
import { PATH_AUTH } from '../../../routes/paths';
// hooks
import useResponsive from '../../../hooks/useResponsive';
// utils
import {parseJson } from '../../../auth/utils';
// auth
import { useAuthContext } from '../../../auth/useAuthContext';
// config
import { NAV } from '../../../config-global';
// locales
import { useLocales } from '../../../locales';
// components
import Logo from '../../../components/logo';
import Scrollbar from '../../../components/scrollbar';
import { NavSectionVertical } from '../../../components/nav-section';
//
import navConfig from './config-navigation';
import navAgentConfig from './config-agent-navigation';
import NavDocs from './NavDocs';
import NavAccount from './NavAccount';
import NavToggleButton from './NavToggleButton';

import AccountPopover from '../header/AccountPopover';
import LanguagePopover from '../header/LanguagePopover';
import NavMobileHeader from './NavMobileHeader';

// ----------------------------------------------------------------------

NavVertical.propTypes = {
  openNav: PropTypes.bool,
  onCloseNav: PropTypes.func,
};

export default function NavVertical({ openNav, onCloseNav }) {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { translate } = useLocales();
  const { logout } = useAuthContext();
  const loginUser  = parseJson(localStorage.getItem('user') || "");
  let navData = navConfig;
  if(loginUser?.roleMain?.order === 4 || loginUser?.roleMain?.order === 5) {
    navData = navAgentConfig;
  }

  const isDesktop = useResponsive('up', 'lg');

  const handleClickLogout = (row) => {
    logout();
    navigate(PATH_AUTH.login, { replace: true });
  };

  useEffect(() => {
    if (openNav) {
      onCloseNav();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const renderContent = (
    <Scrollbar
      sx={{
        height: 1,
        '& .simplebar-content': {
          height: 1,
          display: 'flex',
          flexDirection: 'column',
          pb:2,
        },
      }}
    >
      <Stack
        spacing={3}
        sx={{
          pt: 3,
          pb: 2,
          px: 2.5,
          flexShrink: 0,
        }}
      >
        <Stack 
          sx={{
            flexDirection: 'row',
            alignItems:'right',
            justifyContent:'right',
          }}>
          <Logo 
            sx={{
              mr: 12,
            }}/>
          <LanguagePopover />
          
          <Tooltip title={`${translate('Logout')}`} arrow>
            <PowerSettingsNewIcon 
              color="error"
              onClick={() => {
                handleClickLogout();
              }}
              sx={{
                ml: 1,
                mt: 1,
                cursor: 'pointer',
              }}/>
          </Tooltip>
          {/* <AccountPopover /> */}
        </Stack>

        <NavAccount />
        {!isDesktop && <NavMobileHeader/>}
        
      </Stack>

      <NavSectionVertical data={navData} />

      <Box sx={{ flexGrow: 1 }} />

      <NavDocs />
    </Scrollbar>
  );

  return (
    <Box
      component="nav"
      sx={{
        flexShrink: { lg: 0 },
        width: { lg: NAV.W_DASHBOARD },
      }}
    >
      <NavToggleButton />

      {isDesktop ? (
        <Drawer
          open
          variant="permanent"
          PaperProps={{
            sx: {
              zIndex: 0,
              width: NAV.W_DASHBOARD,
              bgcolor: 'transparent',
              borderRightStyle: 'dashed',
            },
          }}
        >
          {renderContent}
        </Drawer>
      ) : (
        <Drawer
          open={openNav}
          onClose={onCloseNav}
          ModalProps={{
            keepMounted: true,
          }}
          PaperProps={{
            sx: {
              width: NAV.W_DASHBOARD,
            },
          }}
        >
          {renderContent}
        </Drawer>
      )}
    </Box>
  );
}
