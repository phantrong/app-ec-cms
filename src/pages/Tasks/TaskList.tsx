import React from 'react';
import { Table, Button } from 'antd';

interface IProps {
  tasks: any;
  loading: boolean;
}

const TaskList = ({ tasks, loading }: IProps) => {
  const columns = [
    {
      title: 'Title',
      dataIndex: 'title',
    },
    {
      title: 'Content',
      dataIndex: 'content',
    },
    {
      title: 'Status',
      dataIndex: 'status',
    },
    {
      title: 'Actions',
      render: (text: any, record: any) => {
        return (
          <>
            <Button>Detail</Button>
            &nbsp;
            <Button>Edit</Button>
          </>
        );
      },
    },
  ];
  return <Table rowKey="id" dataSource={tasks || []} columns={columns} pagination={false} loading={loading} />;
};

export default TaskList;
