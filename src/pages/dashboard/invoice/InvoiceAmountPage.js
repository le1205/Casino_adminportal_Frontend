import { Helmet } from 'react-helmet-async';
import { useState, useEffect, useRef } from 'react';
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
  DialogTitle,
  DialogContent,
  DialogContentText,
  TextField,
  DialogActions,
  TableContainer,
} from '@mui/material';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// components
import Scrollbar from '../../../components/scrollbar';
import CustomBreadcrumbs from '../../../components/custom-breadcrumbs';
import { useSettingsContext } from '../../../components/settings';
import LoadingScreen from '../../../components/loading-screen';
import ConfirmDialog from '../../../components/confirm-dialog';
import {
  useTable,
  getComparator,
  emptyRows,
  TableNoData,
  TableEmptyRows,
  TableHeadCustom,
  TableSelectedAction,
  TablePaginationCustom,
} from '../../../components/table';
// sections
import { InvoiceAmountTableToolbar, InvoiceAmountTableRow } from '../../../sections/@dashboard/invoice/list';
// utils
import {parseJson } from '../../../auth/utils';
// api
import { apiWithPostData } from '../../../utils/api';
// url
import { balanceListUrl, balanceUpdateUrl } from '../../../utils/urlList';
// ----------------------------------------------------------------------

const TABLE_HEAD = [
  // { id: 'distributor', label: 'distributor', align: 'center' },
  { id: 'creator', label: 'creator', align: 'center' },
  { id: 'user', label: 'user', align: 'center' },
  { id: 'amount', label: 'amount', align: 'center' },
  { id: 'action', label: 'action', align: 'center' },
];

// ----------------------------------------------------------------------

export default function InvoiceAmountPage() {
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
  const { user } = parseJson(localStorage.getItem('user') || "");
  const amountRef = useRef('');

  const { themeStretch } = useSettingsContext();const [isLoading, setIsLoading] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [filterName, setFilterName] = useState('');
  const [selectedRow, setSelectedRow] = useState({});
  const [openBalance, setOpenBalance] = useState(false);
  const [isDeposit, setIsDeposit] = useState(true);
  const [alertContent, setAlertContent] = useState('');
  const [openAlert, setOpenAlert] = useState(false);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [balanceAmount, setBalanceAmount] = useState(0);

  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(order, orderBy),
    filterName,
  });

  const denseHeight = dense ? 52 : 72;

  const isFiltered = filterName !== '';

  const isNotFound =
    (!dataFiltered.length && !!filterName) ||( !tableData.length);

  const handleFilterName = (event) => {
    setPage(0);
    setFilterName(event.target.value);
  };

  const handleResetFilter = () => {
    setFilterName('');
  };
  
  const handleCloseAlert = () => {
    setOpenAlert(false);
  };

  const handleOpenAlert = () => {
    setOpenAlert(true);
  };  

  const handleCloseConfirm = () => {
    setOpenConfirm(false);
  };

  const handleClickBalance = (row) => {
    setSelectedRow(row);
    setOpenBalance(true);
  };

  const handleCloseBalance = () => {
    setOpenBalance(false);
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

  const updateUser = (id, amount, type) => {
    tableData.forEach(element => {
      if(id=== element._id) {
        element.balance = type === 'withdraw' ? element.balance - Number(amount) : element.balance + Number(amount);
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

  const balanceList = () => {
    try {
      setIsLoading(true);
      setPage(0);
      const url = balanceListUrl;
      const headers = {};
      const data = {
        "page": 1,
        "pageSize": 100,
        "username": user?.username,
        "creatorId": user?._id,
      };
      apiWithPostData(url, data, headers).then((response) => {
        const {results, count} = response;
        setTableData(results);
        setIsLoading(false);
      });
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }

  };

  useEffect(() => {
    balanceList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Helmet>
        <title> Admin Portal </title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'xl'}>
        <CustomBreadcrumbs
          heading="amountList"
          links={[
            { name: 'dashboard', href: PATH_DASHBOARD.root },
            { name: 'invoices', href: PATH_DASHBOARD.invoice.root },
            { name: 'amount' },
          ]}
        />

          <Card>
            <Divider />

            <InvoiceAmountTableToolbar
              isFiltered={isFiltered}
              filterName={filterName}
              onFilterName={handleFilterName}
              onResetFilter={handleResetFilter}
            />

            <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
              <TableSelectedAction
                dense={dense}
                numSelected={selected.length}
                rowCount={tableData.length}
                onSelectAllRows={(checked) =>
                  onSelectAllRows(
                    checked,
                    tableData.map((row) => row.id)
                  )
                }
              />
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
                        <InvoiceAmountTableRow
                          key={row._id}
                          row={row}
                          selected={selected.includes(row._id)}
                          onSelectRow={() => onSelectRow(row._id)}
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
            현재 보유캐시: {selectedRow.balance}
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

function applyFilter({ inputData, comparator, filterName, filterStatus }) {
  const stabilizedThis = inputData.map((el, index) => [el, index]);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);

  if (filterName) {
    inputData = inputData.filter(
      (user) => user.username.toLowerCase().indexOf(filterName.toLowerCase()) !== -1
    );
  }

  if (filterStatus !== 'all') {
    inputData = inputData.filter((user) => user.status === filterStatus);
  }

  return inputData;
}

