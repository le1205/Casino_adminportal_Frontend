import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
// @mui
import { useTheme } from '@mui/material/styles';
import { Stack, AppBar, Toolbar, IconButton, Card, Divider } from '@mui/material';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// utils
import { bgBlur } from '../../../utils/cssStyles';
// hooks
import useOffSetTop from '../../../hooks/useOffSetTop';
import useResponsive from '../../../hooks/useResponsive';
// config
import { HEADER, NAV } from '../../../config-global';
// components
import Logo from '../../../components/logo';
import Iconify from '../../../components/iconify';
import { useSettingsContext } from '../../../components/settings';
import Scrollbar from '../../../components/scrollbar';
//
import AccountPopover from './AccountPopover';
import LanguagePopover from './LanguagePopover';

import HeaderAnalytic from '../../../sections/@dashboard/header/headerAnalytic';
// api
import { apiWithPostData } from '../../../utils/api';
// url
import { adminHeaderDashboardUrl, } from '../../../utils/urlList';

// ----------------------------------------------------------------------

Header.propTypes = {
  onOpenNav: PropTypes.func,
};

export default function Header({ onOpenNav }) {
  const theme = useTheme();

  const { themeLayout } = useSettingsContext();

  const isNavHorizontal = themeLayout === 'horizontal';

  const isNavMini = themeLayout === 'mini';

  const isDesktop = useResponsive('up', 'lg');
  const navigate = useNavigate();

  const isOffset = useOffSetTop(HEADER.H_DASHBOARD_DESKTOP) && !isNavHorizontal;

  const [totalMember, setTotalMember] = useState(0);
  const [betMember, setBetMember] = useState(0);
  const [newMember, setNewMember] = useState(0);
  const [loginMember, setLoginMember] = useState(0);
  const [userMoney, setUserMoney] = useState(0);
  const [userPoint, setUserPoint] = useState(0);
  const [deposit, setDeposit] = useState(0);
  const [withdraw, setWithdraw] = useState(0);
  const [profitLoss, setProfitLoss] = useState(0);
  const [cManager, setCManager] = useState(0);
  const [pManager, setPManager] = useState(0);
  const [bettingCount, setBettingCount] = useState(0);
  const [totalBet, setTotalBet] = useState(0);
  const [totalWin, setTotalWin] = useState(0);
  const [rolling, setRolling] = useState(0);
  const [bettingProfit, setBettingProfit] = useState(0);
  
  
  useEffect(() => {
    getHeaderDashboard()
  }, []);
  
  const getHeaderDashboard = () => {
    try {
      const url = adminHeaderDashboardUrl;
      const headers = {};
      apiWithPostData(url, {}, headers).then((response) => {
        const { dashboard } = response;
        setTotalMember(dashboard.total_member || 0);
        setBetMember(dashboard.total_bet || 0);
        setNewMember(0);
        setLoginMember(dashboard.login_member || 0);
        setUserMoney(dashboard.user_money || 0);
        setUserPoint(dashboard.user_point || 0);
        setDeposit(dashboard.totald || 0);
        setWithdraw(dashboard.totalw || 0);
        setProfitLoss(0);
        setCManager(0);
        setPManager(0);
        setBettingCount(dashboard.betting || 0);
        setTotalBet(dashboard.total_bet || 0);
        setTotalWin(dashboard.total_win || 0);
        setRolling(dashboard.rolling || 0);
        setBettingProfit(dashboard.profit || 0);
      });
    } catch (error) {
      console.log(error);
    }

  };

  const movePage = (path) => {
    navigate(path);
  };

  const renderContent = (
    <>
      {isDesktop && isNavHorizontal && <Logo sx={{ mr: 2.5 }} />}

      {!isDesktop && (
        <IconButton onClick={onOpenNav} sx={{ mr: 1, color: 'text.primary' }}>
          <Iconify icon="eva:menu-2-fill" />
        </IconButton>
      )}

      <Stack
        flexGrow={5}
        direction="row"
        alignItems="center"
        justifyContent="flex"
        spacing={{ xs: 0.5, sm: 1.5 }}
      >
        <Card sx={{ mb: 1 }}>
            <Scrollbar>
              <Stack
                direction="row"
                sx={{ py: 1 }}
              >
                <HeaderAnalytic
                  title="Total Members"
                  price={totalMember}
                  color={theme.palette.info.main}
                  handleClick={() => movePage(PATH_DASHBOARD.user.list)}
                />
                <HeaderAnalytic
                  title="Bet Members"
                  price={betMember}
                  color={theme.palette.info.main}
                  handleClick={() => movePage(PATH_DASHBOARD.user.listAccordingPartner)}
                />
                <HeaderAnalytic
                  title="New Members"
                  price={newMember}
                  color={theme.palette.info.main}
                  handleClick={() => movePage(PATH_DASHBOARD.user.accept)}
                />
                <HeaderAnalytic
                  title="Login Members"
                  price={loginMember}
                  color={theme.palette.info.main}
                  handleClick={() => movePage(PATH_DASHBOARD.user.connect)}
                />
                <HeaderAnalytic
                  title="User Money"
                  price={userMoney}
                  color={theme.palette.success.main}
                  handleClick={() => movePage(PATH_DASHBOARD.user.list)}
                />
                <HeaderAnalytic
                  title="User Point"
                  price={userPoint}
                  color={theme.palette.success.main}
                  handleClick={() => movePage(PATH_DASHBOARD.user.list)}
                />

                <HeaderAnalytic
                  title="Deposit"
                  price={deposit}
                  color={theme.palette.warning.main}
                  handleClick={() => movePage(PATH_DASHBOARD.invoice.inApply)}
                />
                <HeaderAnalytic
                  title="Withdraw"
                  price={withdraw}
                  color={theme.palette.warning.main}
                  handleClick={() => movePage(PATH_DASHBOARD.invoice.outApply)}
                />
                <HeaderAnalytic
                  title="Profit/Loss"
                  price={profitLoss}
                  color={theme.palette.warning.main}
                />
                <HeaderAnalytic
                  title="Manager (C)"
                  price={cManager}
                  color={theme.palette.warning.main}
                />
                <HeaderAnalytic
                  title="Manager (P)"
                  price={pManager}
                  color={theme.palette.warning.main}
                />

                <HeaderAnalytic
                  title="Betting Count"
                  price={bettingCount}
                  color={theme.palette.text.secondary}
                  handleClick={() => movePage(PATH_DASHBOARD.bet.common)}
                />

                <HeaderAnalytic
                  title="Total Bet"
                  price={totalBet}
                  color={theme.palette.text.secondary}
                  handleClick={() => movePage(PATH_DASHBOARD.report.partner)}
                />

                <HeaderAnalytic
                  title="Total Win"
                  price={totalWin}
                  color={theme.palette.text.secondary}
                />

                <HeaderAnalytic
                  title="Rolling"
                  price={rolling}
                  color={theme.palette.text.secondary}
                />

                <HeaderAnalytic
                  title="Betting Profit"
                  price={bettingProfit}
                  color={theme.palette.text.secondary}
                />
              </Stack>
            </Scrollbar>
        </Card>
      
        <Stack
          flexGrow={1}
          direction="row"
          alignItems="center"
          justifyContent="flex-end"
          spacing={{ xs: 0.5, sm: 1.5 }}
        >
        <LanguagePopover />
        <AccountPopover />
        </Stack>
      </Stack>

    </>
  );

  return (
    <AppBar
      sx={{
        boxShadow: 'none',
        height: HEADER.H_MOBILE,
        zIndex: theme.zIndex.appBar + 1,
        ...bgBlur({
          color: theme.palette.background.default,
        }),
        transition: theme.transitions.create(['height'], {
          duration: theme.transitions.duration.shorter,
        }),
        ...(isDesktop && {
          width: `calc(100% - ${NAV.W_DASHBOARD + 1}px)`,
          height: HEADER.H_DASHBOARD_DESKTOP,
          ...(isOffset && {
            height: HEADER.H_DASHBOARD_DESKTOP_OFFSET,
          }),
          ...(isNavHorizontal && {
            width: 1,
            bgcolor: 'background.default',
            height: HEADER.H_DASHBOARD_DESKTOP_OFFSET,
            borderBottom: `dashed 1px ${theme.palette.divider}`,
          }),
          ...(isNavMini && {
            width: `calc(100% - ${NAV.W_DASHBOARD_MINI + 1}px)`,
          }),
        }),
      }}
    >
      <Toolbar
        sx={{
          height: 1,
          px: { lg: 5 },
        }}
      >
        {renderContent}
      </Toolbar>
    </AppBar>
  );
}
