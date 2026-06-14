import { useState } from 'react';
import { Form, Input, Button, Checkbox, App } from 'antd';
import {
	ArrowLeftOutlined,
	GithubOutlined,
	GoogleOutlined
} from '@ant-design/icons';

type Mode = 'signin' | 'signup';

interface AuthProps {
	onBack: () => void;
}

interface SignInValues {
	email: string;
	password: string;
	remember?: boolean;
}

interface SignUpValues {
	email: string;
	password: string;
	confirmPassword: string;
	accept: boolean;
}

// decorative pseudo-log lines for the left panel
const LOG_LINES = [
	'[boot] ► initializing workspace ............. ok',
	'[db]   ► postgres connection ................ ok',
	'[vec]  ► pgvector extension loaded .......... ok',
	'[emb]  ► embedding model warmed up .......... ok',
	'[idx]  ► 1,284 chunks indexed ............... ok',
	'[net]  ► waiting for credentials ............ ░░░'
];

function Auth({ onBack }: AuthProps) {
	const { message } = App.useApp();
	const [mode, setMode] = useState<Mode>('signin');
	const [signInForm] = Form.useForm<SignInValues>();
	const [signUpForm] = Form.useForm<SignUpValues>();

	const handleSignIn = async () => {
		const values = await signInForm.validateFields();
		// TODO: POST /auth/login
		message.success(`Welcome back · ${values.email}`);
	};

	const handleSignUp = async () => {
		const values = await signUpForm.validateFields();
		// TODO: POST /auth/register
		message.success(`Account created · ${values.email}`);
	};

	return (
		<div
			className="h-full grid bg-ink-0"
			style={{ gridTemplateColumns: 'minmax(0, 1.1fr) minmax(0, 1fr)' }}
		>
			{/* LEFT — brand */}
			<div className="relative hidden lg:flex flex-col justify-between p-12 border-r border-line bg-ink-1 overflow-hidden">
				{/* dot grid decoration */}
				<div className="absolute inset-0 bg-dots opacity-40 pointer-events-none" />
				{/* diagonal accent line */}
				<div className="absolute top-0 right-0 w-[1px] h-full bg-gradient-to-b from-transparent via-amber/40 to-transparent" />

				<div className="relative">
					<div className="flex items-baseline gap-1">
						<span className="font-display text-[44px] leading-none text-fg-0">
							RAG
						</span>
						<span className="font-display text-[44px] leading-none text-amber">
							/
						</span>
						<span className="font-display text-[44px] leading-none text-fg-0">
							KB
						</span>
					</div>
					<div className="mt-2 font-mono text-[10px] tracking-[0.14em] text-fg-3 uppercase">
						Knowledge Base · v0.1
					</div>
				</div>

				<div className="relative max-w-md">
					<div className="font-mono text-[10px] tracking-[0.14em] uppercase text-amber mb-5">
						Workspace · 0xB7F2
					</div>
					<div className="font-display text-[44px] italic leading-[1.05] text-fg-0">
						Every answer
						<br />
						begins with
						<br />
						a&nbsp;
						<span className="text-amber not-italic font-display">
							document
						</span>
						.
					</div>
					<div className="mt-6 text-[14px] text-fg-2 leading-relaxed">
						Upload sources, index them as vectors, retrieve
						selectively, answer precisely. Built for engineering
						teams who care about provenance.
					</div>
				</div>

				<div className="relative">
					<div className="border border-line bg-ink-2 p-4 font-mono text-[11px] leading-relaxed text-fg-2 space-y-0.5">
						{LOG_LINES.map((line, i) => (
							<div
								key={i}
								className={
									i === LOG_LINES.length - 1
										? 'text-amber'
										: ''
								}
							>
								{line}
							</div>
						))}
					</div>
					<div className="mt-4 flex items-center justify-between font-mono text-[10px] tracking-wider uppercase text-fg-3">
						<span>build · 7f2c · 2026.06</span>
						<span>region · us-west-2</span>
					</div>
				</div>
			</div>

			{/* RIGHT — form */}
			<div className="relative flex flex-col">
				{/* top bar */}
				<div className="flex items-center justify-between px-8 py-5 border-b border-line">
					<button
						onClick={onBack}
						className="flex items-center gap-2 font-mono text-[11px] tracking-wider uppercase text-fg-2 hover:text-amber transition-colors"
					>
						<ArrowLeftOutlined /> Back to app
					</button>
					<div className="font-mono text-[10px] tracking-wider uppercase text-fg-3">
						Preview mode
					</div>
				</div>

				<div className="flex-1 flex items-center justify-center px-8 py-10 overflow-auto">
					<div className="w-full max-w-[400px]">
						{/* mode toggle */}
						<div
							className="grid border border-line mb-8"
							style={{ gridTemplateColumns: '1fr 1fr' }}
						>
							<button
								onClick={() => setMode('signin')}
								className={`py-3 font-mono text-[11px] tracking-wider uppercase transition-colors ${
									mode === 'signin'
										? 'bg-ink-2 text-fg-0'
										: 'text-fg-2 hover:text-fg-0'
								}`}
							>
								Sign in
							</button>
							<button
								onClick={() => setMode('signup')}
								className={`py-3 font-mono text-[11px] tracking-wider uppercase transition-colors border-l border-line ${
									mode === 'signup'
										? 'bg-ink-2 text-fg-0'
										: 'text-fg-2 hover:text-fg-0'
								}`}
							>
								Create account
							</button>
						</div>

						<div className="mb-1 font-mono text-[10px] tracking-[0.14em] uppercase text-amber">
							{mode === 'signin' ? 'Returning' : 'New here'}
						</div>
						<h2 className="font-display text-[36px] leading-tight text-fg-0 mb-1">
							{mode === 'signin'
								? 'Welcome back.'
								: 'Get started.'}
						</h2>
						<p className="text-[14px] text-fg-2 mb-8">
							{mode === 'signin'
								? 'Sign in to access your workspace.'
								: 'Spin up a workspace in under a minute.'}
						</p>

						{mode === 'signin' ? (
							<Form
								form={signInForm}
								layout="vertical"
								requiredMark={false}
								onFinish={handleSignIn}
								initialValues={{ remember: true }}
							>
								<Form.Item
									label={
										<span className="font-mono text-[10px] tracking-wider uppercase text-fg-2">
											Email
										</span>
									}
									name="email"
									rules={[
										{
											required: true,
											message: 'Email required'
										},
										{
											type: 'email',
											message: 'Invalid email'
										}
									]}
								>
									<Input
										size="large"
										placeholder="you@company.com"
										autoComplete="email"
									/>
								</Form.Item>
								<div className="flex justify-between items-end mb-2">
									<span className="font-mono text-[10px] tracking-wider uppercase text-fg-2">
										Password
									</span>
									<a className="font-mono text-[10px] tracking-wider uppercase text-fg-3 hover:text-amber cursor-pointer">
										Forgot?
									</a>
								</div>
								<Form.Item
									name="password"
									rules={[
										{
											required: true,
											message: 'Password required'
										}
									]}
								>
									<Input.Password
										size="large"
										placeholder="••••••••"
										autoComplete="current-password"
									/>
								</Form.Item>
								<Form.Item
									name="remember"
									valuePropName="checked"
								>
									<Checkbox>
										<span className="font-mono text-[11px] text-fg-2">
											Keep me signed in
										</span>
									</Checkbox>
								</Form.Item>
								<Button
									type="primary"
									size="large"
									htmlType="submit"
									block
								>
									Sign in →
								</Button>
							</Form>
						) : (
							<Form
								form={signUpForm}
								layout="vertical"
								requiredMark={false}
								onFinish={handleSignUp}
							>
								<Form.Item
									label={
										<span className="font-mono text-[10px] tracking-wider uppercase text-fg-2">
											Email
										</span>
									}
									name="email"
									rules={[
										{
											required: true,
											message: 'Email required'
										},
										{
											type: 'email',
											message: 'Invalid email'
										}
									]}
								>
									<Input
										size="large"
										placeholder="you@company.com"
									/>
								</Form.Item>
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
										{
											min: 8,
											message: 'At least 8 characters'
										}
									]}
								>
									<Input.Password
										size="large"
										placeholder="At least 8 characters"
									/>
								</Form.Item>
								<Form.Item
									label={
										<span className="font-mono text-[10px] tracking-wider uppercase text-fg-2">
											Confirm password
										</span>
									}
									name="confirmPassword"
									dependencies={['password']}
									rules={[
										{
											required: true,
											message: 'Please confirm'
										},
										({ getFieldValue }) => ({
											validator(_, value) {
												if (
													!value ||
													getFieldValue(
														'password'
													) === value
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
									<Input.Password size="large" />
								</Form.Item>
								<Form.Item
									name="accept"
									valuePropName="checked"
									rules={[
										{
											validator: (_, value) =>
												value
													? Promise.resolve()
													: Promise.reject(
															new Error(
																'Please accept the terms'
															)
														)
										}
									]}
								>
									<Checkbox>
										<span className="font-mono text-[11px] text-fg-2">
											I agree to the terms and privacy
											policy
										</span>
									</Checkbox>
								</Form.Item>
								<Button
									type="primary"
									size="large"
									htmlType="submit"
									block
								>
									Create account →
								</Button>
							</Form>
						)}

						{/* divider */}
						<div className="my-8 flex items-center gap-4">
							<div className="flex-1 h-px bg-line" />
							<span className="font-mono text-[10px] tracking-wider uppercase text-fg-3">
								or
							</span>
							<div className="flex-1 h-px bg-line" />
						</div>

						<div
							className="grid gap-3"
							style={{ gridTemplateColumns: '1fr 1fr' }}
						>
							<Button size="large" icon={<GithubOutlined />}>
								<span className="font-mono text-[12px]">
									GitHub
								</span>
							</Button>
							<Button size="large" icon={<GoogleOutlined />}>
								<span className="font-mono text-[12px]">
									Google
								</span>
							</Button>
						</div>

						<div className="mt-10 font-mono text-[10px] tracking-wider uppercase text-fg-3 text-center">
							© 2026 · Knowledge Base
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default Auth;
