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
import { noticeNofiUrl } from '../../../utils/urlList';
// utils
import {parseJson } from '../../../auth/utils';

// ----------------------------------------------------------------------

FaqCreateForm.propTypes = {
  currentMessage: PropTypes.object,
  onSelectSend:PropTypes.func,
  onSelectCancel:PropTypes.func,
  onUpdateSuccess:PropTypes.func,
  onSendSuccess:PropTypes.func,
};

const loginUser = parseJson(localStorage.getItem('user') || "");

export default function FaqCreateForm({currentMessage, onSelectCancel, onUpdateSuccess, onSendSuccess, onSelectSend }) {
  const { translate } = useLocales();
  const { enqueueSnackbar } = useSnackbar();
  const [isChange, setIsChange] = useState(false);

  const NewMessageSchema = Yup.object().shape({
    replyDes: Yup.string().required('Reply is required'),
  });

  const defaultValues = useMemo(
    () => ({
      title: currentMessage?.title || '',
      user: currentMessage?.user || '',
      content: currentMessage?.des || '',
      replyDes: currentMessage?.replyDes || '',
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
  

  useEffect(() => {
    if (currentMessage) {
      reset(defaultValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentMessage]);
  

  const onSubmit = async (data) => {
    try {
      if(isChange) {
        // eslint-disable-next-line no-unsafe-optional-chaining
        const url = noticeNofiUrl + currentMessage?._id;
        const headers = {};
        const body = {
          replyTitle: 'reply',
          replyDes: data?.replyDes || "",
        };
        apiWithPutData(url, body, headers).then((response) => {
          enqueueSnackbar('수정 성공!');
          onUpdateSuccess(response);
        });
      }
      else {
        // eslint-disable-next-line no-unsafe-optional-chaining
        const url = noticeNofiUrl + currentMessage?._id;
        const headers = {};
        const body = {
          replyTitle: 'reply',
          replyDes: data?.replyDes || "",
        };
        apiWithPutData(url, body, headers).then((response) => {
          enqueueSnackbar('보내기 성공!');
          onSendSuccess(response);
        });
      }
    } catch (error) {
      console.log(error);
    }
  };
  
  const onSelectChange = () => {
    setIsChange(true);
  };
  
  const onSelectReply = () => {
    setIsChange(false);
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={12}>
          <Card sx={{ p: 3 }}>
            {/* <Typography variant="h6" sx={{ color: 'text.secondary', pb:2}}>
              쪽지 보내기
            </Typography> */}
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
              <Stack spacing={1}>
                <RHFEditor simple readOnly name="content" />
              </Stack>
              <Stack spacing={1}>
                <Typography variant="subtitle2" sx={{ color: 'text.secondary', pt:1 }}>
                  답변
                </Typography>
                <RHFEditor simple name="replyDes" />
              </Stack>
            </Box>
            <Stack direction="row" justifyContent='flex-end' spacing={2}  sx={{ mt: 3, textAlign: 'right'}}>
              <Button variant="contained" color="success" onClick={onSelectSend}>
                쪽지보내기
              </Button>
              <Button type='submit' variant="contained" color="success" onClick={onSelectReply}>
                답변
              </Button>
              <Button type='submit' variant="contained" color="success" onClick={onSelectChange}>
                수정
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
