import { Helmet } from 'react-helmet-async';
import { paramCase } from 'change-case';
import { useState, useEffect, useRef } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
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
// api
import { apiWithPostData } from '../../../utils/api';
// url
import { adminListUrl, balanceUpdateUrl, roleListUrl } from '../../../utils/urlList';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'id', label: 'id', align: 'left' },
  { id: 'name', label: 'name', align: 'left' },
  { id: 'company', label: 'company', align: 'left' },
  { id: 'level', label: 'level', align: 'left' },
  { id: 'cash', label: 'cash', align: 'left' },
  { id: 'point', label: 'point', align: 'left' },
  { id: 'inOut', label: 'inOut', align: 'left' },
  { id: 'totalLoose', label: 'totalLoose', align: 'left' },
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
    setSelected,
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
  const [totalRole, setTotalRole] = useState([]);

  const [openConfirm, setOpenConfirm] = useState(false);

  const [openAlert, setOpenAlert] = useState(false);

  const [openBalance, setOpenBalance] = useState(false);

  const [isDeposit, setIsDeposit] = useState(true);

  const [selectedRow, setSelectedRow] = useState({});

  const [alertContent, setAlertContent] = useState('');

  const [filterName, setFilterName] = useState('');

  const [filterRole, setFilterRole] = useState('all');

  const [filterStatus, setFilterStatus] = useState('all');
  const amountRef = useRef('');

  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(order, orderBy),
    filterName,
    filterRole,
    filterStatus,
  });

  const dataInPage = dataFiltered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

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

  const handleFilterStatus = (event, newValue) => {
    setPage(0);
    setFilterStatus(newValue);
  };

  const handleFilterName = (event) => {
    setPage(0);
    setFilterName(event.target.value);
  };

  const handleFilterRole = (event) => {
    setPage(0);
    setFilterRole(event.target.value);
  };

  const handleDeleteRow = (id) => {
    const deleteRow = tableData.filter((row) => row.id !== id);
    setSelected([]);
    setTableData(deleteRow);

    if (page > 0) {
      if (dataInPage.length < 2) {
        setPage(page - 1);
      }
    }
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
    setOpenBalance(false);
  };

  const handleClickBalance = (row) => {
    setSelectedRow(row);
    setOpenBalance(true);
  };

  const handleDepositBalance = () => {
    setIsDeposit(true);
    const amount = amountRef.current.value;
    if(amount === '' || amount === 0)
    {
      const content = "Please input amount to deposit.";
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
      const content = "Please input amount to withdraw.";
      setAlertContent(content);
      handleOpenAlert();
    }
    else if (amount > selectedRow.cash){
      const content = "Please input amount less than cash amount.";
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
      const url = balanceUpdateUrl;
      const amount = amountRef.current.value;
      const type = isDeposit ? 'deposit' : 'withdraw';
      const balanceId = selectedRow._id;
      const headers = {};
      apiWithPostData(url, { amount, type, balanceId}, headers).then((response) => {
        const { results } = response;
        handleCloseBalance();
        usersList();
      });
    } catch (error) {
      console.log(error);
    }
  };

  const usersList = () => {
    try {
      setIsLoading(true);
      const url = adminListUrl;
      const headers = {};
      const data = {};
      apiWithPostData(url, data, headers).then((response) => {
        const { results } = response;
        const users = [];
        results.forEach((item, index) => {
          const user = {
            _id: item._id || '',
            id: item.user_id || '---',
            name: item.Nickname || '---',
            company: item.company || '---',
            level: item.level || '---',
            cash: item.balanceMain || 0,
            point: item.pointSlot || 0,
            inOut: item.inOut || '---',
            totalLoose: item.loseSlotRate || 0,
            lastDate: item.updatedAt || '---',
            isVerified: item.verify || false,
            status: item.isBlock || false,
            role: item.role.name || '---',
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

  const roleList = () => {
    try {
      setIsLoading(true);
      const url = roleListUrl;
      const headers = {};
      const data = {};
      apiWithPostData(url, data, headers).then((response) => {
        const { results } = response;
        const roles = [{
          name: 'all',
          order: 0,
          title: 'all',
        }];
        results.forEach((item, index) => {
          const role = {
            name: item.name || '',
            order: item.order || '',
            title: item.title || '',
          }
          roles.push(role);
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
  }, []);

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
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row) => (
                      <UserTableRow
                        key={row.id}
                        row={row}
                        selected={selected.includes(row.id)}
                        onSelectRow={() => onSelectRow(row.id)}
                        onDeleteRow={() => handleDeleteRow(row.id)}
                        onEditRow={() => handleEditRow(row.name)}
                        onSelectMoney={() => handleClickBalance(row)}
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
            inputRef={amountRef}
          />
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
            Are you sure want to {isDeposit? 'deposit' : 'withdraw'} <strong> {amountRef.current? amountRef.current.value : 0} </strong> ?
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
