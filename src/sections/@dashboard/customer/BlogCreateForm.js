import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useEffect, useMemo, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import { Box, Card, Grid, Stack, Typography, Button, } from '@mui/material';
// locales
import { useLocales } from '../../../locales';

import { useSnackbar } from '../../../components/snackbar';
import Image from '../../../components/image';
import LoadingScreen from '../../../components/loading-screen';
import FormProvider, {
  RHFSwitch,
  RHFTextField,
  RHFUpload,
} from '../../../components/hook-form';
// api
import { apiWithPostData, apiWithPutData, apiWithUploadData } from '../../../utils/api';
// url
import { popupNofiUrl, fileUploadUrl, userNofiUrl } from '../../../utils/urlList';
// utils
import {parseJson } from '../../../auth/utils';

import recommendImage from '../../../assets/images/logo/recommend.png';

// ----------------------------------------------------------------------

BlogCreateForm.propTypes = {
  isEdit: PropTypes.bool,
  currentMessage: PropTypes.object,
  onSelectCancel:PropTypes.func,
  onUpdateSuccess:PropTypes.func,
  onCreateSuccess:PropTypes.func,
};

const loginUser = parseJson(localStorage.getItem('user') || "");

export default function BlogCreateForm({isEdit, currentMessage, onSelectCancel, onUpdateSuccess, onCreateSuccess }) {
  const { translate } = useLocales();
  const { enqueueSnackbar } = useSnackbar();
  const [imageUrl, setImageUrl] = useState(currentMessage?.image);
  const [isLoading, setIsLoading] = useState(false);

  const NewMessageSchema = Yup.object().shape({
    title: Yup.string().required('Title is required'),
    image: Yup.string().required('Image is required'),
  });

  const defaultValues = useMemo(
    () => ({
      title: currentMessage?.title || '',
      image: currentMessage?.image || '',
      status: currentMessage?.status === 'show',
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
    setValue,
    formState: { isSubmitting },
  } = methods;
  

  useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentMessage]);
  

  const onSubmit = async (data) => {
    try {
      if(isEdit) {
          // eslint-disable-next-line no-unsafe-optional-chaining
        const url = `${popupNofiUrl  }/${  currentMessage?._id}`;
        const headers = {};
        const body = {
          title: data?.title || "",
          status: data?.status ? 'show' : 'hide',
          des: data?.content || "",
          image: imageUrl,
        };
        apiWithPutData(url, body, headers).then((response) => {
          enqueueSnackbar('수정 성공!');
          onUpdateSuccess(response);
        });
      }
      else {
        const url = popupNofiUrl;
        const headers = {};
        const body = {
          title: data?.title || "",
          userId: data?.user || loginUser._id,
          status: data?.status ? 'show' : 'hide',
          des: data?.content || "",
          image: imageUrl,
        };
        apiWithPostData(url, body, headers).then((response) => {
          reset();
          enqueueSnackbar('추가 성공!');
          onCreateSuccess(response);
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleDrop = useCallback(
    (acceptedFiles) => {
      const file = acceptedFiles[0];
      if(file) {
        const fileUrl = fileUploadUrl;
        const fromData = new FormData();
        fromData.append('files', file);
        setIsLoading(true);
        try{
          apiWithUploadData(fileUrl, fromData, {}).then((response) => {
            setIsLoading(false);
            const {data} = response;
            setImageUrl(data?.url);
          });

        }
        catch(error) {
          console.log(error);
          setIsLoading(false);
        }
      }
      const newFile = Object.assign(file, {
        preview: URL.createObjectURL(file),
      });

      if (file) {
        setValue('image', newFile, { shouldValidate: true });
      }
    },
    [setValue]
  );
  
  const handleRemoveFile = () => {
    setValue('image', null);
  };

  return (
  <>
  <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
    <Grid container spacing={3} >
      <Grid item xs={12} md={12}>
        <Card sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ color: 'text.secondary', pb:2}}>
            게시판 추가
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
              
            <RHFSwitch
              name="status"
              label="상태"
              labelPlacement="start"
              sx={{ mb: 1, mx: 0, width: 1, justifyContent: 'space-between' }}
            />
            

            <Stack spacing={1}>
              <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
                이미지 선택
              </Typography>

              <RHFUpload
                name="image"
                maxSize={3145728}
                onDrop={handleDrop}
                onDelete={handleRemoveFile}
              />
            </Stack>

            <Stack spacing={1}>
              {/* <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
               크기는 430 * 640(.png)입니다.
              </Typography> */}
              {/* <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
                아래 일러스트 이미지입니다.
              </Typography> */}

              {/* <Image
                src={recommendImage}
                sx ={{width:430,}}
              /> */}
            </Stack>
          </Box>
          <Stack direction="row" justifyContent='flex-end' spacing={2}  sx={{ mt: 3, textAlign: 'right'}}>
            {isEdit && 
              <Button type='submit' variant="contained" color="success">
                {`${translate('change')}`}
              </Button>
            }
            {!isEdit && 
            <Button type='submit' variant="contained" color="success">
              확인
            </Button>
            }
            
            <Button onClick={onSelectCancel} variant="contained" color="warning">
              {`${translate('cancel')}`}
            </Button>
          </Stack>
        </Card>
      </Grid>
    </Grid>
  </FormProvider>
  
  {(isLoading === true) && <LoadingScreen/>} 

  </>
  );
}
