import { Helmet } from 'react-helmet-async';
import { paramCase } from 'change-case';
import { useState, useEffect, useRef } from 'react';
import { Link as RouterLink, useNavigate, useLocation } from 'react-router-dom';
// md5
import {md5} from 'js-md5';
// @mui
import {
  Card,
  Table,
  Button,
  Divider,
  TableBody,
  Container,
  Dialog,
  Stack,
  TableContainer,
  DialogTitle,
  DialogContent,
  DialogContentText,
  TextField,
  DialogActions,
} from '@mui/material';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// components
import Iconify from '../../../components/iconify';
import Scrollbar from '../../../components/scrollbar';
import ConfirmDialog from '../../../components/confirm-dialog';
import CustomBreadcrumbs from '../../../components/custom-breadcrumbs';
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
import { UserTableToolbar, UserTableRow } from '../../../sections/@dashboard/user/list';
// sections
import UserEditForm from '../../../sections/@dashboard/user/UserEditForm';
// api
import { apiWithPostData, apiWithDeleteData, } from '../../../utils/api';
// url
import { adminListUrl, balanceUpdateUrl, roleListUrl, adminDeleteUrl, changePasswordUrl } from '../../../utils/urlList';
// locales
import { useLocales } from '../../../locales';
// utils
import {parseJson } from '../../../auth/utils';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'no', label: 'no', align: 'left' },
  { id: 'creator', label: 'creator', align: 'left' },
  { id: 'name', label: 'id', align: 'left' },
  { id: 'level', label: 'level', align: 'left' },
  { id: 'cash', label: 'cash', align: 'left' },
  // { id: 'point', label: 'point', align: 'left' },
  // { id: 'inOut', label: 'inOut', align: 'left' },
  // { id: 'totalLoose', label: 'totalLoose', align: 'left' },
  { id: 'action', label: 'action', align: 'left' },
  { id: 'lastDate', label: 'lastDate', align:'left' },
];

const oPcode = process.env.REACT_APP_SECRET_OPCODE;
const secretKey = process.env.REACT_APP_SECRET_KEY;

// ----------------------------------------------------------------------

