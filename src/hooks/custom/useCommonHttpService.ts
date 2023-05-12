import { useNavigate } from 'react-router-dom';

//import { authService } from './authService';

export default function useCommonHttpService() {
    const navigate = useNavigate();

    async function httpGet(requestURL: any, parameters: any) {
        // const accessToken = await authService.getAccessToken();
        return new Promise((resolve, reject) => {

            const options = {
                method: 'get',
                // headers: {
                //     'content-type': 'application/json; charset=UTF-8',
                //     'Authorization': `Bearer ${accessToken}` //need to change the auth token
                // }
            };
            if (parameters && typeof (parameters) === "object") {
                Object.keys(parameters).forEach((property) => {
                    requestURL += requestURL.indexOf('?') > -1 ? "&" : "?";
                    requestURL += `${property}=${encodeURIComponent(parameters[property])}`;
                });
            }

            fetch(requestURL, options)
                .then(async (response) => {
                    const data = await response.json();
                    if (!response.ok) {
                        // get error message from body or default to response statusText
                        const error = (data && data.message) || response.statusText;
                        navigate('/error', { state: { status: response.status } });
                        reject(error);
                    } else {
                        resolve(data);
                    }
                })
        })
    }

    async function httpPost(requestURL: any, requestBody: any) {
        // const accessToken = await authService.getAccessToken();
        return new Promise((resolve, reject) => {
            const options = {
                method: 'post',
                // headers: {
                //     'content-type': 'application/json; charset=UTF-8',
                //     'Authorization': `Bearer ${accessToken}` //need to change the auth token
                // },
                body: JSON.stringify(requestBody)
            }

            fetch(requestURL, options)
                .then(async response => {

                    const data = await response.json();

                    if (!response.ok) {
                        // get error message from body or default to response statusText
                        const error = (data && data.message) || response.statusText;
                        reject(error);
                        navigate('/error', { state: { status: response.status } });
                    } else {
                        resolve(data);
                    }

                });
        })
    }

    // async function httpFilePost(requestURL: any, fileData: any) {
    //     const accessToken = await authService.getAccessToken();
    //     return new Promise((resolve, reject) => {

    //         const options = {
    //             method: 'post',
    //             headers: {
    //                 'Accept': 'application/json',
    //                 'Authorization': `Bearer ${accessToken}` //need to change the auth token
    //             },
    //             body: fileData
    //         }

    //         fetch(requestURL, options)
    //             .then(async response => {

    //                 const data = await response.json();

    //                 if (!response.ok) {
    //                     // get error message from body or default to response statusText
    //                     const error = (data && data.Message) || response.statusText;
    //                     reject(error);
    //                     navigate('/error', { state: { status: response.status } });
    //                 } else {
    //                     resolve(data);
    //                 }

    //             });
    //     })
    // }

    // async function httpPut(requestURL: any, requestBody: any) {
    //     const accessToken = await authService.getAccessToken();
    //     return new Promise((resolve, reject) => {
    //         const options = {
    //             method: 'put',
    //             headers: {
    //                 'content-type': 'application/json; charset=UTF-8',
    //                 'Authorization': `Bearer ${accessToken}` //need to change the auth token
    //             },
    //             body: JSON.stringify(requestBody)
    //         }

    //         fetch(requestURL, options)
    //             .then(async response => {

    //                 const data = await response.json();

    //                 if (!response.ok) {
    //                     // get error message from body or default to response statusText
    //                     const error = (data && data.message) || response.statusText;
    //                     reject(error);
    //                     navigate('/error', { state: { status: response.status } });
    //                 } else {
    //                     resolve(data);
    //                 }

    //             });
    //     })
    // }
    //, , httpFilePost, httpPut
    return { httpGet, httpPost };
}
