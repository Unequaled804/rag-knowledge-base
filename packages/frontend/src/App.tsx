// import { useState } from 'react';
import { Input, Layout, Form, Button, Typography } from 'antd';

const { Header, Content, Sider } = Layout;
const { Title } = Typography;

function App() {
	const [form] = Form.useForm();
	const onFinish = (values) => {
		console.log('register', values);
		fetch('http://localhost:3000/user', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(values)
		});
	};

	return (
		<Layout>
			<Header>
				<Title level={3}>RAG Knowledge Base</Title>
			</Header>
			<Layout className="flex-1">
				<Sider collapsible>666</Sider>
				<Layout>
					<Content>
						<Form name="register" form={form} onFinish={onFinish}>
							<Form.Item
								label="Email"
								name="email"
								rules={[
									{
										required: true,
										message: 'Please input your email!'
									},
									{
										type: 'email',
										message: 'Please input a valid email!'
									}
								]}
							>
								<Input />
							</Form.Item>
							<Form.Item
								label="Password"
								name="password"
								rules={[
									{
										required: true,
										message: 'Please input your password!'
									}
								]}
							>
								<Input.Password />
							</Form.Item>
							<Form.Item
								label="Confirm Password"
								name="confirmPassword"
								dependencies={['password']}
								rules={[
									{
										required: true,
										message:
											'Please input your confirm password!'
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
													'The two passwords that you entered do not match!'
												)
											);
										}
									})
								]}
							>
								<Input.Password />
							</Form.Item>
							<Form.Item label={null}>
								<Button type="primary" htmlType="submit">
									Submit
								</Button>
							</Form.Item>
						</Form>
					</Content>
				</Layout>
			</Layout>
		</Layout>
	);
}

export default App;
