import { createBrowserRouter } from "react-router-dom";
import UserLogin from "./pages/UserLogin.jsx";
import UserRegister from "./pages/UserRegister.jsx";
import PartnerLogin from "./pages/PartnerLogin.jsx";
import PartnerRegister from "./pages/PartnerRegister.jsx";
import Home from "./generals/Home.jsx";
import Saved from "./generals/Saved.jsx";
import CreateFood from "./food-partner/CreateFood.jsx";
import Profile from "./food-partner/Profile.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/saved",
    element: <Saved />,
  },
  {
    path: "/user/login",
    element: <UserLogin />,
  },
  {
    path: "/user/register",
    element: <UserRegister />,
  },
  {
    path: "/partner/login",
    element: <PartnerLogin />,
  },
  {
    path: "/partner/register",
    element: <PartnerRegister />,
  },
  {
    path: "/create-food",
    element: <CreateFood />,
  },
  {
    path: "/food-partner",
    element: <Profile />,
  },
  {
    path: "/food-partner/profile/:id",
    element: <Profile />,
  },
]);

export default router;
