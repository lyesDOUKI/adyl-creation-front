// components/ui/readonly-field.tsx
import React from 'react';
import { Label } from '@/components/ui/label';

interface ReadonlyFieldProps {
    icon: React.ElementType;
    label: string;
    value: string;
}

/**
 * Champ en lecture seule affichant une icône, un label et une valeur.
 * Extrait de Checkout.tsx pour être partagé (ex: Appointments.tsx) sans
 * dupliquer le JSX.
 */
export const ReadonlyField = ({ icon: Icon, label, value }: ReadonlyFieldProps) => (
    <div className="space-y-1.5">
        <Label className="text-primary text-sm font-medium">{label}</Label>

        <div className="relative flex items-center gap-2.5 rounded-md border bg-muted/40 px-3 py-2.5 text-sm">
            <Icon className="h-4 w-4 text-muted-foreground shrink-0" />
            <span className="text-foreground truncate">{value || '—'}</span>
        </div>
    </div>
);