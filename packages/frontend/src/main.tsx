import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ErrorBoundary } from 'react-error-boundary';
import './index.css';
import App from './App.tsx';

createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<ErrorBoundary
			fallbackRender={({ error }) => (
				<div>
					<h2>Something went wrong!</h2>
					<button onClick={() => window.location.reload()}>
						Reload
					</button>
					<p>{(error as Error).message}</p>
				</div>
			)}
		>
			<App />
		</ErrorBoundary>
	</StrictMode>
);
