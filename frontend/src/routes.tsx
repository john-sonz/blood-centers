import React, {
  ComponentType,
  Fragment,
  ReactElement,
  Suspense,
  lazy,
} from "react";
import { Redirect, Route, Switch } from "react-router";

import AuthGuard from "./guards/AuthGuard";
import GuestGuard from "./guards/GuestGuard";
import MainLayout from "./layouts/MainLayout";
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
  main: {
    path: "/main",
    messages: {
      path: "/main/messages",
      send: (id: string) => `/main/messages/send/${id}`,
    },
    donations: {
      path: "/main/donations",
      add: "/main/donations/addDonation",
    },
    receipts: {
      path: "/main/receipts",
      add: "/main/receipts/addReceipt",
      addFromDonation: (id: string) => `/main/receipts/addReceiptFromDonation/${id}`
    },
    adminDonations: {
      path: "/main/adminDonations",
    },
    adminReceipts: {
      path: "/main/adminReceipts",
    },
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
    path: routesDict.main.path,
    exact: false,
    guard: AuthGuard,
    layout: MainLayout,
    routes: [
      {
        path: routesDict.main.messages.path,
        component: lazy(() => import("./views/messages/MessagesView")),
      },
      {
        path: routesDict.main.messages.send(":id"),
        component: lazy(() => import("./views/messages/SendMessageView")),
      },
      {
        path: routesDict.main.path,
        component: lazy(() => import("./views/main/MainView")),
      },
      {
        path: routesDict.main.donations.path,
        component: lazy(() => import("./views/donations/DonationsView")), 
      },
      {
        path: routesDict.main.receipts.path,
        component: lazy(() => import("./views/receipts/ReceiptsView")), 
      },
      {
        path: routesDict.main.adminDonations.path,
        component: lazy(() => import("./views/admin/AdminDonationsView")), 
      },
      {
        path: routesDict.main.adminReceipts.path,
        component: lazy(() => import("./views/admin/AdminReceiptsView")), 
      },
      {
        path: routesDict.main.donations.add,
        component: lazy(() => import("./views/donations/AddDonation")), 
      },
      {
        path: routesDict.main.receipts.add,
        component: lazy(() => import("./views/receipts/AddReceipt")), 
      },
      {
        path: routesDict.main.receipts.addFromDonation(":id"),
        component: lazy(() => import("./views/receipts/AddReceiptFromDonation")), 
      },
    ],
  },
  {
    exact: false,
    path: "*",
    component: (): ReactElement => <Redirect to={routesDict.main.path} />,
  },
];
