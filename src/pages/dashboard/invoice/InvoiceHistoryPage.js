import { Helmet } from 'react-helmet-async';
import { useState, useEffect } from 'react';
// @mui
import {
  Tab,
  Tabs,
  Stack,
  Card,
  Table,
  Divider,
  TableBody,
  Typography,
  Container,
  TableContainer,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import moment from 'moment';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// components
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
  TableHeadCustom,
  TableSelectedAction,
  TablePaginationCustom,
} from '../../../components/table';
// sections
import { InvoiceTableToolbar, InvoiceTableRow } from '../../../sections/@dashboard/invoice/list';
// api
import { apiWithPostData } from '../../../utils/api';
// url
import { balanceHistoryUrl, adminListUrl, roleListUrl } from '../../../utils/urlList';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  // { id: 'admin', label: 'admin', align: 'center' },
  // { id: 'subadmin', label: 'subadmin', align: 'center' },
  // { id: 'company', label: 'company', align: 'center' },
  // { id: 'distributor', label: 'distributor', align: 'center' },
  { id: 'agent', label: 'agent', align: 'center' },
  { id: 'user', label: 'user', align: 'center' },
  { id: 'permission', label: 'permission', align: 'center' },
  { id: 'amount', label: 'amount', align: 'center' },
  { id: 'beforeAmount', label: 'beforeAmount', align: 'center' },
  { id: 'afterAmount', label: 'afterAmount', align: 'center' },
  { id: 'style', label: 'style', align: 'center' },
  { id: 'date', label: 'date', align: 'center' },
];

// ----------------------------------------------------------------------

