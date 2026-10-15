import React from 'react';
interface BadgeProps {
    children: React.ReactNode;
    variant?: 'approved' | 'stepup' | 'blocked' | 'neutral' | 'accent' | 'ring';
    size?: 'sm' | 'md';
    icon?: React.ReactNode;
    className?: string;
}
export declare const Badge: React.FC<BadgeProps>;
export {};
//# sourceMappingURL=Badge.d.ts.map