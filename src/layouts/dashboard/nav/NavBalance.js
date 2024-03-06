import PropTypes from 'prop-types';
import { useEffect, useState, useRef } from 'react';
// @mui
import { styled, alpha, useTheme } from '@mui/material/styles';
import { 
  Button, 
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  TextField,
  DialogActions, 
} from '@mui/material';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
import ConfirmDialog from '../../../components/confirm-dialog';
import { useSnackbar } from '../../../components/snackbar';
// locales
import { useLocales } from '../../../locales';

// utils
import { parseJson } from '../../../auth/utils';
// api
import { apiWithPostData } from '../../../utils/api';
// url
import { requestSubAdminUrl, } from '../../../utils/urlList';


// ----------------------------------------------------------------------

export default function NavBalance() {
  const theme = useTheme();
  const { translate } = useLocales();
  const { enqueueSnackbar } = useSnackbar();
  const [openBalance, setOpenBalance] = useState(false);
  const [balanceAmount, setBalanceAmount] = useState(0);
  const [isDeposit, setIsDeposit] = useState(true);
  const [alertContent, setAlertContent] = useState('');
  const [openAlert, setOpenAlert] = useState(false);
  const [openConfirm, setOpenConfirm] = useState(false);

  const amountRef = useRef('');

  const user = parseJson(localStorage.getItem('user') || '');

  const handleClickDeposit = () => {
    setIsDeposit(true);
    setOpenBalance(true);
  };

  const handleClickWithdraw = () => {
    setIsDeposit(false);
    setOpenBalance(true);
  };

  const handleOpenAlert = () => {
    setOpenAlert(true);
  };

  const handleCloseAlert = () => {
    setOpenAlert(false);
  };

  const handleCloseBalance = () => {
    setBalanceAmount(0);
    setOpenBalance(false);
  };

  const handleCloseConfirm = () => {
    setOpenConfirm(false);
  };

  const handleChangeAmount = (event) => {
    if(event?.target?.value) {
      setBalanceAmount(parseInt(event?.target?.value, 10));
    }
    else {
      setBalanceAmount(0);
    }
  };

  const handleBalance = () => {
    const amount = amountRef.current.value;
    if(amount === 0 || amount === '0')
    {
      const content = "금액을 입력하세요.";
      setAlertContent(content);
      handleOpenAlert();
    }
    else if(isDeposit) {
      setOpenConfirm(true);
    }
    else if (amount > user?.vituralMoney){
      const content = "캐시금액보다 적은 금액을 입력해 주세요.";
      setAlertContent(content);
      handleOpenAlert();
    }
    else {
      setOpenConfirm(true);
    }
 };

 const handleUpdateBalance = () => {
   setOpenConfirm(false);
   try {
     const url = requestSubAdminUrl;
     const amount = amountRef.current.value;
     const type = isDeposit ? 'deposit' : 'withdraw';
     const headers = {};
     apiWithPostData(url, { amount, type}, headers).then((response) => {
        enqueueSnackbar(isDeposit ? '입금 성공!' : '출금 성공!');
       handleCloseBalance();
     });
   } catch (error) {
     console.log(error);
   }
 };


  useEffect(() => {

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  return (
    <>
    <Stack 
      sx={{
        flexDirection: 'row',
        alignItems:'center',
        justifyContent:'center',
      }}>
      <Button variant="contained" color="success" onClick={handleClickDeposit}>
        {`${translate('strDeposit')}`}
      </Button>
      <Button variant="contained" color="warning" sx={{ml:2}} onClick={handleClickWithdraw}>
        {`${translate('strWithdraw')}`}
      </Button>
    </Stack>
    
    <Dialog open={openBalance} onClose={handleCloseBalance}>
      <DialogTitle>회원캐시 관리자 {isDeposit ? '입금' : '출금'}</DialogTitle>
          {/* <DialogContentText>
            현재 보유캐시: {userInfo?.userInfo?.vituralMoney}
          </DialogContentText> */}
      <DialogContent direction="column">
        <TextField
          autoFocus
          fullWidth
          type="number"
          margin="dense"
          variant="outlined"
          label="Amount"
          value={balanceAmount}
          onChange={handleChangeAmount}
          inputRef={amountRef}
        />
        
          <Stack direction="row" align="left" spacing={2} sx={{pt: 2}}>
            <Button variant="outlined" color="inherit" sx={{minWidth: 80}} onClick={() => setBalanceAmount(balanceAmount + 1000)}>
              1천원
            </Button>
            <Button variant="outlined" color="inherit" sx={{minWidth: 80}} onClick={() => setBalanceAmount(balanceAmount + 2000)}>
              2천원
            </Button>
            <Button variant="outlined" color="inherit" sx={{minWidth: 80}} onClick={() => setBalanceAmount(balanceAmount + 3000)}>
              3천원
            </Button>
            <Button variant="outlined" color="inherit" sx={{minWidth: 80}} onClick={() => setBalanceAmount(balanceAmount + 5000)}>
              5천원
            </Button>
          </Stack>
        
          <Stack direction="row" align="left" spacing={2} sx={{pt: 2}}>
            <Button variant="outlined" color="inherit" sx={{minWidth: 80}} onClick={() => setBalanceAmount(balanceAmount + 10000)}>
              1만원
            </Button>
            <Button variant="outlined" color="inherit" sx={{minWidth: 80}} onClick={() => setBalanceAmount(balanceAmount + 30000)}>
              3만원
            </Button>
            <Button variant="outlined" color="inherit" sx={{minWidth: 80}} onClick={() => setBalanceAmount(balanceAmount + 50000)}>
              5만원
            </Button>
            <Button variant="outlined" color="inherit" sx={{minWidth: 80}} onClick={() => setBalanceAmount(balanceAmount + 100000)}>
              10만원
            </Button>
          </Stack>
        
          <Stack direction="row" align="left" spacing={2} sx={{pt: 2}}>
            <Button variant="outlined" color="inherit" sx={{minWidth: 80}} onClick={() => setBalanceAmount(balanceAmount + 300000)}>
              30만원
            </Button>
            <Button variant="outlined" color="inherit" sx={{minWidth: 80}} onClick={() => setBalanceAmount(balanceAmount + 500000)}>
              50만원
            </Button>
            <Button variant="outlined" color="inherit" sx={{minWidth: 80}} onClick={() => setBalanceAmount(balanceAmount + 1000000)}>
              100만원
            </Button>
            <Button variant="outlined" color="warning" sx={{minWidth: 80}} onClick={() => setBalanceAmount(0)}>
              정정
            </Button>
          </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleBalance}variant="contained" color="success">
          {isDeposit? '지급' : '회수'}
        </Button>
        <Button onClick={handleCloseBalance} variant="contained" color="warning">
          취소
        </Button>
      </DialogActions>
    </Dialog>

    <ConfirmDialog
      open={openConfirm}
      onClose={handleCloseConfirm}
      title="Confirm"
      content={
        <>
        정말  <strong> {amountRef.current? amountRef.current.value : 0} </strong> 금액을 {isDeposit? '입금' : '출금'} 하시겠습니까?
        </>
      }
      action={
        <Button
          variant="contained"
          color="success"
          onClick={() => {
            handleUpdateBalance();
          }}
        >
          확인
        </Button>
      }
    />

    <Dialog open={openAlert} onClose={handleCloseAlert} sx={{ minWidth: 400 }}>
      <DialogTitle>알림</DialogTitle>

      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          {alertContent}
        </DialogContentText>
      </DialogContent>

      <DialogActions>
        <Button onClick={handleCloseAlert} autoFocus>
          확인
        </Button>
      </DialogActions>
    </Dialog>

    </>
  );
}
