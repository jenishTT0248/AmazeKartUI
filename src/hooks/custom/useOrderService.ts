import { URL_CONSTANT } from '../../constants/custom/urlConstant';
import useCommonHttpService from './useCommonHttpService';

export default function useOrderService() {
    const { httpGet, httpPost } = useCommonHttpService();

    async function getAllAction() {
        const response: any = await httpGet(URL_CONSTANT.Order.GetAll, null);
        return response.data;
    }

    async function deleteAction(obj: any) {
        const response: any = await httpGet(URL_CONSTANT.Order.DeleteData, obj);
        return response.data;
    }

    return { getAllAction, deleteAction };
}