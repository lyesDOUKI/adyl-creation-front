import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ErrorMessageProps {
    message: string;
    onRetry?: () => void;
    className?: string;
}

export const ErrorMessage = ({ message, onRetry, className }: ErrorMessageProps) => {
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