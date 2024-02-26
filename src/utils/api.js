import axios from "axios";
import {  useReducer,  } from 'react';
import { useNavigate } from 'react-router-dom';
// routes
import { PATH_DASHBOARD, PATH_AUTH } from '../routes/paths';

// config
import { HOST_API_SERVER, SECRET } from '../config-global';
//
import { isValidToken, setSession } from '../auth/utils';


export const apiWithPostData = async (url, params, headers) => {
    const config = {
        method: 'post',
        url: HOST_API_SERVER + url,
        headers: {
            'Content-Type': 'application/json', 
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': 'true',
            'authorization':localStorage.getItem('accessToken') || "",
            'token':SECRET.secretToken,
            'admin':'true',
            ...headers,
        },
        data: params,
    };
    
    try {
        const response = await axios(config);
        return response.data;
      } catch (error) {
        console.log("here>>>", error);
        if (error?.response && error?.response?.status === 401) {
            localStorage.clear();
            // eslint-disable-next-line react-hooks/rules-of-hooks
            const navigate = useNavigate();
            navigate(PATH_AUTH.login, { replace: true });
        }
        return error;
    }
}

export const apiWithGetData = async (url, data, headers) => {
    const config = {
        method: 'get',
        url: HOST_API_SERVER + url,
        headers: {
            'Content-Type': 'application/json', 
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': 'true',
            'authorization':localStorage.getItem('accessToken') || "",
            'token':SECRET.secretToken,
            'admin':'true',
            ...headers,
        },
        data
    };
    const response = await axios(config);
    return response.data;
}


export const apiWithPatchData = async (url, data, headers) => {
    const config = {
        method: 'patch',
        url: HOST_API_SERVER + url,
        headers: {
            'Content-Type': 'application/json', 
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': 'true',
            'authorization':localStorage.getItem('accessToken') || "",
            'token':SECRET.secretToken,
            'admin':'true',
            ...headers,
        },
        data
    };
    const response = await axios(config);
    return response.data;
}

export const apiWithPutData = async (url, data, headers) => {
    const config = {
        method: 'put',
        url: HOST_API_SERVER + url,
        headers: {
            'Content-Type': 'application/json', 
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': 'true',
            'authorization':localStorage.getItem('accessToken') || "",
            'token':SECRET.secretToken,
            'admin':'true',
            ...headers,
        },
        data
    };
    const response = await axios(config);
    return response.data;
}

export const apiWithDeleteData = async (url, data, headers) => {
    const config = {
        method: 'delete',
        url: HOST_API_SERVER + url,
        headers: {
            'Content-Type': 'application/json', 
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': 'true',
            'authorization':localStorage.getItem('accessToken') || "",
            'token':SECRET.secretToken,
            'admin':'true',
            ...headers,
        },
        data
    };
    const response = await axios(config);
    return response.data;
}