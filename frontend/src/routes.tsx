import React, {
  ComponentType,
  Fragment,
  ReactElement,
  Suspense,
  lazy,
} from "react";
import { Redirect, Route, Switch } from "react-router";

import AdminGuard from "./guards/AdminGuard";
import AuthGuard from "./guards/AuthGuard";
import GuestGuard from "./guards/GuestGuard";
import LoadingIndicator from "./components/LoadingIndicator";
import MainLayout from "./layouts/MainLayout";

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
    <Suspense fallback={<LoadingIndicator />}>
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
      addFromDonation: (id: string) =>
        `/main/receipts/addReceiptFromDonation/${id}`,
    },
    adminDonations: {
      path: "/main/adminDonations",
    },
    adminReceipts: {
      path: "/main/adminReceipts",
    },
    events: {
      path: "/main/events",
      create: "/main/events/create",
      edit: (id: string) => `/main/events/edit/${id}`,
    },
    privileges: {
      path: "/main/privileges",
      create: "/main/privileges/create",
      edit: (id: string) => `/main/privileges/edit/${id}`,
    },
    myPrivileges: {
      path: "/main/myPrivileges",
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
        path: routesDict.main.events.path,
        component: lazy(() => import("./views/events/EventsView")),
      },
      {
        path: routesDict.main.events.path,
        guard: AdminGuard,
        component: lazy(() => import("./views/events/EventsView")),
      },
      {
        path: routesDict.main.events.create,
        guard: AdminGuard,
        component: lazy(() => import("./views/events/CreateEventView")),
      },
      {
        path: routesDict.main.events.edit(":id"),
        guard: AdminGuard,
        component: lazy(() => import("./views/events/EditEventView")),
      },
      {
        path: routesDict.main.myPrivileges.path,
        component: lazy(() => import("./views/myPrivileges/MyPrivilegesView")),
      },
      {
        path: routesDict.main.privileges.path,
        guard: AdminGuard,
        component: lazy(() => import("./views/privileges/PrivilegesView")),
      },
      {
        path: routesDict.main.privileges.create,
        guard: AdminGuard,
        component: lazy(() => import("./views/privileges/CreatePrivilegeView")),
      },
      {
        path: routesDict.main.privileges.edit(":id"),
        guard: AdminGuard,
        component: lazy(() => import("./views/privileges/EditPrivilegeView")),
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
        guard: AdminGuard,
        component: lazy(() => import("./views/admin/AdminDonationsView")),
      },
      {
        path: routesDict.main.adminReceipts.path,
        guard: AdminGuard,
        component: lazy(() => import("./views/admin/AdminReceiptsView")),
      },
      {
        path: routesDict.main.donations.add,
        guard: AdminGuard,
        component: lazy(() => import("./views/donations/AddDonation")),
      },
      {
        path: routesDict.main.receipts.add,
        guard: AdminGuard,
        component: lazy(() => import("./views/receipts/AddReceipt")),
      },
      {
        path: routesDict.main.receipts.addFromDonation(":id"),
        guard: AdminGuard,
        component: lazy(
          () => import("./views/receipts/AddReceiptFromDonation")
        ),
      },
    ],
  },
  {
    exact: false,
    path: "*",
    component: (): ReactElement => <Redirect to={routesDict.main.path} />,
  },
];
