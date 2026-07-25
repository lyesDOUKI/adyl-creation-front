import type { OrderStep } from '@/domain/order/OrderStep';
import { Check, Clock, Package, Truck, Home } from 'lucide-react';
import { cn } from '@/lib/utils';
import React from 'react';

const stepIcons: Record<string, React.ElementType> = {
  pending: Clock,
  confirmed: Check,
  in_progress: Package,
  shipped: Truck,
  delivered: Home,
};

interface OrderTimelineProps {
  steps: OrderStep[];
}

export const OrderTimeline = ({ steps }: OrderTimelineProps) => (
  <>
    {/* Desktop: horizontal */}
    <div className="hidden md:flex items-start justify-between w-full">
      {steps.map((step, i) => {
        const Icon = stepIcons[step.status] || Clock;
        return (
          <div key={step.status} className="flex-1 flex flex-col items-center relative">
            {/* Connector line */}
            {i < steps.length - 1 && (
              <div
                className={cn(
                  'absolute top-5 left-1/2 w-full h-0.5',
                  step.completed ? 'bg-primary' : 'bg-border'
                )}
              />
            )}
            <div
              className={cn(
                'relative z-10 h-10 w-10 rounded-full flex items-center justify-center border-2 transition-colors',
                step.completed
                  ? 'bg-primary border-primary text-primary-foreground'
                  : 'bg-card border-border text-muted-foreground'
              )}
            >
              <Icon className="h-5 w-5" />
            </div>
            <p className={cn('mt-2 text-xs font-medium text-center', step.completed ? 'text-foreground' : 'text-muted-foreground')}>
              {step.label}
            </p>
            {step.date && (
              <p className="text-[10px] text-muted-foreground text-center">
                {step.date.toLocaleDateString('fr-FR')}
              </p>
            )}
          </div>
        );
      })}
    </div>

    {/* Mobile: vertical */}
    <div className="md:hidden space-y-0">
      {steps.map((step, i) => {
        const Icon = stepIcons[step.status] || Clock;
        return (
          <div key={step.status} className="flex gap-4">
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  'h-10 w-10 rounded-full flex items-center justify-center border-2 transition-colors',
                  step.completed
                    ? 'bg-primary border-primary text-primary-foreground'
                    : 'bg-card border-border text-muted-foreground'
                )}
              >
                <Icon className="h-5 w-5" />
              </div>
              {i < steps.length - 1 && (
                <div className={cn('w-0.5 h-8', step.completed ? 'bg-primary' : 'bg-border')} />
              )}
            </div>
            <div className="pt-2">
              <p className={cn('font-medium text-sm', step.completed ? 'text-foreground' : 'text-muted-foreground')}>
                {step.label}
              </p>
              {step.date && (
                <p className="text-xs text-muted-foreground">
                  {step.date.toLocaleDateString('fr-FR')}
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  </>
);
