import { IconBell, IconHelpCircle } from '@douyinfe/semi-icons';
import { Avatar, Button, Layout, Nav, Skeleton, Typography } from '@douyinfe/semi-ui';
import { NavItemProps } from '@douyinfe/semi-ui/lib/es/navigation';
import { FC, Suspense, useEffect, useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router';

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
  const [selectNavKey, setSelectNavKey] = useState<string>(() => {
    const index0 = getStrTimesIndex(location.pathname, '/', 0);
    const index1 = getStrTimesIndex(location.pathname, '/', 1);
    const activeKey = location.pathname.slice(index0 + 1, index1 > 0 ? index1 : location.pathname.length);

    return activeKey;
  });
  const [navSideMenu, setNavSideMenu] = useState<NavItemProps[]>([]);

  const [selectNavSideMenuKey, setSelectNavSideMenuKey] = useState<string>(() => {
    const index1 = getStrTimesIndex(location.pathname, '/', 1);
    const index2 = getStrTimesIndex(location.pathname, '/', 2);
    const activeKey = location.pathname.slice(index1 + 1, index2 > 0 ? index1 : location.pathname.length);

    return activeKey;
  });

  useEffect(() => {
    onClickNav(selectNavKey, 0);
  }, []);

  const onClickNav = (itemKey: string, level: number) => {
    const panel = panelData.find(item => item.PanelCode === (level === 0 ? itemKey : selectNavKey));

    if (!panel) return;

    const menu = panel.Menus.map(item => ({
      text: item.name,
      itemKey: item.code,
      url: item.url,
    }));

    if (level === 0) {
      setSelectNavKey(itemKey);
      setNavSideMenu(menu);
      setSelectNavSideMenuKey(menu[0].itemKey);
      navigate('/' + itemKey);

      return;
    }

    if (level === 1) {
      setSelectNavSideMenuKey(itemKey);
      const level1Url = '/' + selectNavKey;
      const level2Url = `/${itemKey}`;

      navigate(level1Url + level2Url);
    }
  };

  return (
    <Layout style={{ border: '1px solid var(--semi-color-border)' }}>
      <Header style={{ backgroundColor: 'var(--semi-color-bg-1)' }}>
        <div>
          <Nav
            mode="horizontal"
            selectedKeys={[selectNavKey]}
            items={navItems}
            onClick={d => onClickNav(d.itemKey as string, 0)}
          >
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
            onClick={d => onClickNav(d.itemKey as string, 1)}
            style={{ maxWidth: 190, height: '100%' }}
            defaultSelectedKeys={[selectNavSideMenuKey]}
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
