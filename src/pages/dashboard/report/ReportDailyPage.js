import { Helmet } from 'react-helmet-async';
import { useState, useEffect } from 'react';
// @mui
import {
  Card,
  Table,
  Tooltip,
  Button,
  Divider,
  TableRow, 
  TableHead, 
  TableCell,
  TableBody,
  Container,
  IconButton,
  TableContainer, 
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from '@mui/material';
import moment from 'moment';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// components
import Iconify from '../../../components/iconify';
import Scrollbar from '../../../components/scrollbar';
import CustomBreadcrumbs from '../../../components/custom-breadcrumbs';
import { useSettingsContext } from '../../../components/settings';
import LoadingScreen from '../../../components/loading-screen';
import {
  useTable,
  getComparator,
  emptyRows,
  TableNoData,
  TableEmptyRows,
  TableSelectedAction,
  TablePaginationCustom,
} from '../../../components/table';
// locales
import { useLocales } from '../../../locales';
// sections
import { ReportDailyTableToolbar, ReportDailyTableRow } from '../../../sections/@dashboard/report/list';
// api
import { apiWithPostData } from '../../../utils/api';
// url
import { dailyReportUrl } from '../../../utils/urlList';

// ----------------------------------------------------------------------

const ROLE_OPTIONS = [
  'all',
  'user',
  'partner',
  'admin',
];

const TABLE_HEAD = [
  { id: 'date', label: 'date', align: 'center',  colSpan: 1 },
  { id: 'userName', label: 'userName', align: 'center',  colSpan: 1 },
  { id: 'deposit', label: 'deposit', align: 'center', colSpan: 1 },
  { id: 'withdraw', label: 'withdraw', align: 'center', colSpan: 1 },
  { id: 'depowith', label: 'depowith', align: 'center', colSpan: 1 },
  { id: 'bettingAmount', label: 'bettingAmount', align: 'center', colSpan: 3 },
  { id: 'winAmount', label: 'winAmount', align: 'center', colSpan: 3 },
  { id: 'rollingAmount', label: 'rollingAmount', align: 'center', colSpan: 3 },
  { id: 'loosingAmount', label: 'loosingAmount', align: 'center', colSpan: 3 },
];

const TABLE_SUB_HEAD = [
  { id: 'date', label: '', align: 'center', },
  { id: 'username', label: '', align: 'center', },
  { id: 'deposit', label: '', align: 'center', },
  { id: 'withdraw', label: '', align: 'center', },
  { id: 'depowith', label: '', align: 'center', },
  { id: 'bettingCasino', label: 'casino', align: 'center', },
  { id: 'bettingSlot', label: 'slot', align: 'center', },
  { id: 'bettingTotal', label: 'total', align: 'center', },
  { id: 'winCasino', label: 'casino', align: 'center', },
  { id: 'winSlot', label: 'slot', align: 'center', },
  { id: 'winTotal', label: 'total', align: 'center', },
  { id: 'rollingCasino', label: 'casino', align: 'center', },
  { id: 'rollingSlot', label: 'slot', align: 'center', },
  { id: 'rollingTotal', label: 'total', align: 'center', },
  { id: 'loosingCasino', label: 'casino', align: 'center', },
  { id: 'loosingSlot', label: 'slot', align: 'center', },
  { id: 'loosingTotal', label: 'total', align: 'center', },
];

// ----------------------------------------------------------------------

export default function ReportDailyPage() {
  const {
    dense,
    page,
    order,
    orderBy,
    rowsPerPage,
    setPage,
    //
    selected,
    onSelectAllRows,
    //
    onChangeDense,
    onChangePage,
    onChangeRowsPerPage,
  } = useTable();

  const { themeStretch } = useSettingsContext();
  const { translate } = useLocales();
  const [isLoading, setIsLoading] = useState(false);
  const [openAlert, setOpenAlert] = useState(false);
  const [alertContent, setAlertContent] = useState(`${translate('couldNotSelectFuture')}`);
  const [tableData, setTableData] = useState([]);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [filterRole, setFilterRole] = useState('all');
  const [filterEndDate, setFilterEndDate] = useState(`${moment(new Date()).format('YYYY-MM-DD')  } 23:59:00`);
  const [filterStartDate, setFilterStartDate] = useState(`${moment(new Date()).format('YYYY-MM-DD')  } 00:00:00`);
  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(order, orderBy),
    filterRole,
  });
  const denseHeight = dense ? 52 : 72;
  const isFiltered = filterRole !== 'all';

  const isNotFound =
    (!dataFiltered.length && !!filterRole)

  const handleCloseAlert = () => {
    setOpenAlert(false);
  };
  
  const handleOpenAlert = () => {
    setOpenAlert(true);
  };
  

  const handleOpenConfirm = () => {
    setOpenConfirm(true);
  };

  const handleFilterRole = (event) => {
    setPage(0);
    setFilterRole(event.target.value);
  };

  const handleResetFilter = () => {
    setFilterRole('all');
  };

  const handleClickSearch = () => {
    dailyReport();
  };

  const handleClickStartDate = (date) => {
    const now = moment(new Date()).format('YYYY-MM-DD');
    const selectedDate = moment(date).format('YYYY-MM-DD');
    if (moment(selectedDate).isAfter(moment(now))) {
      setOpenAlert(true);
      setFilterStartDate(`${moment(new Date()).format('YYYY-MM-DD')  } 00:00:00`);
      return;
    }
    const startDate = `${moment(date).format('YYYY-MM-DD')  } 00:00:00`;
    setFilterStartDate(startDate);
  };

  const handleClickEndDate = (date) => {
    const now = moment(new Date()).format('YYYY-MM-DD');
    const selectedDate = moment(date).format('YYYY-MM-DD');
    if (moment(selectedDate).isAfter(moment(now))) {
      setOpenAlert(true);
      setFilterStartDate(`${moment(new Date()).format('YYYY-MM-DD')  } 23:59:00`);
      return;
    }
    const end = `${moment(date).format('YYYY-MM-DD')  } 23:59:00`;
    setFilterEndDate(end);
  };

  const dailyReport = () => {
    try {
      setIsLoading(true);
      const url = dailyReportUrl;
      const headers = {};
      const data = {
        "startDate": filterStartDate,
        "endDate": filterEndDate,
      };
      apiWithPostData(url, data, headers).then((response) => {
        const dailyArr = [];
        response?.forEach(element => {
          element?.forEach(context => {
            dailyArr.push(context);
          });
        });
        dailyArr?.forEach((item, index) => {
          if(item.data) {
            item.id = index;
          }
        });
        setTableData(dailyArr);
        setIsLoading(false);
      });
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }

  };
  
  useEffect(() => {
    dailyReport();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openConfirm]);

  return (
    <>
      <Helmet>
        <title> Admin Portal </title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'xl'}>
      <CustomBreadcrumbs
          heading="resultByDay"
          links={[
            {
              name: 'dashboard',
              href: PATH_DASHBOARD.root,
            },
            {
              name: 'settlement',
              href: PATH_DASHBOARD.report.root,
            },
            {
              name: 'Daily Report',
            },
          ]}
        />

        <Card>
          <Divider />

          <ReportDailyTableToolbar
            isFiltered={isFiltered}
            filterRole={filterRole}
            optionsRole={ROLE_OPTIONS}
            filterEndDate={filterEndDate}
            filterStartDate={filterStartDate}
            onFilterRole={handleFilterRole}
            onResetFilter={handleResetFilter}
            onClickSearch={handleClickSearch}
            onFilterStartDate={(newValue) => {
              handleClickStartDate(newValue);
            }}
            onFilterEndDate={(newValue) => {
              handleClickEndDate(newValue);
            }}
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
              action={
                <Tooltip title="Delete">
                  <IconButton color="primary" onClick={handleOpenConfirm}>
                    <Iconify icon="eva:trash-2-outline" />
                  </IconButton>
                </Tooltip>
              }
            />

            <Scrollbar>
              <Table size={dense ? 'small' : 'medium'} sx={{ minWidth: 800 }}>
                <TableHead>
                  <TableRow>
                    {TABLE_HEAD.map((column) => (
                      <TableCell
                        key={column.id}
                        align={column.align}
                        colSpan={column.colSpan}
                        style={{ top: 56, minWidth: column.minWidth }}
                      >
                        {`${translate(column.label)}`}
                      </TableCell>
                    ))}
                  </TableRow>
                  <TableRow>
                    {TABLE_SUB_HEAD.map((column) => (
                      <TableCell
                        key={column.id}
                        align={column.align}
                        style={{ top: 56, minWidth: column.minWidth }}
                      >
                      {`${translate(column.label)}`}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>                                      

                <TableBody>
                  {dataFiltered
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row) => (
                      <ReportDailyTableRow
                        key={row.username + row.date}
                        row={row}
                        selected={selected.includes(row.id)}
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

      <Dialog open={openAlert} onClose={handleCloseAlert} sx={{ minWidth: 400 }}>
        <DialogTitle sx={{ textTransform: 'capitalize' }}>{`${translate('alert')}`}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {alertContent}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAlert} autoFocus>
          {`${translate('ok')}`}
          </Button>
        </DialogActions>
      </Dialog>
      
      {(isLoading === true) && <LoadingScreen/>} 

    </>
  );
}

// ----------------------------------------------------------------------

function applyFilter({ inputData, comparator, filterRole }) {
  const stabilizedThis = inputData.map((el, index) => [el, index]);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);

  if (filterRole !== 'all' && filterRole !== 'user') {
    inputData = inputData.filter((user) => user.role === filterRole);
  }

  return inputData;
}
