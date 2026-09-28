import { userLogin, foodPartnerRegister, userRegister,foodPartnerLogin } from "../auth.api";

export const userLoginHandler = async ({ email, password }) => {
  console.log(email, password);
  try {
    const data = await userLogin({ email, password });

    console.log(data);
    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const userRegisterHandler = async({fullName,email,password})=>{
  try{
    const data = await userRegister({fullName,email,password})
    return data;
  }catch(error){
console.log(error)
throw error
  }

}

export const foodPartnerRegisterHandler = async ({
  name,
  contactName,
  phone,
  address,
  email,
  password,
}) => {
   console.log(name,contactName,phone,address,email,password)

  try {
    const data = await foodPartnerRegister({
      name,
      contactName,
      phone,
      address,
      email,
      password,
    });
    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};


export const foodPartnerLoginHandler = async({email,password})=>{
try{
  const data = await foodPartnerLogin({email,password})
  return data
}catch(error){
  console.log(error)
  throw error
}}