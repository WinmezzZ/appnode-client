import { Progress, Table } from '@douyinfe/semi-ui';
import { ColumnProps } from '@douyinfe/semi-ui/lib/es/table';
import { css } from '@emotion/react';
import { FC } from 'react';

import { apiNodeList, usePerformance } from '~/api/ccenter-app-nodemgr/node';
import { useTable } from '~/hooks/useTable';

const getStrokeColor = (rate: number) => {
  if (rate > 0.8) {
    return '#ff0000';
  } else if (rate < 0.8 && rate > 0.5) {
    return '#ff6600';
  } else if (rate < 0.5 && rate > 0.3) {
    return '#66ccfff';
  } else {
    return '02b080';
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
          percent={+(item.RealMemUseRate * 100).toFixed(1) || 0}
          style={{ height: '8px' }}
          stroke={getStrokeColor(item.RealMemUseRate)}
          showInfo={true}
        >
          {item.RealMemUseRate && (item.RealMemUseRate * 100).toFixed(2) + '%'}
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
  const { panination, tableData, setTableData, loading } = useTable({
    apiMethod: apiNodeList,
    resultListKeyPath: 'NodeList',
  });

  usePerformance(
    res => {
      if (!tableData.length) return;
      setTableData(nodelst => {
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
            RealMemUseRate: data[3],
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
      nodeIds: tableData.map(node => node.NodeId.toString()),
    },
  );

  return (
    <div css={styles}>
      <Table resizable bordered columns={columns} dataSource={tableData} pagination={panination} loading={loading} />
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
