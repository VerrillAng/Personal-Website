"use client";

import Window from "./window";

type Props = {
  isMaximized: boolean;
  onMaximize: () => void;
  onRestore: () => void;
  onMinimize: () => void;
  onClose: () => void;
};

function Projects({ isMaximized, onMaximize, onRestore, onMinimize, onClose }: Props) {
  return (
    <Window title="Projects" isMaximized={isMaximized} onMaximize={onMaximize} onRestore={onRestore} onMinimize={onMinimize} onClose={onClose}>
      <div className="h-full flex items-center justify-center">
        <span className="text-[#76594D] text-lg font-medium">Projects</span>
      </div>
    </Window>
  );
}

export default Projects;
