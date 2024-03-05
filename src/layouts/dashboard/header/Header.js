import PropTypes from 'prop-types';
import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
// @mui
import { useTheme, styled } from '@mui/material/styles';
import { 
  Stack, 
  AppBar, 
  Toolbar, 
  IconButton, 
  Card, 
  Badge,
  Grid,
  Paper, 
} from '@mui/material';
import PaidIcon from '@mui/icons-material/Paid';
import PersonAddRoundedIcon from '@mui/icons-material/PersonAddRounded';
import NotificationsNoneRoundedIcon from '@mui/icons-material/NotificationsNoneRounded';
import CreditScoreRoundedIcon from '@mui/icons-material/CreditScoreRounded';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// utils
import { bgBlur } from '../../../utils/cssStyles';
import { parseJson } from '../../../auth/utils';
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
// assets
import audioWithdraw from '../../../assets/mp3/withdraw.mp3';
import audioDeposit from '../../../assets/mp3/deposit.mp3';
import audioAddUser from '../../../assets/mp3/add-users.mp3';
import audioCustomer from '../../../assets/mp3/requre account.mp3';

import HeaderAnalytic from '../../../sections/@dashboard/header/headerAnalytic';
// api
import { apiWithPostData } from '../../../utils/api';
// url
import { adminHeaderDashboardUrl, adminHeaderCountUrl, userSessionUrl } from '../../../utils/urlList';

// ----------------------------------------------------------------------

Header.propTypes = {
  onOpenNav: PropTypes.func,
};

