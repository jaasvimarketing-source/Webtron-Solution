import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import {initConversionTracking} from './utils/conversionTracking.ts';
import {initPrivacyAnalytics} from './utils/privacyAnalytics.ts';

initPrivacyAnalytics();
initConversionTracking();

createRoot(document.getElementById('root')!).render(<App />);

