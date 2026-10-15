import React from 'react';
interface NeuCardProps extends React.HTMLAttributes<HTMLDivElement> {
    variant?: 'extruded' | 'inset' | 'deep' | 'flat';
    hoverable?: boolean;
    children: React.ReactNode;
    className?: string;
}
export declare const NeuCard: React.FC<NeuCardProps>;
export {};
//# sourceMappingURL=NeuCard.d.ts.map