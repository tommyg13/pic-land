import "./styles/index.css";
import { Navigate, Route, Routes } from "react-router-dom";

import Header from "./partials/Header";
import { routes } from "./utils/constants";
import GlobalMessageList from "./partials/GlobalMessageList";
import useStoreSelector from "./hooks/useStoreSelector";
import { PrivateRouteProps } from "./types";

const PrivateRoute = ({ children }: PrivateRouteProps) => {
  const user = useStoreSelector("auth.token", null);

  if (user) {
    return children;
  }

  return <Navigate to="/login" replace />;
};

const AuthRoute = ({ children }: PrivateRouteProps) => {
  const user = useStoreSelector("auth.token", null);

  if (user) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default function App() {
  return (
    <>
      <Header />
      <Routes>
        {routes.map((route) => (
          <Route
            key={route.path}
            path={route.path}
            element={
              route.requiresAuth ? (
                <PrivateRoute>{route.element}</PrivateRoute>
              ) : route.isAuth ? (
                <AuthRoute>{route.element}</AuthRoute>
              ) : (
                route.element
              )
            }
          />
        ))}
      </Routes>
      <GlobalMessageList />
    </>
  );
}
