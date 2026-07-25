import { useState, useEffect, useCallback, useRef } from 'react';
import type { AsyncReadState } from './async-read-state';

export function useAsyncReadState<TData>(
    fetchData: () => Promise<TData>,
    fallbackValue: TData
): AsyncReadState<TData> & { refresh: () => void } {
    const fallbackValueRef = useRef(fallbackValue);
    fallbackValueRef.current = fallbackValue;
    const [state, setState] = useState<AsyncReadState<TData>>({
        data: fallbackValue,
        isLoading: true,
        error: null,
    });

    const load = useCallback(async () => {
        setState(previousState => ({ ...previousState, isLoading: true, error: null }));
        try {
            const data = await fetchData();
            setState({ data, isLoading: false, error: null });
        } catch (caughtError) {
            setState({
                data: fallbackValue,
                isLoading: false,
                error: caughtError instanceof Error ? caughtError.message : 'Une erreur est survenue.',
            });
        }
    }, [fetchData]);

    useEffect(() => {
        load();
    }, [load]);

    return { ...state, refresh: load };
}