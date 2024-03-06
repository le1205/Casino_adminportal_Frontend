import { Helmet } from 'react-helmet-async';
import { useState, useEffect } from 'react';
// @mui
import {
  Tab,
  Tabs,
  Card,
  Stack,
  Table,
  Divider,
  Typography,
  TableBody,
  Container,
  TableContainer,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
// routes
import moment from 'moment';
import { PATH_DASHBOARD } from '../../../routes/paths';
// locales
import { useLocales } from '../../../locales';

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
import { BetTotalTableToolbar, BetTotalTableRow } from '../../../sections/@dashboard/bet/list';
// api
import { apiWithPostData, apiWithGetData } from '../../../utils/api';
// url
import { gameLogUrl, adminListUrl, getListRoleUrl } from '../../../utils/urlList';

// ----------------------------------------------------------------------

const STATUS_OPTIONS = [
  { id: 'live', label: 'Casino', },
  { id: 'slot', label: 'Slot', },
];

const TABLE_HEAD = [
  { id: 'creator', label: 'creator', align: 'center' },
  { id: 'id', label: 'id', align: 'center' },
  { id: 'index', label: 'bettingNo', align: 'center' },
  { id: 'provider', label: 'provider', align: 'center' },
  { id: 'gameType', label: 'gameType', align: 'center' },
  { id: 'gameName', label: 'gameName', align: 'center' },
  { id: 'bettingId', label: 'bettingId', align: 'center' },
  { id: 'bettingDate', label: 'bettingDate', align: 'center' },
  // { id: 'before', label: 'Before', align: 'center' },
  { id: 'betMoney', label: 'betMoney', align: 'center' },
  { id: 'winMoney', label: 'winMoney', align: 'center' },
  { id: 'winLose', label: 'winLose', align: 'center' },
  { id: 'after', label: 'after', align: 'center' },
  { id: 'status', label: 'status', align: 'center' },
];

// ----------------------------------------------------------------------

export default function BetCommonPage() {
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
  const [openAlert, setOpenAlert] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [filterName, setFilterName] = useState('');
  const [gameType, setGameType] = useState('live');
  const [filterEndDate, setFilterEndDate] = useState(new Date);
  const [filterStartDate, setFilterStartDate] = useState(new Date);
  const [totalAmount, setTotalAmount] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [totalRole, setTotalRole] = useState([{
    _id: 0,
    id: 0,
    name: "all",
  }]);
  const [totalUsers, setTotalUsers] = useState([]);
  const [filterRole, setFilterRole] = useState('all');
  const [adminList, setAdminList] = useState([]);
  const [list, setList] = useState([]);
  const [alertContent, setAlertContent] = useState(`${translate('couldNotSelectFuture')}`);

  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(order, orderBy),
    filterRole,
  });

  const denseHeight = dense ? 52 : 72;

  const isFiltered =  filterRole !== 'all';

  const isNotFound =
    (!dataFiltered.length && !!filterName) ||( !tableData.length);

  const handleFilterStatus = (event, newValue) => {
    setPage(0);
    setGameType(newValue);
    gameLog(newValue);
  };

  const handleResetFilter = () => {
    setFilterRole('all');
  };

  const handleFilterRole = (event) => {
    setPage(0);
    setFilterRole(event.target.value);
  };

  const handleClickSearch = () => {
    setPage(0)
    setFilterRole('all');
    gameLog(gameType);
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
  
  const usersList = () => {
    try {
      const url = adminListUrl;
      const headers = {};
      const data = {};
      apiWithPostData(url, data, headers).then((response) => {
        const { results } = response;
        const users = [{
          _id: 0,
          id: 0,
          name: "all",
        }];
        results.forEach((item, index) => {
          const user = {
            _id: item._id || '',
            id: item.user_id || '',
            name: item.username || '',
          }
          users.push(user);
        });
        setTotalRole(users);
        setTotalUsers(results);
      });
    } catch (error) {
      console.log(error);
    }
  };
  
  const getListRole = () => {
    try {
      const url = getListRoleUrl;
      const headers = {};
      const data = {};
      apiWithGetData(url, data, headers).then((response) => {
        setAdminList(response);
      });
    } catch (error) {
      console.log(error);
    }
  };

  // const gameLog = (game) => {
  //   try {
  //     setIsLoading(true);
  //     setPage(0);
  //     const url = gameLogUrl;
  //     const headers = {};
  //     const startDate = filterStartDate;
  //     startDate.setHours(0, 0, 0);
  //     const endDate = filterEndDate;
  //     endDate.setHours(23, 59, 59);
  //     const data = {
  //       "start": startDate,
  //       "end": endDate,
  //       "game_type": game,
  //       "perPage": 100,
  //     };
  //     apiWithPostData(url, data, headers).then((response) => {
  //       const dailyArr = response;
  //       console.log(response);
  //       setList(dailyArr);
  //       setIsLoading(false);
  //     });
  //   } catch (error) {
  //     console.log(error);
  //     setIsLoading(false);
  //   }

  // };
  

  const gameLog = async (game) => {
    try {
      setIsLoading(true);
      setPage(0);
      
      const NewDate = moment(filterStartDate).format('YYYY-MM-DD');
      const url = gameLogUrl;
      const headers = {};
      const data = {
        "start": `${NewDate} 00:00:00`,
        "end": `${NewDate} 01:59:59`,
        "game_type": game,
        "perPage": 100,
      };
      const data1 = {
        "start": `${NewDate} 02:00:00`,
        "end": `${NewDate} 03:59:59`,
        "game_type": game,
        "perPage": 100,
      };
      const data2 = {
        "start": `${NewDate} 04:00:00`,
        "end": `${NewDate} 05:59:59`,
        "game_type": game,
        "perPage": 100,
      };
      const data3 = {
        "start": `${NewDate} 06:00:00`,
        "end": `${NewDate} 07:59:59`,
        "game_type": game,
        "perPage": 100,
      };
      const data4 = {
        "start": `${NewDate} 08:00:00`,
        "end": `${NewDate} 09:59:59`,
        "game_type": game,
        "perPage": 100,
      };
      const data5 = {
        "start": `${NewDate} 10:00:00`,
        "end": `${NewDate} 11:59:59`,
        "game_type": game,
        "perPage": 100,
      };
      const data6 = {
        "start": `${NewDate} 12:00:00`,
        "end": `${NewDate} 13:59:59`,
        "game_type": game,
        "perPage": 100,
      };
      const data7 = {
        "start": `${NewDate} 14:00:00`,
        "end": `${NewDate} 15:59:59`,
        "game_type": game,
        "perPage": 100,
      };
      const data8 = {
        "start": `${NewDate} 16:00:00`,
        "end": `${NewDate} 17:59:59`,
        "game_type": game,
        "perPage": 100,
      };
      const data9 = {
        "start": `${NewDate} 18:00:00`,
        "end": `${NewDate} 19:59:59`,
        "game_type": game,
        "perPage": 100,
      };
      const data10 = {
        "start": `${NewDate} 20:00:00`,
        "end": `${NewDate} 21:59:59`,
        "game_type": game,
        "perPage": 100,
      };
      const data11 = {
        "start": `${NewDate} 22:00:00`,
        "end": `${NewDate} 23:59:59`,
        "game_type": game,
        "perPage": 100,
      };
      
      await Promise.all([
        apiWithPostData(url, data, headers),
        apiWithPostData(url, data1, headers),
        apiWithPostData(url, data2, headers),
        apiWithPostData(url, data3, headers),
        apiWithPostData(url, data4, headers),
        apiWithPostData(url, data5, headers),
        apiWithPostData(url, data6, headers),
        apiWithPostData(url, data7, headers),
        apiWithPostData(url, data8, headers),
        apiWithPostData(url, data9, headers),
        apiWithPostData(url, data10, headers),
        apiWithPostData(url, data11, headers),
      ]).then((dataArray) => {
        let value = [];
        // eslint-disable-next-line array-callback-return
        dataArray.slice(0, 12).map((item) => {
            value = [...value, item];
        });
        setList(value.flat(1));
        setIsLoading(false);
      });

    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }

  };
  
  const handleFilterItem = (data, totalUser, adminsList) => {
    if (data.length !== 0) {
        const listMain = [];
        // eslint-disable-next-line array-callback-return
        data.map((item) => {
            const value = totalUser.find((user) => user.username === item.username);
            if (value) {
                listMain.push({
                    ...item,
                    user: value
                });
            }
        });
        
        if (listMain.length !== 0) {
            let listAgentMain = [];
            // eslint-disable-next-line array-callback-return
            listMain.map((item) => {
                const value = adminsList.find((user) => user._id === item?.user?.creatorId);
                if (value) {
                    listAgentMain.push({
                        ...item,
                        agent: value
                    });
                }
            });
            listAgentMain = listAgentMain.flat().sort((a, b) => new Date(b.create_at) - new Date(a.create_at));

            if (listAgentMain.length !== 0) {
                const distributorList = listAgentMain.map((ditem) => ({
                        ...ditem,
                        distributor: adminList.find((user) => user._id === ditem?.agent?.creatorId)
                    }));
                const companyList = distributorList.map((citem) => ({
                        ...citem,
                        company: adminList.find((user) => user._id === citem?.distributor?.creatorId)
                    }));
                const subadminList = companyList.map((sitem) => ({
                        ...sitem,
                        subadmin: adminList.find((user) => user._id === sitem?.company?.creatorId)
                    }));
                const adminFinalList = subadminList.map((aitem) => ({
                        ...aitem,
                        admin: adminList.find((user) => user._id === aitem?.subadmin?.creatorId)
                    }));
                setTableData(adminFinalList);
                return;
            }
        }
        setTableData([]);
    }
    setTableData([]);
  };

  useEffect(() => {
    usersList();
    getListRole();
    gameLog(gameType);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFirst]);

  useEffect(() => {
    let valAmount = 0;
    let valCount = 0;
    dataFiltered.forEach(element => {
      valAmount += element.bet;
      valCount += 1;
    });
    setTotalAmount(valAmount);
    setTotalCount(valCount);
  }, [dataFiltered]);

  useEffect(() => {
    if(totalUsers.length === 0 || adminList.length === 0 || list.length === 0) {
      return;
    }
    handleFilterItem(list, totalUsers, adminList);
    
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [totalUsers, adminList, list]);


  return (
    <>
      <Helmet>
        <title> Admin Portal </title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'xl'}>
        <CustomBreadcrumbs
          heading="totalBetList"
          links={[
            { name: 'dashboard', href: PATH_DASHBOARD.root },
            { name: 'betting', href: PATH_DASHBOARD.bet.root },
            { name: 'all' },
          ]}
        />

        <Card>
          <Tabs
            value={gameType}
            onChange={handleFilterStatus}
            sx={{
              px: 2,
              bgcolor: 'background.neutral',
            }}
          >
            {STATUS_OPTIONS.map((tab) => (
              <Tab key={tab.id} label={tab.label} value={tab.id} />
            ))}
          </Tabs>

          <Divider />

          <BetTotalTableToolbar
            isFiltered={isFiltered}
            filterEndDate={filterEndDate}
            filterStartDate={filterStartDate}
            filterRole={filterRole}
            optionsRole={totalRole}
            onResetFilter={handleResetFilter}
            onClickSearch={handleClickSearch}
            onFilterRole={handleFilterRole}
            onFilterStartDate={(newValue) => {
              setFilterStartDate(newValue);
            }}
            onFilterEndDate={(newValue) => {
              setFilterEndDate(newValue);
            }}
          />
          
          <Stack direction="row" justifyContent="flex-end" alignItems="center" spacing={3} sx={{ textTransform: 'capitalize', mt: -4, pb:1, mr:6 }}>
            <Typography variant="subtitle1" noWrap sx={{ color: theme.palette.success.main}}>
            {`${translate('totalBettingAmount')}`}:
            </Typography>
            <Typography variant="subtitle1" noWrap  sx={{ color: theme.palette.success.main}}>
              {totalAmount?.toLocaleString()}
            </Typography>
            <Typography variant="subtitle1" noWrap  sx={{ color: theme.palette.warning.main, pl:2}}>
            {`${translate('bettingCount')}`}:
            </Typography>
            <Typography variant="subtitle1" noWrap  sx={{ color: theme.palette.warning.main}}>
              {totalCount?.toLocaleString()}
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
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row) => (
                      <BetTotalTableRow
                        key={row.id}
                        row={row}
                        selected={selected.includes(row.id)}
                        onSelectRow={() => onSelectRow(row.id)}
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

function applyFilter({ inputData, comparator, filterRole, }) {
  const stabilizedThis = inputData.map((el, index) => [el, index]);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);
  
  if (filterRole !== 'all') {
    inputData = inputData.filter((user) => user.username === filterRole);
  }

  return inputData;
}
