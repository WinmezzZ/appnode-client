import { Progress, Table } from '@douyinfe/semi-ui';
import { ColumnProps } from '@douyinfe/semi-ui/lib/es/table';
import { css } from '@emotion/react';
import { FC, useEffect, useState } from 'react';

import { apiNodeList, usePerformance } from '~/api/ccenter-app-nodemgr/node';
import { NodeList } from '~/interface/ccenter-app-nodemgr/node.interface';

const getStrokeColor = (rate: number) => {
  if (rate > 0.8) {
    return '#f93920';
  } else if (rate < 0.8 && rate > 0.2) {
    return '#fc8800';
  } else {
    return undefined;
  }
};

const columns: ColumnProps[] = [
  {
    title: '节点名称',
    dataIndex: 'NodeName',
    width: 'auto',
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
  {
    title: 'CPU',
    width: 100,
    render(item) {
      return (
        <div>
          <Progress
            percent={+(item.CPUUseRate * 100).toFixed(1) || 0}
            style={{ height: '8px' }}
            stroke={getStrokeColor(item.CPUUseRate)}
            showInfo={true}
          >
            {item.CPUUseRate && (item.CPUUseRate * 100).toFixed(2) + '%'}
          </Progress>
        </div>
      );
    },
  },
  {
    title: '内存',
    width: 100,
    render(item) {
      return (
        <Progress
          percent={+(item.MemUseRate * 100).toFixed(1) || 0}
          style={{ height: '8px' }}
          stroke={getStrokeColor(item.MemUseRate)}
          showInfo={true}
        >
          {item.MemUseRate && (item.MemUseRate * 100).toFixed(2) + '%'}
        </Progress>
      );
    },
  },
  {
    title: '储存',
    width: 100,
    render(item) {
      return (
        <Progress
          percent={+(item.DiskUseRate * 100).toFixed(1) || 0}
          style={{ height: '8px' }}
          stroke={getStrokeColor(item.DiskUseRate)}
          showInfo={true}
        >
          {item.DiskUseRate && (item.DiskUseRate * 100).toFixed(2) + '%'}
        </Progress>
      );
    },
  },
  {
    title: '网络',
    render(item) {
      return item.RXSpeed && `↑ ${item.RXSpeed} / ↓ ${item.TXSpeed}`;
    },
    width: 160,
  },
];

const NodeManageNodeListPage: FC = () => {
  const [pageSize, setPageSize] = useState(20);
  const [pageNum, setPageNum] = useState(1);
  const [total, setTotal] = useState(0);
  const [nodeList, setNodeList] = useState<NodeList>([]);
  const [loading, setLoading] = useState(false);

  usePerformance(
    res => {
      if (!nodeList.length) return;
      setNodeList(nodelst => {
        if (!Object.keys(res.d).length) return nodelst;

        return nodelst.map(node => {
          const item = Object.keys(res.d).find(i => +i === node.NodeId);

          if (!item) return node;

          const data = res.d[item].Performance;

          return {
            ...node,
            CPUUseRate: data[0],
            RealMemUsed: data[1],
            MemTotal: data[2],
            MemUseRate: data[3],
            RXSpeed: data[4],
            TXSpeed: data[5],
            DiskUsed: data[6],
            DiskTotal: data[7],
            DiskUseRate: data[8],
          };
        });
      });
    },
    {
      nodeIds: nodeList.map(node => node.NodeId.toString()),
    },
  );

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
    <div css={styles}>
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

const styles = css`
  table {
    border: 1 px solid #000;
    td {
      width: 200px;
      height: 40px;
      line-height: 40px;
    }
  }
`;
