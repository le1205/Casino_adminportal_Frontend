import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { LoadingButton } from '@mui/lab';
import { Box, Card, Grid, Stack, Typography, Tabs, Tab,  Table, TableRow, TableBody, TableCell,  ButtonGroup, Button, Input} from '@mui/material';
// locales
import { useLocales } from '../../../locales';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
import { useSnackbar } from '../../../components/snackbar';
import FormProvider, {
  RHFSelect,
  RHFSwitch,
  RHFTextField,
  RHFEditor,
} from '../../../components/hook-form';
// api
import { apiWithPostData } from '../../../utils/api';
// url
import { adminListUrl, createUserUrl, roleListUrl } from '../../../utils/urlList';

// ----------------------------------------------------------------------

UserNewEditForm.propTypes = {
  isEdit: PropTypes.bool,
  currentUser: PropTypes.object,
};

const banks = [
  { code: '1', label: 'sc제일은행', },
  { code: '2', label: '경남은행', },
  { code: '3', label: '광주은행',  },
  { code: '4', label: '국민은행',  },
  { code: '5', label: '기업은행', },
  { code: '6', label: '농형', },
  { code: '7', label: '대구은행', },
  { code: '8', label: '부산은행', },
  { code: '9', label: '산업은행', },
  { code: '10', label: '새마을금고', },
  { code: '11', label: '수협', },
  { code: '12', label: '시티은행', },
  { code: '13', label: '신한은행', },
  { code: '14', label: '신협', },
  { code: '15', label: '우리은행', },
  { code: '16', label: '우체국', },
  { code: '17', label: '저축은행', },
  { code: '18', label: '전북은행', },
  { code: '19', label: '제주은행', },
  { code: '20', label: '축협', },
  { code: '21', label: '카카오뱅크', },
  { code: '22', label: '케이뱅크', },
  { code: '23', label: '토스', },
  { code: '24', label: '하나은행', },
];
const slotLevel = [
  { code: '1', label: '1', },
  { code: '2', label: '2', },
  { code: '3', label: '3',  },
  { code: '4', label: '4',  },
  { code: '5', label: '5', },
  { code: '6', label: '6', },
];



