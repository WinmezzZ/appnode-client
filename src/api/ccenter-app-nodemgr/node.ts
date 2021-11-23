import { useEffect } from 'react';

import { ApiNodeListParams, NodeList, PerformanceResult } from '~/interface/ccenter-app-nodemgr/node.interface';

import { request } from '../request';
import { SocketEffect, useSocket } from '../socket';

/** 桌面菜单接口 */
export const apiNodeList = (data: ApiNodeListParams) =>
  request<ApiNodeListResult>('get', 'Node.List', { ...data, api_ccenter_app: 'nodemgr' });

interface ApiNodeListResult {
  NodeList: NodeList;
  PageCount: number;
  PageNumber: number;
  PageSize: number;
  ShowIndex: {
    next: number;
    prev: number;
  };
  TotalCount: number;
}

export const usePerformance: SocketEffect<PerformanceResult, { nodeIds: string[] }> = (cb, { nodeIds }) => {
  const socket = useSocket(
    'Node.SubscribePerformance',
    {
      api_ccenter_app: 'nodemgr',
    },
    {
      onMessage: e => {
        cb(JSON.parse(e.data));
      },
    },
  );

  useEffect(() => {
    if (!nodeIds.length) return;
    socket.sendJsonMessage({ a: 'watch', d: { NodeId: nodeIds } });
    socket.sendJsonMessage({
      a: 'subscribe',
      d: {
        Performance: [
          'CPUUseRate',
          'MemUsed',
          'MemTotal',
          'MemUseRate',
          'RXSpeed',
          'TXSpeed',
          'DiskUsed',
          'DiskTotal',
          'DiskUseRate',
        ],
      },
    });
  }, [nodeIds]);

  return socket;
};
