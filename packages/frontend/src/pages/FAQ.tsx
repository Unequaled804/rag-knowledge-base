import { useState } from 'react';
import { Input, Button, Modal, Form, Select, App, Popconfirm } from 'antd';
import {
	PlusOutlined,
	SearchOutlined,
	EditOutlined,
	DeleteOutlined
} from '@ant-design/icons';

type Category = 'general' | 'billing' | 'technical' | 'security';

interface FAQItem {
	id: string;
	question: string;
	answer: string;
	category: Category;
	updatedAt: string;
	views: number;
}

const MOCK_FAQS: FAQItem[] = [
	{
		id: 'f1',
		question: 'How does retrieval ranking work?',
		answer: 'We blend dense vector similarity (cosine, OpenAI text-embedding-3-small) with sparse BM25 keyword matching, then re-rank top-50 candidates with a cross-encoder before passing the top 6 chunks to the model. Chunk overlap is 64 tokens; chunks are 512 tokens by default.',
		category: 'technical',
		updatedAt: '2026-06-10',
		views: 248
	},
	{
		id: 'f2',
		question: 'Are my uploaded documents used to train any model?',
		answer: 'No. Embeddings are produced inside your workspace and stored in pgvector. We never send raw documents to a third-party training pipeline. Inference uses provider APIs with zero-retention agreements where available.',
		category: 'security',
		updatedAt: '2026-06-08',
		views: 1402
	},
	{
		id: 'f3',
		question:
			'What is the difference between FAQ entries and indexed documents?',
		answer: 'FAQ entries are hand-curated Q/A pairs that take priority over retrieved chunks — if a question matches an FAQ entry above a similarity threshold, that exact answer is returned. Use FAQs for high-value, frequently asked questions where you want deterministic answers.',
		category: 'general',
		updatedAt: '2026-06-05',
		views: 87
	},
	{
		id: 'f4',
		question: 'Can I change the billing plan mid-cycle?',
		answer: 'Yes. Upgrades take effect immediately and are pro-rated against the remaining cycle. Downgrades take effect at the next renewal so you keep the higher tier for the period you have already paid for.',
		category: 'billing',
		updatedAt: '2026-06-01',
		views: 33
	}
];

const CATEGORY_LABEL: Record<Category, string> = {
	general: 'General',
	billing: 'Billing',
	technical: 'Technical',
	security: 'Security'
};

function CategoryTag({ category }: { category: Category }) {
	return (
		<span className="font-mono text-[10px] tracking-wider uppercase text-fg-2 border border-line px-1.5 py-0.5">
			{CATEGORY_LABEL[category]}
		</span>
	);
}

interface FAQFormValues {
	question: string;
	answer: string;
	category: Category;
}

