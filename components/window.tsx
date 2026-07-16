"use client";

import Image from "next/image";
import { type ReactNode } from "react";

type Props = {
  title?: string;
  headerLeft?: ReactNode;
  isMaximized: boolean;
  onMaximize: () => void;
  onRestore: () => void;
  onMinimize: () => void;
  onClose: () => void;
  children: ReactNode;
};

function Window({ title, headerLeft, isMaximized, onMaximize, onRestore, onMinimize, onClose, children }: Props) {
  return (
    <div className="h-full w-full flex flex-col border border-[#CBBEA8] rounded-2xl">
      <div className="drag-handle flex items-center justify-between px-4 h-8 bg-[#F7E4BC] border-b border-[#CBBEA8] rounded-t-2xl cursor-grab active:cursor-grabbing">
        {headerLeft ?? (title && <span className="text-[#76594D] text-sm font-semibold select-none">{title}</span>)}
        <div className="flex items-center gap-4 text-[#7a6030] text-xs h-full">
          <button className="w-6 h-4 flex items-center justify-center hover:opacity-70 transition-opacity" onClick={onMinimize}>
            <Image src="/images/control_buttons/minimize.svg" alt="Minimize" width={12} height={12} />
          </button>
          <button className="w-6 h-4 flex items-center justify-center hover:opacity-70 transition-opacity" onClick={isMaximized ? onRestore : onMaximize}>
            <Image src={isMaximized ? "/images/control_buttons/restore.svg" : "/images/control_buttons/maximize.svg"} alt={isMaximized ? "Restore" : "Maximize"} width={12} height={12} />
          </button>
          <button className="w-6 h-4 flex items-center justify-center hover:opacity-70 transition-opacity" onClick={onClose}>
            <Image src="/images/control_buttons/close.svg" alt="Close" width={12} height={12} />
          </button>
        </div>
      </div>
      <div className="flex-1 min-h-0 bg-[#FFF7E7] rounded-b-2xl">
        {children}
      </div>
    </div>
  );
}

export default Window;
