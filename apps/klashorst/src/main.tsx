import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';

const root = document.getElementById('root')!;

// The Worker paints the museum's first screen into this element before the
// page is sent, so there is something to look at while this bundle is on its
// way. It has done its job the moment React has a tree of its own, and it is
// cleared in the same task as the first render, so nothing flashes between
// the two.
root.replaceChildren();

// No StrictMode: its double mount in development tears down and loses the
// WebGL context behind the 3D room, leaving a blank canvas.
createRoot(root).render(<App />);
