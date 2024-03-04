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
  RHFTextField,
  RHFEditor,
} from '../../../components/hook-form';
// api
import { apiWithPostData, apiWithPutData } from '../../../utils/api';
// url
import { adminListUrl, updateUserUrl, roleListUrl } from '../../../utils/urlList';
// utils
import {parseJson } from '../../../auth/utils';

// ----------------------------------------------------------------------

MessageCreateForm.propTypes = {
  isEdit: PropTypes.bool,
  currentUser: PropTypes.object,
  onSelectCancel:PropTypes.func,
  onUpdateSuccess:PropTypes.func,
};

const loginUser = parseJson(localStorage.getItem('user') || "");

export default function MessageCreateForm({ isEdit = true, currentUser, onSelectCancel, onUpdateSuccess }) {
  const navigate = useNavigate();
  const { translate } = useLocales();
  const { enqueueSnackbar } = useSnackbar();
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
        title: data?.title || "",
        user: data?.user || "",
        content: data?.content || "",
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
              columnGap={1}
              display="grid"
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                sm: 'repeat(1, 1fr)',
              }}
            >

              <RHFTextField name="title" 
                inputProps={
                    { readOnly: true }
                } label={`${translate('title')}`} />
              <RHFSelect native name="user" label={`${translate('user')}`} placeholder={`${translate('user')}`}  >
                <option value=""  />
                {totalAgent.map((element) => (
                  <option key={element.id} value={element.name}  >
                    {element.name}
                  </option>
                ))}
              </RHFSelect>
            </Box>
            <Stack spacing={1}>
              <Typography variant="subtitle2" sx={{ color: 'text.secondary', pt:1 }}>
                Content
              </Typography>

              <RHFEditor simple name="content" />
            </Stack>
            <Stack direction="row" justifyContent='flex-end' spacing={2}  sx={{ mt: 3, textAlign: 'right'}}>
              <Button type='submit' variant="contained" color="success">
                {`${translate('send')}`}
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
