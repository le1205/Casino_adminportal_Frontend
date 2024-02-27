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
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
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
  { id: 'index', label: 'bettingNo', align: 'center' },
  { id: 'id', label: 'id', align: 'center' },
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

  const { themeStretch } = useSettingsContext();
  const [isLoading, setIsLoading] = useState(false);
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
  const [listLog, setListLog] = useState([]);

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

  const gameLog = (game) => {
    try {
      setIsLoading(true);
      setPage(0);
      const url = gameLogUrl;
      const headers = {};
      const startDate = filterStartDate;
      startDate.setHours(0, 0, 0);
      const endDate = filterEndDate;
      endDate.setHours(23, 59, 59);
      const data = {
        "start": startDate,
        "end": endDate,
        "game_type": game,
      };
      apiWithPostData(url, data, headers).then((response) => {
        const dailyArr = response;
        setList(dailyArr);
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
                console.log("list>>>", adminFinalList);
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
  }, []);

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
            { name: 'total' },
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
              베팅총금액:
            </Typography>
            <Typography variant="subtitle1" noWrap  sx={{ color: theme.palette.success.main}}>
              {totalAmount?.toLocaleString()}
            </Typography>
            <Typography variant="subtitle1" noWrap  sx={{ color: theme.palette.warning.main, pl:2}}>
              Total:
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
