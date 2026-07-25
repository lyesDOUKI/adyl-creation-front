import { Button } from '@/components/ui/button';
import { Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface NotFoundProps {
    title?: string;
    description?: string;
    className?: string;
}

export const NotFound = ({
    title = 'Introuvable',
    description = "Cette création n'existe plus ou a été retirée de la boutique.",
    className,
}: NotFoundProps) => {
    const navigate = useNavigate();

    return (
        <div className={cn('flex flex-col items-center justify-center gap-3 py-20 text-center px-4', className)}>
            <span className="text-5xl animate-float">🧶</span>
            <h2 className="font-heading font-semibold text-lg text-foreground">{title}</h2>
            <p className="text-sm text-muted-foreground max-w-sm">{description}</p>
            <Button
                size="sm"
                className="mt-2 rounded-full gap-1.5 gradient-hero border-0 shadow-warm"
                onClick={() => navigate('/')}
            >
                <Home className="h-3.5 w-3.5" />
                Retour à la boutique
            </Button>
        </div>
    );
};