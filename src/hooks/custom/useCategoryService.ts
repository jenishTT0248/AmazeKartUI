import { URL_CONSTANT } from '../../constants/custom/urlConstant';
import useCommonHttpService from './useCommonHttpService';

export default function useCategoryService() {
    const { httpGet, httpPost } = useCommonHttpService();

    async function getAllAction() {
        const response: any = await httpGet(URL_CONSTANT.CategoryMaster.getAll, null);
        return response.data;
    }

    async function getByIdAction(obj: any) {
        const response: any = await httpGet(URL_CONSTANT.CategoryMaster.GetById, obj);
        return response.data;
    }

    async function saveDataAction(obj: any) {
        const response: any = await httpPost(URL_CONSTANT.CategoryMaster.SaveData, obj);
        return response.data;
    }

    async function deleteAction(obj: any) {
        const response: any = await httpGet(URL_CONSTANT.CategoryMaster.DeleteData, obj);
        return response.data;
    }

    return { getAllAction, getByIdAction, saveDataAction, deleteAction };
}