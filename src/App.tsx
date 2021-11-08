import { ConfigProvider } from '@douyinfe/semi-ui';
import { Suspense, useEffect } from 'react';
import { useSelector } from 'react-redux';

import { history, HistoryRouter } from '~/route/history';

import RenderRouter from './route';

const App: React.FC = () => {
  const { theme: _ } = useSelector(state => state.global);

  useEffect(() => {
    const mql = window.matchMedia('(prefers-color-scheme: dark)');

    function matchMode(e: MediaQueryListEvent) {
      const body = document.body;

      if (e.matches) {
        if (!body.hasAttribute('theme-mode')) {
          body.setAttribute('theme-mode', 'dark');
        }
      } else {
        if (body.hasAttribute('theme-mode')) {
          body.removeAttribute('theme-mode');
        }
      }
    }

    mql.addEventListener('change', matchMode);
  }, []);

  return (
    <ConfigProvider>
      <HistoryRouter history={history}>
        <Suspense fallback={<h1>Loading...</h1>}>
          <RenderRouter />
        </Suspense>
      </HistoryRouter>
    </ConfigProvider>
  );
};

export default App;
