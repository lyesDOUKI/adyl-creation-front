import { useState, useCallback, useRef } from 'react';
import type { AsyncCreateState } from './async-create-state';

export function useAsyncCreateState<TArgs extends unknown[], TResult>(
    createOperation: (...operationArgs: TArgs) => Promise<TResult>
): AsyncCreateState<TResult> & { submitAction: (...operationArgs: TArgs) => Promise<TResult | null> } {
    const createOperationRef = useRef(createOperation);
    createOperationRef.current = createOperation;

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const submitAction = useCallback(async (...operationArgs: TArgs): Promise<TResult | null> => {
        setIsSubmitting(true);
        setError(null);
        try {
            const result = await createOperationRef.current(...operationArgs);
            setIsSubmitting(false);
            return result;
        } catch (caughtError) {
            setIsSubmitting(false);
            setError(caughtError instanceof Error ? caughtError.message : 'Une erreur est survenue.');
            return null;
        }
    }, []);

    return { isSubmitting, error, submitAction };
}