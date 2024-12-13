'use client'

import React, { useState } from 'react';
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

const data: Partial<User>[] = [
    {
        'id': '123',
        'name': 'omer',
        'surname': 'korkmaz',
        'email': 'omercankorkmaz0@gmail.com',
        'phone': '345123332',
        'age': 27,
        'country': 'Turkiye',
        'district': 'Ankara',
        'role': 'Sw Engineer',
        'createdAt': new Date().toString(),
        'updatedAt': new Date().toString()
    },
];

const Users: React.FC = () => {

    const [form] = Form.useForm();
    const [selectedUserId, setSelectedUserId] = useState();
    const [selectedColumns, setSelectedColumns] = useState(columnNames);
    const [userModalOpen, setUserModalOpen] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);
    const [searchLoading, setSearchLoading] = useState(false);

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
                <Tooltip placement="bottom" title={'Delete'}>
                    <Button icon={<DeleteOutlined />} type="link" size='large'></Button>
                </Tooltip>
            </Space>
        ),
    };

    const onFinish: FormProps<Partial<User>>['onFinish'] = (values) => {
        setConfirmLoading(true);
        console.log(selectedUserId);
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
        form.setFieldsValue(data[0]);
        setSelectedUserId(data[0].id);
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
                    <Search placeholder="Search" loading={searchLoading} enterButton />
                </div>
            </div>
            <Table<Partial<User>> columns={[...filteredColumns, actionColumn]} dataSource={data} bordered pagination={{ position: ['bottomCenter'], total: data.length }} />
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