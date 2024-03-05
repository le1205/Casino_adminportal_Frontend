import { Helmet } from 'react-helmet-async';
import { paramCase } from 'change-case';
import { useState, useEffect } from 'react';
// md5
import {md5} from 'js-md5';

import { Link as RouterLink, useNavigate } from 'react-router-dom';
// @mui
import {
  Card,
  Table,
  Button,
  Tooltip,
  Divider,
  TableBody,
  Container,
  IconButton,
  TableContainer,
} from '@mui/material';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// components
import Iconify from '../../../components/iconify';
import Scrollbar from '../../../components/scrollbar';
import ConfirmDialog from '../../../components/confirm-dialog';
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
import { PartnerTableRow, PartnerTableToolbar } from '../../../sections/@dashboard/partner/list';

// api
import { apiWithPostData } from '../../../utils/api';
// url
import { partnerListUrl } from '../../../utils/urlList';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'name', label: 'name', align: 'center' },
  { id: 'level', label: 'level', align: 'center' },
  { id: 'slotRolling', label: 'slotRolling', align: 'center' },
  { id: 'slotLoosing', label: 'slotLoosing', align: 'center' },
  { id: 'moneySend', label: 'moneySend', align: 'center' },
  { id: 'moneyReceive', label: 'moneyReceive', align: 'center' },
  { id: 'userNumber', label: 'userNumber', align: 'center' },
  { id: 'moneyAmount', label: 'moneyAmount', align: 'center' },
  { id: 'points', label: 'points', align: 'center' },
  { id: 'createUser', label: 'createUser', align: 'center' },
  // { id: 'option', label: 'Option', align: 'center' },
];

// ----------------------------------------------------------------------

export default function PartnerListPage() {
  const {
    dense,
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
  const [tableData, setTableData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [filterName, setFilterName] = useState('');

  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(order, orderBy),
    filterName,
  });
  const dataInPage = dataFiltered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  const denseHeight = dense ? 52 : 72;
  const isFiltered = filterName !== '';

  const isNotFound =
    (!dataFiltered.length && !!filterName);

  const handleOpenConfirm = () => {
    setOpenConfirm(true);
  };

  const handleFilterName = (event) => {
    setPage(0);
    setFilterName(event.target.value);
  };

  const handleResetFilter = () => {
    setFilterName('');
  };

  const handleSelectMove = (row) => {
    navigate(PATH_DASHBOARD.user.new);
  };

  const partnerList = () => {
    try {
      setIsLoading(true);
      const url = partnerListUrl;
      const headers = {};
      const data = {};
      apiWithPostData(url, data, headers).then((response) => {
        const partners = [];
        response.forEach((item, index) => {
          const {role, value} = item;
          if(value.username !== process.env.REACT_APP_ADMIN_DEVELOPER) {
            const partner = {
              id: value?._id || '',
              name: value?.username || '',
              roleName: role?.name || '',
              roleOrder: role?.order || 0,
              slotRolling: value?.balanceMain || 0,
              slotLoosing: value?.pointSlot || 0,
              deposit: value?.totald || 0,
              withdraw: value?.totalw || 0,
              userCount: value?.total_user || 0,
              userMoney: value?.user_money || 0,
              userPoint: value?.user_point || 0,
              userId: value?.userId || '',
              totalBet: value?.total_bet || 0,
              totalWin: value?.total_win || 0,
            }
            partners.push(partner);
          }
        });
        setIsLoading(false);
        setTableData(partners);
      });
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    partnerList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openConfirm]);

  return (
    <>
      <Helmet>
        <title> Admin Portal </title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'xl'}>
        <CustomBreadcrumbs
          heading="partnerList"
          links={[
            { name: 'dashboard', href: PATH_DASHBOARD.root },
            { name: 'partner', href: PATH_DASHBOARD.partner.root },
            { name: 'list' },
          ]}
        />

        <Card>
          <Divider />

          <PartnerTableToolbar
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
                      <PartnerTableRow
                        key={row?.id}
                        row={row}
                        selected={selected.includes(row.id)}
                        onSelectRow={() => onSelectRow(row.id)}
                        onSelectMove={() => handleSelectMove(row)}
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

function applyFilter({ inputData, comparator, filterName, }) {
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

  return inputData;
}
