import React, { PropsWithChildren } from 'react';
export type MarqueeOpts = {
    rate?: number;
    /**
     * Switch the direction to up/down instead of left/right.
     * If this is enabled make sure your container has a height set.
     */
    upDown?: boolean;
    startOnScreen?: boolean;
};
export declare function Marquee({ children, ...marqueeOpts }: PropsWithChildren<MarqueeOpts>): React.JSX.Element;
