import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';

const DEFAULT_AUTO_HIDE_MS = 5000;

interface ErrorMessageProps {
    message: string;
    onRetry?: () => void;
    className?: string;
    autoHideAfter?: number;
}

export const ErrorMessage = ({
                                 message,
                                 onRetry,
                                 className,
                                 autoHideAfter = DEFAULT_AUTO_HIDE_MS,
                             }: ErrorMessageProps) => {
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        setVisible(true);

        if (!Number.isFinite(autoHideAfter) || autoHideAfter <= 0) return;

        const id = setTimeout(() => setVisible(false), autoHideAfter);
        return () => clearTimeout(id);
    }, [message, autoHideAfter]);

    if (!visible) return null;

    return (
        <div className={cn('flex flex-col items-center justify-center gap-3 py-16 text-center px-4', className)}>
            <span className="text-4xl">💔</span>
            <p className="text-base font-medium text-foreground max-w-sm">
                Oups, quelque chose a mal tourné
            </p>
            <p className="text-sm text-muted-foreground max-w-sm">{message}</p>
            {onRetry && (
                <Button
                    variant="outline"
                    size="sm"
                    className="mt-2 rounded-full gap-1.5 hover:border-primary/40 hover:text-primary"
                    onClick={onRetry}
                >
                    <RefreshCw className="h-3.5 w-3.5" />
                    Réessayer
                </Button>
            )}
        </div>
    );
};