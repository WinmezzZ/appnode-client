import { Layout, Nav, Skeleton } from '@douyinfe/semi-ui';
import { NavItems, NavProps } from '@douyinfe/semi-ui/lib/es/navigation';
import { FC, Suspense } from 'react';
import { Outlet } from 'react-router-dom';

const { Sider, Content } = Layout;

interface LayoutMainPageProps<T> {
  menu?: T;
  selectNavSideMenuKey: string;
  onClickMenu?: NavProps['onClick'];
  showWrpperStyle?: boolean;
}

type ShouldKeyRequid<T> = T extends NavItems
  ? LayoutMainPageProps<T>
  : Omit<LayoutMainPageProps<T>, 'selectNavSideMenuKey'>;

export const LayoutMainPage = <T extends NavItems | undefined>(props: ShouldKeyRequid<T>) => {
  const { menu, onClickMenu, showWrpperStyle } = props;

  return (
    <Layout>
      {menu && (
        <Sider style={{ backgroundColor: 'var(--semi-color-bg-1)' }}>
          <Nav
            onClick={onClickMenu}
            style={{ maxWidth: 190, height: '100%' }}
            items={menu}
            defaultSelectedKeys={[props.selectNavSideMenuKey]}
            footer={{
              collapseButton: true,
            }}
          />
        </Sider>
      )}
      <Content
        style={
          showWrpperStyle
            ? {
                padding: '24px',
                backgroundColor: 'var(--semi-color-bg-0)',
              }
            : {}
        }
      >
        <div
          style={
            showWrpperStyle
              ? {
                  borderRadius: '10px',
                  border: '1px solid var(--semi-color-border)',
                  height: '376px',
                  padding: '32px',
                }
              : {}
          }
        >
          <Suspense
            fallback={
              <Skeleton placeholder={<Skeleton.Paragraph rows={2} />} loading={true}>
                <p>Hello World</p>
              </Skeleton>
            }
          >
            <Outlet />
          </Suspense>
        </div>
      </Content>
    </Layout>
  );
};

(LayoutMainPage as FC<LayoutMainPageProps<any>>).defaultProps = {
  showWrpperStyle: false,
};
