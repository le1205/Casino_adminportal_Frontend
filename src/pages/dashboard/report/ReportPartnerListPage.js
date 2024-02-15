import { Helmet } from 'react-helmet-async';
import { paramCase } from 'change-case';
import { useState, useEffect } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
// @mui
import {
  Tab,
  Grid,
  Card,
  Table,
  Button,
  Tooltip,
  Typography,
  TableBody,
  TableRow,
  TableCell,
  Stack,
  Container,
  IconButton,
  TableContainer,
} from '@mui/material';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// _mock_
import { _userList } from '../../../_mock/arrays';
// components
import Iconify from '../../../components/iconify';
import Scrollbar from '../../../components/scrollbar';
import ConfirmDialog from '../../../components/confirm-dialog';
import CustomBreadcrumbs from '../../../components/custom-breadcrumbs';
import { useSettingsContext } from '../../../components/settings';
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
import { ReportTableToolbar, ReportTableRow } from '../../../sections/@dashboard/report/list';
// api
import { apiWithPostData } from '../../../utils/api';
// url
import { allTotalListUrl, } from '../../../utils/urlList';

// ----------------------------------------------------------------------

const STATUS_OPTIONS = ['all', 'active', 'banned'];

const ROLE_OPTIONS = [
  'all',
  'ux designer',
  'full stack designer',
  'backend developer',
  'project manager',
  'leader',
  'ui designer',
  'ui/ux designer',
  'front end developer',
  'full stack developer',
];

const TABLE_HEAD = [
  { id: 'name', label: 'Name', align: 'left' },
  { id: 'rate', label: 'Applied Rate', align: 'left' },
  { id: 'status', label: 'Holding Status', align: 'left' },
  { id: 'depwith', label: 'Deposit & Withdrawal', align: 'center' },
  { id: 'sport', label: 'Sport', align: 'left' },
  { id: 'slot', label: 'Slot', align: 'left' },
  { id: 'mini', label: 'Mini Game', align: 'left' },
];

const TABLE_HEAD_TOTAL_ONE = [
  { id: '1', label: '', align: 'center' },
  { id: '2', label: '', align: 'center' },
  { id: '3', label: '', align: 'center' },
];
const TABLE_HEAD_TOTAL_TWO = [
  { id: 'sport', label: 'Sport', align: 'center' },
  { id: 'slot', label: 'Slot', align: 'center' },
  { id: 'mini', label: 'Mini Game', align: 'center' },
  { id: 'total', label: 'Total', align: 'center' },
];

// ----------------------------------------------------------------------

