import axios from "axios";

const BASE_URL = "http://localhost:8080/api/branches";

const branchService = {
  // Lấy toàn bộ danh sách chi nhánh
  getAllBranches: async () => {
    const response = await axios.get(BASE_URL);
    return response.data;
  },
};

export default branchService;
