import React from 'react';
interface NeuButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'accent' | 'danger' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
    icon?: React.ReactNode;
    children?: React.ReactNode;
    className?: string;
}
export declare const NeuButton: React.FC<NeuButtonProps>;
export {};
//# sourceMappingURL=NeuButton.d.ts.map