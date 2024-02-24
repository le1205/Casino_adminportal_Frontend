import axios from "axios";

// config
import { HOST_API_SERVER, SECRET } from '../config-global';


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
    const response = await axios(config);
    return response.data;
}

export const apiWithGetData = async (url, data) => {
    const config = {
        method: 'get',
        url: HOST_API_SERVER + url,
        headers: {
            'Content-Type': 'application/json', 
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': 'true',
            'authorization':localStorage.getItem('accessToken') || "",
        },
        data
    };
    const response = await axios(config);
    return response.data;
}


export const apiWithPatchData = async (url, data) => {
    const config = {
        method: 'patch',
        url: HOST_API_SERVER + url,
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': 'true',
            'authorization':localStorage.getItem('accessToken') || "",
        },
        data
    };
    const response = await axios(config);
    return response.data;
}

export const apiWithPutData = async (url, data) => {
    const config = {
        method: 'put',
        url: HOST_API_SERVER + url,
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': 'true',
            'authorization':localStorage.getItem('accessToken') || "",
        },
        data
    };
    const response = await axios(config);
    return response.data;
}

export const apiWithDeleteData = async (url, data) => {
    const config = {
        method: 'delte',
        url: HOST_API_SERVER + url,
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': 'true',
            'authorization':localStorage.getItem('accessToken') || "",
        },
        data
    };
    const response = await axios(config);
    return response.data;
}