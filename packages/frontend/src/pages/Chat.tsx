import { useState } from 'react';
import { Input, Button, Select, Slider, Tooltip } from 'antd';
import {
	SendOutlined,
	ReloadOutlined,
	DatabaseOutlined
} from '@ant-design/icons';

interface Msg {
	id: string;
	role: 'user' | 'assistant';
	content: string;
	sources?: { title: string; chunk: string }[];
}

const INITIAL_MSGS: Msg[] = [
	{
		id: 'm1',
		role: 'user',
		content: 'How is retrieval ranking calculated?'
	},
	{
		id: 'm2',
		role: 'assistant',
		content:
			'Retrieval combines dense vector similarity with sparse BM25 keyword matching. The top-50 candidates are re-ranked by a cross-encoder, and the top-6 chunks are returned to the model as context. Chunks are 512 tokens with 64-token overlap by default.',
		sources: [
			{
				title: 'product-spec-v3.pdf',
				chunk: '... we blend dense vector similarity (cosine) with sparse BM25 matching, then re-rank top-50 candidates with a cross-encoder before passing the top 6 chunks ...'
			},
			{
				title: 'onboarding-guide.md',
				chunk: '... chunking defaults to 512 tokens per chunk with 64-token overlap to preserve semantic continuity across boundaries ...'
			}
		]
	}
];