export default function UserNewEditForm({ isEdit = false, currentUser }) {
  const navigate = useNavigate();
  const { translate } = useLocales();
  const { enqueueSnackbar } = useSnackbar();
  const [totalRole, setTotalRole] = useState([]);
  const [totalAgent, setTotalAgent] = useState([]);

  const NewUserSchema = Yup.object().shape({
    id: Yup.string().required('Id is required'),
    password: Yup.string().required('Password is required'),
    nickName: Yup.string().required('NickName is required'),
    exchangePassword: Yup.string().required('Exchange password is required'),
  });

  const defaultValues = useMemo(
    () => ({
      id: currentUser?.id || '',
      password: currentUser?.password || '',
      nickName: currentUser?.nickName || '',
      exchangePassword: currentUser?.exchangePassword || '',
      birthday: currentUser?.birthday || '',
      phoneNumber: currentUser?.phoneNumber || '',
      bankInfo: currentUser?.bankInfo || '',
      bankAccount: currentUser?.bankAccount || '',
      loginAvailable: currentUser?.loginAvailable || true,
      betAvailable: currentUser?.betAvailable || true,
      depositOwner: currentUser?.depositOwner || '',
      community: currentUser?.community || '',
      slotRolling: currentUser?.slotRolling || 0,
      slotLoosing: currentUser?.slotLoosing || 0,
      casinoRolling: currentUser?.casinoRolling || 0,
      casinoLoosing: currentUser?.casinoLoosing || 0,
      role: currentUser?.role || '',
      agent: currentUser?.agent || '',
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentUser]
  );

  const methods = useForm({
    resolver: yupResolver(NewUserSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;


  const roleList = () => {
    try {
      const url = roleListUrl;
      const headers = {};
      const data = {};
      apiWithPostData(url, data, headers).then((response) => {
        const { results } = response;
        const roles = [];
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
  
  const usersList = () => {
    try {
      const url = adminListUrl;
      const headers = {};
      const data = {};
      apiWithPostData(url, data, headers).then((response) => {
        const { results } = response;
        const users = [];
        results.forEach((item, index) => {
          const user = {
            _id: item._id || '',
            id: item.user_id || '',
            name: item.username || '',
          }
          users.push(user);
        });
        setTotalAgent(users);
      });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    roleList();
    usersList();
    if (isEdit && currentUser) {
      reset(defaultValues);
    }
    if (!isEdit) {
      reset(defaultValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEdit, currentUser]);

  const onSubmit = async (data) => {
    try {
      const url = createUserUrl;
      const headers = {};
      const body = {
        email: "",
        username: data?.id || "",
        password: data?.password || "",
        passwordDeposit: data?.exchangePassword || "",
        Birthday: data?.birthday || "",
        phone: data?.phoneNumber || "",
        bankName: data?.bankInfo || "",
        bankAccount: data?.bankAccount || "",
        bankOwner: data?.depositOwner || "",
        Nickname: data?.nickName || "",
        phoneType: "",
        liveRate: data?.casinoRolling || 0,
        slotRate: data?.slotRolling || 0,
        loseSlotRate: data?.slotLoosing || 0,
        loseLiveRate: data?.casinoLoosing || 0,
        withdrawRate: 0,
        role: data?.role || "user",
        agent: data?.agent || "",
        verify: true,
        status: data?.betAvailable || true,
      };
      console.log("BODY>>>", body);
      apiWithPostData(url, body, headers).then((response) => {
        console.log(response);
        reset();
        enqueueSnackbar(!isEdit ? 'Create success!' : 'Update success!');
        navigate(PATH_DASHBOARD.user.list);
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card sx={{ p: 3 }}>
            <Box
              rowGap={3}
              columnGap={2}
              display="grid"
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                sm: 'repeat(2, 1fr)',
              }}
            >

              <RHFSwitch
                name="loginAvailable"
                labelPlacement="start"
                label={
                  <Typography variant="subtitle2" sx={{ mb: 0.5, textTransform: 'capitalize' }}>
                    {`${translate('loginAvailable')}`}
                  </Typography>
                }
                sx={{ mx: 0, width: 1, justifyContent: 'space-between' }}
              />
              
              <RHFSwitch
                name="betAvailable"
                labelPlacement="start"
                label={
                  <Typography variant="subtitle2" sx={{ mb: 0.5, textTransform: 'capitalize' }}>
                    {`${translate('betAvailable')}`}
                  </Typography>
                }
                sx={{ mx: 0, width: 1, justifyContent: 'space-between' }}
              />
              <RHFTextField name="id" label={`${translate('id')}`} />
              <RHFTextField name="password" label={`${translate('password')}`} />
              <RHFTextField name="nickName" label={`${translate('nickName')}`} />
              <RHFTextField name="exchangePassword" label={`${translate('exchangePassword')}`}  />
              <RHFTextField name="birthday" label={`${translate('birthday')}`}/>
              <RHFTextField name="phoneNumber" label={`${translate('phoneNumber')}`}/>
              <RHFSelect native name="bankInfo" label={`${translate('bankInfo')}`} placeholder={`${translate('bankInfo')}`}  >
                <option value=""  />
                {banks.map((agent) => (
                  <option key={agent.code} value={agent.label}  >
                    {agent.label}
                  </option>
                ))}
              </RHFSelect>
              <RHFTextField name="bankAccount"  label={`${translate('bankAccount')}`} />
              <RHFTextField name="depositOwner" label={`${translate('depositOwner')}`} />
              <RHFTextField name="community" label={`${translate('community')}`} />
              <RHFTextField name="slotRolling" label={`${translate('slotRolling')}`} />
              <RHFTextField name="slotLoosing" label={`${translate('slotLoosing')}`} />
              <RHFTextField name="casinoRolling" label={`${translate('casinoRolling')}`} />
              <RHFTextField name="casinoLoosing" label={`${translate('casinoLoosing')}`} />
              <RHFSelect native name="role" label={`${translate('role')}`} placeholder={`${translate('role')}`}  >
                <option value=""  />
                {totalRole.map((element) => (
                  <option key={element.order} value={element.title}  >
                    {element.name}
                  </option>
                ))}
              </RHFSelect>
              <RHFSelect native name="agent" label={`${translate('agent')}`} placeholder={`${translate('agent')}`}  >
                <option value=""  />
                {totalAgent.map((element) => (
                  <option key={element.id} value={element.name}  >
                    {element.name}
                  </option>
                ))}
              </RHFSelect>
            </Box>
            {/* <Stack spacing={1}>
              <Typography variant="subtitle2" sx={{ color: 'text.secondary', pt:1 }}>
                Memo
              </Typography>

              <RHFEditor simple name="memo" />
            </Stack> */}
            <Stack alignItems="flex-end" sx={{ mt: 3 }}>
              <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                {!isEdit ? 'Create User' : 'Save Changes'}
              </LoadingButton>
            </Stack>
          </Card>
        </Grid>
        {/* <Grid item xs={12} md={6}>
          <Card sx={{ p: 3 }} >
            
          <Stack spacing={2} sx={{ width: 1 }}>
              <Tabs value={currentTab} onChange={(event, newValue) => setCurrentTab(newValue)}>
                
                <Tab key="one" value="one" label="Rate Seeting by game (Casino)" />
                <Tab key="two" value="two" label="Rate Seeting by game (Slot)" />
              </Tabs>
              {(currentTab === "one") && <Box
                  key="one"
                  sx={{ p: 2, borderRadius: 1, bgcolor: 'background.neutral' }}
                >
                  
                  <Grid container spacing={2}>
                    
                    <Table sx={{ minWidth: 800 }}>
                      <TableHeadCustom headLabel={TABLE_HEAD} />
                      <TableBody>
                          <TableRow key="casino_0">
                            <TableCell align='left'>
                              <Stack direction="row" spacing={2}>
                                <Typography variant="subtitle2" sx={{ color: 'text.secondary', pt:1 }}>
                                  Rolling
                                </Typography>
                                <ButtonGroup key="casino_0" variant="outlined"  color="info">
                                  <Button>-</Button>
                                  <Input
                                    disableUnderline
                                    size="small"
                                    variant="outlined"
                                    inputProps={{  type: 'number' }}
                                    sx={{
                                      typography: 'h10',
                                      width:'20',
                                      '& input': {
                                        p: 0,
                                        textAlign: 'center',
                                      },
                                    }}
                                  />
                                  <Button>+</Button>
                                </ButtonGroup>
                              </Stack>
                            </TableCell>
                            <TableCell align="center" />
                            <TableCell align="center" />
                            <TableCell align="center" />
                          </TableRow>
                          <TableRow key="casino_1">
                            <TableCell>Losing</TableCell>
                            <TableCell align="center" />
                            <TableCell align="center" />
                            <TableCell align="center" />
                          </TableRow>
                      </TableBody>
                    </Table>
                  </Grid>
                </Box>}
              {(currentTab === "two") && 
                <Box
                  key="two"
                  sx={{ p: 2, borderRadius: 1, bgcolor: 'background.neutral' }}
                >
                  Rate Seeting by game (Slot)
                </Box>}
            </Stack>
          </Card>
        </Grid> */}
      </Grid>
    </FormProvider>
  );
}
