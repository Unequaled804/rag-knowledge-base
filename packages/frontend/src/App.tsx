import { useEffect, useState } from 'react';
import { ConfigProvider, App as AntdApp, theme, Avatar } from 'antd';
import {
	UserOutlined,
	FileTextOutlined,
	MessageOutlined,
	QuestionCircleOutlined,
	LoginOutlined
} from '@ant-design/icons';
import Users from './pages/Users';
import Documents from './pages/Documents';
import FAQ from './pages/FAQ';
import Chat from './pages/Chat';
import Auth from './pages/Auth';

type PageKey = 'users' | 'documents' | 'faq' | 'chat';
type ThemeKey = 'tech' | 'civic';

interface NavItem {
	key: PageKey;
	label: string;
	cn: string;
	code: string;
	icon: React.ReactNode;
}

const NAV: NavItem[] = [
	{
		key: 'users',
		label: 'Users',
		cn: '用户管理',
		code: '01',
		icon: <UserOutlined />
	},
	{
		key: 'documents',
		label: 'Documents',
		cn: '文档资料',
		code: '02',
		icon: <FileTextOutlined />
	},
	{
		key: 'faq',
		label: 'FAQ',
		cn: '常见问题',
		code: '03',
		icon: <QuestionCircleOutlined />
	},
	{
		key: 'chat',
		label: 'Playground',
		cn: '智能问答',
		code: '04',
		icon: <MessageOutlined />
	}
];

const PAGE_META: Record<
	PageKey,
	{ title: string; cnTitle: string; subtitle: string; cnSubtitle: string }
> = {
	users: {
		title: 'Users',
		cnTitle: '用户管理',
		subtitle: 'Manage who can access the knowledge base',
		cnSubtitle: '管理可访问知识库的成员与权限'
	},
	documents: {
		title: 'Documents',
		cnTitle: '文档资料',
		subtitle: 'Upload, index and curate source material',
		cnSubtitle: '上传、索引并整理知识来源'
	},
	faq: {
		title: 'Frequently Asked Questions',
		cnTitle: '常见问题',
		subtitle: 'Hand-curated answers that take priority over retrieval',
		cnSubtitle: '人工整理的标准问答，优先于自动检索结果'
	},
	chat: {
		title: 'Playground',
		cnTitle: '智能问答',
		subtitle: 'Test prompts and inspect retrieved context',
		cnSubtitle: '调试提示词，查看检索上下文'
	}
};

const THEME_TOKENS: Record<
	ThemeKey,
	{
		algorithm: typeof theme.darkAlgorithm | typeof theme.defaultAlgorithm;
		primary: string;
		primaryHover: string;
		primaryActive: string;
		bgBase: string;
		bgContainer: string;
		bgElevated: string;
		border: string;
		borderSecondary: string;
		text: string;
		textSecondary: string;
		textTertiary: string;
		fontFamily: string;
		tableHoverBg: string;
	}
> = {
	tech: {
		algorithm: theme.darkAlgorithm,
		primary: '#FFB000',
		primaryHover: '#ffc233',
		primaryActive: '#e69e00',
		bgBase: '#0a0a0b',
		bgContainer: '#16161a',
		bgElevated: '#1d1d22',
		border: '#27272d',
		borderSecondary: '#1d1d22',
		text: '#f4f4f5',
		textSecondary: '#a1a1aa',
		textTertiary: '#71717a',
		fontFamily:
			"'Geist', 'Noto Sans SC', system-ui, -apple-system, sans-serif",
		tableHoverBg: '#16161a'
	},
	civic: {
		algorithm: theme.defaultAlgorithm,
		primary: '#1e3a5f',
		primaryHover: '#2a4d7a',
		primaryActive: '#152a45',
		bgBase: '#f5f3ee',
		bgContainer: '#ffffff',
		bgElevated: '#ffffff',
		border: '#dcd8cf',
		borderSecondary: '#e8e4dc',
		text: '#1a1a1a',
		textSecondary: '#4a4a4a',
		textTertiary: '#6b6b6b',
		fontFamily:
			"'Noto Sans SC', 'PingFang SC', 'Microsoft YaHei', system-ui, sans-serif",
		tableHoverBg: '#faf8f3'
	}
};

