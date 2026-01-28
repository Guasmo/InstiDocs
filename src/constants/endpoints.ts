export const loginApi = "/auth/login";        // POST
export const registerApi = "/auth/register";  // POST

export const userApi = "/user";                // Base for user operations
export const createUserApi = "/user";          // POST
export const createAdminUserApi = "/user/admin"; // POST (Admin)
export const getUsersApi = "/user";            // GET
export const getAllUsersApi = "/user/admin/all"; // GET (Admin) - list all
export const getUserByIdApi = "/user";         // GET    /:id
export const updateUserApi = "/user";          // PATCH  /:id
export const deleteUserApi = "/user";          // DELETE /:id
export const getTeachersApi = "/user/teachers"; // GET

export const documentsApi = "/documents";      // GET, POST, DELETE
export const uploadDocumentApi = "/documents/upload"; // POST

export const uploadImageApi = "/upload/image";       // POST
export const deleteImageApi = "/upload/image";       // DELETE /:filename

export const coursesApi = "/courses";              // GET, POST, DELETE
