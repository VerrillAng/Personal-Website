"use client";

import Image from "next/image";
import { type ReactNode } from "react";

type Props = {
  isMaximized: boolean;
  onMaximize: () => void;
  onRestore: () => void;
  onClose: () => void;
  children: ReactNode;
};

function Window({ isMaximized, onMaximize, onRestore, onClose, children }: Props) {
  return (
    <div className="h-full w-full flex flex-col border border-[#CBBEA8] rounded-2xl">
      <div className="drag-handle flex items-center justify-end px-4 h-8 bg-[#F7E4BC] border-b border-[#CBBEA8] rounded-t-2xl cursor-grab active:cursor-grabbing">
        <div className="flex items-center gap-4 text-[#7a6030] text-xs h-full">
          <button className="w-6 h-4 flex items-center justify-center hover:opacity-70 transition-opacity">
            <Image src="/images/control_buttons/minimize.svg" alt="Minimize" width={12} height={12} />
          </button>
          <button className="w-6 h-4 flex items-center justify-center hover:opacity-70 transition-opacity" onClick={isMaximized ? onRestore : onMaximize}>
            <Image src={isMaximized ? "/images/control_buttons/restore.svg" : "/images/control_buttons/Maximize.svg"} alt={isMaximized ? "Restore" : "Maximize"} width={12} height={12} />
          </button>
          <button className="w-6 h-4 flex items-center justify-center hover:opacity-70 transition-opacity" onClick={onClose}>
            <Image src="/images/control_buttons/close.svg" alt="Close" width={12} height={12} />
          </button>
        </div>
      </div>
      <div className="flex-1 bg-[#FFF7E7] rounded-b-2xl overflow-hidden">
        {children}
      </div>
    </div>
  );
}

export default Window;