function App() {
	const [active, setActive] = useState<PageKey>('users');
	const [showAuth, setShowAuth] = useState(false);
	const [themeKey, setThemeKey] = useState<ThemeKey>('tech');

	useEffect(() => {
		document.documentElement.setAttribute('data-theme', themeKey);
	}, [themeKey]);

	const t = THEME_TOKENS[themeKey];
	const isCivic = themeKey === 'civic';

	const configProvider = (children: React.ReactNode) => (
		<ConfigProvider
			theme={{
				algorithm: t.algorithm,
				token: {
					colorPrimary: t.primary,
					colorPrimaryHover: t.primaryHover,
					colorPrimaryActive: t.primaryActive,
					colorBgBase: t.bgBase,
					colorBgContainer: t.bgContainer,
					colorBgElevated: t.bgElevated,
					colorBorder: t.border,
					colorBorderSecondary: t.borderSecondary,
					colorText: t.text,
					colorTextSecondary: t.textSecondary,
					colorTextTertiary: t.textTertiary,
					borderRadius: isCivic ? 2 : 4,
					controlHeight: 36,
					fontFamily: t.fontFamily
				},
				components: {
					Button: { primaryShadow: 'none', defaultShadow: 'none' },
					Table: {
						headerBg: 'transparent',
						rowHoverBg: t.tableHoverBg
					}
				}
			}}
		>
			<AntdApp className="h-full">{children}</AntdApp>
		</ConfigProvider>
	);

	if (showAuth) {
		return configProvider(<Auth onBack={() => setShowAuth(false)} />);
	}

	const meta = PAGE_META[active];

	return configProvider(
		<div className="h-full flex bg-ink-0 text-fg-0">
			{/* SIDEBAR */}
			<aside className="w-[240px] shrink-0 bg-ink-1 border-r border-line flex flex-col">
				{/* Brand */}
				<div className="px-5 py-5 border-b border-line">
					{isCivic ? (
						<div>
							<div className="flex items-baseline gap-2">
								<span className="font-display text-[26px] leading-none text-fg-0">
									知识中枢
								</span>
								<span className="font-mono text-[10px] text-fg-3 tracking-wider">
									v0.1
								</span>
							</div>
							<div className="mt-1.5 font-sans text-[11px] tracking-[0.2em] text-fg-2 uppercase">
								RAG · Knowledge Base
							</div>
						</div>
					) : (
						<div>
							<div className="flex items-baseline gap-1">
								<span className="font-display text-[28px] leading-none text-fg-0">
									RAG
								</span>
								<span className="font-display text-[28px] leading-none text-amber">
									/
								</span>
								<span className="font-display text-[28px] leading-none text-fg-0">
									KB
								</span>
							</div>
							<div className="mt-1.5 font-mono text-[10px] tracking-[0.14em] text-fg-3 uppercase">
								Knowledge Base · v0.1
							</div>
						</div>
					)}
				</div>

				{/* Section label */}
				<div className="px-5 pt-6 pb-2 font-mono text-[10px] tracking-[0.14em] text-fg-3 uppercase">
					{isCivic ? '功能 · Workspace' : 'Workspace'}
				</div>

				{/* Nav */}
				<nav className="flex flex-col">
					{NAV.map((item) => {
						const isActive = item.key === active;
						return (
							<button
								key={item.key}
								onClick={() => setActive(item.key)}
								className={`group relative flex items-center gap-3 px-5 py-2.5 text-left transition-colors ${
									isActive
										? 'bg-ink-2 text-fg-0'
										: 'text-fg-1 hover:bg-ink-2 hover:text-fg-0'
								}`}
							>
								{isActive && (
									<span className="absolute left-0 top-0 bottom-0 w-[2px] bg-amber" />
								)}
								<span className="font-mono text-[10px] text-fg-3 w-5">
									{item.code}
								</span>
								<span className="text-[13px]">
									{isCivic ? item.cn : item.label}
								</span>
							</button>
						);
					})}
				</nav>

				<div className="px-5 pt-8 pb-2 font-mono text-[10px] tracking-[0.14em] text-fg-3 uppercase">
					{isCivic ? '预览 · Preview' : 'Preview'}
				</div>
				<button
					onClick={() => setShowAuth(true)}
					className="group relative flex items-center gap-3 px-5 py-2.5 text-left text-fg-1 hover:bg-ink-2 hover:text-fg-0 transition-colors"
				>
					<LoginOutlined className="text-fg-3 text-[12px]" />
					<span className="text-[13px]">
						{isCivic ? '登录注册页' : 'Auth screens'}
					</span>
					<span className="ml-auto font-mono text-[9px] text-fg-3 tracking-wider uppercase">
						↗
					</span>
				</button>

				{/* footer */}
				<div className="mt-auto p-5 border-t border-line">
					<div className="flex items-center gap-2.5">
						<div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
						<span className="font-mono text-[10px] tracking-wider uppercase text-fg-2">
							{isCivic ? '运行正常' : 'All systems normal'}
						</span>
					</div>
					<div className="mt-2 font-mono text-[10px] text-fg-3">
						build · 7f2c·2026.06
					</div>
				</div>
			</aside>

			{/* MAIN */}
			<main className="flex-1 flex flex-col min-w-0">
				{/* Header */}
				<header className="h-16 shrink-0 px-8 border-b border-line flex items-center justify-between bg-ink-0">
					<div className="flex items-center gap-2 font-mono text-[12px] text-fg-2">
						<span>{isCivic ? '工作台' : 'workspace'}</span>
						<span className="text-amber">/</span>
						<span className="text-fg-0">
							{isCivic
								? NAV.find((n) => n.key === active)?.cn
								: active}
						</span>
					</div>
					<div className="flex items-center gap-5">
						{/* Theme switcher */}
						<div className="flex items-stretch border border-line text-[11px] font-mono tracking-wider uppercase">
							<button
								onClick={() => setThemeKey('tech')}
								className={`px-3 py-1.5 transition-colors ${
									themeKey === 'tech'
										? 'bg-amber text-ink-0'
										: 'text-fg-2 hover:text-fg-0'
								}`}
							>
								Tech
							</button>
							<button
								onClick={() => setThemeKey('civic')}
								className={`px-3 py-1.5 border-l border-line transition-colors ${
									themeKey === 'civic'
										? 'bg-amber text-ink-0'
										: 'text-fg-2 hover:text-fg-0'
								}`}
							>
								Civic
							</button>
						</div>
						<div className="flex items-center gap-2 px-3 py-1.5 rounded border border-line text-fg-2 hover:text-fg-0 hover:border-line-2 cursor-pointer transition-colors">
							<span className="font-mono text-[11px]">
								{isCivic ? '搜索' : 'search'}
							</span>
							<kbd className="font-mono text-[10px] text-fg-3 border border-line rounded px-1.5 py-0.5">
								⌘K
							</kbd>
						</div>
						<div className="w-px h-5 bg-line" />
						<div className="flex items-center gap-2.5">
							<Avatar
								size={26}
								icon={<UserOutlined />}
								className="!bg-ink-2 !text-fg-1"
							/>
							<div className="font-mono text-[11px] text-fg-1">
								admin@rag.kb
							</div>
						</div>
					</div>
				</header>

				{/* Page Title */}
				<div className="px-8 pt-8 pb-6 bg-ink-0">
					<div className="font-mono text-[10px] tracking-[0.14em] text-amber uppercase mb-3">
						{`${isCivic ? '章节' : 'Section'} · ${NAV.find((n) => n.key === active)?.code}`}
					</div>
					{isCivic ? (
						<>
							<h1 className="font-display text-[40px] leading-none text-fg-0">
								{meta.cnTitle}
							</h1>
							<div className="mt-2 font-sans text-[13px] tracking-[0.08em] text-fg-2 uppercase">
								{meta.title}
							</div>
							<p className="mt-4 text-[14px] text-fg-1 max-w-xl leading-relaxed">
								{meta.cnSubtitle}
							</p>
						</>
					) : (
						<>
							<h1 className="font-display text-[44px] leading-none text-fg-0">
								{meta.title}
							</h1>
							<p className="mt-3 text-[14px] text-fg-2 max-w-xl">
								{meta.subtitle}
							</p>
						</>
					)}
				</div>

				{/* Page content */}
				<div className="flex-1 px-8 pb-8 bg-ink-0 overflow-auto">
					{active === 'users' && <Users />}
					{active === 'documents' && <Documents />}
					{active === 'faq' && <FAQ />}
					{active === 'chat' && <Chat />}
				</div>
			</main>
		</div>
	);
}

export default App;
