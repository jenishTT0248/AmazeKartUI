import { URL_CONSTANT } from '../../constants/custom/urlConstant';
import useCommonHttpService from './useCommonHttpService';

export default function useLoginService() {
    const { httpPost } = useCommonHttpService();

    async function validateUserAction(reqObj: any) {
        const response: any = await httpPost(URL_CONSTANT.Login.ValidateUser, reqObj);
        return response.data;
    }

    return { validateUserAction };
}