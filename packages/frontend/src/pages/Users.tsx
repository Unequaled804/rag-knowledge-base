import { useState } from 'react';
import {
	Table,
	Button,
	Input,
	Space,
	Modal,
	Form,
	Select,
	Popconfirm,
	App
} from 'antd';
import type { TableProps } from 'antd';
import {
	PlusOutlined,
	SearchOutlined,
	ReloadOutlined
} from '@ant-design/icons';

type Role = 'USER' | 'ADMIN';

interface User {
	id: string;
	email: string;
	role: Role;
	createdAt: string;
}

const MOCK_USERS: User[] = [
	{
		id: '1',
		email: 'alice@example.com',
		role: 'ADMIN',
		createdAt: '2026-06-10 09:21'
	},
	{
		id: '2',
		email: 'bob@example.com',
		role: 'USER',
		createdAt: '2026-06-11 14:05'
	},
	{
		id: '3',
		email: 'carol@example.com',
		role: 'USER',
		createdAt: '2026-06-12 18:42'
	},
	{
		id: '4',
		email: 'daniel@example.com',
		role: 'USER',
		createdAt: '2026-06-13 08:11'
	}
];

interface UserFormValues {
	email: string;
	password?: string;
	confirmPassword?: string;
	role: Role;
}

function RolePill({ role }: { role: Role }) {
	if (role === 'ADMIN') {
		return (
			<span className="inline-flex items-center font-mono text-[10px] tracking-wider uppercase px-2 py-0.5 border border-amber/40 text-amber bg-amber/[0.06]">
				Admin
			</span>
		);
	}
	return (
		<span className="inline-flex items-center font-mono text-[10px] tracking-wider uppercase px-2 py-0.5 border border-line text-fg-2">
			User
		</span>
	);
}

