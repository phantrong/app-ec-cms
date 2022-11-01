import React, { useState } from 'react';
import { Pagination, Button, Row } from 'antd';
import { useQuery } from 'react-query';
import TaskList from './TaskList';
import { getListTask } from 'api/task';
import styles from './styles.module.scss';

const pageSize = 10;

export default function Tasks() {
  const [filter, setFilter] = useState({ pageIndex: 1, pageSize });

  const { data, isFetching, refetch } = useQuery(['tasks', filter], () => getListTask(filter), {
    keepPreviousData: true,
  });
  const handlePageChange = (page: number) => setFilter((oldFilter) => ({ ...oldFilter, pageIndex: page }));

  return (
    <div className={styles.container}>
      <Row justify="space-between">
        <h2>List of Task</h2>
        <Button onClick={() => refetch()}>Reload</Button>
      </Row>
      <TaskList loading={isFetching} tasks={data?.data} />
      <p />
      <Pagination
        current={data?.pageIndex}
        total={data?.totalItems}
        pageSize={pageSize}
        onChange={handlePageChange}
        showSizeChanger={false}
      />
    </div>
  );
}