export default function ReportPartnerListPage() {
  const {
    dense = false,
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

  const [tableData, setTableData] = useState(_userList);

  const [openConfirm, setOpenConfirm] = useState(false);

  const [filterName, setFilterName] = useState('');

  const [filterRole, setFilterRole] = useState('all');

  const [filterStatus, setFilterStatus] = useState('all');

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

  const handleOpenConfirm = () => {
    setOpenConfirm(true);
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

  const handleDeleteRows = (selectedRows) => {
    const deleteRows = tableData.filter((row) => !selectedRows.includes(row.id));
    setSelected([]);
    setTableData(deleteRows);

    if (page > 0) {
      if (selectedRows.length === dataInPage.length) {
        setPage(page - 1);
      } else if (selectedRows.length === dataFiltered.length) {
        setPage(0);
      } else if (selectedRows.length > dataInPage.length) {
        const newPage = Math.ceil((tableData.length - selectedRows.length) / rowsPerPage) - 1;
        setPage(newPage);
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

  const getAllTotalList = () => {
    try {
      const url = allTotalListUrl;
      const headers = {};
      apiWithPostData(url, {}, headers).then((response) => {
        const { mapData } = response;
        console.log("allTotalData >>>", mapData);
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
    getAllTotalList();
  }, []);

  return (
    <>
      <Helmet>
        <title> Admin Portal </title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'xl'}>
        <CustomBreadcrumbs
          heading="Partner Report"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Settlement', href: PATH_DASHBOARD.report.root },
            { name: 'Partner Report' },
          ]}
        />
        <Card>
          <Typography variant="h6" sx={{ color: 'text.secondary', pt:1, pl:1, }}>
            Total Search Result
          </Typography>
          <Grid container spacing={3} direction="row">
            <Grid item xs={12} md={6} > 
              <Table size= 'small' sx={{ minWidth: 600, mt:6 }}>
                  <TableHeadCustom
                    headLabel={TABLE_HEAD_TOTAL_ONE}
                  />
                  <TableBody sx={{ pt:3, }}>
                    <TableRow key="total_search_one_1">
                      <TableCell align='left'>
                        <Stack direction="row"
                          alignItems="center"
                          justifyContent="space-between">
                          <Typography variant="body2">
                            Money:
                          </Typography>
                          <Typography variant="body2">
                            0
                          </Typography>
                        </Stack>
                      </TableCell>
                      <TableCell align='left'>
                        <Stack direction="row"
                          alignItems="center"
                          justifyContent="space-between">
                          <Typography variant="body2">
                            User Deposit:
                          </Typography>
                          <Typography variant="body2">
                            0
                          </Typography>
                        </Stack>
                      </TableCell>
                      <TableCell align='left'>
                        <Stack direction="row"
                          alignItems="center"
                          justifyContent="space-between">
                          <Typography variant="body2">
                            User Widthraw:
                          </Typography>
                          <Typography variant="body2">
                            0
                          </Typography>
                        </Stack>
                      </TableCell>
                      <TableCell align='left'>
                        <Stack direction="row"
                          alignItems="center"
                          justifyContent="space-between">
                          <Typography variant="body2">
                            Deposit-Withdraw:
                          </Typography>
                          <Typography variant="body2">
                            0
                          </Typography>
                        </Stack>
                      </TableCell>
                    </TableRow>
                    <TableRow key="total_search_one_2">
                      <TableCell align='left'>
                        <Stack direction="row"
                          alignItems="center"
                          justifyContent="space-between">
                          <Typography variant="body2">
                            Holding Point:
                          </Typography>
                          <Typography variant="body2">
                            0
                          </Typography>
                        </Stack>
                      </TableCell>
                      <TableCell align='left'>
                        <Stack direction="row"
                          alignItems="center"
                          justifyContent="space-between">
                          <Typography variant="body2">
                            Partner Deposit:
                          </Typography>
                          <Typography variant="body2">
                            0
                          </Typography>
                        </Stack>
                      </TableCell>
                      <TableCell align='left'>
                        <Stack direction="row"
                          alignItems="center"
                          justifyContent="space-between">
                          <Typography variant="body2">
                            Partner Widthraw:
                          </Typography>
                          <Typography variant="body2">
                            0
                          </Typography>
                        </Stack>
                      </TableCell>
                      <TableCell align='left'>
                        <Stack direction="row"
                          alignItems="center"
                          justifyContent="space-between">
                          <Typography variant="body2">
                            Partner Deposit-Withdraw:
                          </Typography>
                          <Typography variant="body2">
                            0
                          </Typography>
                        </Stack>
                      </TableCell>
                    </TableRow>
                    <TableRow key="total_search_one_3">
                      <TableCell align='left'>
                        <Stack direction="row"
                          alignItems="center"
                          justifyContent="space-between">
                          <Typography variant="body2">
                            Users:
                          </Typography>
                          <Typography variant="body2">
                            0
                          </Typography>
                        </Stack>
                      </TableCell>
                      <TableCell align='left'>
                        <Stack direction="row"
                          alignItems="center"
                          justifyContent="space-between">
                          <Typography variant="body2">
                            Admin Deposit:
                          </Typography>
                          <Typography variant="body2">
                            0
                          </Typography>
                        </Stack>
                      </TableCell>
                      <TableCell align='left'>
                        <Stack direction="row"
                          alignItems="center"
                          justifyContent="space-between">
                          <Typography variant="body2">
                            Admin Widthraw:
                          </Typography>
                          <Typography variant="body2">
                            0
                          </Typography>
                        </Stack>
                      </TableCell>
                      <TableCell align='left'>
                        <Stack direction="row"
                          alignItems="center"
                          justifyContent="space-between">
                          <Typography variant="body2">
                            Admin Deposit-Withdraw:
                          </Typography>
                          <Typography variant="body2">
                            0
                          </Typography>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  </TableBody>
              </Table>
            </Grid>
            <Grid item xs={12} md={6} >
              <Table size= 'small' sx={{ minWidth: 600, pt:1 }}>
                  <TableHeadCustom
                    headLabel={TABLE_HEAD_TOTAL_TWO}
                  />
                  <TableBody>
                    <TableRow key="total_search_two_1">
                      <TableCell align='left'>
                        <Stack direction="row"
                          alignItems="center"
                          justifyContent="space-between">
                          <Typography variant="body2">
                            Betting:
                          </Typography>
                          <Typography variant="body2">
                            0
                          </Typography>
                        </Stack>
                      </TableCell>
                      <TableCell align='left'>
                        <Stack direction="row"
                          alignItems="center"
                          justifyContent="space-between">
                          <Typography variant="body2">
                            Betting:
                          </Typography>
                          <Typography variant="body2">
                            0
                          </Typography>
                        </Stack>
                      </TableCell>
                      <TableCell align='left'>
                        <Stack direction="row"
                          alignItems="center"
                          justifyContent="space-between">
                          <Typography variant="body2">
                            Betting:
                          </Typography>
                          <Typography variant="body2">
                            0
                          </Typography>
                        </Stack>
                      </TableCell>
                      <TableCell align='left'>
                        <Stack direction="row"
                          alignItems="center"
                          justifyContent="space-between">
                          <Typography variant="body2">
                            Total Bet:
                          </Typography>
                          <Typography variant="body2">
                            0
                          </Typography>
                        </Stack>
                      </TableCell>
                    </TableRow>
                    <TableRow key="total_search_two_2">
                      <TableCell align='left'>
                        <Stack direction="row"
                          alignItems="center"
                          justifyContent="space-between">
                          <Typography variant="body2">
                            Win:
                          </Typography>
                          <Typography variant="body2">
                            0
                          </Typography>
                        </Stack>
                      </TableCell>
                      <TableCell align='left'>
                        <Stack direction="row"
                          alignItems="center"
                          justifyContent="space-between">
                          <Typography variant="body2">
                            Win:
                          </Typography>
                          <Typography variant="body2">
                            0
                          </Typography>
                        </Stack>
                      </TableCell>
                      <TableCell align='left'>
                        <Stack direction="row"
                          alignItems="center"
                          justifyContent="space-between">
                          <Typography variant="body2">
                            Win:
                          </Typography>
                          <Typography variant="body2">
                            0
                          </Typography>
                        </Stack>
                      </TableCell>
                      <TableCell align='left'>
                        <Stack direction="row"
                          alignItems="center"
                          justifyContent="space-between">
                          <Typography variant="body2">
                            Total Win:
                          </Typography>
                          <Typography variant="body2">
                            0
                          </Typography>
                        </Stack>
                      </TableCell>
                    </TableRow>
                    <TableRow key="total_search_two_3">
                      <TableCell align='left'>
                        <Stack direction="row"
                          alignItems="center"
                          justifyContent="space-between">
                          <Typography variant="body2">
                            Rolling:
                          </Typography>
                          <Typography variant="body2">
                            0
                          </Typography>
                        </Stack>
                      </TableCell>
                      <TableCell align='left'>
                        <Stack direction="row"
                          alignItems="center"
                          justifyContent="space-between">
                          <Typography variant="body2">
                            Rolling:
                          </Typography>
                          <Typography variant="body2">
                            0
                          </Typography>
                        </Stack>
                      </TableCell>
                      <TableCell align='left'>
                        <Stack direction="row"
                          alignItems="center"
                          justifyContent="space-between">
                          <Typography variant="body2">
                            Rolling:
                          </Typography>
                          <Typography variant="body2">
                            0
                          </Typography>
                        </Stack>
                      </TableCell>
                      <TableCell align='left'>
                        <Stack direction="row"
                          alignItems="center"
                          justifyContent="space-between">
                          <Typography variant="body2">
                            Total Rolling:
                          </Typography>
                          <Typography variant="body2">
                            0
                          </Typography>
                        </Stack>
                      </TableCell>
                    </TableRow>
                    <TableRow key="total_search_two_4">
                      <TableCell align='left'>
                        <Stack direction="row"
                          alignItems="center"
                          justifyContent="space-between">
                          <Typography variant="body2">
                            Losing:
                          </Typography>
                          <Typography variant="body2">
                            0
                          </Typography>
                        </Stack>
                      </TableCell>
                      <TableCell align='left'>
                        <Stack direction="row"
                          alignItems="center"
                          justifyContent="space-between">
                          <Typography variant="body2">
                            Losing:
                          </Typography>
                          <Typography variant="body2">
                            0
                          </Typography>
                        </Stack>
                      </TableCell>
                      <TableCell align='left'>
                        <Stack direction="row"
                          alignItems="center"
                          justifyContent="space-between">
                          <Typography variant="body2">
                            Losing:
                          </Typography>
                          <Typography variant="body2">
                            0
                          </Typography>
                        </Stack>
                      </TableCell>
                      <TableCell align='left'>
                        <Stack direction="row"
                          alignItems="center"
                          justifyContent="space-between">
                          <Typography variant="body2">
                            Total Losing:
                          </Typography>
                          <Typography variant="body2">
                            0
                          </Typography>
                        </Stack>
                      </TableCell>
                    </TableRow>
                    <TableRow key="total_search_two_5">
                      <TableCell align='left'>
                        <Stack direction="row"
                          alignItems="center"
                          justifyContent="space-between">
                          <Typography variant="body2">
                            Balance:
                          </Typography>
                          <Typography variant="body2">
                            0
                          </Typography>
                        </Stack>
                      </TableCell>
                      <TableCell align='left'>
                        <Stack direction="row"
                          alignItems="center"
                          justifyContent="space-between">
                          <Typography variant="body2">
                            Balance:
                          </Typography>
                          <Typography variant="body2">
                            0
                          </Typography>
                        </Stack>
                      </TableCell>
                      <TableCell align='left'>
                        <Stack direction="row"
                          alignItems="center"
                          justifyContent="space-between">
                          <Typography variant="body2">
                            Balance:
                          </Typography>
                          <Typography variant="body2">
                            0
                          </Typography>
                        </Stack>
                      </TableCell>
                      <TableCell align='left'>
                        <Stack direction="row"
                          alignItems="center"
                          justifyContent="space-between">
                          <Typography variant="body2">
                            Total Balance:
                          </Typography>
                          <Typography variant="body2">
                            0
                          </Typography>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  </TableBody>
              </Table>
            </Grid>
          </Grid>
        </Card>
        <Card>
          <ReportTableToolbar
            isFiltered={isFiltered}
            filterName={filterName}
            filterRole={filterRole}
            optionsRole={ROLE_OPTIONS}
            onFilterName={handleFilterName}
            onFilterRole={handleFilterRole}
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
                      <ReportTableRow
                        key={row.id}
                        row={row}
                        selected={selected.includes(row.id)}
                        onSelectRow={() => onSelectRow(row.id)}
                        onDeleteRow={() => handleDeleteRow(row.id)}
                        onEditRow={() => handleEditRow(row.name)}
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

      <ConfirmDialog
        open={openConfirm}
        onClose={handleCloseConfirm}
        title="Delete"
        content={
          <>
            Are you sure want to delete <strong> {selected.length} </strong> items?
          </>
        }
        action={
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              handleDeleteRows(selected);
              handleCloseConfirm();
            }}
          >
            Delete
          </Button>
        }
      />
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
