import { FC, lazy } from 'react';
import { Navigate, RouteObject, useRoutes } from 'react-router-dom';

import LoginPage from '~/views/user/login';

const LayoutPage = lazy(() => import('~/views/index'));
const NodeManageNodeListPage = lazy(() => import('~/views/nodemgr'));

const routeList: RouteObject[] = [
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/',
    element: <LayoutPage />,
    children: [
      {
        path: '',
        element: <Navigate to="/nodemgr" />,
      },
      {
        path: 'nodemgr',
        element: <Navigate to="/nodemgr/list" />,
      },
      {
        path: 'nodemgr/list',
        element: <NodeManageNodeListPage />,
      },

      {
        path: '*',
        element: <h1>404</h1>,
      },
    ],
  },
];

const RenderRouter: FC = () => {
  const element = useRoutes(routeList);

  return element;
};

export default RenderRouter;