function Chat() {
	const [messages, setMessages] = useState<Msg[]>(INITIAL_MSGS);
	const [input, setInput] = useState('');
	const [model, setModel] = useState('claude-opus-4-7');
	const [temperature, setTemperature] = useState(0.3);
	const [topK, setTopK] = useState(6);
	const [systemPrompt, setSystemPrompt] = useState(
		'You are a helpful assistant grounded in the provided knowledge base.'
	);

	const send = () => {
		const text = input.trim();
		if (!text) return;
		setMessages((prev) => [
			...prev,
			{ id: String(Date.now()), role: 'user', content: text }
		]);
		setInput('');
		// TODO: 调用后端 /chat 接口；这里 mock 一条回复
		setTimeout(() => {
			setMessages((prev) => [
				...prev,
				{
					id: String(Date.now() + 1),
					role: 'assistant',
					content:
						'This is a placeholder response. Wire up POST /chat to stream a real answer here, including retrieved sources.'
				}
			]);
		}, 600);
	};

	const reset = () => {
		setMessages([]);
	};

	return (
		<div
			className="grid gap-6 min-h-[520px]"
			style={{
				gridTemplateColumns: '1fr 320px',
				height: 'calc(100vh - 260px)'
			}}
		>
			{/* Conversation column */}
			<div className="flex flex-col border border-line bg-ink-1 min-h-0">
				{/* Top bar */}
				<div className="px-5 py-3 border-b border-line flex items-center justify-between shrink-0">
					<div className="flex items-center gap-3">
						<div className="w-1.5 h-1.5 rounded-full bg-amber amber-pulse" />
						<span className="font-mono text-[11px] tracking-wider uppercase text-fg-2">
							session · live
						</span>
						<span className="font-mono text-[11px] text-fg-3">
							· {messages.length} turns
						</span>
					</div>
					<button
						onClick={reset}
						className="font-mono text-[11px] tracking-wider uppercase text-fg-2 hover:text-amber transition-colors flex items-center gap-1.5"
					>
						<ReloadOutlined /> Reset
					</button>
				</div>

				{/* Messages */}
				<div className="flex-1 overflow-auto px-8 py-6 min-h-0">
					{messages.length === 0 ? (
						<div className="h-full flex flex-col items-center justify-center text-center">
							<div className="font-display italic text-[28px] text-fg-1 max-w-md leading-snug">
								Ask anything grounded in your knowledge base.
							</div>
							<div className="mt-4 font-mono text-[11px] tracking-wider uppercase text-fg-3">
								Retrieval-augmented · top-{topK} · temp{' '}
								{temperature.toFixed(2)}
							</div>
						</div>
					) : (
						<div className="space-y-8 max-w-3xl mx-auto">
							{messages.map((m) => (
								<div key={m.id}>
									<div className="font-mono text-[10px] tracking-[0.14em] uppercase text-fg-3 mb-2">
										{m.role === 'user'
											? '> you'
											: '< assistant'}
									</div>
									<div
										className={`text-[14px] leading-relaxed ${
											m.role === 'user'
												? 'text-fg-0'
												: 'text-fg-1'
										}`}
									>
										{m.content}
									</div>
									{m.sources && m.sources.length > 0 && (
										<div className="mt-4 border-l-2 border-amber/40 pl-4 space-y-3">
											<div className="font-mono text-[10px] tracking-wider uppercase text-amber">
												Retrieved · {m.sources.length}{' '}
												sources
											</div>
											{m.sources.map((s, i) => (
												<div
													key={i}
													className="border border-line bg-ink-2 p-3"
												>
													<div className="flex items-center gap-2 mb-2">
														<DatabaseOutlined className="text-fg-3 text-[11px]" />
														<span className="font-mono text-[11px] text-fg-1">
															{s.title}
														</span>
														<span className="font-mono text-[10px] text-fg-3">
															chunk #
															{String(
																Math.floor(
																	Math.random() *
																		80
																) + 1
															).padStart(3, '0')}
														</span>
													</div>
													<div className="text-[12px] text-fg-2 leading-relaxed font-mono">
														{s.chunk}
													</div>
												</div>
											))}
										</div>
									)}
								</div>
							))}
						</div>
					)}
				</div>

				{/* Input */}
				<div className="border-t border-line p-4 shrink-0">
					<div className="max-w-3xl mx-auto">
						<div className="relative">
							<Input.TextArea
								value={input}
								onChange={(e) => setInput(e.target.value)}
								onPressEnter={(e) => {
									if (!e.shiftKey) {
										e.preventDefault();
										send();
									}
								}}
								placeholder="Ask a question..."
								autoSize={{ minRows: 2, maxRows: 6 }}
								className="!pr-28 !bg-ink-2"
							/>
							<Button
								type="primary"
								onClick={send}
								icon={<SendOutlined />}
								disabled={!input.trim()}
								className="!absolute !right-2 !bottom-2"
							>
								Send
							</Button>
						</div>
						<div className="flex items-center justify-between mt-2 font-mono text-[10px] tracking-wider uppercase text-fg-3">
							<span>⏎ send · ⇧⏎ newline</span>
							<span>{input.length} chars</span>
						</div>
					</div>
				</div>
			</div>

			{/* Settings column */}
			<aside className="border border-line bg-ink-1 flex flex-col min-h-0">
				<div className="px-5 py-3 border-b border-line shrink-0">
					<div className="font-mono text-[10px] tracking-[0.14em] uppercase text-fg-3">
						Settings
					</div>
				</div>

				<div className="p-5 space-y-6 overflow-auto">
					<div>
						<label className="font-mono text-[10px] tracking-wider uppercase text-fg-2 block mb-2">
							Model
						</label>
						<Select
							value={model}
							onChange={setModel}
							className="!w-full"
							options={[
								{
									label: 'claude-opus-4-7',
									value: 'claude-opus-4-7'
								},
								{
									label: 'claude-sonnet-4-6',
									value: 'claude-sonnet-4-6'
								},
								{
									label: 'claude-haiku-4-5',
									value: 'claude-haiku-4-5'
								}
							]}
						/>
					</div>

					<div>
						<div className="flex items-center justify-between mb-2">
							<label className="font-mono text-[10px] tracking-wider uppercase text-fg-2">
								Temperature
							</label>
							<span className="font-mono text-[11px] text-amber tabular-nums">
								{temperature.toFixed(2)}
							</span>
						</div>
						<Slider
							min={0}
							max={1}
							step={0.05}
							value={temperature}
							onChange={(v) => setTemperature(v as number)}
							tooltip={{ open: false }}
						/>
						<div className="flex justify-between font-mono text-[9px] text-fg-3 tracking-wider uppercase">
							<span>deterministic</span>
							<span>creative</span>
						</div>
					</div>

					<div>
						<div className="flex items-center justify-between mb-2">
							<label className="font-mono text-[10px] tracking-wider uppercase text-fg-2">
								Top-K retrieval
							</label>
							<span className="font-mono text-[11px] text-amber tabular-nums">
								{topK}
							</span>
						</div>
						<Slider
							min={1}
							max={20}
							step={1}
							value={topK}
							onChange={(v) => setTopK(v as number)}
							tooltip={{ open: false }}
						/>
						<div className="font-mono text-[10px] text-fg-3 mt-1">
							Chunks passed to context window
						</div>
					</div>

					<div>
						<label className="font-mono text-[10px] tracking-wider uppercase text-fg-2 block mb-2">
							System prompt
						</label>
						<Input.TextArea
							value={systemPrompt}
							onChange={(e) => setSystemPrompt(e.target.value)}
							rows={5}
							className="!bg-ink-2 !font-mono !text-[12px]"
						/>
					</div>
				</div>

				<div className="mt-auto border-t border-line p-4 shrink-0">
					<div
						className="grid gap-3 font-mono text-[10px] uppercase tracking-wider"
						style={{ gridTemplateColumns: '1fr 1fr' }}
					>
						<div>
							<div className="text-fg-3">Tokens used</div>
							<Tooltip title="Across this session">
								<div className="text-fg-0 text-[13px] mt-1 tabular-nums">
									1,284
								</div>
							</Tooltip>
						</div>
						<div>
							<div className="text-fg-3">Latency p50</div>
							<div className="text-fg-0 text-[13px] mt-1 tabular-nums">
								642 ms
							</div>
						</div>
					</div>
				</div>
			</aside>
		</div>
	);
}

export default Chat;
