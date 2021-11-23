// import Cookies from 'js-cookie';

// const query = {
//   IgnoreDefaultFields: 'Y',
//   api_csrf_token: Cookies.get('CSRFToken') || '',
// };

// interface SocketResponse<T> {
//   a: string;
//   d: T;
// }

// export const socket = <T>(url: string, params = {}, data: Record<string, any>[] = []) => {
//   return new Promise<SocketResponse<T>>(resolve => {
//     const isDev = import.meta.env.DEV;
//     const proxyPath = isDev ? '/socket' : '';
//     const io = new WebSocket(
//       `ws://${location.host}${proxyPath}/api?api_action=${url}&${new URLSearchParams(Object.assign(query, params))}`,
//     );

//     io.addEventListener('open', () => {
//       data.forEach(d => {
//         io.send(JSON.stringify(d));
//       });

//       io.onmessage = data => {
//         resolve(JSON.parse(data.data));
//       };
//     });
//   });
// };

import Cookies from 'js-cookie';
import useWebSocket, { Options } from 'react-use-websocket';

const commonQuery = {
  IgnoreDefaultFields: 'Y',
  api_csrf_token: Cookies.get('CSRFToken') || '',
};

export function useSocket(action: string, query: Record<string, any>, options: Options = {}) {
  const isDev = import.meta.env.DEV;
  const proxyPath = isDev ? '/socket' : '';
  const url = `ws://${location.host}${proxyPath}/api?api_action=${action}&${new URLSearchParams(
    Object.assign(commonQuery, query),
  )}`;
  const socket = useWebSocket(url, options);

  // options.onMessage = e => {
  //   return JSON.parse(e.data);
  // };

  return socket;
}

interface SocketResponse<T> {
  a: string;
  d: T;
}

export interface SocketEffect<Res, Req> {
  (callback: (res: SocketResponse<Res>) => void, query: Req, options?: Options): void;
}
