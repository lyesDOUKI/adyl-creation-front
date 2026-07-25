import { cn } from '@/lib/utils';

interface SpinnerProps {
    label?: string;
    className?: string;
}

export const Spinner = ({ label = 'Chargement...', className }: SpinnerProps) => {
    return (
        <div className={cn('flex flex-col items-center justify-center gap-4 py-16', className)}>
            <div className="relative h-14 w-14">
                {/* Anneau qui tourne */}
                <div className="absolute inset-0 rounded-full border-4 border-primary/15" />
                <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-primary animate-spin" />
                {/* Cœur qui bat au centre */}
                <div className="absolute inset-0 flex items-center justify-center text-lg animate-heartbeat">
                    💗
                </div>
            </div>
            <p className="text-sm text-muted-foreground font-medium">{label}</p>
        </div>
    );
};