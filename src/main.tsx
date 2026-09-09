import { createRoot } from 'react-dom/client';
import { AuthProvider } from '@/ui/auth/AuthProvider';
import App from '@/App.tsx';
import '@/index.css';
import {StrictMode} from "react";

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <AuthProvider>
            <App />
        </AuthProvider>
    </StrictMode>,
);