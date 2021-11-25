import {
  IconBell,
  IconExit,
  IconHelpCircleStroked,
  IconMoon,
  IconSetting,
  IconSun,
  IconUser,
} from '@douyinfe/semi-icons';
import { Button, Dropdown, Layout, Nav, Tooltip, Typography } from '@douyinfe/semi-ui';
import { NavItemProps } from '@douyinfe/semi-ui/lib/es/navigation';
import { FC, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router';

import { LayoutMainPage } from '~/components/layout-main-page';
import { panelData } from '~/config/data/panel';
import { setGlobalState } from '~/store/global.store';
import { getStrTimesIndex } from '~/utils/getStrTimesIndex';

const { Header } = Layout;
const { Title } = Typography;

const LayoutPage: FC = () => {
  const { theme } = useSelector(state => state.global);
  const dispatch = useDispatch();
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
    onClickNav(selectNavKey, 0, false);
  }, []);

  const onClickNav = (itemKey: string, level: number, jump = true) => {
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
      jump && navigate('/' + itemKey + '/' + menu[0].itemKey);

      return;
    }

    if (level === 1) {
      setSelectNavSideMenuKey(itemKey);
      const level1Url = '/' + selectNavKey;
      const level2Url = `/${itemKey}`;

      jump && navigate(level1Url + level2Url);
    }
  };

  const onSwitchTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';

    localStorage.setItem('theme', newTheme);
    dispatch(
      setGlobalState({
        theme: newTheme,
      }),
    );
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
              <Tooltip content={`切换到${theme === 'dark' ? '浅色' : '深色'}主题`}>
                <Button
                  onClick={onSwitchTheme}
                  theme="borderless"
                  icon={theme === 'light' ? <IconMoon size="large" /> : <IconSun size="large" />}
                  style={{
                    color: 'var(--semi-color-text-2)',
                    marginRight: '12px',
                  }}
                />
              </Tooltip>
              <Tooltip content="消息通知">
                <Button
                  theme="borderless"
                  icon={<IconBell size="large" />}
                  style={{
                    color: 'var(--semi-color-text-2)',
                    marginRight: '12px',
                  }}
                />
              </Tooltip>

              <Dropdown
                position="topLeft"
                render={
                  <Dropdown.Menu>
                    <Dropdown.Item icon={<IconSetting />}>设置</Dropdown.Item>
                    <Dropdown.Item icon={<IconHelpCircleStroked />}>帮助</Dropdown.Item>
                    <Dropdown.Divider />
                    <Dropdown.Item icon={<IconExit />} type="danger">
                      退出登录
                    </Dropdown.Item>
                  </Dropdown.Menu>
                }
              >
                <Button
                  theme="borderless"
                  icon={<IconUser size="large" />}
                  style={{
                    color: 'var(--semi-color-text-2)',
                  }}
                />
              </Dropdown>
            </Nav.Footer>
          </Nav>
        </div>
      </Header>
      <LayoutMainPage
        menu={navSideMenu}
        selectNavSideMenuKey={selectNavSideMenuKey}
        onClickMenu={e => onClickNav(e.itemKey as string, 1)}
        showWrpperStyle
      />
    </Layout>
  );
};

export default LayoutPage;
