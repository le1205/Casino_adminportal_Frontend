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
import { adminListUrl, createUserNofiUrl, noticeNofiUrl } from '../../../utils/urlList';
// utils
import {parseJson } from '../../../auth/utils';

// ----------------------------------------------------------------------

MessageCreateForm.propTypes = {
  isEdit: PropTypes.bool,
  currentMessage: PropTypes.object,
  onSelectCancel:PropTypes.func,
  onUpdateSuccess:PropTypes.func,
  onCreateSuccess:PropTypes.func,
};

const loginUser = parseJson(localStorage.getItem('user') || "");

export default function MessageCreateForm({isEdit, currentMessage, onSelectCancel, onUpdateSuccess, onCreateSuccess }) {
  const { translate } = useLocales();
  const { enqueueSnackbar } = useSnackbar();
  const [userOptions, setUserOptions] = useState([]);

  const NewMessageSchema = Yup.object().shape({
    title: Yup.string().required('Title is required'),
    content: Yup.string().required('Content is required'),
  });

  const defaultValues = useMemo(
    () => ({
      title: currentMessage?.title || '',
      user: currentMessage?.user || '',
      content: currentMessage?.des || '',
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentMessage]
  );

  const methods = useForm({
    resolver: yupResolver(NewMessageSchema),
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
        const userData = results
          .filter((val) => val.role.title === 'user')
          .map((item) => ({
            label: item.username,
            value: item._id,
            icon: ''
          }));
        setUserOptions([
          {
            label: '내 하위업체들의 모든 회원',
            value: loginUser._id,
            icon: ''
          },
          ...userData
        ]);
      });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if(!isEdit) {
      usersList();
    }
    if (isEdit && currentMessage) {
      reset(defaultValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentMessage]);
  

  const onSubmit = async (data) => {
    try {
      if(isEdit) {
        // eslint-disable-next-line no-unsafe-optional-chaining
        const url = noticeNofiUrl + currentMessage?._id;
        console.log(currentMessage?._id);
        const headers = {};
        const body = {
          replyTitle: data?.title || "",
          replyDes: data?.content || "",
        };
        apiWithPutData(url, body, headers).then((response) => {
          enqueueSnackbar('수정 성공!');
          onUpdateSuccess(response);
        });
      }
      else {
        const url = createUserNofiUrl;
        const headers = {};
        const body = {
          title: data?.title || "",
          userId: data?.user || loginUser._id,
          des: data?.content || "",
        };
        apiWithPostData(url, body, headers).then((response) => {
          reset();
          enqueueSnackbar('보내기 성공!');
          onCreateSuccess(response);
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={12}>
          <Card sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ color: 'text.secondary', pb:2}}>
              쪽지 보내기
            </Typography>
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
                    { readOnly: false }
                } label={`${translate('title')}`} />
              {isEdit === false && 
                <RHFSelect native name="user" label={`${translate('user')}`} placeholder={`${translate('user')}`}  >
                  {userOptions.map((element) => (
                    <option key={element.value} value={element.value}  >
                      {element.label}
                    </option>
                  ))}
                </RHFSelect>
              }
              <Stack spacing={1}>
                <Typography variant="subtitle2" sx={{ color: 'text.secondary', pt:1 }}>
                  내용
                </Typography>
                <RHFEditor simple name="content" />
              </Stack>
            </Box>
            <Stack direction="row" justifyContent='flex-end' spacing={2}  sx={{ mt: 3, textAlign: 'right'}}>
              <Button type='submit' variant="contained" color="success">
                {isEdit ? `${translate('change')}` : `${translate('send')}`}
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