function FAQ() {
	const { message } = App.useApp();
	const [items, setItems] = useState<FAQItem[]>(MOCK_FAQS);
	const [expanded, setExpanded] = useState<string | null>('f1');
	const [keyword, setKeyword] = useState('');
	const [filter, setFilter] = useState<Category | 'all'>('all');
	const [modalOpen, setModalOpen] = useState(false);
	const [editing, setEditing] = useState<FAQItem | null>(null);
	const [form] = Form.useForm<FAQFormValues>();

	const filtered = items
		.filter((i) => (filter === 'all' ? true : i.category === filter))
		.filter(
			(i) =>
				i.question.toLowerCase().includes(keyword.toLowerCase()) ||
				i.answer.toLowerCase().includes(keyword.toLowerCase())
		);

	const isEdit = editing !== null;

	const handleAdd = () => {
		setEditing(null);
		form.resetFields();
		setModalOpen(true);
	};

	const handleEdit = (item: FAQItem) => {
		setEditing(item);
		form.setFieldsValue({
			question: item.question,
			answer: item.answer,
			category: item.category
		});
		setModalOpen(true);
	};

	const handleDelete = (item: FAQItem) => {
		setItems((prev) => prev.filter((i) => i.id !== item.id));
		message.success('Entry removed');
	};

	const handleSubmit = async () => {
		const values = await form.validateFields();
		if (isEdit && editing) {
			setItems((prev) =>
				prev.map((i) =>
					i.id === editing.id
						? {
								...i,
								...values,
								updatedAt: new Date().toISOString().slice(0, 10)
							}
						: i
				)
			);
			message.success('Entry updated');
		} else {
			setItems((prev) => [
				{
					id: String(Date.now()),
					...values,
					updatedAt: new Date().toISOString().slice(0, 10),
					views: 0
				},
				...prev
			]);
			message.success('Entry created');
		}
		setModalOpen(false);
	};

	const categories: (Category | 'all')[] = [
		'all',
		'general',
		'technical',
		'billing',
		'security'
	];

	return (
		<div>
			{/* Toolbar */}
			<div className="flex items-center justify-between mb-5">
				<div className="flex items-center gap-3">
					<Input
						prefix={<SearchOutlined className="text-fg-3" />}
						placeholder="Search questions and answers..."
						value={keyword}
						onChange={(e) => setKeyword(e.target.value)}
						allowClear
						className="!w-96"
					/>
					<span className="font-mono text-[11px] tracking-wider uppercase text-fg-3">
						{filtered.length} entries
					</span>
				</div>
				<Button
					type="primary"
					icon={<PlusOutlined />}
					onClick={handleAdd}
				>
					New entry
				</Button>
			</div>

			{/* Category filter strip */}
			<div className="flex items-center gap-1 mb-6 border-b border-line">
				{categories.map((c) => (
					<button
						key={c}
						onClick={() => setFilter(c)}
						className={`relative px-4 py-2.5 font-mono text-[11px] tracking-wider uppercase transition-colors ${
							filter === c
								? 'text-fg-0'
								: 'text-fg-2 hover:text-fg-0'
						}`}
					>
						{c === 'all' ? 'All' : CATEGORY_LABEL[c]}
						{filter === c && (
							<span className="absolute left-0 right-0 bottom-[-1px] h-[2px] bg-amber" />
						)}
					</button>
				))}
			</div>

			{/* List */}
			<div className="border border-line bg-ink-1">
				{filtered.length === 0 ? (
					<div className="px-6 py-16 text-center font-mono text-[12px] uppercase tracking-wider text-fg-3">
						No entries
					</div>
				) : (
					filtered.map((item, idx) => {
						const isOpen = expanded === item.id;
						return (
							<div
								key={item.id}
								className="border-b border-line last:border-b-0"
							>
								<button
									onClick={() =>
										setExpanded(isOpen ? null : item.id)
									}
									className="w-full text-left px-6 py-5 flex items-start gap-6 hover:bg-ink-2 transition-colors group"
								>
									<div className="font-mono text-[10px] text-fg-3 mt-1.5 w-6">
										{String(idx + 1).padStart(2, '0')}
									</div>
									<div className="flex-1 min-w-0">
										<div className="flex items-center gap-3 mb-2">
											<CategoryTag
												category={item.category}
											/>
											<span className="font-mono text-[10px] tracking-wider uppercase text-fg-3">
												{item.views} views · updated{' '}
												{item.updatedAt}
											</span>
										</div>
										<div className="font-display text-[22px] italic text-fg-0 leading-snug">
											{item.question}
										</div>
										{isOpen && (
											<div className="mt-4 pt-4 border-t border-line text-[14px] text-fg-1 leading-relaxed max-w-3xl">
												{item.answer}
											</div>
										)}
									</div>
									<div className="flex items-center gap-1 mt-1 opacity-60 group-hover:opacity-100 transition-opacity">
										<span
											role="button"
											tabIndex={0}
											onClick={(e) => {
												e.stopPropagation();
												handleEdit(item);
											}}
											onKeyDown={(e) => {
												if (e.key === 'Enter') {
													e.stopPropagation();
													handleEdit(item);
												}
											}}
											className="p-2 text-fg-2 hover:text-amber transition-colors"
										>
											<EditOutlined />
										</span>
										<Popconfirm
											title="Remove entry?"
											okText="Remove"
											cancelText="Cancel"
											okButtonProps={{ danger: true }}
											onConfirm={(e) => {
												e?.stopPropagation();
												handleDelete(item);
											}}
											onCancel={(e) =>
												e?.stopPropagation()
											}
										>
											<span
												role="button"
												tabIndex={0}
												onClick={(e) =>
													e.stopPropagation()
												}
												className="p-2 text-fg-2 hover:text-red-400 transition-colors"
											>
												<DeleteOutlined />
											</span>
										</Popconfirm>
										<span className="ml-2 font-mono text-[10px] text-fg-3 w-6 text-right">
											{isOpen ? '−' : '+'}
										</span>
									</div>
								</button>
							</div>
						);
					})
				)}
			</div>

			<Modal
				title={
					<span className="font-mono text-[11px] tracking-[0.14em] uppercase text-fg-2">
						{isEdit ? 'Edit entry' : 'New entry'}
					</span>
				}
				open={modalOpen}
				onCancel={() => setModalOpen(false)}
				onOk={handleSubmit}
				okText={isEdit ? 'Save' : 'Create'}
				destroyOnHidden
				width={620}
			>
				<Form
					form={form}
					layout="vertical"
					initialValues={{ category: 'general' }}
					className="!mt-5"
					requiredMark={false}
				>
					<Form.Item
						label={
							<span className="font-mono text-[10px] tracking-wider uppercase text-fg-2">
								Question
							</span>
						}
						name="question"
						rules={[
							{ required: true, message: 'Question required' },
							{ max: 200, message: 'Max 200 characters' }
						]}
					>
						<Input placeholder="What do users frequently ask?" />
					</Form.Item>
					<Form.Item
						label={
							<span className="font-mono text-[10px] tracking-wider uppercase text-fg-2">
								Answer
							</span>
						}
						name="answer"
						rules={[
							{ required: true, message: 'Answer required' },
							{ min: 10, message: 'At least 10 characters' }
						]}
					>
						<Input.TextArea
							rows={6}
							placeholder="A clear, deterministic answer..."
						/>
					</Form.Item>
					<Form.Item
						label={
							<span className="font-mono text-[10px] tracking-wider uppercase text-fg-2">
								Category
							</span>
						}
						name="category"
						rules={[{ required: true }]}
					>
						<Select
							options={(
								Object.keys(CATEGORY_LABEL) as Category[]
							).map((c) => ({
								label: CATEGORY_LABEL[c],
								value: c
							}))}
						/>
					</Form.Item>
				</Form>
			</Modal>
		</div>
	);
}

export default FAQ;
