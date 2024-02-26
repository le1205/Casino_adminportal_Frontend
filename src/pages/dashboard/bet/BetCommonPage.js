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
import { BetTotalTableToolbar, BetTotalTableRow } from '../../../sections/@dashboard/bet/list';
// api
import { apiWithPostData } from '../../../utils/api';
// url
import { gameLogUrl } from '../../../utils/urlList';

// ----------------------------------------------------------------------

const STATUS_OPTIONS = [
  { id: 'live', label: 'Casino', },
  { id: 'slot', label: 'Slot', },
];

const TABLE_HEAD = [
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

  const { themeStretch } = useSettingsContext();
  const [isLoading, setIsLoading] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [filterName, setFilterName] = useState('');
  const [gameType, setGameType] = useState('live');
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

  const handleFilterStatus = (event, newValue) => {
    setPage(0);
    setGameType(newValue);
    gameLog(newValue);
  };

  const handleFilterName = (event) => {
    setPage(0);
    setFilterName(event.target.value);
  };


  const handleResetFilter = () => {
    setFilterName('');
  };

  const handleClickSearch = () => {
    gameLog(gameType);
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
        setTableData(dailyArr);
        setIsLoading(false);
      });
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }

  };

  useEffect(() => {
    gameLog(gameType);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
