import Category from "../pages/Category";
import Home from "../pages/Home";
import Image from "../pages/Image";
import Login from "../pages/auth/Login";
import { Route } from "../types";

export const routes: Route[] = [
  {
    path: "/",
    element: <Home />,
    requiresAuth: false,
  },
  {
    path: "/login",
    element: <Login />,
    requiresAuth: false,
    isAuth: true,
  },
  {
    path: "/categories/:category",
    element: <Category />,
    requiresAuth: false,
  },
  {
    path: "/images/:id",
    element: <Image />,
    requiresAuth: false,
  },
];
