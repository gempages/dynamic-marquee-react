import { PropsWithChildren } from 'react';
import { Marquee as MarqueeLib } from 'dynamic-marquee';
export declare function WatchSize({ marqueeInstance, onChange, children, }: PropsWithChildren<{
    marqueeInstance: MarqueeLib;
    onChange: (size: number) => void;
}>): JSX.Element;
