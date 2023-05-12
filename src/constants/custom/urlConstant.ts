const ROOT_URL = process.env.REACT_APP_API_URL;

export const URL_CONSTANT = {
    CategoryMaster: {
        getAll: ROOT_URL + "/api/Category/GetAll",
        GetById: ROOT_URL + "/api/Category/GetById",
        DeleteData: ROOT_URL + "/api/Category/DeleteData",
        Insert: ROOT_URL + "/api/Category/Insert",
        Update: ROOT_URL + "/api/Category/Update",
    }



}