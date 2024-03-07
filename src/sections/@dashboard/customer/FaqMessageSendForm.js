import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useEffect, useMemo, useState } from 'react';
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
import { adminListUrl, createUserNofiUrl, userNofiUrl } from '../../../utils/urlList';
// utils
import {parseJson } from '../../../auth/utils';

// ----------------------------------------------------------------------

FaqMessageSendForm.propTypes = {
  userOptions: PropTypes.array,
  currentUser: PropTypes.object,
  onSelectCancel:PropTypes.func,
  onCreateSuccess:PropTypes.func,
};

const loginUser = parseJson(localStorage.getItem('user') || "");

export default function FaqMessageSendForm({ currentUser, onSelectCancel, onCreateSuccess, userOptions }) {
  const { translate } = useLocales();
  const { enqueueSnackbar } = useSnackbar();
  const [isComplete, setIsComplete] = useState(false);

  const NewMessageSchema = Yup.object().shape({
    title: Yup.string().required('Title is required'),
    content: Yup.string().required('Content is required'),
  });
  console.log("here", currentUser);
  console.log("userOptions", userOptions);

  const defaultValues = useMemo(
    () => ({
      title: '',
      user: currentUser?._id || '',
      content: '',
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentUser]
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


  const onSubmit = async (data) => {
    try {
      const url = createUserNofiUrl;
      const headers = {};
      const body = {
        title: data?.title || "",
        userId: data?.user || loginUser._id,
        status: "reading",
        des: data?.content || "",
        type: 1,
      };
      apiWithPostData(url, body, headers).then((response) => {
        reset();
        setIsComplete(false);
        enqueueSnackbar('보내기 성공!');
        onCreateSuccess(response);
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

              <RHFSelect native name="user" label={`${translate('user')}`} placeholder={`${translate('user')}`}  >
                {userOptions.map((element) => (
                  <option key={element.value} value={element.value}  >
                    {element.label}
                  </option>
                ))}
              </RHFSelect>
              
              <Stack spacing={1}>
                <Typography variant="subtitle2" sx={{ color: 'text.secondary', pt:1 }}>
                  내용
                </Typography>
                <RHFEditor simple name="content" />
              </Stack>
            </Box>
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
