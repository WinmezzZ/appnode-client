import { request } from '../request';

/** 桌面菜单接口 */
export const apiNodeList = (data: ApiNodeListParams) =>
  request<ApiNodeListResult>('get', 'Node.List', { ...data, api_ccenter_app: 'nodemgr' });

interface ApiNodeListParams {
  _pageNumber: number;
  _pageSize: number;
  /** 关键字，搜索SSHHostname或NodeName */
  Keyword?: string;
  /** 节点分组ID */
  NodeGroupId?: string;
  /** 节点ID */
  NodeId?: string;
  /** 节点名称，支持模糊匹配 */
  NodeName?: string;
  /** SSH主机名 */
  SSHHostname?: string;
  /** SSH验证方法，password或publickey */
  SSHAuthMethod?: string;
  /** 是否总是包含本地节点，Y/N */
  AlwaysIncludeLocal?: 'Y' | 'N';
  /** 受控端是否有更新，Y/N */
  AgentIsUpgradable?: 'Y' | 'N';
  /** 受控端连接状态 */
  AgentConnStatus?: 'online' | 'offline' | 'checking';
}

interface Node {
  AgentConnError: string;
  AgentConnStatus: string;
  AgentConnectAdminStatus: string;
  AgentConnectDomainName: string;
  AgentConnectHostname: string;
  AgentConnectMethod: string;
  AgentConnectPort: number;
  AgentConnectProtocol: string;
  AgentConnectSignKey: string;
  AgentIsUpgradable: string;
  AgentLatestVersion: string;
  AgentRunningVersion: string;
  AgentVersion: string;
  BaseArch: string;
  IsDefault: 'Y' | 'N';
  NodeGroupId: number;
  NodeGroupName: string;
  NodeId: number;
  NodeName: string;
  NodeType: string;
  OS: string;
  OSRelease: string;
  OSVersion: string;
  SSHAuthMethod: string;
  SSHHostname: string;
  SSHIdentityFile: string;
  SSHIdentityFilePassphrase: string;
  SSHPassword: string;
  SSHPort: number;
  SSHUsername: string;
  ShowIndex: number;
}

export type NodeList = Node[];

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
