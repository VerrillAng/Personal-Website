"use client";

import Window from "./window";

type Props = {
  isMaximized: boolean;
  onMaximize: () => void;
  onRestore: () => void;
  onClose: () => void;
};

function Home({ isMaximized, onMaximize, onRestore, onClose }: Props) {
  return (
    <Window isMaximized={isMaximized} onMaximize={onMaximize} onRestore={onRestore} onClose={onClose}>
      <div className="h-full flex items-center justify-center">
        <span className="text-[#76594D] text-lg font-medium">Welcome Home</span>
      </div>
    </Window>
  );
}

export default Home;
