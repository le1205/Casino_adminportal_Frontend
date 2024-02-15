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
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
import { useSnackbar } from '../../../components/snackbar';
import FormProvider, {
  RHFSelect,
  RHFSwitch,
  RHFTextField,
  RHFEditor,
} from '../../../components/hook-form';
// components
import { TableHeadCustom } from '../../../components/table';

// ----------------------------------------------------------------------

PartnerNewEditForm.propTypes = {
  isEdit: PropTypes.bool,
  currentUser: PropTypes.object,
};

const agencies = [
  { code: '1', label: '자동추천코드', },
  { code: '2', label: '총본사', },
  { code: '3', label: '대본사',  },
  { code: '4', label: '부본사',  },
  { code: '5', label: '총판', },
]
const subAgencies = [
  { code: '1', label: 'pgt01', },
  { code: '2', label: 'jangcp', },
  { code: '3', label: 'pgt02',  },
  { code: '4', label: 'pgt001',  },
  { code: '5', label: 'pgt002', },
]
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
]


const TABLE_HEAD = [
  { id: 'all', label: 'All Apply', align: 'left' },
  { id: 'name', label: 'Name', align: 'center' },
  { id: 'rolling', label: 'Rolling', align: 'center' },
  { id: 'losing', label: 'Losing', align: 'center' },
];


export default function PartnerNewEditForm({ isEdit = false, currentUser }) {
  const navigate = useNavigate();
  
  const [currentTab, setCurrentTab] = useState('one');

  const { enqueueSnackbar } = useSnackbar();

  const NewUserSchema = Yup.object().shape({
    id: Yup.string().required('Id is required'),
    password: Yup.string().required('Password is required'),
    nickName: Yup.string().required('NickName is required'),
    name: Yup.string().required('Name is required'),
    phoneNumber: Yup.string().required('Phone number is required'),
    agent: Yup.string().required('Agent is required'),
    bankInfo: Yup.string().required('Bank information is required'),
    exchangePassword: Yup.string().required('Exchange password is required'),
  });

  const defaultValues = useMemo(
    () => ({
      id: currentUser?.id || '',
      password: currentUser?.password || '',
      phoneNumber: currentUser?.phoneNumber || '',
      nickName: currentUser?.nickName || '',
      name: currentUser?.name || '',
      userLock: currentUser?.userLock || false,
      loginAvailable: currentUser?.loginAvailable || true,
      exchangePassword: currentUser?.exchangePassword,
      bankInfo: currentUser?.bankInfo || '',
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

  useEffect(() => {
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
      await new Promise((resolve) => setTimeout(resolve, 500));
      reset();
      enqueueSnackbar(!isEdit ? 'Create success!' : 'Update success!');
      navigate(PATH_DASHBOARD.user.list);
      console.log('DATA', data);
    } catch (error) {
      console.error(error);
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
                  <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                    Login Available
                  </Typography>
                }
                sx={{ mx: 0, width: 1, justifyContent: 'space-between' }}
              />
              
              <RHFSwitch
                name="userLock"
                labelPlacement="start"
                label={
                  <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                    User Lock
                  </Typography>
                }
                sx={{ mx: 0, width: 1, justifyContent: 'space-between' }}
              />
              <RHFTextField name="id" label="Id" />
              <RHFTextField name="password" label="Password" />
              <RHFTextField name="nickName" label="NickName" />
              <Stack 
                direction="row"
                alignItems="center"
                justifyContent="space-between" >
                <RHFSelect native name="agent" label="Upper Agent" placeholder="Upper Agent"  style={{width: "49%"}} >
                  <option value=""  />
                  {agencies.map((agent) => (
                    <option key={agent.code} value={agent.label}  >
                      {agent.label}
                    </option>
                  ))}
                </RHFSelect>
                <RHFSelect native name="subAgent" label="Sub Agent" placeholder="Sub Agent"  style={{width: "49%"}} >
                  <option value=""  />
                  {subAgencies.map((agent) => (
                    <option key={agent.code} value={agent.label}  >
                      {agent.label}
                    </option>
                  ))}
                </RHFSelect>
              </Stack>
              <RHFTextField name="name" label="Name" />
              <RHFTextField name="phoneNumber" label="Phone Number" />
              <RHFSelect native name="bankInfo" label="Bank Info" placeholder="Bank Info"  >
                <option value=""  />
                {banks.map((agent) => (
                  <option key={agent.code} value={agent.label}  >
                    {agent.label}
                  </option>
                ))}
              </RHFSelect>
              <RHFTextField name="exchangePassword" label="Exchange Password" />
            </Box>
            <Stack spacing={1}>
              <Typography variant="subtitle2" sx={{ color: 'text.secondary', pt:1 }}>
                Memo
              </Typography>

              <RHFEditor simple name="memo" />
            </Stack>
            <Stack alignItems="flex-end" sx={{ mt: 3 }}>
              <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                {!isEdit ? 'Create User' : 'Save Changes'}
              </LoadingButton>
            </Stack>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
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
        </Grid>
      </Grid>
    </FormProvider>
  );
}
