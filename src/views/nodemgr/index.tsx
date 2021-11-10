import { Table } from '@douyinfe/semi-ui';
import Cookies from 'js-cookie';
import { FC, useEffect, useState } from 'react';
import { useEventSource } from 'react-use-websocket';

import { apiNodeList, NodeList } from '~/api/ccenter-app-nodemgr/node';
// import { socket } from '~/api/socket';

// const ws = socket('Node.SubscribePerformance');

// ws.addEventListener('error', e => {
//   console.log(ws);
//   console.log('err:', e);

//   ws.send(
//     JSON.stringify({
//       headers: {
//         Cookies: document.cookie,
//       },
//     }),
//   );
// });

// ws.addEventListener('connect', function (e) {
//   console.log('connected!', e);
//   ws.send(
//     JSON.stringify({
//       headers: {
//         Cookies: document.cookie,
//       },
//     }),
//   );
// });

// ws.addEventListener('open', () => {
//   console.log('WebSocket连接成功');
//   ws.send('{"a":"watch","d":{"NodeId":["9"]}}');

//   console.log('WebSocket连接成功11');
// });

// ws.onmessage = data => {
//   console.log(data);
// };

const columns = [
  {
    title: '节点名称',
    dataIndex: 'NodeName',
    width: 300,
  },
  {
    title: '分组',
    dataIndex: 'NodeGroupName',
    width: 200,
  },
  {
    title: '受控端',
    dataIndex: 'AgentConnStatus',
    width: 100,
  },
];

const query = {
  api_ccenter_app: 'nodemgr',
  IgnoreDefaultFields: 'Y',
  api_csrf_token: Cookies.get('CSRFToken') || '',
};

const NodeManageNodeListPage: FC = () => {
  const { lastEvent, getEventSource, readyState } = useEventSource(
    `wws://console.hyyar.com/api/?api_action=Node.SubscribePerformance&${new URLSearchParams(query)}`,
    {
      withCredentials: true,
      events: {
        open: e => {
          console.log('This has type "open": ', e);
        },
        message: messageEvent => {
          console.log('This has type "message": ', messageEvent);
        },
        update: messageEvent => {
          console.log('This has type "update": ', messageEvent);
        },
      },
    },
  );
  const [pageSize, setPageSize] = useState(20);
  const [pageNum, setPageNum] = useState(1);
  const [total, setTotal] = useState(0);
  const [nodeList, setNodeList] = useState<NodeList>([]);
  const [loading, setLoading] = useState(false);

  console.log(lastEvent);
  console.log(getEventSource);
  console.log(readyState);

  const getData = async (currentPage = pageNum, currentSize = pageSize) => {
    setLoading(true);
    const res = await apiNodeList({
      _pageNumber: currentPage,
      _pageSize: currentSize,
    });

    setLoading(false);

    if (res.CODE === 'ok') {
      setNodeList(res.DATA.NodeList);
      setTotal(res.DATA.TotalCount);
    }
  };

  const onChange = (currentPage: number, pageSize: number) => {
    setPageNum(currentPage);
    setPageSize(pageSize);
    getData(currentPage);
  };

  useEffect(() => {
    getData();
  }, [pageSize, pageNum]);

  return (
    <div>
      <Table
        resizable
        bordered
        columns={columns}
        dataSource={nodeList}
        pagination={{
          currentPage: pageNum,
          pageSize: pageSize,
          total,
          onChange,
          showSizeChanger: true,
          showTotal: true,
          showQuickJumper: true,
        }}
        loading={loading}
      />
    </div>
  );
};

export default NodeManageNodeListPage;
