import React from 'react';
import { Camera } from 'lucide-react';
import { cn } from '@/lib/utils';

export type PhotoAspectRatio = '4:3' | '16:9' | '16:10' | '3:4' | '1:1';

const aspectClasses: Record<PhotoAspectRatio, string> = {
  '4:3': 'aspect-[4/3]',
  '16:9': 'aspect-[16/9]',
  '16:10': 'aspect-[16/10]',
  '3:4': 'aspect-[3/4]',
  '1:1': 'aspect-square',
};

export interface PhotoPlaceholderProps {
  title: string;
  shotGuide: string;
  aspectRatio?: PhotoAspectRatio;
  dimensions?: string;
  fileHint?: string;
  ariaLabel?: string;
  className?: string;
}

export function PhotoPlaceholder({
  title,
  shotGuide,
  aspectRatio = '16:9',
  dimensions,
  fileHint,
  ariaLabel,
  className,
}: PhotoPlaceholderProps) {
  return (
    <div
      role="img"
      aria-label={ariaLabel || `${title} placeholder`}
      className={cn(
        'bg-slate-100 border-2 border-dashed border-slate-300 rounded-lg text-slate-700 flex flex-col justify-between p-3.5 sm:p-4 select-none',
        aspectClasses[aspectRatio],
        className
      )}
    >
      {/* Top Annotation Bar */}
      <div className="flex flex-wrap items-center justify-between gap-1.5 text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider text-slate-500">
        <span className="inline-flex items-center gap-1.5">
          <Camera className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" aria-hidden="true" />
          <span>Photo · {aspectRatio}</span>
        </span>
        {dimensions && (
          <span className="text-slate-600 bg-white px-1.5 py-0.5 rounded border border-slate-300 whitespace-nowrap">
            {dimensions}
          </span>
        )}
      </div>

      {/* Center Shot Guide */}
      <div className="my-auto py-2 text-center max-w-sm mx-auto">
        <p className="text-sm font-bold text-slate-800 leading-snug">
          {title}
        </p>
        <p className="mt-1.5 text-xs text-slate-600 leading-relaxed">
          {shotGuide}
        </p>
      </div>

      {/* Target File Hint */}
      {fileHint ? (
        <div className="text-[11px] text-slate-500 text-center truncate">
          Replace at: <span className="font-semibold text-slate-700">{fileHint}</span>
        </div>
      ) : (
        <div className="h-2" aria-hidden="true" />
      )}
    </div>
  );
}
