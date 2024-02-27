import { Helmet } from 'react-helmet-async';
import { useState, useEffect } from 'react';
// @mui
import {
  Tab,
  Tabs,
  Card,
  Table,
  Divider,
  TableBody,
  Container,
  TableContainer,
} from '@mui/material';
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
import { balanceHistoryUrl } from '../../../utils/urlList';

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

  const { themeStretch } = useSettingsContext();
  const [isLoading, setIsLoading] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [filterName, setFilterName] = useState('');
  const [filterEndDate, setFilterEndDate] = useState(new Date);
  const [filterStartDate, setFilterStartDate] = useState(new Date);

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

  const handleClickSearch = () => {
    balanceHistory();
  };

  const balanceHistory = () => {
    try {
      setIsLoading(true);
      setPage(0);
      const url = balanceHistoryUrl;
      const headers = {};
      const startDate = filterStartDate;
      startDate.setHours(0, 0, 0);
      const endDate = filterEndDate;
      endDate.setHours(23, 59, 59);
      const data = {
        "page": 1,
        "pageSize": 100,
        "column": "createdAt",
        "sort": -1,
        "date": [startDate, endDate],
      };
      apiWithPostData(url, data, headers).then((response) => {
        const {results, count, totald, totalw} = response;
        setTableData(results);
        setIsLoading(false);
      });
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }

  };

  useEffect(() => {
    balanceHistory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
                      <InvoiceTableRow
                        key={row._id}
                        row={row}
                        selected={selected.includes(row._id)}
                        onSelectRow={() => onSelectRow(row._id)}
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

