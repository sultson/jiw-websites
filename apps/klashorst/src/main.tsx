import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';

// No StrictMode: its double mount in development tears down and loses the
// WebGL context behind the 3D room, leaving a blank canvas.
createRoot(document.getElementById('root')!).render(<App />);
