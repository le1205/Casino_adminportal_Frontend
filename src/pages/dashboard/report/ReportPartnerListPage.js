import { Helmet } from 'react-helmet-async';
import { paramCase } from 'change-case';
import { useState, useEffect } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
// @mui
import {
  Grid,
  Card,
  Table,
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

const ROLE_OPTIONS = [
  'all',
];

const TABLE_HEAD = [
  { id: 'name', label: 'Name', align: 'left' },
  { id: 'rate', label: 'Applied Rate', align: 'left' },
  { id: 'status', label: 'Holding Status', align: 'left' },
  { id: 'depwith', label: 'Deposit & Withdrawal', align: 'center' },
  { id: 'casino', label: 'Casino', align: 'left' },
  { id: 'slot', label: 'Slot', align: 'left' },
  { id: 'total', label: 'Total', align: 'left' },
];

const TABLE_HEAD_TOTAL_ONE = [
  { id: '1', label: '', align: 'center' },
  { id: '2', label: '', align: 'center' },
  { id: '3', label: '', align: 'center' },
];
const TABLE_HEAD_TOTAL_TWO = [
  { id: 'casino', label: 'Casino', align: 'center' },
  { id: 'slot', label: 'Slot', align: 'center' },
  { id: 'total', label: 'Total', align: 'center' },
];
const userData = localStorage.getItem('user') || "";

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
  const [isLoading, setIsLoading] = useState(false);

  const [openConfirm, setOpenConfirm] = useState(false);
  const [filterName, setFilterName] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [totalHoldingPoint, setTotalHoldingPoint] = useState(0);
  const [totalPartnerDeposit, setTotalPartnerDeposit] = useState(0);
  const [totalAdminDeposit, setTotalAdminDeposit] = useState(0);
  const [totalPartnerWithdraw, setTotalPartnerWithdraw] = useState(0);
  const [totalAdminWithdraw, setTotalAdminWithdraw] = useState(0);
  const [totalPartnerIncome, setTotalPartnerIncome] = useState(0);
  const [totalAdminIncome, setTotalAdminIncome] = useState(0);
  const [dataActive, setDataActive] = useState({});
  const [node, setNode] = useState([]);
  const [totalData, setTotalData] = useState({});
  const [totalDepWith, setTotalDepWith] = useState(0);
  const [tableData, setTableData] = useState([]);
  const [count, setCount] = useState(0);

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

  const handleDeleteRow = (key) => {
    const deleteRow = node.filter((row) => row.key !== key);
    setSelected([]);

    if (page > 0) {
      if (dataInPage.length < 2) {
        setPage(page - 1);
      }
    }
  };

  const handleEditRow = (id) => {
    navigate(PATH_DASHBOARD.user.edit(paramCase(id)));
  };

  const handleClickDown = (key) => {
    const tempData = tableData;
    let number = count;
    tempData.forEach(element => {
      if(element._id === key) {
        element.expand = true;
      }
      if(element.parent_key === key) {
        number += 1;
        element.display = true;
      }
    });
    setTableData(tempData);
    setCount(number);

  };

  const handleClickUp = (key) => {
    const tempData = tableData;
    let number = count;
    tempData.forEach(element => {
      if(element._id === key) {
        element.expand = false;
      }
      if(element.parent_key === key) {
        number -= 1;
        element.display = false;
      }
    });
    setTableData(tempData);
    setCount(number);
  };


  const getAllTotalList = () => {
    try {
      setIsLoading(true);
      setPage(0);
      const url = allTotalListUrl;
      const headers = {};
      apiWithPostData(url, {}, headers).then((response) => {
        const valueData = {
          ...response
        };
        const valueMain = response.mapData.map((item) => ({
          ...item
        }));
        const listDataUser = valueMain.filter((item) => item.creatorId === userData._id);
        const treedata = handleCountData(listDataUser, valueMain);
        setTotalData(valueData);
        setDataActive(response.ListTotal);
        // eslint-disable-next-line no-unsafe-optional-chaining
        setTotalDepWith(valueData?.totald - valueData?.totalw);
        setNode(treedata);
        const totalArrays = handleTreeData(treedata);
        setTableData(totalArrays);
        setIsLoading(false);
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleCountUser = (arr) => {
      const countUser = arr.filter((item) => item.role.title === 'user').length;
      return countUser;
  };
  
  const handleCountData = (listValue, dataMain) => {
    const value  = dataMain
    const listDataUser1 = value.filter((item) => item.creatorId === userData._id);
    const treedata = listDataUser1.map((item) => ({
            key: item.userId,
            data: {
                ...item,
                total_user: handleCountUser(value.filter((sub) => sub.creatorId === item.userId))
            },
            children: value
                .filter((sub) => sub.creatorId === item.userId)
                ?.map((subitem) => ({
                        key: subitem.userId,
                        data: {
                            ...subitem,
                            total_user: handleCountUser(value.filter((com) => com.creatorId === subitem.userId))
                        },
                        children: value
                            .filter((com) => com.creatorId === subitem.userId)
                            ?.map((comitem) => ({
                                    key: comitem.userId,
                                    data: {
                                        ...comitem,
                                        total_user: handleCountUser(value.filter((dis) => dis.creatorId === comitem.userId))
                                    },
                                    children: value
                                        .filter((dis) => dis.creatorId === comitem.userId)
                                        ?.map((disitem) => ({
                                                key: disitem.userId,
                                                data: {
                                                    ...disitem,
                                                    total_user: handleCountUser(
                                                        value.filter((agent) => agent.creatorId === disitem.userId)
                                                    )
                                                },
                                                children: value
                                                    .filter((agent) => agent.creatorId === disitem.userId)
                                                    ?.map((agentitem) => ({
                                                            key: agentitem.userId,
                                                            data: {
                                                                ...agentitem,
                                                                total_user: handleCountUser(
                                                                    value.filter((agent) => agent.creatorId === agentitem.userId)
                                                                )
                                                            },
                                                            children: value
                                                                .filter((user) => user.creatorId === agentitem.userId)
                                                                ?.map((useitem) => ({
                                                                        key: useitem.userId,
                                                                        data: useitem
                                                                    }))
                                                        }))
                                            }))
                                }))
                    }))
        }));
    return treedata;
};

  const handleTreeData = (arr) => {
    const arrData = [];
    const loop = (data, key, display) => {
      data.forEach((item, index) => {
        if(item.data) {
          const itemData = item.data;
          itemData._id = item.key;
          itemData.parent_key = key;
          itemData.display = display;
          itemData.expand = false;
          arrData.push(itemData);
        }
        if (item.children && item.children.length > 0 ) 
        {
            loop(item.children, item.key, false);
        }
          
      });
    };
    loop(arr, "", true);
    return arrData;
  };
  
  useEffect(() => {
    getAllTotalList();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openConfirm]);


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
                          {totalData?.totalMoney}
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
                            {totalData?.totald}
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
                            {totalData?.totalw}
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
                            {totalDepWith}
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
                            {totalHoldingPoint}
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
                            {totalPartnerDeposit}
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
                            {totalPartnerWithdraw}
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
                            {totalPartnerIncome}
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
                            {totalData?.mapData?.length}
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
                            {totalAdminDeposit}
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
                            {totalAdminWithdraw}
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
                            {totalAdminIncome}
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
                            {dataActive?.bet_live}
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
                            
                          {dataActive?.bet_slot}
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
                            {
                            // eslint-disable-next-line no-unsafe-optional-chaining
                            dataActive?.bet_live + dataActive.bet_slot
                            }
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
                            {dataActive?.win_live}
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
                            {dataActive?.win_slot}
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
                          {
                            // eslint-disable-next-line no-unsafe-optional-chaining
                            dataActive?.win_live + dataActive.win_slot
                          }
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
                            {dataActive?.bet_money_live}
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
                            {dataActive?.bet_money_slot}
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
                            {
                            // eslint-disable-next-line no-unsafe-optional-chaining
                            dataActive?.bet_money_live + dataActive.bet_money_slot
                            }
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
                            {dataActive?.lose_money_live}
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
                            {dataActive?.lose_money_slot}
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
                            {
                            // eslint-disable-next-line no-unsafe-optional-chaining
                            dataActive?.lose_money_live + dataActive.lose_money_slot
                            }
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
                            {dataActive?.balance_live}
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
                            {dataActive?.balance_slot}
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
                            {
                            // eslint-disable-next-line no-unsafe-optional-chaining
                            dataActive?.balance_live + dataActive.balance_slot
                            }
                          </Typography>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  </TableBody>
              </Table>
            </Grid>
          </Grid>
        </Card>
        <Card  sx={{ mt:6, pl:0, }}>
          <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
            <TableSelectedAction
              dense={dense}
              numSelected={selected.length}
              rowCount={node.length}
              onSelectAllRows={(checked) =>
                onSelectAllRows(
                  checked,
                  node.map((row) => row.id)
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
                  rowCount={node.length}
                  numSelected={selected.length}
                  onSort={onSort}
                  onSelectAllRows={(checked) =>
                    onSelectAllRows(
                      checked,
                      node.map((row) => row.id)
                    )
                  }
                />

                <TableBody>
                  {tableData
                    // .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row, index) => (
                      <ReportTableRow
                        key={row._id + index}
                        display={row.display}
                        row={row}
                        count= {count}
                        selected={selected.includes(row._id)}
                        onSelectRow={() => onSelectRow(row._id)}
                        onDeleteRow={() => handleDeleteRow(row._id)}
                        onEditRow={() => handleEditRow(row.name)}
                        onClickDownArrow={() => handleClickDown(row._id)}
                        onClickUpArrow={() => handleClickUp(row._id)}
                      />
                    ))}

                  <TableEmptyRows
                    height={denseHeight}
                    emptyRows={emptyRows(page, rowsPerPage, node.length)}
                  />

                  <TableNoData isNotFound={isNotFound} />
                </TableBody>
              </Table>
            </Scrollbar>
          </TableContainer>

          {/* <TablePaginationCustom
            count={dataFiltered.length}
            page={page}
            rowsPerPage={rowsPerPage}
            onPageChange={onChangePage}
            onRowsPerPageChange={onChangeRowsPerPage}
            //
            dense={dense}
            onChangeDense={onChangeDense}
          /> */}
        </Card>
      </Container>
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
