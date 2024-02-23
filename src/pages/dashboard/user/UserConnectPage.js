import { Helmet } from 'react-helmet-async';
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
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
  TablePaginationCustom,
} from '../../../components/table';
// sections
import { UserConnectingTableToolbar, UserConnectingTableRow } from '../../../sections/@dashboard/user/list';
// api
import { apiWithPostData } from '../../../utils/api';
// url
import { userSessionUrl, roleListUrl,} from '../../../utils/urlList';

// ----------------------------------------------------------------------


const ROLE_OPTIONS = [
  'all',
  'admin',
  'partner',
  'user',
];

const TABLE_HEAD = [
  { id: 'id', label: 'id', align: 'left' },
  { id: 'company', label: 'company', align: 'left' },
  { id: 'cash', label: 'cash', align: 'left' },
  { id: 'loginTime', label: 'loginTime', align: 'left' },
  { id: 'lastIp', label: 'lastIp', align: 'left' },
  { id: 'depowith', label: 'depowith', align: 'left' },
  { id: 'lastGame', label: 'lastGame', align: 'left' },
  { id: 'loginPossible', label: 'loginPossible', align:'left' },
  { id: 'betPossible', label: 'betPossible', align:'left' },
  { id: 'confirm', label: 'confirm', align:'left' },
  { id: 'logout', label: 'logout', align:'left' },
];

