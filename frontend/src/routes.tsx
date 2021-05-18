import React, {
  ComponentType,
  Fragment,
  ReactElement,
  Suspense,
  lazy,
} from "react";
import { Redirect, Route, Switch } from "react-router";

import GuestGuard from "./guards/GuestGuard";
import SplashScreen from "./components/SplashScreen";

interface IRoute {
  exact?: boolean;
  path?: string | string[];
  guard?: ComponentType;
  layout?: ComponentType;
  component?: ComponentType;
  routes?: IRoute[];
}

export function renderRoutes(routes: IRoute[] = []): ReactElement {
  return (
    <Suspense fallback={<SplashScreen />}>
      <Switch>
        {routes.map((route, i) => {
          const Guard = route.guard || Fragment;
          const Layout = route.layout || Fragment;
          const Component: any = route.component || Fragment;

          return (
            <Route
              key={i}
              path={route.path}
              exact={route.exact ?? true}
              render={(props) => (
                <Guard>
                  <Layout>
                    {route.routes ? (
                      renderRoutes(route.routes)
                    ) : (
                      <Component {...props} />
                    )}
                  </Layout>
                </Guard>
              )}
            />
          );
        })}
      </Switch>
    </Suspense>
  );
}

export const routesDict = {
  login: "/login",
  register: "/register",
  app: {
    path: "/app",
  },
};

export const routes: IRoute[] = [
  {
    path: routesDict.login,
    guard: GuestGuard,
    component: lazy(() => import("./views/auth/Login")),
  },
  {
    path: routesDict.register,
    guard: GuestGuard,
    component: lazy(() => import("./views/auth/Register")),
  },
  {
    exact: false,
    path: "*",
    component: (): ReactElement => <Redirect to={routesDict.login} />,
  },
];
