import { Helmet } from 'react-helmet-async';
import { useState, useEffect } from 'react';
// @mui
import {
  Card,
  Table,
  Tooltip,
  Divider,
  TableRow, 
  TableHead, 
  TableCell,
  TableBody,
  Container,
  IconButton,
  TableContainer, 
} from '@mui/material';
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
  { id: 'date', label: 'Date', align: 'center',  colSpan: 1 },
  { id: 'username', label: 'User name', align: 'center',  colSpan: 1 },
  { id: 'deposit', label: 'Deposit', align: 'center', colSpan: 1 },
  { id: 'withdraw', label: 'Withdraw', align: 'center', colSpan: 1 },
  { id: 'depowith', label: 'Deposit-Wthdraw', align: 'center', colSpan: 1 },
  { id: 'betting', label: 'Betting Amount', align: 'center', colSpan: 3 },
  { id: 'win', label: 'Win Amount', align: 'center', colSpan: 3 },
  { id: 'rolling', label: 'Rolling Amount', align: 'center', colSpan: 3 },
  { id: 'loosing', label: 'Loosing Amount', align: 'center', colSpan: 3 },
];

const TABLE_SUB_HEAD = [
  { id: 'date', label: '', align: 'center', },
  { id: 'username', label: '', align: 'center', },
  { id: 'deposit', label: '', align: 'center', },
  { id: 'withdraw', label: '', align: 'center', },
  { id: 'depowith', label: '', align: 'center', },
  { id: 'bettingCasino', label: 'Casino', align: 'center', },
  { id: 'bettingSlot', label: 'Slot', align: 'center', },
  { id: 'bettingTotal', label: 'Total', align: 'center', },
  { id: 'winCasino', label: 'Casino', align: 'center', },
  { id: 'winSlot', label: 'Slot', align: 'center', },
  { id: 'winTotal', label: 'Total', align: 'center', },
  { id: 'rollingCasino', label: 'Casino', align: 'center', },
  { id: 'rollingSlot', label: 'Slot', align: 'center', },
  { id: 'rollingTotal', label: 'Total', align: 'center', },
  { id: 'loosingCasino', label: 'Casino', align: 'center', },
  { id: 'loosingSlot', label: 'Slot', align: 'center', },
  { id: 'loosingTotal', label: 'Total', align: 'center', },
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
  const [isLoading, setIsLoading] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [filterRole, setFilterRole] = useState('all');
  const [filterEndDate, setFilterEndDate] = useState(new Date);
  const [filterStartDate, setFilterStartDate] = useState(new Date);
  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(order, orderBy),
    filterRole,
  });
  const dataInPage = dataFiltered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  const denseHeight = dense ? 52 : 72;
  const isFiltered = filterRole !== 'all';

  const isNotFound =
    (!dataFiltered.length && !!filterRole)

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
          heading="Daily Report"
          links={[
            {
              name: 'Dashboard',
              href: PATH_DASHBOARD.root,
            },
            {
              name: 'Settlement',
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
              setFilterStartDate(newValue);
            }}
            onFilterEndDate={(newValue) => {
              setFilterEndDate(newValue);
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
                        {column.label}
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
                        {column.label}
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
