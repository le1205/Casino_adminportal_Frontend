import { Helmet } from 'react-helmet-async';
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
// @mui
import {
  Card,
  Stack,
  Table,
  Button,
  Divider,
  TableBody,
  Container,
  Dialog,
  TextField,
  DialogTitle,
  DialogContent,
  DialogContentText,
  TableContainer,
  DialogActions,
} from '@mui/material';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';

// components
import Scrollbar from '../../../components/scrollbar';
import CustomBreadcrumbs from '../../../components/custom-breadcrumbs';
import ConfirmDialog from '../../../components/confirm-dialog';
import { useSettingsContext } from '../../../components/settings';
import LoadingScreen from '../../../components/loading-screen';
import {
  useTable,
  getComparator,
  emptyRows,
  TableNoData,
  TableEmptyRows,
  TableHeadCustom,
  TablePaginationCustom,
} from '../../../components/table';
// sections
import { UserConnectingTableToolbar, UserConnectingTableRow } from '../../../sections/@dashboard/user/list';
// api
import { apiWithPostData, apiWithGetData, apiWithDeleteData } from '../../../utils/api';
// url
import { userSessionUrl, realBalanceUpdateUrl, userBalanceUrl, userDeleteSessionUrl} from '../../../utils/urlList';
// url
import { validateIPaddress,} from '../../../utils/validate';
import SettingGameSlotPage from '../setting/game/SettingGameSlotPage';

// ----------------------------------------------------------------------


const TABLE_HEAD = [
  { id: 'id', label: 'id', align: 'left' },
  { id: 'company', label: 'company', align: 'left' },
  { id: 'cash', label: 'cash', align: 'left' },
  { id: 'connectTime', label: 'connectTime', align: 'left' },
  { id: 'ip', label: 'ip', align: 'left' },
  // { id: 'depowith', label: 'depowith', align: 'left' },
  { id: 'lastGame', label: 'lastGame', align: 'left' },
  { id: 'loginPossible', label: 'loginPossible', align:'left' },
  // { id: 'betPossible', label: 'betPossible', align:'left' },
  { id: 'action', label: 'action', align: 'left' },
  // { id: 'confirm', label: 'confirm', align:'left' },
  { id: 'logout', label: 'logout', align:'left' },
];