const StyledBlockContainer = styled(Paper)(({ theme }) => ({
  marginTop:1,
  padding: theme.spacing(1),
  border: `solid 1px ${theme.palette.divider}`,
  borderRadius: Number(theme.shape.borderRadius) * 1.5,
  backgroundColor: theme.palette.background[theme.palette.mode === 'light' ? 100 : 800],
}));

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
  const [countDeposit, setCountDeposit] = useState(0);
  const [countWithdraw, setCountWithdraw] = useState(0);
  const [countNofi, setCountNofi] = useState(0);
  const [countUser, setCountUser] = useState(0);
  const widthdrawRef = useRef();
  const deposutRef = useRef();
  const customerRef = useRef();

  const loginUser  = parseJson(localStorage.getItem('user') || "");
  let isAgent = false;
  if(loginUser?.roleMain?.order === 4 || loginUser?.roleMain?.order === 5) {
    isAgent = true;
  }
   
  
  useEffect(() => {
    getHeaderDashboard();
    getHeaderCount();
    getOnlineCount();
    
    const optimer = setInterval(getHeaderCount, 3000);
    const optimer1 = setInterval(getOnlineCount, 10000);
    return () => {
      clearInterval(optimer);
      clearInterval(optimer1);
    };
    
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  const getHeaderDashboard = () => {
    if(isDesktop === false)
      return;
    try {
      const url = adminHeaderDashboardUrl;
      const headers = {};
      apiWithPostData(url, {}, headers).then((response) => {
        const { dashboard } = response;
        setTotalMember(dashboard?.total_member || 0);
        setBetMember(dashboard?.total_bet || 0);
        setNewMember(0);
        setUserMoney(dashboard?.user_money || 0);
        setUserPoint(dashboard?.user_point || 0);
        setDeposit(dashboard?.totald || 0);
        setWithdraw(dashboard?.totalw || 0);
        // eslint-disable-next-line no-unsafe-optional-chaining
        setProfitLoss(dashboard?.totald - dashboard?.totalw);
        setCManager(0);
        setPManager(0);
        setBettingCount(dashboard?.betting || 0);
        setTotalBet(dashboard?.total_bet || 0);
        setTotalWin(dashboard?.total_win || 0);
        setRolling(dashboard?.rolling || 0);
        // eslint-disable-next-line no-unsafe-optional-chaining
        const rate = (dashboard?.total_bet) - (dashboard?.total_win)
        setBettingProfit(rate || 0);
      });
    } catch (error) {
      console.log(error);
    }
  };
  
  const getHeaderCount = () => {
    if(isDesktop === false)
      return;
    try {
      const url = adminHeaderCountUrl;
      const headers = {};
      apiWithPostData(url, {}, headers).then((response) => {
        const { nofi } = response;
        setCountDeposit (response?.countDeposit || 0);
        setCountWithdraw (response?.countWithdraw || 0);
        setCountNofi (response?.countNofi || 0);
        setCountUser (response?.countUser || 0);

        if(nofi?.countDeposit === true) {
          new Audio(audioDeposit).play();
          deposutRef.current = setInterval(() => {
              new Audio(audioDeposit).play();
          }, 1000);
          return;
        }
        new Audio(audioDeposit).pause();
        
        if(nofi?.countWithdraw === true) {
          new Audio(audioWithdraw).play();
          widthdrawRef.current = setInterval(() => {
              new Audio(audioWithdraw).play();
          }, 1000);
          return;
        }
        new Audio(audioWithdraw).pause();
        if (nofi?.countNofi === true) {
            new Audio(audioCustomer).play();
            customerRef.current = setInterval(() => {
                new Audio(audioCustomer).play();
            }, 3000);
            return;
        }
        new Audio(audioCustomer).pause();
        if(nofi?.countUser === true) {
          new Audio(audioAddUser).play();
        }
        new Audio(audioAddUser).pause();
      });
    } catch (error) {
      console.log(error);
    }
  };
  
  const getOnlineCount = () => {
    try {
      const url = userSessionUrl;
      const data = {
        page: 1,
        pageSize: 100,
        date:[new Date, new Date]
      }
      const headers = {};
      apiWithPostData(url, data, headers).then((response) => {
        const {count} = response;
        setLoginMember(count);
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
        direction="row"
        alignItems="center"
        justifyContent="flex"
        spacing={{ xs: 0.5, sm: 1.5 }}
      >
        {isDesktop && 
            <StyledBlockContainer variant="outlined">
              <Grid container spacing={1} 
                direction="row"
              > 
                {!isAgent && 
                  <HeaderAnalytic
                    title="depositRequestCount"
                    isAgent ={isAgent}
                    price={countDeposit}
                    color={theme.palette.info.main}
                    handleClick={() => movePage(PATH_DASHBOARD.invoice.inReport)}
                  />
                }
                {!isAgent && 
                  <HeaderAnalytic
                    title="memberRequestCount"
                    isAgent ={isAgent}
                    price={countUser}
                    color={theme.palette.info.main}
                    handleClick={() => movePage(PATH_DASHBOARD.user.list)}
                  />
                }
                <HeaderAnalytic
                  title="loggedInMember"
                  isAgent ={isAgent}
                  price={loginMember}
                  color={theme.palette.warning.main}
                  handleClick={() => movePage(PATH_DASHBOARD.user.connect)}
                />
                <HeaderAnalytic
                  title="userMoney"
                  isAgent ={isAgent}
                  price={userMoney}
                  color={theme.palette.text.secondary}
                  handleClick={() => movePage(PATH_DASHBOARD.user.list)}
                />
                <HeaderAnalytic
                  title="totalDeposit"
                  isAgent ={isAgent}
                  price={deposit}
                  color={theme.palette.success.main}
                  handleClick={() => movePage(PATH_DASHBOARD.invoice.inReport)}
                />
                <HeaderAnalytic
                  title="totalWithdraw"
                  isAgent ={isAgent}
                  price={withdraw}
                  color={theme.palette.success.main}
                  handleClick={() => movePage(PATH_DASHBOARD.invoice.outReport)}
                />
                 <HeaderAnalytic
                  title="depWithProfit"
                  isAgent ={isAgent}
                  price={profitLoss}
                  color={theme.palette.success.main}
                  handleClick={() => movePage(PATH_DASHBOARD.invoice.inReport)}
                /> 
                {!isAgent && 
                  <HeaderAnalytic
                    title="withdrawRequestCount"
                    isAgent ={isAgent}
                    price={countWithdraw}
                    color={theme.palette.info.main}
                    handleClick={() => movePage(PATH_DASHBOARD.invoice.outReport)}
                  />
                }
                {!isAgent && 
                  <HeaderAnalytic
                    title="faqRequestCount"
                    isAgent ={isAgent}
                    price={countNofi}
                    color={theme.palette.info.main}
                    handleClick={() => movePage(PATH_DASHBOARD.customer.faq)}
                  />
                }
                <HeaderAnalytic
                  title="totalMembers"
                  isAgent ={isAgent}
                  price={totalMember}
                  color={theme.palette.warning.main}
                  handleClick={() => movePage(PATH_DASHBOARD.user.list)}
                />
                <HeaderAnalytic
                  title="userPoint"
                  isAgent ={isAgent}
                  price={userPoint}
                  color={theme.palette.text.secondary}
                  handleClick={() => movePage(PATH_DASHBOARD.user.list)}
                />
                <HeaderAnalytic
                  title="totalBet"
                  isAgent ={isAgent}
                  price={totalBet}
                  color={theme.palette.success.main}
                  handleClick={() => movePage(PATH_DASHBOARD.bet.common)}
                />
                <HeaderAnalytic
                  title="totalWin"
                  isAgent ={isAgent}
                  price={totalWin}
                  color={theme.palette.success.main}
                  handleClick={() => movePage(PATH_DASHBOARD.bet.common)}
                />
                <HeaderAnalytic
                  title="bettingProfit"
                  isAgent ={isAgent}
                  price={bettingProfit}
                  color={theme.palette.success.main}
                  handleClick={() => movePage(PATH_DASHBOARD.bet.common)}
                />
              </Grid>
            </StyledBlockContainer>
        }
            

        {/* </Card> */}
      
        {/* <Stack
          flexGrow={1}
          direction="row"
          alignItems="center"
          justifyContent="flex-end"
          spacing={{ xs: 0.5, sm: 1.5 }}
        >
          <NotificationsPopover />
        
          <Badge badgeContent={countDeposit} color="error">
            <PaidIcon color='success'  sx={{ cursor: 'pointer'}}  onClick={() => movePage(PATH_DASHBOARD.invoice.inReport)}/>
          </Badge>

          <Badge badgeContent={countWithdraw} color="error">
            <CreditScoreRoundedIcon color='success'  sx={{ cursor: 'pointer'}}  onClick={() => movePage(PATH_DASHBOARD.invoice.outReport)}/>
          </Badge>
        
          <Badge badgeContent={countNofi} color="error">
            <NotificationsNoneRoundedIcon color='success'  sx={{ cursor: 'pointer'}}  onClick={() => movePage(PATH_DASHBOARD.customer.faq)}/>
          </Badge>
        
          <Badge badgeContent={countUser} color="error">
            <PersonAddRoundedIcon color='success'  sx={{ cursor: 'pointer'}}  onClick={() => movePage(PATH_DASHBOARD.user.list)}/>
          </Badge>

          <LanguagePopover />
          <AccountPopover />
        </Stack> */}
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
