import { FC, Suspense, useEffect, useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router';
import React from 'react';
import { Layout, Nav, Button, Breadcrumb, Skeleton, Avatar, Typography } from '@douyinfe/semi-ui';
import { IconBell, IconHelpCircle } from '@douyinfe/semi-icons';
import { NavItemProps, NavProps } from '@douyinfe/semi-ui/lib/es/navigation';
import { panelData } from '~/config/data/panel';
import { getStrTimesIndex } from '~/utils/getStrTimesIndex';

const { Header, Sider, Content } = Layout;
const { Title } = Typography;

const LayoutPage: FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const navItems: NavItemProps[] = panelData.map(item => ({
    text: item.PanelName,
    itemKey: item.PanelCode,
  }));
  const [selectKey, setSelectkey] = useState<React.ReactText>(() => {
    const index0 = getStrTimesIndex(location.pathname, '/', 0);
    const index1 = getStrTimesIndex(location.pathname, '/', 1);
    const activeKey = location.pathname.slice(index0 + 1, index1 > 0 ? index0 : location.pathname.length);

    return activeKey;
  });
  const [navSideMenu, setNavSideMenu] = useState<NavItemProps[]>([]);

  useEffect(() => {
    const panel = panelData.find(item => item.PanelCode === (selectKey as string));
    if (panel) {
      const menu = panel.Menus.map(item => ({
        text: item.name,
        itemKey: item.code,
        url: item.url,
      }));
      setNavSideMenu(menu);
      navigate(selectKey as string);
    }
  }, [selectKey]);

  const onClickNav: NavProps['onClick'] = ({ itemKey }) => {
    setSelectkey(itemKey);
  };

  return (
    <Layout style={{ border: '1px solid var(--semi-color-border)' }}>
      <Header style={{ backgroundColor: 'var(--semi-color-bg-1)' }}>
        <div>
          <Nav mode="horizontal" selectedKeys={[selectKey]} items={navItems} onClick={onClickNav}>
            <Nav.Header>
              <Title style={{ width: '100px' }} heading={3}>
                APPNODE
              </Title>
            </Nav.Header>

            <Nav.Footer>
              <Button
                theme="borderless"
                icon={<IconBell size="large" />}
                style={{
                  color: 'var(--semi-color-text-2)',
                  marginRight: '12px',
                }}
              />
              <Button
                theme="borderless"
                icon={<IconHelpCircle size="large" />}
                style={{
                  color: 'var(--semi-color-text-2)',
                  marginRight: '12px',
                }}
              />
              <Avatar color="orange" size="small">
                YJ
              </Avatar>
            </Nav.Footer>
          </Nav>
        </div>
      </Header>
      <Layout>
        <Sider style={{ backgroundColor: 'var(--semi-color-bg-1)' }}>
          <Nav
            style={{ maxWidth: 190, height: '100%' }}
            defaultSelectedKeys={['Home']}
            items={navSideMenu}
            footer={{
              collapseButton: true,
            }}
          />
        </Sider>
        <Content
          style={{
            padding: '24px',
            backgroundColor: 'var(--semi-color-bg-0)',
          }}
        >
          <Breadcrumb
            style={{
              marginBottom: '24px',
            }}
            routes={['首页', '当这个页面标题很长时需要省略', '上一页', '详情页']}
          />
          <div
            style={{
              borderRadius: '10px',
              border: '1px solid var(--semi-color-border)',
              height: '376px',
              padding: '32px',
            }}
          >
            <Suspense
              fallback={
                <Skeleton placeholder={<Skeleton.Paragraph rows={2} />} loading={true}>
                  <p>Hi, Bytedance dance dance.</p>
                  <p>Hi, Bytedance dance dance.</p>
                </Skeleton>
              }
            >
              <Outlet />
            </Suspense>
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default LayoutPage;
