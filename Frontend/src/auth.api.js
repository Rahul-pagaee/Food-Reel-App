import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000",
  withCredentials: true,
});

const userLogin = async ({ email, password }) => {
  try {
    const response = await api.post(
      "/api/auth/user/login",
      { email, password },
      { withCredentials: true },
    );
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const userRegister = async ({ fullName, email, password }) => {
  try {
    const response = await api.post(
      "/api/auth/user/register",
      { fullName, email, password },
      { withCredentials: true },
    );
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const foodPartnerRegister = async ({
  name,
  contactName,
  phone,
  address,
  email,
  password,
}) => {
  try {
    const response = await api.post(
      "/api/auth/food-partner/register",
      {
        name,
        contactName,
        phone,
        address,
        email,
        password,
      },
      { withCredentials: true },
    );
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const foodPartnerLogin = async ({ email, password }) => {
  try {
    const response = await api.post(
      "/api/auth/food-partner/login",
      { email, password },
      { withCredentials: true },
    );
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const getAllFoods = async () => {
  try {
    const response = await api.get("/api/food", {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.log("Error fetching foods:", error);
    throw error;
  }
};


const createFoodItem = async (formData) => {
  try {
    const response = await api.post("/api/food", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.log("Error creating food item:", error);
    throw error;
  }
};

export {
  userLogin,
  foodPartnerRegister,
  userRegister,
  foodPartnerLogin,
  getAllFoods,
  createFoodItem,
};
