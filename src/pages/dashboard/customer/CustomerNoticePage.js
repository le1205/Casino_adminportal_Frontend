import { Helmet } from 'react-helmet-async';
import { useState, useEffect, useRef } from 'react';
// @mui
import {
  Card,
  Button,
  Table,
  Divider,
  Dialog,
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
import Iconify from '../../../components/iconify';
import { useSnackbar } from '../../../components/snackbar';
// locales
import { useLocales } from '../../../locales';
// sections
import { CustomerMessageTableToolbar, CustomerNoticeTableRow } from '../../../sections/@dashboard/customer/list';
import NoticeCreateForm from '../../../sections/@dashboard/customer/NoticeCreateForm';
// api
import { apiWithPostData, apiWithDeleteData, apiWithPutData } from '../../../utils/api';
// url
import { messageListUrl, userNofiUrl} from '../../../utils/urlList';
// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'receiveDate', label: 'receiveDate', align: 'center' },
  { id: 'title', label: 'title', align: 'center' },
  { id: 'status', label: 'status', align: 'center' },
  { id: 'action', label: 'action', align: 'center' },
];

// ----------------------------------------------------------------------

export default function CustomerNoticePage() {

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

  const { themeStretch } = useSettingsContext();
  const [isLoading, setIsLoading] = useState(false);
  const [isFirst, setIsFirst] = useState(true);
  const [tableData, setTableData] = useState([]);
  const [filterName, setFilterName] = useState('');
  const [selectedRow, setSelectedRow] = useState({});
  const [pendingCount, setPendingCount] = useState(0);
  const [openCreate, setOpenCreate] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const intervalRef = useRef(null);

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

  const handleClickCreate = () => {
    setIsEdit(false);
    setSelectedRow({});
    setOpenCreate(true);
  };
  
  const handleCloseCreate = () => {
    setOpenCreate(false);
  };
  
  const handleCreateSuccess = () =>{
    setOpenCreate(false);
  }
  
  const handleUpdateSuccess = () =>{
    setOpenCreate(false);
  }
  const handleClickEdit = (row) =>{
    setSelectedRow(row);
    setIsEdit(true)
    setOpenCreate(true);
  }

  const handleUpdateStatus = (row) =>{
    try {
      setIsLoading(true);
      // eslint-disable-next-line no-unsafe-optional-chaining
      const url = userNofiUrl + row?._id;
      const newStatus = row.status === 'reading' ? 'posted' : 'reading';
      const headers = {};
      const body = {
        status: newStatus
      };
      apiWithPutData(url, body, headers).then((response) => {
        
        const Newlist = tableData;
        const index = Newlist.findIndex((item) => item._id === row?._id);
        Newlist[index] = {
            ...Newlist[index],
            status:newStatus,
        };
        setTableData([...Newlist]);
        setIsLoading(false);
      });
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  }

  const handleClickRemove = (id) =>{
    try {
      setIsLoading(true);
      const url = userNofiUrl + id;
      const headers = {};
      const data = {};
      apiWithDeleteData(url, data, headers).then((response) => {
        setTableData((val) => val.filter((item) => item._id !== id));
        setIsLoading(false);
      });
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  }

  const noticeList = () => {
    try {
      setIsLoading(true);
      setPage(0);
      const url = messageListUrl;
      const headers = {};
      const data = {
        type: 2,
      };
      apiWithPostData(url, data, headers).then((response) => {
        setIsLoading(false);
        setTableData(response);
      });
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  const noticeUnreadList = () => {
    try {
      const url = messageListUrl;
      const headers = {};
      const data = {
        type: 2,
      };
      apiWithPostData(url, data, headers).then((response) => {
        setTableData(response);
      });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    noticeList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFirst]);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      noticeUnreadList();
    }, 5000);
    return () => {
     clearInterval(intervalRef.current);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  return (
    <>
      <Helmet>
        <title> Admin Portal </title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'xl'}>
        <CustomBreadcrumbs
          heading="manageNotice"
          links={[
            { name: 'dashboard', href: PATH_DASHBOARD.root },
            { name: 'customerCenter', href: PATH_DASHBOARD.customer.root },
            { name: 'Notice' },
          ]} 
          action={
            <Button
              variant="contained"
              startIcon={<Iconify icon="eva:plus-fill" />}
              sx={{ mt: 4 }}
              onClick={handleClickCreate}
            >
              {translate('createNew')}
            </Button>
          }
        />
        <Card>
          <Divider />

          <CustomerMessageTableToolbar
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
                      <CustomerNoticeTableRow
                        key={row._id}
                        row={row}
                        pendingCount = {pendingCount}
                        selected={selected.includes(row._id)}
                        onSelectRow={() => onSelectRow(row._id)}
                        onSelectEdit={() => handleClickEdit(row)}
                        onSelectRemove={() => handleClickRemove(row._id)}
                        onSelectStatus={() => handleUpdateStatus(row)}
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
      

      <Dialog open = {openCreate} onClose={handleCloseCreate}>
        <NoticeCreateForm isEdit={isEdit} currentMessage={selectedRow} onSelectCancel={handleCloseCreate} onCreateSuccess={handleCreateSuccess}  onUpdateSuccess={handleUpdateSuccess}/>
      </Dialog>
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
