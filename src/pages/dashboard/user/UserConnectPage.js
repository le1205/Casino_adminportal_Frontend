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
  { id: 'no', label: 'no', align: 'left' },
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

  const handleFilterRole = (event) => {
    setPage(0);
    setFilterRole(event.target.value);
  };
    
  const handleResetFilter = () => {
    setFilterName('');
    setFilterRole('all');
    setFilterStatus('all');
  };

  const roleList = () => {
    try {
      setIsLoading(true);
      const url = roleListUrl;
      const headers = {};
      const data = {};
      apiWithPostData(url, data, headers).then((response) => {
        const { results } = response;
        const roles = [{
          name: 'all',
          order: 0,
          title: 'all',
        }];
        results.forEach((item, index) => {
          const role = {
            name: item.name || '',
            order: item.order || '',
            title: item.title || '',
          }
          roles.push(role);
        });
        setTotalRole(roles);
      });
    } catch (error) {
      console.log(error);
    }

  };

  

  const sessionList = () => {
    try {
      setIsLoading(true);
      const url = userSessionUrl;
      const data = {
        page: 1,
        pageSize: 50,
      }
      const headers = {};
      apiWithPostData(url, data, headers).then((response) => {
        console.log("respnose>>>>", response);
        // const { results } = response;
        // const users = [];
        // results.forEach((item, index) => {
        //   const user = {
        //     _id: item._id || '',
        //     id: item.user_id || '---',
        //     name: item.Nickname || '---',
        //     company: item.company || '---',
        //     level: item.level || '---',
        //     cash: item.balanceMain || 0,
        //     point: item.pointSlot || '0',
        //     inOut: item.inOut || '---',
        //     totalLoose: item.loseSlotRate || '0',
        //     lastDate: item.updatedAt || '---',
        //     isVerified: item.verify || false,
        //     status: item.isBlock || false,
        //     role: item.role.name || '---',
        //   }
        //   users.push(user);
        // });

        // setTableData(users);
        setIsLoading(false);

      });
    } catch (error) {
      console.log(error);
    }

  };

  
  useEffect(() => {
    roleList();
    sessionList();
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
            optionsRole={totalRole}
            onFilterName={handleFilterName}
            onFilterRole={handleFilterRole}
            onResetFilter={handleResetFilter}
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
