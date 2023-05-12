const ROOT_URL = process.env.REACT_APP_API_URL;

export const URL_CONSTANT = {
  CategoryMaster: {
    getAll: ROOT_URL + '/api/Category/GetAll',
    GetById: ROOT_URL + '/api/Category/GetById',
    DeleteData: ROOT_URL + '/api/Category/DeleteData',
    SaveData: ROOT_URL + '/api/Category/SaveData',
  },
  CustomerMaster: {
    getAll: ROOT_URL + '/api/Customer/GetAll',
    GetById: ROOT_URL + '/api/Customer/GetById',
    DeleteData: ROOT_URL + '/api/Customer/DeleteData',
    SaveData: ROOT_URL + '/api/Customer/SaveData',
  },
};
