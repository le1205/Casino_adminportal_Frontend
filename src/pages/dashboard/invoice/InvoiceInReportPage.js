import { Helmet } from 'react-helmet-async';
import { useState, useEffect } from 'react';
// @mui
import {
  Card,
  Table,
  Divider,
  TableBody,
  Container,
  TableContainer,
} from '@mui/material';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';

import CustomBreadcrumbs from '../../../components/custom-breadcrumbs';
import { useSettingsContext } from '../../../components/settings';
import LoadingScreen from '../../../components/loading-screen';
// utils
import {parseJson } from '../../../auth/utils';
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
// components
import Scrollbar from '../../../components/scrollbar';
import { useSnackbar } from '../../../components/snackbar';
// locales
import { useLocales } from '../../../locales';
// sections
import { InvoiceAmountTableToolbar, InvoiceDepositTableRow } from '../../../sections/@dashboard/invoice/list';
// api
import { apiWithPostData } from '../../../utils/api';
// url
import {  getDepositListUrl, subAcceptUrl, subCancelUrl } from '../../../utils/urlList';
// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'creator', label: 'creator', align: 'center' },
  { id: 'user', label: 'user', align: 'center' },
  { id: 'amount', label: 'amount', align: 'center' },
  { id: 'date', label: 'date', align: 'center' },
  { id: 'status', label: 'status', align: 'center' },
  { id: 'action', label: 'action', align: 'center' },
];

// ----------------------------------------------------------------------

export default function InvoiceInReportPage() {

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
  const { translate } = useLocales();
  const loginUser  = parseJson(localStorage.getItem('user') || "");

  const { themeStretch } = useSettingsContext();
  const { enqueueSnackbar } = useSnackbar();
  const [isLoading, setIsLoading] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [filterName, setFilterName] = useState('');
  const [selectedRow, setSelectedRow] = useState({});
  const [pendingCount, setPendingCount] = useState(0);

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


  const handleClickAccept = (row) => {
    setSelectedRow(row);
    setIsLoading(true);
    try {
      const url = subAcceptUrl;
      const headers = {};
      const data = {
        requestId: row._id,
        type: "deposit"
      };
      apiWithPostData(url, data, headers).then((response) => {
        setIsLoading(false);
        if(response === true) {
          updateUser(row._id, "Accept");
          enqueueSnackbar(translate('updateSuccess'));
        }
      });
    } catch (error) {
      setIsLoading(false);
      console.log(error);
    }
  };

  const handleClickCancel = (row) => {
    setSelectedRow(row);
    setIsLoading(true);
    try {
      const url = subCancelUrl;
      const headers = {};
      const data = {
        requestId: row._id,
        type: "deposit"
      };
      apiWithPostData(url, data, headers).then((response) => {
        setIsLoading(false);
        if(response === true) {
          updateUser(row._id, "Cancel");
          enqueueSnackbar(translate('updateSuccess'));
        }
      });
    } catch (error) {
      setIsLoading(false);
      console.log(error);
    }
  };

  const updateUser = (id, status) => {
    let count = pendingCount;
    tableData.forEach(element => {
      if(id=== element._id) {
        element.status = status;
        count -= 1;
      }
    });
    setPendingCount(count);
  };
  

  const depositList = () => {
    try {
      setIsLoading(true);
      setPage(0);
      const url = getDepositListUrl + loginUser._id;
      const headers = {};
      const data = {};
      apiWithPostData(url, data, headers).then((response) => {
        setIsLoading(false);
        setTableData(response);
        if(response?.length > 0) {
          let valCount = 0;
          response.forEach(element => {
            if(element?.status === "Pending") {
              valCount += 1;
            }
          });
          setPendingCount(valCount);
        }
      });
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }

  };

  useEffect(() => {
    depositList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  return (
    <>
      <Helmet>
        <title> Admin Portal </title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'xl'}>
        <CustomBreadcrumbs
          heading="depositList"
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
              name: 'List',
            },
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
                      <InvoiceDepositTableRow
                        key={row._id}
                        row={row}
                        pendingCount = {pendingCount}
                        selected={selected.includes(row._id)}
                        onSelectRow={() => onSelectRow(row._id)}
                        onSelectAccept={() => handleClickAccept(row)}
                        onSelectCancel={() => handleClickCancel(row)}
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

function applyFilter({ inputData, comparator, filterName,  }) {
  const stabilizedThis = inputData.map((el, index) => [el, index]);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);

  if (filterName !== "") {
    inputData = inputData.filter(
      (user) => user?.userId?.username.toLowerCase().indexOf(filterName.toLowerCase()) !== -1
    );
  }

  return inputData;
}

