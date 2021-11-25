import { useEffect, useState } from 'react';

import { MyResponse } from '~/api/request';
import { Pagination } from '~/interface/common/pagination.interface';

interface ApiMethod<K, V> {
  (...arg: any): MyResponse<Pagination<K, V>>;
}

interface UseTableOptions<T extends ApiMethod<any, any>> {
  apiMethod: T;
  apiParams?: T extends (...arg: infer Arg) => MyResponse<Pagination<any, any>> ? Arg[0] : unknown;
  resultListKeyPath: string;
}

type ListItem<T> = T extends (...arg: any) => MyResponse<Pagination<any, Array<infer R>>> ? R : unknown;

export function useTable<T extends ApiMethod<any, any>>(options: UseTableOptions<T>) {
  const { apiMethod, apiParams = {}, resultListKeyPath } = options;
  const [pageSize, setPageSize] = useState(20);
  const [pageNum, setPageNum] = useState(1);
  const [total, setTotal] = useState(0);
  const [tableData, setTableData] = useState<ListItem<T>[]>([]);
  const [loading, setLoading] = useState(false);

  const getData = async (currentPage = pageNum, currentSize = pageSize) => {
    setLoading(true);
    const res = await apiMethod({
      _pageNumber: currentPage,
      _pageSize: currentSize,
      ...apiParams,
    });

    setLoading(false);
    if (res.CODE === 'ok') {
      setTableData(res.DATA[resultListKeyPath]);
      setTotal(res.DATA.TotalCount);
    }
  };

  const onTableChange = (currentPage: number, pageSize: number) => {
    setPageNum(currentPage);
    setPageSize(pageSize);
    getData(currentPage);
  };

  useEffect(() => {
    getData();
  }, [pageSize, pageNum]);

  return {
    onTableChange,
    loading,
    tableData,
    setTableData,
    panination: {
      currentPage: pageNum,
      pageSize: pageSize,
      total,
      onChange: onTableChange,
      showSizeChanger: true,
      showTotal: true,
      showQuickJumper: true,
    },
  };
}