function Users() {
	const { message } = App.useApp();
	const [users, setUsers] = useState<User[]>(MOCK_USERS);
	const [loading, setLoading] = useState(false);
	const [keyword, setKeyword] = useState('');
	const [modalOpen, setModalOpen] = useState(false);
	const [editingUser, setEditingUser] = useState<User | null>(null);
	const [form] = Form.useForm<UserFormValues>();

	const isEdit = editingUser !== null;
	const filtered = users.filter((u) =>
		u.email.toLowerCase().includes(keyword.toLowerCase())
	);

	const handleAdd = () => {
		setEditingUser(null);
		form.resetFields();
		setModalOpen(true);
	};

	const handleEdit = (user: User) => {
		setEditingUser(user);
		form.setFieldsValue({ email: user.email, role: user.role });
		setModalOpen(true);
	};

	const handleDelete = (user: User) => {
		setUsers((prev) => prev.filter((u) => u.id !== user.id));
		message.success(`Removed ${user.email}`);
	};

	const handleRefresh = () => {
		setLoading(true);
		setTimeout(() => setLoading(false), 400);
	};

	const handleSubmit = async () => {
		const values = await form.validateFields();
		if (isEdit && editingUser) {
			setUsers((prev) =>
				prev.map((u) =>
					u.id === editingUser.id
						? { ...u, email: values.email, role: values.role }
						: u
				)
			);
			message.success('User updated');
		} else {
			setUsers((prev) => [
				...prev,
				{
					id: String(Date.now()),
					email: values.email,
					role: values.role,
					createdAt: new Date()
						.toISOString()
						.slice(0, 16)
						.replace('T', ' ')
				}
			]);
			message.success('User created');
		}
		setModalOpen(false);
	};

	const columns: TableProps<User>['columns'] = [
		{
			title: 'Email',
			dataIndex: 'email',
			key: 'email',
			render: (text: string) => (
				<span className="font-mono text-[13px] text-fg-0">{text}</span>
			)
		},
		{
			title: 'Role',
			dataIndex: 'role',
			key: 'role',
			width: 120,
			filters: [
				{ text: 'Admin', value: 'ADMIN' },
				{ text: 'User', value: 'USER' }
			],
			onFilter: (value, record) => record.role === value,
			render: (role: Role) => <RolePill role={role} />
		},
		{
			title: 'Created',
			dataIndex: 'createdAt',
			key: 'createdAt',
			width: 180,
			sorter: (a, b) => a.createdAt.localeCompare(b.createdAt),
			render: (t: string) => (
				<span className="font-mono text-[12px] text-fg-2">{t}</span>
			)
		},
		{
			title: 'Actions',
			key: 'actions',
			width: 140,
			render: (_, record) => (
				<Space size={4}>
					<button
						onClick={() => handleEdit(record)}
						className="font-mono text-[11px] uppercase tracking-wider text-fg-2 hover:text-amber px-2 py-1 transition-colors"
					>
						Edit
					</button>
					<Popconfirm
						title="Remove this user?"
						description={record.email}
						okText="Remove"
						okButtonProps={{ danger: true }}
						cancelText="Cancel"
						onConfirm={() => handleDelete(record)}
					>
						<button className="font-mono text-[11px] uppercase tracking-wider text-fg-2 hover:text-red-400 px-2 py-1 transition-colors">
							Remove
						</button>
					</Popconfirm>
				</Space>
			)
		}
	];

	const stats = {
		total: users.length,
		admins: users.filter((u) => u.role === 'ADMIN').length,
		standard: users.filter((u) => u.role === 'USER').length
	};

	return (
		<div>
			{/* Stat strip */}
			<div className="grid grid-cols-3 border border-line bg-ink-1 mb-6">
				{[
					{ label: 'Total', value: stats.total },
					{ label: 'Admins', value: stats.admins },
					{ label: 'Standard', value: stats.standard }
				].map((s, i) => (
					<div
						key={s.label}
						className={`px-6 py-5 ${i !== 0 ? 'border-l border-line' : ''}`}
					>
						<div className="font-mono text-[10px] tracking-[0.14em] uppercase text-fg-3">
							{s.label}
						</div>
						<div className="mt-2 font-display text-[34px] leading-none text-fg-0">
							{String(s.value).padStart(2, '0')}
						</div>
					</div>
				))}
			</div>

			{/* Toolbar */}
			<div className="flex items-center justify-between mb-4">
				<Input
					prefix={<SearchOutlined className="text-fg-3" />}
					placeholder="Filter by email..."
					value={keyword}
					onChange={(e) => setKeyword(e.target.value)}
					allowClear
					className="!w-80 !bg-ink-1"
				/>
				<Space>
					<Button icon={<ReloadOutlined />} onClick={handleRefresh}>
						Refresh
					</Button>
					<Button
						type="primary"
						icon={<PlusOutlined />}
						onClick={handleAdd}
					>
						New user
					</Button>
				</Space>
			</div>

			{/* Table */}
			<div className="border border-line bg-ink-1">
				<Table<User>
					rowKey="id"
					columns={columns}
					dataSource={filtered}
					loading={loading}
					pagination={{
						pageSize: 10,
						showSizeChanger: false,
						showTotal: (total) => (
							<span className="font-mono text-[11px] tracking-wider uppercase text-fg-3">
								{total} record{total === 1 ? '' : 's'}
							</span>
						)
					}}
				/>
			</div>

			<Modal
				title={
					<span className="font-mono text-[11px] tracking-[0.14em] uppercase text-fg-2">
						{isEdit ? 'Edit user' : 'New user'}
					</span>
				}
				open={modalOpen}
				onCancel={() => setModalOpen(false)}
				onOk={handleSubmit}
				okText={isEdit ? 'Save' : 'Create'}
				destroyOnHidden
				width={460}
			>
				<Form
					form={form}
					layout="vertical"
					initialValues={{ role: 'USER' }}
					className="!mt-5"
					requiredMark={false}
				>
					<Form.Item
						label={
							<span className="font-mono text-[10px] tracking-wider uppercase text-fg-2">
								Email
							</span>
						}
						name="email"
						rules={[
							{ required: true, message: 'Email required' },
							{ type: 'email', message: 'Invalid email format' }
						]}
					>
						<Input
							placeholder="user@example.com"
							autoComplete="off"
						/>
					</Form.Item>

					{!isEdit && (
						<>
							<Form.Item
								label={
									<span className="font-mono text-[10px] tracking-wider uppercase text-fg-2">
										Password
									</span>
								}
								name="password"
								rules={[
									{
										required: true,
										message: 'Password required'
									},
									{ min: 6, message: 'At least 6 characters' }
								]}
							>
								<Input.Password placeholder="At least 6 characters" />
							</Form.Item>

							<Form.Item
								label={
									<span className="font-mono text-[10px] tracking-wider uppercase text-fg-2">
										Confirm
									</span>
								}
								name="confirmPassword"
								dependencies={['password']}
								rules={[
									{
										required: true,
										message: 'Confirm password'
									},
									({ getFieldValue }) => ({
										validator(_, value) {
											if (
												!value ||
												getFieldValue('password') ===
													value
											) {
												return Promise.resolve();
											}
											return Promise.reject(
												new Error(
													'Passwords do not match'
												)
											);
										}
									})
								]}
							>
								<Input.Password />
							</Form.Item>
						</>
					)}

					<Form.Item
						label={
							<span className="font-mono text-[10px] tracking-wider uppercase text-fg-2">
								Role
							</span>
						}
						name="role"
						rules={[{ required: true, message: 'Select a role' }]}
					>
						<Select
							options={[
								{ label: 'User', value: 'USER' },
								{ label: 'Admin', value: 'ADMIN' }
							]}
						/>
					</Form.Item>
				</Form>
			</Modal>
		</div>
	);
}

export default Users;
