'use client';

import { useEffect, useState, FC } from 'react';
import { Space, Table, Tooltip, Button, Modal, Input, message, InputNumber } from 'antd';
import type { Breakpoint, FormProps, TableProps } from 'antd';
import { EditOutlined, SaveOutlined } from '@ant-design/icons';
import { Form } from 'antd';
const { Search } = Input;

import User from '../user.model';
import { ColumnType } from 'antd/es/table';

const columns: TableProps<Partial<User>>['columns'] = [];
const columnNames = ['id', 'name', 'surname', 'email', 'phone', 'age', 'country', 'district', 'role', 'createdAt', 'updatedAt'];
const responsivenessOfColumns: { [k: string]: undefined | Breakpoint[] } = {
  id: undefined,
  name: undefined,
  surname: undefined,
  email: ['sm'],
  phone: ['lg'],
  age: ['md'],
  country: ['md'],
  district: ['lg'],
  role: ['lg'],
  createdAt: ['xl'],
  updatedAt: ['xl'],
};
columnNames.forEach((columnName) => {
  columns.push({
    title: columnName.toUpperCase(),
    dataIndex: columnName,
    key: columnName,
    render(value, record) {
      if ([record.createdAt, record.updatedAt].includes(value))
        return (
          <>
            <span>{new Date(value).toLocaleTimeString()}</span>
            <br />
            <span>{new Date(value).toLocaleDateString()}</span>
          </>
        );
      else return value;
    },
    responsive: responsivenessOfColumns[columnName],
  });
});

const Users: FC = () => {
  const [form] = Form.useForm();
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<Partial<User>>();
  const [userModalOpen, setUserModalOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);

  const [tableLoading, setTableLoading] = useState(true);

  const [search, setSearch] = useState('');
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [count, setCount] = useState(0);

  const [messageApi, contextHolder] = message.useMessage();

  useEffect(() => {
    const fetchCount = async () => {
      const countRes = await fetch(`http://localhost:9000/users/count?search=${search}`);
      const countData = await countRes.json();
      setCount(countData.count);
    };
    fetchCount();
  }, [search]);

  useEffect(() => {
    fetchUsers();
  }, [search, pageNumber, pageSize]);

  const fetchUsers = async () => {
    setTableLoading(true);

    const res = await fetch(`http://localhost:9000/users?search=${search}&page=${pageNumber}&pageSize=${pageSize}`);
    const data = await res.json();
    setUsers(data.users);

    setTableLoading(false);
  };

  const actionColumn: ColumnType<Partial<User>> = {
    title: 'ACTION',
    key: 'action',
    render: (value: any, record: Partial<User>) => (
      <Space size="middle">
        <Tooltip placement="bottom" title={'Edit'}>
          <Button icon={<EditOutlined />} type="link" size="large" onClick={() => handleModalOpen(record)}></Button>
        </Tooltip>
      </Space>
    ),
  };

  const onFinish: FormProps<User>['onFinish'] = async (newValues) => {
    setConfirmLoading(true);
    if (selectedUser) {
      const finalObj: { [k: string]: string | number } = { id: selectedUser.id as number };
      Object.keys(selectedUser).forEach((key) => {
        if (!['id', 'password', 'createdAt', 'updatedAt'].includes(key)) {
          if (selectedUser[key as keyof User] !== newValues[key as keyof User]) {
            finalObj[key as keyof typeof finalObj] = newValues[key as keyof User] as string | number;
          }
        }
      });
      const updateRes = await fetch(`http://localhost:9000/users/update`, {
        body: JSON.stringify(finalObj),
        method: 'POST',
        headers: {
          'Content-type': 'application/json',
        },
      });
      const updateData = await updateRes.json();
      if ((updateData.message = 'success')) {
        fetchUsers();
        setUserModalOpen(false);
        setConfirmLoading(false);
        messageApi.open({
          type: 'success',
          content: 'User edited',
        });
      } else {
        messageApi.open({
          type: 'error',
          content: 'User coult not edited',
        });
      }
    }
  };

  const onFinishFailed: FormProps<Partial<User>>['onFinishFailed'] = (errorInfo) => {
    console.log(errorInfo);
    setUserModalOpen(false);
  };

  const handleModalOpen = (user: Partial<User>) => {
    setSelectedUser(user);
    form.setFieldsValue(user);
    setUserModalOpen(true);
  };

  const handleModalCancel = () => {
    setUserModalOpen(false);
    form.resetFields();
  };

  return (
    <>
      {contextHolder}
      <div className="pt-10 xl:px-32 lg:px-20 md:px-16 sm:px-10 xs:px-5 px-4">
        <div className="mb-4 flex justify-between">
          <Search
            placeholder="Search"
            enterButton
            onSearch={(value) => {
              setPageNumber(1);
              setSearch(value);
            }}
            className="!w-auto"
          />
        </div>
        <Table<Partial<User>>
          loading={tableLoading}
          columns={[...columns, actionColumn]}
          dataSource={users}
          bordered
          pagination={{
            position: ['bottomCenter'],
            total: count,
            onChange: (page, pageSize) => {
              setPageNumber(page);
              setPageSize(pageSize);
            },
            showTotal: (total, range) => (
              <span>
                Total {total} records, showing {range[0]} - {range[1]}
              </span>
            ),
            current: pageNumber,
          }}
          rowKey="id"
        />
        <Modal
          title="Edit User"
          open={userModalOpen}
          confirmLoading={confirmLoading}
          okText="Submit"
          onCancel={handleModalCancel}
          footer={
            <Button form="userForm" type="primary" htmlType="submit" icon={<SaveOutlined />}>
              Save
            </Button>
          }
        >
          <Form
            id="userForm"
            form={form}
            name="basic"
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 14 }}
            style={{ maxWidth: 600 }}
            initialValues={{ remember: true }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
            className="my-10"
          >
            <Form.Item<Partial<User>> label="Name" name="name">
              <Input />
            </Form.Item>
            <Form.Item<Partial<User>> label="Surname" name="surname">
              <Input />
            </Form.Item>
            <Form.Item<Partial<User>> label="Email" name="email">
              <Input type="email" />
            </Form.Item>
            <Form.Item<Partial<User>> label="Phone" name="phone">
              <Input />
            </Form.Item>
            <Form.Item<Partial<User>> label="Age" name="age">
              <InputNumber className="!w-full" />
            </Form.Item>
            <Form.Item<Partial<User>> label="Country" name="country">
              <Input />
            </Form.Item>
            <Form.Item<Partial<User>> label="District" name="district">
              <Input />
            </Form.Item>
            <Form.Item<Partial<User>> label="Role" name="role">
              <Input />
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </>
  );
};

export default Users;
