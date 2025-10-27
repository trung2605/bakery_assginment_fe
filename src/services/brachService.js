import axios from "axios";

const BASE_URL = "https://bakery-assginment-be.onrender.com/api/branches";

const branchService = {
  // Lấy toàn bộ danh sách chi nhánh
  getAllBranches: async () => {
    const response = await axios.get(BASE_URL);
    return response.data;
  },
};

export default branchService;
