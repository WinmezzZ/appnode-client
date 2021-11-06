import { lazy, FC } from 'react';
import LoginPage from '~/views/user/login';
import { RouteObject, useRoutes } from 'react-router-dom';

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
        path: 'dashboard',
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