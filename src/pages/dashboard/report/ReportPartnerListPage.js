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
  Button,
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
import { useTheme } from '@mui/material/styles';

import { TreeTable } from 'primereact/treetable';
import { Column } from 'primereact/column';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// locales
import { useLocales } from '../../../locales';

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
} from '../../../components/table';
// sections
import { ReportTableToolbar, ReportTableRow } from '../../../sections/@dashboard/report/list';
// utils
import {parseJson } from '../../../auth/utils';
import { toNumberTag, toNumberString } from '../../../utils/convert';
// api
import { apiWithPostData } from '../../../utils/api';
// url
import { allTotalListUrl, } from '../../../utils/urlList';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'name', label: 'name', align: 'left' },
  { id: 'appliedRate', label: 'appliedRate', align: 'left' },
  { id: 'holdingStatus', label: 'holdingStatus', align: 'left' },
  { id: 'depositWithdrawal', label: 'depositWithdrawal', align: 'center' },
  { id: 'casino', label: 'casino', align: 'left' },
  { id: 'slot', label: 'slot', align: 'left' },
  { id: 'total', label: 'total', align: 'left' },
];

const TABLE_HEAD_TOTAL_TWO = [
  { id: 'casino', label: 'casino', align: 'center' },
  { id: 'slot', label: 'slot', align: 'center' },
  { id: 'total', label: 'total', align: 'center' },
];
const userData = parseJson(localStorage.getItem('user') || "");

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
  } = useTable();

  const { themeStretch } = useSettingsContext();
  const { translate } = useLocales();
  const navigate = useNavigate();
  const theme = useTheme();
  const loginUser  = parseJson(localStorage.getItem('user') || "");

  const [isLoading, setIsLoading] = useState(false);
  const [isFirst, setIsFirst] = useState(true);
  const [openAlert, setOpenAlert] = useState(false);
  const [alertContent, setAlertContent] = useState(`${translate('couldNotSelectFuture')}`);
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
  const [totalData, setTotalData] = useState({});
  const [totalDepWith, setTotalDepWith] = useState(0);
  const [tableData, setTableData] = useState([]);
  const [filterEndDate, setFilterEndDate] = useState(new Date());
  const [filterStartDate, setFilterStartDate] = useState(new Date());
  
  const [globalFilter, setGlobalFilter] = useState('');

  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(order, orderBy),
    filterName,
    filterRole,
    filterStatus,
    loginUser,
  });

  const dataInPage = dataFiltered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const denseHeight = dense ? 52 : 72;

  const isNotFound =
    (!dataFiltered.length && !!filterName) ||
    (!dataFiltered.length && !!filterRole) ||
    (!dataFiltered.length && !!filterStatus);

  const handleFilterName = (event) => {
    setFilterName(event.target.value);
  };

  const handleCloseAlert = () => {
    setOpenAlert(false);
  };
  
  const handleOpenAlert = () => {
    setOpenAlert(true);
  };

  const handleOpenConfirm = () => {
    setOpenConfirm(true);
  };
  
  const handleResetFilter = () => {
    setFilterRole('all');
  };

  const handleClickStartDate = (date) => {
    const now = moment(new Date()).format('YYYY-MM-DD');
    const selectedDate = moment(date).format('YYYY-MM-DD');
    if (moment(selectedDate).isAfter(moment(now))) {
      setOpenAlert(true);
      setFilterStartDate(new Date());
      return;
    }
    setFilterStartDate(date);
  };

  const handleClickEndDate = (date) => {
    const now = moment(new Date()).format('YYYY-MM-DD');
    const selectedDate = moment(date).format('YYYY-MM-DD');
    if (moment(selectedDate).isAfter(moment(now))) {
      setOpenAlert(true);
      setFilterStartDate(new Date());
      return;
    }
    setFilterEndDate(date);
  };

  const handleClickSearch = () => {
    const start = moment(filterStartDate).format('YYYY-MM-DD');
    const end = moment(filterEndDate).format('YYYY-MM-DD');
    if(moment(start).isAfter(moment(end))) {
      setAlertContent("시작일과 마감일을 확인하세요.")
      setOpenAlert(true);
      return;
    }
    getAllTotalList();
  };

  const getAllTotalList = () => {
    try {
      setIsLoading(true);
      setPage(0);
      const url = allTotalListUrl;
      const headers = {};
      const data = {
        "startDate": `${moment(filterStartDate).format('YYYY-MM-DD')  } 00:00:00`,
        "endDate": `${moment(filterEndDate).format('YYYY-MM-DD')  } 23:59:00`,
      }
      apiWithPostData(url, data, headers).then((response) => {
        const valueData = {
          ...response
        };
        const valueMain = response.mapData.map((item) => ({
          ...item
        }));
        const listDataUser = valueMain.filter((item) => item.creatorId === userData._id);
        
        const treedata = handleCountData(listDataUser, valueMain);
        setTotalData(valueData?.userInfo);
        setDataActive(response.ListTotal);
        // eslint-disable-next-line no-unsafe-optional-chaining
        setTotalDepWith(valueData?.userInfo?.totald - valueData?.userInfo?.totalw);
        setTotalHoldingPoint(valueData?.balanceHold);
        setTableData(treedata);
        setIsLoading(false);
      });
    } catch (error) {
      setIsLoading(false);
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

  const actionTemplate = (node, column) => (
        <div
            style={{
                flexDirection: 'column',
                paddingLeft:'20px',
                fontSize:'12px',
            }}
        >
            <Stack direction="row">
                {node.data.username} 
                
            <Typography variant="body2"
              sx={{
                ...(node?.data?.role?.order ===1 && {
                  color: theme.palette.info.main,
                }),
                ...(node?.data?.role?.order ===2 && {
                  color: theme.palette.warning.main,
                }),
                ...(node?.data?.role?.order ===3 && {
                  color: theme.palette.success.main,
                }),
                ...(node?.data?.role?.order ===4 && {
                  color: theme.palette.common.main,
                }),
                ...(node?.data?.role?.order ===5 && {
                  color: theme.palette.primary.main,
                }),
                ...(node?.data?.role?.order ===6 && {
                  color: theme.palette.secondary.main,
                }),
            }}>
              ({node?.data?.role?.name})
            </Typography>
            </Stack>
            <div>총관리 { `(${  node?.data?.total_user || 0  }명)`}</div>
        </div>
    );
  const actionTemplate1 = (node, column) => (
        <div
            style={{
                display: 'flex',
                justifyContent: 'space-around',
                fontSize:'12px',
            }}
        >
            <span>슬롯</span>
            <div className="">
                R : {node.data.slotRate} L : {node.data.loseSlotRate}
            </div>
        </div>
    );
  const actionTemplate2 = (node, column) => (
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                padding: '0 12px',
                fontSize:'12px',
            }}
        >
            <div
                className=""
                style={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    paddingBottom: '10px',
                    fontSize:'12px',
                }}
            >
                <span>보유머니</span>
                <span>{toNumberTag(node.data.balanceMain)}</span>
            </div>
            <div
                className=""
                style={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    paddingBottom: '10px',
                    fontSize:'12px',
                }}
            >
                <span>보유포인트</span>
                <span>{toNumberTag(0)}</span>
            </div>
        </div>
    );
  const actionTemplate3 = (node, column) => (
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                padding: '0 12px',
                fontSize:'12px',
            }}
        >
            <div
                className=""
                style={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    paddingBottom: '10px'
                }}
            >
                <span>회원입금</span>
                <span>{toNumberTag(node.data.deposit)}</span>
            </div>
            <div
                className=""
                style={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    paddingBottom: '10px'
                }}
            >
                <span>회원출금</span>
                <span>{toNumberTag(node.data.withdraw)}</span>
            </div>
            <div
                className=""
                style={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    paddingBottom: '10px'
                }}
            >
                <span>입금-출금</span>
                <span>{toNumberTag(node.data.deposit - node.data.withdraw)}</span>
            </div>
        </div>
    );

  const actionTemplate4 = (node, column) => (
        <div
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    padding: '0 12px',
                    fontSize:'12px',
                }}
            >
                <div
                    className=""
                    style={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        paddingBottom: '10px'
                    }}
                >
                    <span>베팅</span>
                    <span>{toNumberTag(node.data.bet_live)}</span>
                </div>
                <div
                    className=""
                    style={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        paddingBottom: '10px'
                    }}
                >
                    <span
                        style={{
                            color: 'blue'
                        }}
                    >
                        당첨
                    </span>
                    <span>{toNumberTag(node.data.win_live)}</span>
                </div>
                <div
                    className=""
                    style={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        paddingBottom: '10px'
                    }}
                >
                    <span>롤링</span>
                    <span>{toNumberTag(node.data.bet_money_live)}</span>
                </div>
                <div
                    className=""
                    style={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        paddingBottom: '10px'
                    }}
                >
                    <span>정산</span>
                    <span>
                        <span>{toNumberTag(node.data.balance_live)}</span>
                    </span>
                </div>
                <div
                    className=""
                    style={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        paddingBottom: '10px'
                    }}
                >
                    <span
                        style={{
                            color: 'red'
                        }}
                    >
                        루징
                    </span>
                    <span>
                        <span>{toNumberTag(node.data.lose_money_live)}</span>
                    </span>
                </div>
            </div>
    );
  const actionTemplate5 = (node, column) => (
        <div
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    padding: '0 12px',
                    fontSize:'12px',
                }}
            >
                <div
                    className=""
                    style={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        paddingBottom: '10px'
                    }}
                >
                    <span>베팅</span>
                    <span>{toNumberTag(node.data.bet_slot)}</span>
                </div>
                <div
                    className=""
                    style={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        paddingBottom: '10px'
                    }}
                >
                    <span
                        style={{
                            color: 'blue'
                        }}
                    >
                        당첨
                    </span>
                    <span>{toNumberTag(node.data.win_slot)}</span>
                </div>
                <div
                    className=""
                    style={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        paddingBottom: '10px'
                    }}
                >
                    <span>롤링</span>
                    <span>{toNumberTag(node.data.bet_money_slot)}</span>
                </div>
                <div
                    className=""
                    style={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        paddingBottom: '10px'
                    }}
                >
                    <span>정산</span>
                    <span>
                        <span>{toNumberTag(node.data.balance_slot)}</span>
                    </span>
                </div>
                <div
                    className=""
                    style={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        paddingBottom: '10px'
                    }}
                >
                    <span
                        style={{
                            color: 'red'
                        }}
                    >
                        루징
                    </span>
                    <span>
                        <span>{toNumberTag(node.data.lose_money_slot)}</span>
                    </span>
                </div>
            </div>
    );
  const actionTemplate6 = (node, column) => (
        <div
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    padding: '0 12px',
                    fontSize:'12px',
                }}
            >
                <div
                    className=""
                    style={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        paddingBottom: '10px'
                    }}
                >
                    <span>베팅</span>
                    <span>{toNumberTag(node.data.bet_live + node.data.bet_slot)}</span>
                </div>
                <div
                    className=""
                    style={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        paddingBottom: '10px'
                    }}
                >
                    <span
                        style={{
                            color: 'blue'
                        }}
                    >
                        당첨
                    </span>
                    <span>{toNumberTag(node.data.win_live + node.data.win_slot)}</span>
                </div>
                <div
                    className=""
                    style={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        paddingBottom: '10px'
                    }}
                >
                    <span>롤링</span>
                    <span>{toNumberTag(node.data.bet_money_live + node.data.bet_money_slot)}</span>
                </div>
                <div
                    className=""
                    style={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        paddingBottom: '10px'
                    }}
                >
                    <span>정산</span>
                    <span>
                        <span>{toNumberTag(node.data.balance_live +  node.data.balance_slot)}</span>
                    </span>
                </div>
                <div
                    className=""
                    style={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        paddingBottom: '10px'
                    }}
                >
                    <span
                        style={{
                            color: 'red'
                        }}
                    >
                        루징
                    </span>
                    <span>
                        <span>{toNumberTag(node.data.lose_money_live + node.data.lose_money_slot)}</span>
                    </span>
                </div>
            </div>
    );

  
  useEffect(() => {
    getAllTotalList();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFirst]);


  return (
    <>
      <Helmet>
        <title> Admin Portal </title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'xl'}>
        <CustomBreadcrumbs
          heading="partnerCalculate"
          links={[
            { name: 'dashboard', href: PATH_DASHBOARD.root },
            { name: 'settlement', href: PATH_DASHBOARD.report.root },
            { name: 'partnerReport' },
          ]}
        />
        <Card>
          
          <ReportTableToolbar
            filterEndDate={filterEndDate}
            filterStartDate={filterStartDate}
            onResetFilter={handleResetFilter}
            onFilterStartDate={(newValue) => {
              handleClickStartDate(newValue);
            }}
            onFilterEndDate={(newValue) => {
              handleClickEndDate(newValue);
            }}
            onClickSearch = {handleClickSearch}
            onFilterName={handleFilterName}
          />

          <Typography variant="h6" sx={{ color: 'text.secondary', pt:1, pl:1, }}>
            Total Search Result
          </Typography>
          <Grid container spacing={3} direction="row">
            <Grid item xs={12} md={6} > 
              <Table size= 'small' sx={{ minWidth: 600, mt:6 }}>
                  {/* <TableHeadCustom
                    headLabel={TABLE_HEAD_TOTAL_ONE}
                  /> */}
                  <TableBody sx={{ pt:3, }}>
                    <TableRow key="total_search_one_1">
                      <TableCell align='left' sx={{ textTransform: 'capitalize' }}>
                        <Stack direction="row"
                          alignItems="center"
                          justifyContent="space-between">
                          <Typography variant="body2">
                            {`${translate('holdingMoney')}`}
                          </Typography>
                          <Typography variant="body2">
                          {toNumberString(totalData?.user_money)}
                          </Typography>
                        </Stack>
                      </TableCell>
                      <TableCell align='left' sx={{ textTransform: 'capitalize' }}>
                        <Stack direction="row"
                          alignItems="center"
                          justifyContent="space-between">
                          <Typography variant="body2">
                            {`${translate('userDeposit')}`}
                          </Typography>
                          <Typography variant="body2">
                            {toNumberString(totalData?.totald)}
                          </Typography>
                        </Stack>
                      </TableCell>
                      <TableCell align='left'  sx={{ textTransform: 'capitalize' }}>
                        <Stack direction="row"
                          alignItems="center"
                          justifyContent="space-between">
                          <Typography variant="body2">
                            {`${translate('userWithdraw')}`}
                          </Typography>
                          <Typography variant="body2">
                            {toNumberString(totalData?.totalw)}
                          </Typography>
                        </Stack>
                      </TableCell>
                      <TableCell align='left' sx={{ textTransform: 'capitalize' }}>
                        <Stack direction="row"
                          alignItems="center"
                          justifyContent="space-between">
                          <Typography variant="body2">
                            {`${translate('depositMinWithdraw')}`}
                          </Typography>
                          <Typography variant="body2">
                            {toNumberString(totalDepWith)}
                          </Typography>
                        </Stack>
                      </TableCell>
                    </TableRow>
                    <TableRow key="total_search_one_2">
                      <TableCell align='left' sx={{ textTransform: 'capitalize' }}>
                        <Stack direction="row"
                          alignItems="center"
                          justifyContent="space-between">
                          <Typography variant="body2">
                            {`${translate('holdingPoint')}`}
                          </Typography>
                          <Typography variant="body2">
                            {toNumberString(totalHoldingPoint)}
                          </Typography>
                        </Stack>
                      </TableCell>
                      <TableCell align='left' sx={{ textTransform: 'capitalize' }}>
                        <Stack direction="row"
                          alignItems="center"
                          justifyContent="space-between">
                          <Typography variant="body2">
                            {`${translate('partnerDeposit')}`}
                          </Typography>
                          <Typography variant="body2">
                            {toNumberString(totalPartnerDeposit)}
                          </Typography>
                        </Stack>
                      </TableCell>
                      <TableCell align='left' sx={{ textTransform: 'capitalize' }}>
                        <Stack direction="row"
                          alignItems="center"
                          justifyContent="space-between">
                          <Typography variant="body2">
                            {`${translate('partnerWidthraw')}`}
                          </Typography>
                          <Typography variant="body2">
                            {toNumberString(totalPartnerWithdraw)}
                          </Typography>
                        </Stack>
                      </TableCell>
                      <TableCell align='left' sx={{ textTransform: 'capitalize' }}>
                        <Stack direction="row"
                          alignItems="center"
                          justifyContent="space-between">
                          <Typography variant="body2">
                            {`${translate('partnerDepMinWid')}`}
                          </Typography>
                          <Typography variant="body2">
                            {toNumberString(totalPartnerIncome)}
                          </Typography>
                        </Stack>
                      </TableCell>
                    </TableRow>
                    <TableRow key="total_search_one_3">
                      <TableCell align='left' sx={{ textTransform: 'capitalize' }}>
                        <Stack direction="row"
                          alignItems="center"
                          justifyContent="space-between">
                          <Typography variant="body2">
                            {`${translate('userAmount')}`}
                          </Typography>
                          <Typography variant="body2">
                            {totalData?.total_user}
                          </Typography>
                        </Stack>
                      </TableCell>
                      <TableCell align='left' sx={{ textTransform: 'capitalize' }}>
                        <Stack direction="row"
                          alignItems="center"
                          justifyContent="space-between">
                          <Typography variant="body2">
                            {`${translate('adminDeposit')}`}
                          </Typography>
                          <Typography variant="body2">
                            {toNumberString(totalAdminDeposit)}
                          </Typography>
                        </Stack>
                      </TableCell>
                      <TableCell align='left' sx={{ textTransform: 'capitalize' }}>
                        <Stack direction="row"
                          alignItems="center"
                          justifyContent="space-between">
                          <Typography variant="body2">
                            {`${translate('adminWidthraw')}`}
                          </Typography>
                          <Typography variant="body2">
                            {toNumberString(totalAdminWithdraw)}
                          </Typography>
                        </Stack>
                      </TableCell>
                      <TableCell align='left' sx={{ textTransform: 'capitalize' }}>
                        <Stack direction="row"
                          alignItems="center"
                          justifyContent="space-between">
                          <Typography variant="body2">
                            {`${translate('adminDepMinWith')}`}
                          </Typography>
                          <Typography variant="body2">
                            {toNumberString(totalAdminIncome)}
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
                      <TableCell align='left' sx={{ textTransform: 'capitalize', borderRight:'solid 1px lightgray', borderLeft:'solid 1px lightgray' }}>
                        <Stack direction="row"
                          alignItems="center"
                          justifyContent="space-between">
                          <Typography variant="body2">
                            {`${translate('betting')}`}:
                          </Typography>
                          <Typography variant="body2">
                            {toNumberString(dataActive?.bet_live)}
                          </Typography>
                        </Stack>
                      </TableCell>
                      <TableCell align='left' sx={{ textTransform: 'capitalize', borderRight:'solid 1px lightgray' }}>
                        <Stack direction="row"
                          alignItems="center"
                          justifyContent="space-between">
                          <Typography variant="body2">
                            {`${translate('betting')}`}:
                          </Typography>
                          <Typography variant="body2">
                            
                          {toNumberString(dataActive?.bet_slot)}
                          </Typography>
                        </Stack>
                      </TableCell>
                      <TableCell align='left' sx={{ textTransform: 'capitalize', }}>
                        <Stack direction="row"
                          alignItems="center"
                          justifyContent="space-between">
                          <Typography variant="body2">
                            {`${translate('totalBet')}`}:
                          </Typography>
                          <Typography variant="body2">
                            {
                            // eslint-disable-next-line no-unsafe-optional-chaining
                            toNumberString(dataActive?.bet_live + dataActive.bet_slot)
                            }
                          </Typography>
                        </Stack>
                      </TableCell>
                    </TableRow>
                    <TableRow key="total_search_two_2">
                      <TableCell align='left' sx={{ textTransform: 'capitalize', borderRight:'solid 1px lightgray', borderLeft:'solid 1px lightgray' }}>
                        <Stack direction="row"
                          alignItems="center"
                          justifyContent="space-between">
                          <Typography variant="body2">
                            {`${translate('win')}`}:
                          </Typography>
                          <Typography variant="body2">
                            {toNumberString(dataActive?.win_live)}
                          </Typography>
                        </Stack>
                      </TableCell>
                      <TableCell align='left' sx={{ textTransform: 'capitalize', borderRight:'solid 1px lightgray' }}>
                        <Stack direction="row"
                          alignItems="center"
                          justifyContent="space-between">
                          <Typography variant="body2">
                            {`${translate('win')}`}:
                          </Typography>
                          <Typography variant="body2">
                            {toNumberString(dataActive?.win_slot)}
                          </Typography>
                        </Stack>
                      </TableCell>
                      <TableCell align='left' sx={{ textTransform: 'capitalize', }}>
                        <Stack direction="row"
                          alignItems="center"
                          justifyContent="space-between">
                          <Typography variant="body2">
                            {`${translate('totalWin')}`}:
                          </Typography>
                          <Typography variant="body2">
                          {
                            // eslint-disable-next-line no-unsafe-optional-chaining
                            toNumberString(dataActive?.win_live + dataActive.win_slot)
                          }
                          </Typography>
                        </Stack>
                      </TableCell>
                    </TableRow>
                    <TableRow key="total_search_two_3">
                      <TableCell align='left' sx={{ textTransform: 'capitalize', borderRight:'solid 1px lightgray', borderLeft:'solid 1px lightgray' }}>
                        <Stack direction="row"
                          alignItems="center"
                          justifyContent="space-between">
                          <Typography variant="body2">
                            {`${translate('rolling')}`}:
                          </Typography>
                          <Typography variant="body2">
                            {toNumberString(dataActive?.bet_money_live)}
                          </Typography>
                        </Stack>
                      </TableCell>
                      <TableCell align='left' sx={{ textTransform: 'capitalize', borderRight:'solid 1px lightgray' }}>
                        <Stack direction="row"
                          alignItems="center"
                          justifyContent="space-between">
                          <Typography variant="body2">
                            {`${translate('rolling')}`}:
                          </Typography>
                          <Typography variant="body2">
                            {toNumberString(dataActive?.bet_money_slot)}
                          </Typography>
                        </Stack>
                      </TableCell>
                      <TableCell align='left' sx={{ textTransform: 'capitalize', }}>
                        <Stack direction="row"
                          alignItems="center"
                          justifyContent="space-between">
                          <Typography variant="body2">
                            {`${translate('totalRollAmount')}`}:
                          </Typography>
                          <Typography variant="body2">
                            {
                            // eslint-disable-next-line no-unsafe-optional-chaining
                            toNumberString(dataActive?.bet_money_live + dataActive.bet_money_slot)
                            }
                          </Typography>
                        </Stack>
                      </TableCell>
                    </TableRow>
                    <TableRow key="total_search_two_5">
                      <TableCell align='left' sx={{ textTransform: 'capitalize', borderRight:'solid 1px lightgray', borderLeft:'solid 1px lightgray' }}>
                        <Stack direction="row"
                          alignItems="center"
                          justifyContent="space-between">
                          <Typography variant="body2">
                            {`${translate('balance')}`}:
                          </Typography>
                          <Typography variant="body2">
                            {toNumberString(dataActive?.balance_live)}
                          </Typography>
                        </Stack>
                      </TableCell>
                      <TableCell align='left' sx={{ textTransform: 'capitalize', borderRight:'solid 1px lightgray' }}>
                        <Stack direction="row"
                          alignItems="center"
                          justifyContent="space-between">
                          <Typography variant="body2">
                            {`${translate('balance')}`}:
                          </Typography>
                          <Typography variant="body2">
                            {toNumberString(dataActive?.balance_slot)}
                          </Typography>
                        </Stack>
                      </TableCell>
                      <TableCell align='left' sx={{ textTransform: 'capitalize', }}>
                        <Stack direction="row"
                          alignItems="center"
                          justifyContent="space-between">
                          <Typography variant="body2">
                            {`${translate('totalBalance')}`}:
                          </Typography>
                          <Typography variant="body2">
                            {
                            // eslint-disable-next-line no-unsafe-optional-chaining
                            toNumberString(dataActive?.balance_live + dataActive.balance_slot)
                            }
                          </Typography>
                        </Stack>
                      </TableCell>
                    </TableRow>
                    <TableRow key="total_search_two_4">
                      <TableCell align='left' sx={{ textTransform: 'capitalize', borderRight:'solid 1px lightgray', borderLeft:'solid 1px lightgray' }}>
                        <Stack direction="row"
                          alignItems="center"
                          justifyContent="space-between">
                          <Typography variant="body2">
                            {`${translate('losing')}`}:
                          </Typography>
                          <Typography variant="body2">
                            {toNumberString(dataActive?.lose_money_live)}
                          </Typography>
                        </Stack>
                      </TableCell>
                      <TableCell align='left' sx={{ textTransform: 'capitalize', borderRight:'solid 1px lightgray' }}>
                        <Stack direction="row"
                          alignItems="center"
                          justifyContent="space-between">
                          <Typography variant="body2">
                            {`${translate('losing')}`}:
                          </Typography>
                          <Typography variant="body2">
                            {toNumberString(dataActive?.lose_money_slot)}
                          </Typography>
                        </Stack>
                      </TableCell>
                      <TableCell align='left' sx={{ textTransform: 'capitalize', }}>
                        <Stack direction="row"
                          alignItems="center"
                          justifyContent="space-between">
                          <Typography variant="body2">
                            {`${translate('totalLosing')}`}:
                          </Typography>
                          <Typography variant="body2">
                            {
                            // eslint-disable-next-line no-unsafe-optional-chaining
                            toNumberString(dataActive?.lose_money_live + dataActive.lose_money_slot)
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

            <Scrollbar sx={{ p: 2 }}>
              {/* <Table size={dense ? 'small' : 'medium'} sx={{ minWidth: 800 }}>
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
                    emptyRows={emptyRows(page, rowsPerPage, tableData.length)}
                  />

                  <TableNoData isNotFound={isNotFound} />
                </TableBody>
              </Table> */}
              
                    
              <TreeTable value={dataFiltered} tableStyle={{ minWidth: '1400px', }} globalFilter={globalFilter}>
                    <Column
                        className="body_table_name_userlist"
                        body={actionTemplate}
                        header="이름"
                        style={{ minWidth: '150px', borderRight: 'solid 1px lightgray', borderBottom: 'solid 1px lightgray', }}
                        expander
                    />
                    <Column 
                        field="username" 
                        body={actionTemplate1} 
                        style={{ borderRight: 'solid 1px lightgray',borderBottom: 'solid 1px lightgray', }}
                        header="적용 요율 (%)" />

                    <Column
                        field="bet_money_slot"
                        body={actionTemplate2}
                        style={{ minWidth: '150px', borderRight: 'solid 1px lightgray', borderBottom: 'solid 1px lightgray',}}
                        header="보유금액"
                    />
                    <Column
                        field="lose_money_slot"
                        body={actionTemplate3}
                        style={{
                            minWidth: '150px',
                            borderRight: 'solid 1px lightgray',
                            borderBottom: 'solid 1px lightgray',
                        }}
                        header="입출금"
                    />
                    <Column
                        body={actionTemplate4}
                        field="bet_money_live"
                        style={{
                            minWidth: '150px',
                            borderRight: 'solid 1px lightgray',
                            borderBottom: 'solid 1px lightgray',
                        }}
                        header="카지노"
                    />
                    <Column
                        body={actionTemplate5}
                        field="lose_money_live"
                        style={{
                            minWidth: '150px',
                            borderRight: 'solid 1px lightgray',
                            borderBottom: 'solid 1px lightgray',
                        }}
                        header="슬롯"
                    />
                    <Column
                        body={actionTemplate6}
                        field="withdraw_rate"
                        style={{
                            minWidth: '150px',
                            borderBottom: 'solid 1px lightgray',
                        }}
                        header="총베팅"
                    />
                </TreeTable>
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

function applyFilter({ inputData, comparator, filterName, filterStatus, filterRole, loginUser }) {
  const stabilizedThis = inputData.map((el, index) => [el, index]);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);

  if (filterName) {
    inputData = inputData.filter(
      (user) => user?.data?.username?.toLowerCase().indexOf(filterName.toLowerCase()) !== -1
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
