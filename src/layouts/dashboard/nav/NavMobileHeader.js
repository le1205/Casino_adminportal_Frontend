import { Link as RouterLink, useNavigate} from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';
// @mui
import { useTheme } from '@mui/material/styles';
import {  Grid, Stack } from '@mui/material';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
import useResponsive from '../../../hooks/useResponsive';
// utils
import { parseJson } from '../../../auth/utils';
// assets
import audioWithdraw from '../../../assets/mp3/withdraw.mp3';
import audioDeposit from '../../../assets/mp3/deposit.mp3';
import audioAddUser from '../../../assets/mp3/add-users.mp3';
import audioCustomer from '../../../assets/mp3/requre account.mp3';

import HeaderAnalytic from '../../../sections/@dashboard/header/headerMobileAnalytic';
// api
import { apiWithPostData } from '../../../utils/api';
// url
import { adminHeaderDashboardUrl, adminHeaderCountUrl, } from '../../../utils/urlList';

// ----------------------------------------------------------------------

export default function NavMobileHeader() {
  const theme = useTheme();
  const navigate = useNavigate();
  const isDesktop = useResponsive('up', 'lg');
  const loginUser  = parseJson(localStorage.getItem('user') || "");
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

  let isAgent = false;
  if(loginUser?.roleMain?.order === 4 || loginUser?.roleMain?.order === 5) {
    isAgent = true;
  }

  useEffect(() => {
    getHeaderDashboard();
    getHeaderCount();
    
    const optimer = setInterval(getHeaderCount, 3000);
    return () => {
      clearInterval(optimer);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  const getHeaderDashboard = () => {
    if(isDesktop === true)
      return;
    try {
      const url = adminHeaderDashboardUrl;
      const headers = {};
      apiWithPostData(url, {}, headers).then((response) => {
        const { dashboard } = response;
        setTotalMember(dashboard?.total_member || 0);
        setBetMember(dashboard?.total_bet || 0);
        setNewMember(0);
        setLoginMember(dashboard?.login_member || 0);
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
    if(isDesktop === true)
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

  const movePage = (path) => {
    navigate(path);
  };

  return (
    
    <Stack
      direction="row"
      alignItems="center"
      justifyContent="flex"
      spacing={{ xs: 0.5, sm: 1.5 }}
    >
      {!isDesktop && 
        <Grid container spacing={1} 
          direction="row"
        > {!isAgent && 
            <HeaderAnalytic
              title="depositRequestCount"
              price={countDeposit}
              color={theme.palette.info.main}
              handleClick={() => movePage(PATH_DASHBOARD.invoice.inReport)}
            />
          }
          {!isAgent && 
            <HeaderAnalytic
              title="withdrawRequestCount"
              price={countWithdraw}
              color={theme.palette.info.main}
              handleClick={() => movePage(PATH_DASHBOARD.invoice.outReport)}
            />
          }
          {!isAgent && 
            <HeaderAnalytic
              title="memberRequestCount"
              price={countUser}
              color={theme.palette.info.main}
              handleClick={() => movePage(PATH_DASHBOARD.user.list)}
            />
          }
          {!isAgent && 
            <HeaderAnalytic
              title="faqRequestCount"
              price={countNofi}
              color={theme.palette.info.main}
              handleClick={() => movePage(PATH_DASHBOARD.customer.faq)}
            />
          }
          <HeaderAnalytic
            title="loggedInMember"
            price={loginMember}
            color={theme.palette.warning.main}
            handleClick={() => movePage(PATH_DASHBOARD.user.connect)}
          />
          <HeaderAnalytic
            title="totalMembers"
            price={totalMember}
            color={theme.palette.warning.main}
            handleClick={() => movePage(PATH_DASHBOARD.user.list)}
          />
          <HeaderAnalytic
            title="userMoney"
            price={userMoney}
            color={theme.palette.text.secondary}
            handleClick={() => movePage(PATH_DASHBOARD.user.list)}
          />
          <HeaderAnalytic
            title="userPoint"
            price={userPoint}
            color={theme.palette.text.secondary}
            handleClick={() => movePage(PATH_DASHBOARD.user.list)}
          />
          <HeaderAnalytic
            title="totalDeposit"
            price={deposit}
            color={theme.palette.success.main}
            handleClick={() => movePage(PATH_DASHBOARD.invoice.inReport)}
          />
          <HeaderAnalytic
            title="totalBet"
            price={totalBet}
            color={theme.palette.success.main}
            handleClick={() => movePage(PATH_DASHBOARD.bet.common)}
          />
          <HeaderAnalytic
            title="totalWithdraw"
            price={withdraw}
            color={theme.palette.success.main}
            handleClick={() => movePage(PATH_DASHBOARD.invoice.outReport)}
          />
          <HeaderAnalytic
            title="totalWin"
            price={totalWin}
            color={theme.palette.success.main}
            handleClick={() => movePage(PATH_DASHBOARD.bet.common)}
          />
          <HeaderAnalytic
            title="depWithProfit"
            price={profitLoss}
            color={theme.palette.success.main}
            handleClick={() => movePage(PATH_DASHBOARD.invoice.inReport)}
          /> 
          <HeaderAnalytic
            title="bettingProfit"
            price={bettingProfit}
            color={theme.palette.success.main}
            handleClick={() => movePage(PATH_DASHBOARD.bet.common)}
          />
        </Grid>
      }
    </Stack>
  );
}