export default function UserConnectPage() {
  const {
    dense,
    page,
    order,
    orderBy,
    rowsPerPage,
    setPage,
    //
    selected,
    onSelectRow,
    onSelectAllRows,
    //
    onSort,
    onChangeDense,
    onChangePage,
    onChangeRowsPerPage,
  } = useTable();

  const { themeStretch } = useSettingsContext();

  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [filterName, setFilterName] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterEndDate, setFilterEndDate] = useState(new Date);
  const [filterStartDate, setFilterStartDate] = useState(new Date);
  const [openBalance, setOpenBalance] = useState(false);
  const [isDeposit, setIsDeposit] = useState(true);
  const [selectedRow, setSelectedRow] = useState({});
  const [alertContent, setAlertContent] = useState('');
  const [updateCount, setUpdateCount] = useState(0);
  const amountRef = useRef('');
  const [openConfirm, setOpenConfirm] = useState(false);
  const [openAlert, setOpenAlert] = useState(false);
  const [balanceAmount, setBalanceAmount] = useState(0);

  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(order, orderBy),
    filterName,
    filterRole,
    filterStatus,
  });


  const denseHeight = dense ? 52 : 72;

  const isNotFound =
    (!dataFiltered.length && !!filterName) ||
    (!dataFiltered.length && !!filterRole) ||
    (!dataFiltered.length && !!filterStatus);
    
  const handleCloseAlert = () => {
    setOpenAlert(false);
  };

  const handleOpenAlert = () => {
    setOpenAlert(true);
  };

  const handleCloseConfirm = () => {
    setOpenConfirm(false);
  };

  const handleCloseBalance = () => {
    setOpenBalance(false);
  };

  const handleClickBalance = (row) => {
    setSelectedRow(row);
    setOpenBalance(true);
  };

  const handleClickRefresh = (row) => {
    setSelectedRow(row);
    try {
      setIsLoading(true);
      const url = userBalanceUrl + row.id;
      const headers = {};
      apiWithGetData(url, {}, headers).then((response) => {
        setIsLoading(false);
        if(response?.balance) {
          tableData.forEach(element => {
            if(row._id === element._id) {
              let count = updateCount;
              count += 1;
              setUpdateCount(count);
              element.cash = response?.balance;
            }
          });
        }
      });
    } catch (error) {
      setIsLoading(false);
      console.log(error);
    }
  };

  const handleChangeAmount = (event) => {
    if(event?.target?.value) {
      setBalanceAmount(parseInt(event?.target?.value, 10));
    }
    else {
      setBalanceAmount(0);
    }
  };
  

  const handleDepositBalance = () => {
    setIsDeposit(true);
    const amount = amountRef.current.value;
    if(amount === '' || amount === 0)
    {
      const content = "지급할 수량을 입력하세요.";
      setAlertContent(content);
      handleOpenAlert();
    }
    else {
      setOpenConfirm(true);
    }
  };

  const handleWithdrawBalance = () => {
    setIsDeposit(false);
    const amount = amountRef.current.value;
    if(amount === '' || amount === 0)
    {
      const content = "회수할 수량을 입력하세요.";
      setAlertContent(content);
      handleOpenAlert();
    }
    else if (amount > selectedRow.cash){
      const content = "보유캐시보다 작은수량을 입력하세요. ";
      setAlertContent(content);
      handleOpenAlert();
    }
    else {
      setOpenConfirm(true);
    }
  };
  
  const updateSession = (id, amount, type) => {
    tableData.forEach(element => {
      if(id=== element.id) {
        element.cash = type === 'withdraw' ? element.cash - Number(amount) : element.cash + Number(amount);
      }
    });
  };
  
  const handleClickLogout = (id) => {
    try {
      const url = userDeleteSessionUrl + id;
      const data = {};
      const headers = {};
      apiWithDeleteData(url, data, headers).then((response) => {
        console.log("delete respnose>> ", response);
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleUpdateBalance = () => {
    setOpenConfirm(false);
    try {
      const url = realBalanceUpdateUrl;
      const amount = amountRef.current.value;
      const type = isDeposit ? 'deposit' : 'withdraw';
      const balanceId = selectedRow.id;
      const headers = {};
      apiWithPostData(url, { amount, type, balanceId}, headers).then((response) => {
        handleCloseBalance();
        if(response === true) {
          updateSession(balanceId, amount, type);
        }
      });
    } catch (error) {
      console.log(error);
    }
  };

  const sessionList = () => {
    try {
      setIsLoading(true);
      const url = userSessionUrl;
      const data = {
        page: 1,
        pageSize: 50,
        date:[filterStartDate, filterEndDate]
      }
      const headers = {};
      apiWithPostData(url, data, headers).then((response) => {
        const {count, results} = response;
        const users = [];
        results.forEach(item => {
          const ipAddress = validateIPaddress(item.ip) ? item.ip : '159.35.21.216';
          const user = {
            _id: item._id || '',
            id: item.userId || '',
            ip: ipAddress,
            username: item.user?.username || '',
            cash: item.user?.balance  || 0,
            lastDate: item.updatedAt,
            isVerified: item.user?.verify || false,
            status: item.user?.isBlock || false,
            lastGame: item.user?.userActive?.game_title || '',
            company: item.user?.userActive?.provider_name || '',
          }
          users.push(user);
        });

        setTableData(users);
        setIsLoading(false);

      });
    } catch (error) {
      console.log(error);
    }

  };

  
  useEffect(() => {
    sessionList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Helmet>
        <title> Admin Portal </title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'xl'}>
        <CustomBreadcrumbs
          heading="loggedInMember"
          links={[
            { name: 'dashboard', href: PATH_DASHBOARD.root },
            { name: 'user', href: PATH_DASHBOARD.user.root },
            { name: 'connecting' },
          ]}
        />

        <Card>
          <Divider />

          {/* <UserConnectingTableToolbar
            isFiltered={isFiltered}
            filterName={filterName}
            filterRole={filterRole}
            onFilterName={handleFilterName}
            onResetFilter={handleResetFilter}
            onClickSearch={handleClickSearch}
            onFilterStartDate={(newValue) => {
              setFilterStartDate(newValue);
            }}
            onFilterEndDate={(newValue) => {
              setFilterEndDate(newValue);
            }}
          /> */}

          <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>

            <Scrollbar>
              <Table size={dense ? 'small' : 'medium'} sx={{ minWidth: 800 }}>
                <TableHeadCustom
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={tableData.length}
                  numSelected={selected.length}
                  onSort={onSort}
                  onSelectAllRows={(checked) =>
                    onSelectAllRows(
                      checked,
                      tableData.map((row) => row.id)
                    )
                  }
                />

                <TableBody>
                  {dataFiltered
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row) => (
                      <UserConnectingTableRow
                        key={row.id}
                        count={updateCount}
                        row={row}
                        selected={selected.includes(row.id)}
                        onSelectRow={() => onSelectRow(row.id)}
                        onSelectLogout= {() => handleClickLogout(row._id)}
                        onSelectMoney={() => handleClickBalance(row)}
                        onSelectRefresh={() => handleClickRefresh(row)}
                      />
                    ))}

                  <TableEmptyRows
                    height={denseHeight}
                    emptyRows={emptyRows(page, rowsPerPage, tableData.length)}
                  />

                  <TableNoData isNotFound={isNotFound} />
                </TableBody>
              </Table>
            </Scrollbar>
          </TableContainer>

          <TablePaginationCustom
            count={dataFiltered.length}
            page={page}
            rowsPerPage={rowsPerPage}
            onPageChange={onChangePage}
            onRowsPerPageChange={onChangeRowsPerPage}
            //
            dense={dense}
            onChangeDense={onChangeDense}
          />
        </Card>
      </Container>

      
      <Dialog open={openBalance} onClose={handleCloseBalance}>
        <DialogTitle>회원캐시 관리자 입출금</DialogTitle>
        <DialogContent>
          <DialogContentText>
            현재 보유캐시: {selectedRow.cash}
          </DialogContentText>
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
          <Button onClick={handleDepositBalance}variant="contained" color="success">
            지급
          </Button>
          <Button onClick={handleWithdrawBalance} variant="contained" color="warning">
            회수
          </Button>
        </DialogActions>
      </Dialog>

      <ConfirmDialog
        open={openConfirm}
        onClose={handleCloseConfirm}
        title="Confirm"
        content={
          <>
            <strong> {amountRef.current? amountRef.current.value : 0} </strong> {isDeposit? '지급' : '회수'}  하시겠습니까 ?
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
            Confirm
          </Button>
        }
      />

      <Dialog open={openAlert} onClose={handleCloseAlert} sx={{ minWidth: 400 }}>
        <DialogTitle>Alert</DialogTitle>

        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {alertContent}
          </DialogContentText>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleCloseAlert} autoFocus>
            Ok
          </Button>
        </DialogActions>
      </Dialog>
      
      {(isLoading === true) && <LoadingScreen/>} 
    </>
  );
}

// ----------------------------------------------------------------------

function applyFilter({ inputData, comparator, filterName, filterStatus, filterRole }) {
  const stabilizedThis = inputData.map((el, index) => [el, index]);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);

  if (filterName) {
    inputData = inputData.filter(
      (user) => user.name.toLowerCase().indexOf(filterName.toLowerCase()) !== -1
    );
  }

  if (filterStatus !== 'all') {
    inputData = inputData.filter((user) => user.status === filterStatus);
  }

  if (filterRole !== 'all') {
    inputData = inputData.filter((user) => user.role === filterRole);
  }

  return inputData;
}
