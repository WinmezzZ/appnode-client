import Cookies from 'js-cookie';

const query = {
  api_ccenter_app: 'nodemgr',
  IgnoreDefaultFields: 'Y',
  api_csrf_token: Cookies.get('CSRFToken') || '',
};

export const socket = (url: string) => {
  const io = new WebSocket(`ws://47.101.33.221:8888/api?api_action=${url}&${new URLSearchParams(query)}`);

  return io;
};