export default function InvoiceHistoryPage() {
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
  const theme = useTheme();

  const { themeStretch } = useSettingsContext();
  const [isLoading, setIsLoading] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [logData, setLogData] = useState([]);
  const [filterName, setFilterName] = useState('');
  const [filterEndDate, setFilterEndDate] = useState(new Date);
  const [filterStartDate, setFilterStartDate] = useState(new Date);
  const [totalDeposit, setTotalDeposit] = useState(0);
  const [totalWithdraw, setTotalWithdraw] = useState(0);
  const [totalIncome, setTotalIncome] = useState(0);
  const [adminList, setAdminList] = useState([]);
  const [roleList, setRoleList] = useState([]);
  const [totalCount, setTotalCount] = useState(0);

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
    setFilterName(event.target.value);
  };


  const handleResetFilter = () => {
    setFilterName('');
  };

  const handleClickSearch = () => {
    setPage(0);
    balanceHistory();
  };  

  const getRoleList = () => {
    try {
      setIsLoading(true);
      const url = roleListUrl;
      const headers = {};
      const data = {};
      apiWithPostData(url, data, headers).then((response) => {
        const { results } = response;
        setRoleList(results);
      });
    } catch (error) {
      console.log(error);
    }
  };
  
  const getAdminList = () => {
    try {
      const url = adminListUrl;
      const headers = {};
      const data = {};
      apiWithPostData(url, data, headers).then((response) => {
        const{results} = response;
        setAdminList(results);
      });
    } catch (error) {
      console.log(error);
    }
  };

  const balanceHistory = () => {
    try {
      setIsLoading(true);
      const url = balanceHistoryUrl;
      const headers = {};
      const startDate = `${moment(filterStartDate).format('YYYY-MM-DD')  } 00:00:00`;
      const endDate = `${moment(filterEndDate).format('YYYY-MM-DD')  } 23:59:00`;
      const data = {
        "page": page + 1,
        "pageSize": rowsPerPage,
        "column": "createdAt",
        "sort": -1,
        "date": [startDate, endDate],
      };
      apiWithPostData(url, data, headers).then((response) => {
        const {results, count, totald, totalw} = response;
        setTotalCount(count);
        setTableData(results);
        setLogData(results);
        setIsLoading(false);
        // setTotalDeposit(totald);
        // setTotalWithdraw(totalw);
        // setTotalIncome(totald - totalw);
      });
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }

  };

  const getAgentList = (data, adminsList, rolesList) => {
    const agentList = data.map((ageitem) => (
      {
          ...ageitem,
          agent: adminsList.find((user) => user._id === ageitem?.user[0]?.creatorId)
      } || {}
    ));
    const roleDataList = agentList.map((roleData) => (
      {
          ...roleData,
          role: rolesList.find((role) => role._id === roleData?.user[0]?.rolesId)
      } || {}
    ));
    setTableData(roleDataList);
  };

  useEffect(() => {
    getRoleList();
    getAdminList();
    balanceHistory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    balanceHistory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, rowsPerPage]);

  useEffect(() => {
    if(logData.length === 0 || adminList.length === 0 || roleList.length === 0 ) {
      return;
    }
    getAgentList(logData, adminList, roleList);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [logData, adminList,  roleList]);

  useEffect(() => {
    let valDeposit = 0;
    let valWithdraw = 0;
    let valIncome = 0;
    dataFiltered.forEach(element => {
      if(element?.type === "deposit") {
        valDeposit += element.amount;
      }
      else {
        valWithdraw += element.amount;
      }
    });
    valIncome = valDeposit - valWithdraw;
    setTotalDeposit(valDeposit);
    setTotalWithdraw(valWithdraw);
    setTotalIncome(valIncome);
  }, [dataFiltered]);

  return (
    <>
      <Helmet>
        <title> Admin Portal </title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'xl'}>

        <CustomBreadcrumbs
          heading="cashHistory"
          links={[
            {
              name: 'dashboard',
              href: PATH_DASHBOARD.root,
            },
            {
              name: 'invoices',
              href: PATH_DASHBOARD.invoice.root,
            },
            {
              name: 'history',
            },
          ]}
        />

        <Card>

          <Divider />

          <InvoiceTableToolbar
            isFiltered={isFiltered}
            filterName={filterName}
            filterEndDate={filterEndDate}
            filterStartDate={filterStartDate}
            onFilterName={handleFilterName}
            onResetFilter={handleResetFilter}
            onClickSearch={handleClickSearch}
            onFilterStartDate={(newValue) => {
              setFilterStartDate(newValue);
            }}
            onFilterEndDate={(newValue) => {
              setFilterEndDate(newValue);
            }}
          />
          
          <Stack direction="row" justifyContent="flex-end" alignItems="center" spacing={3} sx={{ textTransform: 'capitalize', mt: -4, pb:1, mr:6 }}>
            <Typography variant="subtitle1" noWrap sx={{ color: theme.palette.success.main}}>
              충전금액:
            </Typography>
            <Typography variant="subtitle1" noWrap  sx={{ color: theme.palette.success.main}}>
              {totalDeposit?.toLocaleString()}
            </Typography>
            <Typography variant="subtitle1" noWrap  sx={{ color: theme.palette.warning.main, pl:2}}>
              환전금액:
            </Typography>
            <Typography variant="subtitle1" noWrap  sx={{ color: theme.palette.warning.main}}>
              {totalWithdraw?.toLocaleString()}
            </Typography>
            <Typography variant="subtitle1" noWrap  sx={{ color: theme.palette.info.main, pl:2}}>
              충환전금액:
            </Typography>
            <Typography variant="subtitle1" noWrap  sx={{ color: theme.palette.info.main}}>
              {totalIncome?.toLocaleString()}
            </Typography>
          </Stack>

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
                    .slice(0, rowsPerPage)
                    .map((row) => (
                      <InvoiceTableRow
                        key={row._id}
                        row={row}
                        selected={selected.includes(row._id)}
                        onSelectRow={() => onSelectRow(row._id)}
                      />
                    ))}

                  <TableNoData isNotFound={isNotFound} />
                </TableBody>
              </Table>
            </Scrollbar>
          </TableContainer>

          <TablePaginationCustom
            count={totalCount}
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
      (row) => row.user[0]?.username.toLowerCase().indexOf(filterName.toLowerCase()) !== -1
    );
  }

  return inputData;
}

