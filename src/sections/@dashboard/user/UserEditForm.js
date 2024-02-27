import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import { Box, Card, Grid, Stack, Typography, Button, } from '@mui/material';
// locales
import { useLocales } from '../../../locales';

import { useSnackbar } from '../../../components/snackbar';
import FormProvider, {
  RHFSelect,
  RHFSwitch,
  RHFTextField,
} from '../../../components/hook-form';
// api
import { apiWithPostData, apiWithPutData } from '../../../utils/api';
// url
import { adminListUrl, updateUserUrl, roleListUrl } from '../../../utils/urlList';
// utils
import {parseJson } from '../../../auth/utils';

// ----------------------------------------------------------------------

UserEditForm.propTypes = {
  isEdit: PropTypes.bool,
  currentUser: PropTypes.object,
  onSelectCancel:PropTypes.func,
  onUpdateSuccess:PropTypes.func,
};

const loginUser = parseJson(localStorage.getItem('user') || "");

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



export default function UserEditForm({ isEdit = true, currentUser, onSelectCancel, onUpdateSuccess }) {
  const navigate = useNavigate();
  const { translate } = useLocales();
  const { enqueueSnackbar } = useSnackbar();
  const [totalRole, setTotalRole] = useState([]);
  const [totalAgent, setTotalAgent] = useState([]);

  const NewUserSchema = Yup.object().shape({
    id: Yup.string().required('Id is required'),
    nickName: Yup.string().required('NickName is required'),
  });

  const defaultValues = useMemo(
    () => ({
      _id: currentUser?._id || '',
      id: currentUser?.id || '',
      password: currentUser?.password || '',
      nickName: currentUser?.nickName || '',
      exchangePassword: currentUser?.exchangePassword || '',
      eamil: currentUser?.email || '',
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
      withdrawRate: currentUser?.withdrawRate || '',
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
        results.forEach((item) => {
          if(parseInt(item?.order, 10) > parseInt(loginUser?.roleMain?.order, 10)) {
            const role = {
              name: item.name || '',
              order: item.order || '',
              title: item.title || '',
            }
            roles.push(role);
          }
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
      const url = updateUserUrl + currentUser._id;
      const headers = {};
      const body = {
        email: `${data?.id }@gmail.com` || "",
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
        liveRate: Number(data?.casinoRolling) || 0,
        slotRate: Number(data?.slotRolling) || 0,
        loseSlotRate: Number(data?.slotLoosing) || 0,
        loseLiveRate: Number(data?.casinoLoosing) || 0,
        withdrawRate: Number(data?.withdrawRate) || 0,
        role: data?.role || "user",
        agent: data?.agent || "",
        verify: data?.loginAvailable || true,
        status: data?.betAvailable || true,
      };
      apiWithPutData(url, body, headers).then((response) => {
        onUpdateSuccess(response);
        reset();
        enqueueSnackbar('갱신 성공!');
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={12}>
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
              <RHFTextField name="id" 
                inputProps={
                    { readOnly: true }
                } label={`${translate('id')}`} />
              <RHFTextField name="password" label={`${translate('password')}`} />
              <RHFTextField name="nickName" label={`${translate('nickName')}`} />
              <RHFTextField name="exchangePassword" label={`${translate('exchangePassword')}`}  />
              <RHFSelect native name="role" label={`${translate('role')}`} placeholder={`${translate('role')}`}  >
                <option value=""  />
                {totalRole.map((element) => (
                  <option key={element.order} value={element.title}  >
                    {element.name}
                  </option>
                ))}
              </RHFSelect>
              <RHFTextField name="withdrawRate" label={`${translate('withdrawRate')}`}  />
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
            <Stack direction="row" justifyContent='flex-end' spacing={2}  sx={{ mt: 3, textAlign: 'right'}}>
              <Button type='submit' variant="contained" color="success">
              {`${translate('change')}`}
              </Button>
              <Button onClick={onSelectCancel} variant="contained" color="warning">
              {`${translate('cancel')}`}
              </Button>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
