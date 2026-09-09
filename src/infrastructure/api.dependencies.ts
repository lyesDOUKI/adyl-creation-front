import { tokenProvider } from '@/infrastructure/auth/auth.dependencies';
import { ApiClient } from './ApiClient';

export const apiClient = new ApiClient(
    tokenProvider,
);