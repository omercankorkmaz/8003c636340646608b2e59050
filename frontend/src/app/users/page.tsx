'use client'

import React, { useEffect, useState } from 'react';
import { Space, Table, Tooltip, Button, Modal, Select, Input } from 'antd';
import type { CheckboxOptionType, FormProps, TableProps } from 'antd';
import { DeleteOutlined, EditOutlined, SaveOutlined } from '@ant-design/icons';
import { Form } from "antd";
const { Search } = Input;

import User from '../user.model';

const columns: TableProps<Partial<User>>['columns'] = [];
const columnNames = ['id', 'name', 'surname', 'email', 'phone', 'age', 'country', 'district', 'role', 'createdAt', 'updatedAt'];
columnNames.forEach(columnName => {
    columns.push({
        title: columnName.toUpperCase(),
        dataIndex: columnName,
        key: columnName,
        // render(value, record) {
        //     if ([record.createdAt, record.updatedAt].includes(value)) return (
        //         <>
        //             <span>{new Date(value).toLocaleTimeString()}</span>
        //             <br />
        //             <span>{new Date(value).toLocaleDateString()}</span>
        //         </>
        //     );
        //     else return value;
        // },
    })
});

const Users: React.FC = () => {

    const [form] = Form.useForm();
    const [users, setUsers] = useState<User[]>([]);
    const [selectedUser, setSelectedUser] = useState<User>();
    const [selectedColumns, setSelectedColumns] = useState(columnNames);
    const [userModalOpen, setUserModalOpen] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);

    const [tableLoading, setTableLoading] = useState(true);

    const [search, setSearch] = useState("");
    const [pageNumber, setPageNumber] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [count, setCount] = useState(0);

    const [resetTable, setResetTable] = useState(false);

    const tblRef: Parameters<typeof Table>[0]['ref'] = React.useRef(null);

    useEffect(() => {
        async function fetchCount() {
            const countRes = await fetch(`http://localhost:9000/users/count?search=${search}`);
            const countData = await countRes.json();
            setCount(countData.count);
        }
        fetchCount();
    }, [search])

    useEffect(() => {
        async function fetchUsers() {
            setTableLoading(true);

            const res = await fetch(`http://localhost:9000/users?search=${search}&page=${pageNumber}&pageSize=${pageSize}`);
            const data = await res.json();
            setUsers(data.users);

            setTableLoading(false);
        }
        fetchUsers();
    }, [search, pageNumber, pageSize])

    const filteredColumns = columns.map(column => {
        return {
            ...column,
            hidden: !selectedColumns.includes(column.key as string),
        }
    });

    const selectableColumns = columns.map(({ key, title }) => ({
        label: title,
        value: key,
    }));

    const actionColumn = {
        title: 'ACTION',
        key: 'action',
        render: () => (
            <Space size="middle">
                <Tooltip placement="bottom" title={'Edit'}>
                    <Button icon={<EditOutlined />} type="link" size='large' onClick={handleModalOpen}></Button>
                </Tooltip>
            </Space>
        ),
    };

    const onFinish: FormProps<Partial<User>>['onFinish'] = (values) => {
        setConfirmLoading(true);
        console.log(selectedUser);
        console.log(values);
        // save op.
        setUserModalOpen(false);
        setConfirmLoading(false);
    };

    const onFinishFailed: FormProps<Partial<User>>['onFinishFailed'] = (errorInfo) => {
        console.log(errorInfo);
        setUserModalOpen(false);
    };

    const handleModalOpen = () => {
        form.setFieldsValue(users[0]);
        setSelectedUser(users[0]);
        setUserModalOpen(true);
    }

    const handleModalCancel = () => {
        setUserModalOpen(false);
        form.resetFields();
    }

    return (
        <div className='px-56 pt-10'>
            {/* <h1 className="text-balance text-2xl font-semibold tracking-tight text-gray-900 sm:text-4xl mb-4">
                Users Table
            </h1> */}
            <div className='mb-4 flex justify-between'>
                <div>
                    <label className='font-semibold mr-4'>Visible Columns</label>
                    <Select
                        mode="multiple"
                        options={selectableColumns as CheckboxOptionType[]}
                        onChange={(value) => setSelectedColumns(value as string[])}
                        defaultValue={columnNames}
                    ></Select>
                </div>
                <div>
                    <Search placeholder="Search" enterButton onSearch={(value) => { setResetTable(true); setPageNumber(1); setSearch(value); }} />
                </div>
            </div>
            <Table<Partial<User>> ref={tblRef} loading={tableLoading} columns={[...filteredColumns, actionColumn]} dataSource={users} bordered pagination={{
                position: ['bottomCenter'], total: count, onChange: (page, pageSize) => {
                    setPageNumber(page);
                    setPageSize(pageSize);
                }, showTotal: (total, range) => <span>Total {total} records, showing {range[0]} - {range[1]}</span>, current: pageNumber
            }} />
            <Modal
                title="Edit User"
                open={userModalOpen}
                confirmLoading={confirmLoading}
                okText="Submit"
                onCancel={handleModalCancel}
                footer={<Button form="userForm" type="primary" htmlType="submit" icon={<SaveOutlined />}>Save</Button>}
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
                    className='my-10'
                >
                    <Form.Item<Partial<User>>
                        label="Name"
                        name="name"
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item<Partial<User>>
                        label="Surname"
                        name="surname"
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item<Partial<User>>
                        label="Email"
                        name="email"
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item<Partial<User>>
                        label="Phone"
                        name="phone"
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item<Partial<User>>
                        label="Age"
                        name="age"
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item<Partial<User>>
                        label="Country"
                        name="country"
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item<Partial<User>>
                        label="District"
                        name="district"
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item<Partial<User>>
                        label="Role"
                        name="role"
                    >
                        <Input />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    )
}

export default Users;