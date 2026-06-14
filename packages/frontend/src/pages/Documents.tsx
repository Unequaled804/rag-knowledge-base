import { useState } from 'react';
import { Upload, Button, Input, App, Progress, Popconfirm } from 'antd';
import {
	InboxOutlined,
	SearchOutlined,
	ReloadOutlined,
	FileTextOutlined
} from '@ant-design/icons';
import type { UploadProps } from 'antd';

type Status = 'pending' | 'processing' | 'ready' | 'failed';

interface DocItem {
	id: string;
	filename: string;
	ext: string;
	size: string;
	chunks: number;
	status: Status;
	progress?: number;
	uploadedAt: string;
}

const MOCK_DOCS: DocItem[] = [
	{
		id: 'd1',
		filename: 'product-spec-v3.pdf',
		ext: 'PDF',
		size: '2.4 MB',
		chunks: 84,
		status: 'ready',
		uploadedAt: '2026-06-11 11:02'
	},
	{
		id: 'd2',
		filename: 'onboarding-guide.md',
		ext: 'MD',
		size: '142 KB',
		chunks: 17,
		status: 'ready',
		uploadedAt: '2026-06-12 09:14'
	},
	{
		id: 'd3',
		filename: 'q2-financials.xlsx',
		ext: 'XLSX',
		size: '880 KB',
		chunks: 0,
		status: 'processing',
		progress: 64,
		uploadedAt: '2026-06-13 17:33'
	},
	{
		id: 'd4',
		filename: 'archive-2023.zip',
		ext: 'ZIP',
		size: '18.6 MB',
		chunks: 0,
		status: 'failed',
		uploadedAt: '2026-06-13 18:01'
	},
	{
		id: 'd5',
		filename: 'press-release-draft.docx',
		ext: 'DOCX',
		size: '64 KB',
		chunks: 0,
		status: 'pending',
		uploadedAt: '2026-06-13 21:22'
	}
];

function StatusPill({ status }: { status: Status }) {
	const map: Record<Status, { label: string; cls: string; dot?: string }> = {
		pending: {
			label: 'Pending',
			cls: 'border-line text-fg-2',
			dot: 'bg-fg-3'
		},
		processing: {
			label: 'Processing',
			cls: 'border-amber/40 text-amber bg-amber/[0.06]',
			dot: 'bg-amber amber-pulse'
		},
		ready: {
			label: 'Ready',
			cls: 'border-emerald-700/50 text-emerald-300 bg-emerald-700/[0.08]',
			dot: 'bg-emerald-400'
		},
		failed: {
			label: 'Failed',
			cls: 'border-red-700/40 text-red-300 bg-red-700/[0.08]',
			dot: 'bg-red-400'
		}
	};
	const s = map[status];
	return (
		<span
			className={`inline-flex items-center gap-1.5 font-mono text-[10px] tracking-wider uppercase px-2 py-0.5 border ${s.cls}`}
		>
			<span className={`w-1 h-1 rounded-full ${s.dot}`} />
			{s.label}
		</span>
	);
}

