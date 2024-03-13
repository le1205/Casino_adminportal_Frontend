import { Helmet } from 'react-helmet-async';
import { useState, useEffect } from 'react';
// @mui
import {
  Stack,
  Button,
  Card,
  Typography,
  Table,
  Divider,
  TableBody,
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
import { InvoiceAdminTableToolbar, InvoiceAdminTableRow } from '../../../sections/@dashboard/invoice/list';
// locales
import { useLocales } from '../../../locales';
// api
import { apiWithPostData, apiWithGetData } from '../../../utils/api';
// url
import { transactionUrl } from '../../../utils/urlList';
// utils
import {parseJson } from '../../../auth/utils';
import {toNumberString } from '../../../utils/convert';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'user', label: 'id', align: 'center' },
  { id: 'permission', label: 'permission', align: 'center' },
  { id: 'amount', label: 'amount', align: 'center' },
  { id: 'beforeAmount', label: 'beforeMoney', align: 'center' },
  { id: 'afterAmount', label: 'afterMoney', align: 'center' },
  // { id: 'money', label: '보유 머니', align: 'center' },
  { id: 'style', label: 'style', align: 'center' },
  { id: 'date', label: 'date', align: 'center' },
];

// ----------------------------------------------------------------------

export default function InvoiceAdminListPage() {

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
  const { translate } = useLocales();

  const { themeStretch } = useSettingsContext();
  const [isLoading, setIsLoading] = useState(false);
  const [isFirst, setIsFirst] = useState(true);
  const [tableData, setTableData] = useState([]);
  const [logData, setLogData] = useState([]);
  const [filterName, setFilterName] = useState('');
  const [filterEndDate, setFilterEndDate] = useState(new Date);
  const [filterStartDate, setFilterStartDate] = useState(new Date);
  const [totalCount, setTotalCount] = useState(0);

  const loginUser = parseJson(localStorage.getItem('user') || "");
  let isAdmin = false;
  if (loginUser?.roleMain?.order === 1) {
    isAdmin = true;
  }

  const point = localStorage.getItem('point') || 0;

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

  const handleClickCreate = () => {
    createTransaction();
  };  

  const handleClickSearch = () => {
    setPage(0);
    getTransactionList();
  };  

  
  const getTransactionList = () => {
    setIsLoading(true);
    try {
      const url = transactionUrl;
      const headers = {};
      const data = {};
      apiWithGetData(url, data, headers).then((response) => {
        setTableData(response);
        setIsLoading(false);
      });
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  
  const createTransaction = () => {
    setIsLoading(true);
    try {
      const url = transactionUrl;
      const headers = {};
      const data = {};
      apiWithPostData(url, data, headers).then((response) => {
        setIsLoading(false);
      });
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };


  useEffect(() => {
    getTransactionList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFirst]);


  return (
    <>
      <Helmet>
        <title> Admin Portal </title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'xl'}>
        <CustomBreadcrumbs
          heading="operatorTransaction"
          links={[
            { name: 'dashboard', href: PATH_DASHBOARD.root },
            { name: 'invoices', href: PATH_DASHBOARD.invoice.root },
            { name: 'Admin List' },
          ]}
          
          action={
            <Button
              variant="contained"
              disabled={point === '0' || point === 0}
              sx={{ mt: 4, display: isAdmin ? 'block' : 'none'}}
              onClick={handleClickCreate}
            >
              {translate('strWithdraw')}
            </Button>
          }
        />
        <Card>

          <Divider />

          <InvoiceAdminTableToolbar
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
            <Typography variant="subtitle1" noWrap  sx={{ color: theme.palette.warning.main, pl:2}}>
            {`${translate('point')}`}:
            </Typography>
            <Typography variant="subtitle1" noWrap  sx={{ color: theme.palette.warning.main}}>
              {toNumberString(point)}
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
                      <InvoiceAdminTableRow
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
      (row) => row.userId?.rolesId?.title.toLowerCase().indexOf(filterName.toLowerCase()) !== -1
    );
  }

  return inputData;
}


