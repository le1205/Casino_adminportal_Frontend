import axios from "axios";

// config
import { HOST_API_SERVER } from '../config-global';


export const apiWithPostData = async (url, params) => {
    const config = {
        method: 'post',
        url: HOST_API_SERVER + url,
        headers: {
            'Content-Type': 'application/json', 
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': 'true',
            'authorization':'0040544dd65352c2bf9c74f4d9b44099',
            'token':'C74fWJQNre8g8xoxyo0a3zIMdXHKPESZ',
            'admin':'true',
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
        },
        data
    };
    const response = await axios(config);
    return response.data;
}