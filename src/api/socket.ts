import Cookies from 'js-cookie';

const query = {
  api_ccenter_app: 'nodemgr',
  IgnoreDefaultFields: 'Y',
  api_csrf_token: Cookies.get('CSRFToken') || '',
};

export const socket = (url: string) => {
  const io = new WebSocket(`ws://${location.host}/socket/api?api_action=${url}&${new URLSearchParams(query)}`);

  return io;
};
