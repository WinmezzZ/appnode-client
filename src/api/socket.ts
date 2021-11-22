import Cookies from 'js-cookie';

const query = {
  api_ccenter_app: 'nodemgr',
  IgnoreDefaultFields: 'Y',
  api_csrf_token: Cookies.get('CSRFToken') || '',
  api_agent_app: 'sysinfo',
};

export const socket = (url: string, data = {}) => {
  const isDev = import.meta.env.DEV;
  const proxyPath = isDev ? '/socket' : '';
  const io = new WebSocket(
    `ws://${location.host}${proxyPath}/api?api_action=${url}&${new URLSearchParams(Object.assign(query, data))}`,
  );

  io.addEventListener('open', e => {
    console.log('websocket连接成功', e);
  });

  return io;
};