export default function UserListPage() {
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

  const loginUser = parseJson(localStorage.getItem('user') || "");

  const navigate = useNavigate();
  const { translate } = useLocales();
  const [isFirst, setIsFirst] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [totalRole, setTotalRole] = useState([]);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [openAlert, setOpenAlert] = useState(false);
  const [openBalance, setOpenBalance] = useState(false);
  const [openRemove, setOpenRemove] = useState(false);
  const [openChangePassword, setOpenChangePassword] = useState(false);
  const [openChangeStatus, setOpenChangeStatus] = useState(false);
  const [isDeposit, setIsDeposit] = useState(true);
  const [selectedRow, setSelectedRow] = useState({});
  const [alertContent, setAlertContent] = useState('');
  const [filterName, setFilterName] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [balanceAmount, setBalanceAmount] = useState(0);
  const [totalUserCount, setTotalUserCount] = useState(0);
  const amountRef = useRef('');
  const passwordRef = useRef('');
  const confirmPasswordRef = useRef('');

  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(order, orderBy),
    filterName,
    filterRole,
    filterStatus,
  });

  const denseHeight = dense ? 52 : 72;
  const isFiltered = filterName !== '' || filterRole !== 'all' || filterStatus !== 'all';
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

  const handleFilterName = (event) => {
    setFilterName(event.target.value);
  };

  const handleFilterRole = (event) => {
    setFilterRole(event.target.value);
  };

  const handleClickSearch = () => {
    // console.log("clicked");
    setPage(0);
    usersList();
  };

  const handleEditRow = (id) => {
    navigate(PATH_DASHBOARD.user.edit(paramCase(id)));
  };

  const handleResetFilter = () => {
    setFilterName('');
    setFilterRole('all');
    setFilterStatus('all');
  };

  const handleCloseBalance = () => {
    setBalanceAmount(0);
    setOpenBalance(false);
  };

  const handleClickBalance = (row) => {
    setSelectedRow(row);
    setOpenBalance(true);
  };

  const handleClickRemove = (row) => {
    setSelectedRow(row);
    setOpenRemove(true);
  };

  const handleCloseRemove = () => {
    setOpenRemove(false);
  };

  const handleClickChangePassword = (row) => {
    setSelectedRow(row);
    setOpenChangePassword(true);
  };

  const handleCloseChangePassword = () => {
    setOpenChangePassword(false);
  };

  const handleClickChangeStatus = (row) => {
    setSelectedRow(row);
    setOpenChangeStatus(true);
  };

  const handleCloseChangeStatus = () => {
    setOpenChangeStatus(false);
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
    if(amount === '0' || amount === 0)
    {
      const content = "입금할 금액을 입력해주세요.";
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
    if(amount === '0' || amount === 0)
    {
      const content = "출금할 금액을 입력해주세요.";
      setAlertContent(content);
      handleOpenAlert();
    }
    else if (amount > selectedRow.cash){
      const content = "캐시금액보다 적은 금액을 입력해 주세요.";
      setAlertContent(content);
      handleOpenAlert();
    }
    else {
      setOpenConfirm(true);
    }
  };

  const updateUser = (id, amount, type) => {
    tableData.forEach(element => {
      if(id=== element._id) {
        element.cash = type === 'withdraw' ? element.cash - Number(amount) : element.cash + Number(amount);
      }
    });
  };

  const handleUpdateBalance = () => {
    setOpenConfirm(false);
    try {
      const url = balanceUpdateUrl;
      const amount = amountRef.current.value;
      const type = isDeposit ? 'deposit' : 'withdraw';
      const balanceId = selectedRow._id;
      const headers = {};
      apiWithPostData(url, { amount, type, balanceId}, headers).then((response) => {
        handleCloseBalance();
        if(response === true) {
          updateUser(balanceId, amount, type);
        }
      });
    } catch (error) {
      console.log(error);
    }
  };

  const updateUserRemove = (id) => {
    const tempArr = tableData;
    // eslint-disable-next-line array-callback-return, consistent-return
    const data = tempArr.filter((item)=>{
      if(item._id !== id){
        return item
      }
    });
    setTableData(data)
  };

  const handleRemoveUser = () => {
    setOpenConfirm(false);
    try {
      const url = adminDeleteUrl + selectedRow._id;
      const headers = {};
      const data = {};
      apiWithDeleteData(url, data, headers).then((response) => {
        handleCloseRemove();
        if (response?.deletedCount > 0) {
          updateUserRemove(selectedRow._id);
        }
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleChangePassword = () => {
    setOpenConfirm(false);
    const password = passwordRef.current.value;
    const confirmPassword = confirmPasswordRef.current.value;
    if(password === '' || password === undefined)
    {
      const content = "새 비밀번호를 입력하세요";
      setAlertContent(content);
      handleOpenAlert();
    }
    else if(confirmPassword === '' || confirmPassword === undefined)
    {
      const content = "비밀번호 확인을 입력하세요";
      setAlertContent(content);
      handleOpenAlert();
    }
    else if(password !== confirmPassword )
    {
      const content = "비밀번호를 확인하세요";
      setAlertContent(content);
      handleOpenAlert();
    }
    else {
      try {
        const url = changePasswordUrl;
        const headers = {};
        const data = {
          newpass: password,
          userId: selectedRow._id
        };
        apiWithPostData(url, data, headers).then((response) => {
          handleCloseChangePassword();
          if(response === "Success!") {
            const content = "비밀번호 변경 성공";
            setAlertContent(content);
            handleOpenAlert();
          }
          else {
            const content = "비밀번호 변경 실패";
            setAlertContent(content);
            handleOpenAlert();
          }
        });
      } catch (error) {
        console.log(error);
      }
    }
  };

  const handleUpdateSuccess = (data) =>{
    tableData.forEach(element => {
      if(selectedRow._id=== element._id) {
        element.isVerified = data.verify || false;
        element.status = data.isBlock || false;
        element.nickName = data.Nickname || '';
        element.birthday = data.Birthday || '';
        element.phoneNumber = data.phone || '';
        element.bankInfo = data.bankName || '';
        element.bankAccount = data.bankAccount || '';
        element.loginAvailable = data.verify || true;
        element.betAvailable = data.isBlock || true;
        element.depositOwner = data.bankOwner || '';
        element.community = data.community || '';
        element.slotRolling = data.slotRate || 0;
        element.slotLoosing = data.loseSlotRate || 0;
        element.casinoRolling = data.liveRate || 0;
        element.casinoLoosing = data.loseLiveRate || 0;
        element.agent = data.agent || '';
        element.exchangeRate = data.withdrawRate || '';
      }
    });
    setOpenChangeStatus(false);
  }

  const usersList = () => {
    try {
      setIsLoading(true);
      const url = adminListUrl;
      const headers = {};
      let data = {
        page: page + 1,
        pageSize:rowsPerPage,
      };
      if(filterName !== '') {
        data = {
          page: page + 1,
          pageSize:rowsPerPage,
          username: filterName,
        };
      }
      if(filterRole !== 'all') {
        data = {
          page: page + 1,
          pageSize:rowsPerPage,
          role: filterRole,
        };
      }
      if(filterName !== '' && filterRole !== 'all') {
        data = {
          page: page + 1,
          pageSize:rowsPerPage,
          username: filterName,
          role: filterRole,
        };
      }
      apiWithPostData(url, data, headers).then((response) => {
        const { results, count } = response;
        setTotalUserCount(count);
        const users = [];
        results.forEach((item, index) => {
          if(item.username !== process.env.REACT_APP_ADMIN_DEVELOPER) {
            const user = {
              _id: item?._id || '',
              no: page * rowsPerPage + index + 1,
              id: item?.user_id || '',
              name: item?.username || '',
              company: item?.company || '',
              creator: item?.creator || '',
              level: item?.level || '',
              cash: item?.balanceMain || 0,
              point: item?.pointSlot || 0,
              inOut: item?.inOut || '',
              totalLoose: item?.loseSlotRate || 0,
              lastDate: item?.updatedAt,
              isVerified: item?.verify || false,
              status: item?.isBlock || false,
              role: item?.role?.name || '',
              roleOrder: item?.role?.order || 0,
              nickName: item?.Nickname || '',
              birthday: item?.Birthday || '',
              phoneNumber: item?.phone || '',
              bankInfo: item?.bankName || '',
              bankAccount: item?.bankAccount || '',
              loginAvailable: item?.verify || true,
              betAvailable: item?.isBlock || true,
              depositOwner: item?.bankOwner || '',
              community: item?.community || '',
              slotRolling: item?.slotRate || 0,
              slotLoosing: item?.loseSlotRate || 0,
              casinoRolling: item?.liveRate || 0,
              casinoLoosing: item?.loseLiveRate || 0,
              agent: item?.agent || '',
              exchangeRate: item?.withdrawRate || '',
            }
            users.push(user);
          }
        });
        setTableData(users);
        setIsLoading(false);

      });
    } catch (error) {
      console.log(error);
    }

  };

  const roleList = () => {
    try {
      setIsLoading(true);
      const url = roleListUrl;
      const headers = {};
      const data = {};
      apiWithPostData(url, data, headers).then((response) => {
        const { results } = response;
        const roles = [{
          id: 'all',
          name: 'all',
          order: 0,
          title: 'all',
        }];
        results.forEach((item, index) => {
          if(parseInt(item?.order, 10) > parseInt(loginUser?.roleMain?.order, 10)) {
            const role = {
              id: item._id || '',
              name: item.name || '',
              order: item.order || '',
              title: item.title || '',
            }
            roles.push(role);
          }
        });
        setTotalRole(roles);
      });
    } catch (error) {
      console.log(error);
    }
  };

  
  useEffect(() => {
    
    // const code = oPcode+secretKey
    // console.log(code);
    // const md5Signature = md5(code).toLowerCase();
    // console.log(md5Signature);
    roleList();
    usersList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFirst]);
  
  
  useEffect(() => {
    usersList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, rowsPerPage]);

  return (
    <>
      <Helmet>
        <title> Admin Portal </title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'xl'}>
        <CustomBreadcrumbs
          heading="memberList"
          links={[
            { name: 'dashboard', href: PATH_DASHBOARD.root },
            { name: 'user', href: PATH_DASHBOARD.user.root },
            { name: 'list' },
          ]}
          action={
            <Button
              component={RouterLink}
              to={PATH_DASHBOARD.user.new}
              variant="contained"
              startIcon={<Iconify icon="eva:plus-fill" />}
              sx={{ mt: 4 }}
            >
              New User
            </Button>
          }
        />
        <Card>
          <Divider />
          <UserTableToolbar
            isFiltered={isFiltered}
            filterName={filterName}
            filterRole={filterRole}
            optionsRole={totalRole}
            onFilterName={handleFilterName}
            onFilterRole={handleFilterRole}
            onResetFilter={handleResetFilter}
            onClickSearch={handleClickSearch}
          />

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
                    .slice(0,  rowsPerPage)
                    .map((row, index) => (
                      <UserTableRow
                        key={row._id}
                        row={row}
                        index={index}
                        selected={selected.includes(row.id)}
                        onSelectRow={() => onSelectRow(row.id)}
                        onEditRow={() => handleEditRow(row.name)}
                        onSelectMoney={() => handleClickBalance(row)}
                        onSelectRemove={() => handleClickRemove(row)}
                        onSelectChangePassword={() => handleClickChangePassword(row)}
                        onSelectChangeStatus={() => handleClickChangeStatus(row)}
                      />
                    ))}

                  {/* <TableEmptyRows
                    height={denseHeight}
                    emptyRows={emptyRows(page, rowsPerPage, tableData.length)}
                  /> */}

                  <TableNoData isNotFound={isNotFound} />
                </TableBody>
              </Table>
            </Scrollbar>
          </TableContainer>

          <TablePaginationCustom
            count={totalUserCount}
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
        <DialogContent direction="column">
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
      
      <Dialog open={openRemove} onClose={handleCloseRemove}>
        <DialogTitle>확인</DialogTitle>
        <DialogContent>
          <DialogContentText>
            정말 {selectedRow.name} 회원님을 삭제하시겠습니까?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleRemoveUser}variant="contained" color="success">
            확인
          </Button>
          <Button onClick={handleCloseRemove} variant="contained" color="warning">
            취소
          </Button>
        </DialogActions>
      </Dialog>
      
      <Dialog open={openChangePassword} onClose={handleCloseChangePassword}  sx={{ minWidth: 600 }}>
        <DialogTitle>{`${translate('changeUserStatus')}`}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            fullWidth
            type="password"
            margin="dense"
            variant="outlined"
            label={`${translate('password')}`}
            inputRef={passwordRef}
          />
          <TextField
            autoFocus
            fullWidth
            type="password"
            margin="dense"
            variant="outlined"
            label={`${translate('confirmPassword')}`}
            inputRef={confirmPasswordRef}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleChangePassword}variant="contained" color="success">
          {`${translate('change')}`}
          </Button>
          <Button onClick={handleCloseChangePassword} variant="contained" color="warning">
          {`${translate('cancel')}`}
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

      <Dialog open = {openChangeStatus} onClose={handleCloseChangeStatus}>
        <UserEditForm isEdit currentUser={selectedRow} onSelectCancel={handleCloseChangeStatus} onUpdateSuccess={handleUpdateSuccess}/>
      </Dialog>

      <Dialog open={openAlert} onClose={handleCloseAlert} sx={{ minWidth: 400 }}>
        <DialogTitle>Alert</DialogTitle>

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

      {(isLoading === true) && <LoadingScreen/>} 
    </>
  );
}

// ----------------------------------------------------------------------

function applyFilter({ inputData, comparator, filterName, filterStatus, filterRole }) {
  // const stabilizedThis = inputData.map((el, index) => [el, index]);

  // stabilizedThis.sort((a, b) => {
  //   const order = comparator(a[0], b[0]);
  //   if (order !== 0) return order;
  //   return a[1] - b[1];
  // });

  // inputData = stabilizedThis.map((el) => el[0]);

  // if (filterName) {
  //   inputData = inputData.filter(
  //     (user) => user.name.toLowerCase().indexOf(filterName.toLowerCase()) !== -1
  //   );
  // }

  if (filterStatus !== 'all') {
    inputData = inputData.filter((user) => user.status === filterStatus);
  }

  // if (filterRole !== 'all') {
  //   inputData = inputData.filter((user) => user.role === filterRole);
  // }

  return inputData;
}
