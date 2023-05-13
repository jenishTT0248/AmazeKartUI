import { URL_CONSTANT } from '../../constants/custom/urlConstant';
import useCommonHttpService from './useCommonHttpService';

export default function usePaymentDetailService() {
  const { httpGet } = useCommonHttpService();

  async function getAllAction() {
    const response: any = await httpGet(URL_CONSTANT.PaymentDetailMaster.getAll, null);
    return response.data;
  }

  return { getAllAction };
}