function Documents() {
	const { message } = App.useApp();
	const [docs, setDocs] = useState<DocItem[]>(MOCK_DOCS);
	const [keyword, setKeyword] = useState('');

	const filtered = docs.filter((d) =>
		d.filename.toLowerCase().includes(keyword.toLowerCase())
	);

	const stats = {
		total: docs.length,
		ready: docs.filter((d) => d.status === 'ready').length,
		processing: docs.filter((d) => d.status === 'processing').length,
		chunks: docs.reduce((sum, d) => sum + d.chunks, 0)
	};

	const uploadProps: UploadProps = {
		multiple: true,
		showUploadList: false,
		beforeUpload: (file) => {
			const newDoc: DocItem = {
				id: String(Date.now()) + Math.random(),
				filename: file.name,
				ext: (file.name.split('.').pop() ?? '').toUpperCase(),
				size: `${(file.size / 1024).toFixed(0)} KB`,
				chunks: 0,
				status: 'pending',
				uploadedAt: new Date()
					.toISOString()
					.slice(0, 16)
					.replace('T', ' ')
			};
			setDocs((prev) => [newDoc, ...prev]);
			message.success(`${file.name} queued for indexing`);
			return false;
		}
	};

	const handleDelete = (doc: DocItem) => {
		setDocs((prev) => prev.filter((d) => d.id !== doc.id));
		message.success(`Removed ${doc.filename}`);
	};

	return (
		<div>
			{/* Stats */}
			<div className="flex border border-line bg-ink-1 mb-6">
				{[
					{ label: 'Documents', value: stats.total },
					{ label: 'Indexed', value: stats.ready },
					{ label: 'Processing', value: stats.processing },
					{ label: 'Chunks', value: stats.chunks }
				].map((s, i) => (
					<div
						key={s.label}
						className={`flex-1 px-6 py-5 ${i !== 0 ? 'border-l border-line' : ''}`}
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

			{/* Upload zone */}
			<Upload.Dragger
				{...uploadProps}
				className="!bg-ink-1 !border-line hover:!border-amber/60 transition-colors"
				style={{ padding: '8px' }}
			>
				<div className="py-8 flex flex-col items-center">
					<div className="w-12 h-12 rounded-full border border-line flex items-center justify-center mb-4 bg-ink-2">
						<InboxOutlined className="text-amber text-[20px]" />
					</div>
					<div className="font-display text-[22px] italic text-fg-0">
						Drop files here
					</div>
					<div className="mt-2 font-mono text-[11px] tracking-wider uppercase text-fg-3">
						PDF · MD · TXT · DOCX · HTML — max 25 MB
					</div>
				</div>
			</Upload.Dragger>

			{/* Toolbar */}
			<div className="flex items-center justify-between mt-8 mb-4">
				<div className="flex items-center gap-3">
					<Input
						prefix={<SearchOutlined className="text-fg-3" />}
						placeholder="Filter by filename..."
						value={keyword}
						onChange={(e) => setKeyword(e.target.value)}
						allowClear
						className="!w-80"
					/>
					<span className="font-mono text-[11px] tracking-wider uppercase text-fg-3">
						{filtered.length} of {docs.length}
					</span>
				</div>
				<Button icon={<ReloadOutlined />}>Refresh</Button>
			</div>

			{/* File list (custom rows, not antd table — more design control) */}
			<div className="border border-line bg-ink-1">
				<div
					className="grid gap-6 px-6 py-3 border-b border-line font-mono text-[10px] tracking-[0.14em] uppercase text-fg-3"
					style={{
						gridTemplateColumns: '1fr 120px 120px 140px 180px 100px'
					}}
				>
					<div>File</div>
					<div>Type</div>
					<div>Size</div>
					<div>Chunks</div>
					<div>Status</div>
					<div className="text-right">Actions</div>
				</div>

				{filtered.length === 0 ? (
					<div className="px-6 py-16 text-center font-mono text-[12px] uppercase tracking-wider text-fg-3">
						No documents
					</div>
				) : (
					filtered.map((doc) => (
						<div
							key={doc.id}
							className="grid gap-6 px-6 py-4 border-b border-line last:border-b-0 hover:bg-ink-2 transition-colors group"
							style={{
								gridTemplateColumns:
									'1fr 120px 120px 140px 180px 100px'
							}}
						>
							<div className="flex items-center gap-3 min-w-0">
								<FileTextOutlined className="text-fg-3 shrink-0" />
								<div className="min-w-0">
									<div className="font-mono text-[13px] text-fg-0 truncate">
										{doc.filename}
									</div>
									<div className="font-mono text-[10px] text-fg-3 mt-0.5">
										uploaded {doc.uploadedAt}
									</div>
								</div>
							</div>
							<div className="flex items-center font-mono text-[11px] text-fg-1 tracking-wider">
								{doc.ext}
							</div>
							<div className="flex items-center font-mono text-[12px] text-fg-2 tabular-nums">
								{doc.size}
							</div>
							<div className="flex items-center font-mono text-[12px] text-fg-2 tabular-nums">
								{doc.status === 'processing' ? (
									<div className="w-24">
										<Progress
											percent={doc.progress ?? 0}
											size="small"
											strokeColor="#FFB000"
											trailColor="#27272d"
											showInfo={false}
										/>
									</div>
								) : doc.status === 'ready' ? (
									<span>{doc.chunks} chunks</span>
								) : (
									<span className="text-fg-3">—</span>
								)}
							</div>
							<div className="flex items-center">
								<StatusPill status={doc.status} />
							</div>
							<div className="flex items-center justify-end gap-3 opacity-60 group-hover:opacity-100 transition-opacity">
								<button className="font-mono text-[11px] uppercase tracking-wider text-fg-2 hover:text-amber transition-colors">
									Re-index
								</button>
								<Popconfirm
									title="Remove this document?"
									description={doc.filename}
									okText="Remove"
									okButtonProps={{ danger: true }}
									cancelText="Cancel"
									onConfirm={() => handleDelete(doc)}
								>
									<button className="font-mono text-[11px] uppercase tracking-wider text-fg-2 hover:text-red-400 transition-colors">
										Remove
									</button>
								</Popconfirm>
							</div>
						</div>
					))
				)}
			</div>
		</div>
	);
}

export default Documents;
