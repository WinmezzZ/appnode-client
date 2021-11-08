import { Table } from '@douyinfe/semi-ui';
import { FC, useEffect, useState } from 'react';

import { apiNodeList, NodeList } from '~/api/ccenter-app-nodemgr/node';

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

const NodeManageNodeListPage: FC = () => {
  const [pageSize, setPageSize] = useState(20);
  const [pageNum, setPageNum] = useState(1);
  const [total, setTotal] = useState(0);
  const [nodeList, setNodeList] = useState<NodeList>([]);
  const [loading, setLoading] = useState(false);

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