export default function UserConnectPage() {
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

  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [totalRole, setTotalRole] = useState([]);
  const [filterName, setFilterName] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterEndDate, setFilterEndDate] = useState(new Date);
  const [filterStartDate, setFilterStartDate] = useState(new Date);
  const amountRef = useRef('');

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
  
  const handleFilterName = (event) => {
    setPage(0);
    setFilterName(event.target.value);
  };
    
  const handleResetFilter = () => {
    setFilterName('');
    setFilterRole('all');
    setFilterStatus('all');
  };

  const handleClickSearch = () => {
    sessionList();
  };

  const sessionList = () => {
    try {
      setIsLoading(true);
      const url = userSessionUrl;
      const data = {
        page: 1,
        pageSize: 50,
        date:[filterStartDate, filterEndDate]
      }
      const headers = {};
      apiWithPostData(url, data, headers).then((response) => {
        const resData = {
          "results": [
            {
              "_id": "65d85e959ebe835afd7ae708",
              "userId": "65b50a8d0ca0f44e512d4888",
              "__v": 0,
              "accessToken": "4f4811b301321fb3528b111ab73f8a91",
              "createdAt": "2024-02-23T09:00:05.100Z",
              "ip": "127.0.0.1",
              "refreshToken": "4f4811b301321fb3528b111ab73f8a91",
              "updatedAt": "2024-02-23T16:59:18.144Z",
              "useragent": {
                "isYaBrowser": false,
                "isAuthoritative": true,
                "isMobile": false,
                "isMobileNative": false,
                "isTablet": false,
                "isiPad": false,
                "isiPod": false,
                "isiPhone": false,
                "isiPhoneNative": false,
                "isAndroid": false,
                "isAndroidNative": false,
                "isBlackberry": false,
                "isOpera": false,
                "isIE": false,
                "isEdge": false,
                "isIECompatibilityMode": false,
                "isSafari": false,
                "isFirefox": false,
                "isWebkit": false,
                "isChrome": true,
                "isKonqueror": false,
                "isOmniWeb": false,
                "isSeaMonkey": false,
                "isFlock": false,
                "isAmaya": false,
                "isPhantomJS": false,
                "isEpiphany": false,
                "isDesktop": true,
                "isWindows": false,
                "isLinux": false,
                "isLinux64": false,
                "isMac": true,
                "isChromeOS": false,
                "isBada": false,
                "isSamsung": false,
                "isRaspberry": false,
                "isBot": false,
                "isCurl": false,
                "isAndroidTablet": false,
                "isWinJs": false,
                "isKindleFire": false,
                "isSilk": false,
                "isCaptive": false,
                "isSmartTV": false,
                "isUC": false,
                "isFacebook": false,
                "isAlamoFire": false,
                "isElectron": false,
                "silkAccelerated": false,
                "browser": "Chrome",
                "version": "121.0.0.0",
                "os": "OS X",
                "platform": "Apple Mac",
                "geoIp": {},
                "source": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36",
                "isWechat": false
              },
              "user": {
                "_id": "65b50a8d0ca0f44e512d4888",
                "email": "wndyd11@gmail.com",
                "password": "$2a$10$zjD2IqrfboSJotNvFWcXTuJBm1Yz7UmQ.gFb.tQItUPZmPLXFj0va",
                "username": "wndyd11",
                "firstname": "",
                "lastname": "",
                "oddsformat": "decimal",
                "cryptoAccount": "",
                "publicAddress": "",
                "avatar": "",
                "ip": "127.0.0.1",
                "referral": "uDIKE2FLJq",
                "amount": 10000,
                "referralPercent": 5,
                "creatorId": "65b509620ca0f44e512d4267",
                "status": true,
                "passwordDeposit": "10941094",
                "bankOwner": "",
                "bankAccount": "",
                "bankName": "",
                "phone": "",
                "phoneType": "",
                "Birthday": "",
                "Nickname": "glaemsp",
                "slotRate": 0,
                "liveRate": 0,
                "pointSlot": 0,
                "pointLive": 0,
                "pointSlotAgs": 0,
                "pointLiveAgs": 0,
                "pointSlotFiver": 0,
                "pointLiveFiver": 0,
                "loseLiveRate": 0,
                "loseSlotRate": 0,
                "withdrawRate": 0,
                "verify": true,
                "isBlock": false,
                "userPointSlot": 0,
                "userPointLive": 0,
                "token": "4f2172351322383c75c30f1c0c8ce94e",
                "user_id": "1900411",
                "vituralMoney": 0,
                "rolesId": "65279c0e089f88b6bec5aedf",
                "createdAt": "2024-01-27T13:52:16.332Z",
                "updatedAt": "2024-02-23T09:00:21.286Z",
                "__v": 0,
                "balance": 580,
                "userActive": {
                  "id": 31484803691,
                  "round_id": "15371861090453",
                  "username": "wndyd11",
                  "provider_name": "PragmaticPlay(BT)",
                  "game_title": "원숭이 7마리",
                  "tx_type": "win",
                  "bet": 0,
                  "win": 0,
                  "balance": 580,
                  "create_at": "2024-02-24 01:59:44",
                  "category": "Slots"
                }
              }
            }
          ],
          "count": 1
        };

        const {count, results} = resData;
        console.log("results>>>", results);
        const users = [];
        results.forEach(item => {
          const user = {
            _id: item._id || '',
            id: item.userId || '',
            ip: item.ip || '',
            username: item.user?.username || '',
            cash: item.user?.balance  || 0,
            lastDate: item.updatedAt,
            isVerified: item.user?.verify || false,
            status: item.user?.isBlock || false,
            lastGame: item.user?.userActive?.game_title || '',
            company: item.user?.userActive?.provider_name || '',
          }
          users.push(user);
        });

        setTableData(users);
        setIsLoading(false);

      });
    } catch (error) {
      console.log(error);
    }

  };

  
  useEffect(() => {
    sessionList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Helmet>
        <title> Admin Portal </title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'xl'}>
        <CustomBreadcrumbs
          heading="loggedInMember"
          links={[
            { name: 'dashboard', href: PATH_DASHBOARD.root },
            { name: 'user', href: PATH_DASHBOARD.user.root },
            { name: 'connecting' },
          ]}
        />

        <Card>
          <Divider />

          <UserConnectingTableToolbar
            isFiltered={isFiltered}
            filterName={filterName}
            filterRole={filterRole}
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
                      <UserConnectingTableRow
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
