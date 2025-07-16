import React from "react";
import { Play, Pause, RotateCcw } from "lucide-react";

interface ControlPanelProps {
  onStoryMode: (enabled: boolean) => void;
  onReset: () => void;
  isStoryMode?: boolean;
}

const ControlPanel: React.FC<ControlPanelProps> = ({
  onStoryMode,
  onReset,
  isStoryMode = false,
}) => {
  const toggleStoryMode = () => {
    onStoryMode(!isStoryMode);
  };

  const handleReset = () => {
    onReset();
  };

  return (
    <div className="fixed bottom-6 left-6 bg-black/90 backdrop-blur-xl rounded-2xl border border-blue-500/40 p-4 z-40 shadow-2xl shadow-blue-500/20">
      <div className="flex items-center space-x-4">
        {/* Story Mode */}
        <button
          onClick={toggleStoryMode}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300 ${
            isStoryMode
              ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/40"
              : "bg-slate-800/80 text-blue-200 hover:bg-slate-700/80 border border-blue-500/20"
          }`}
        >
          {isStoryMode ? (
            <Pause className="w-4 h-4" />
          ) : (
            <Play className="w-4 h-4" />
          )}
          <span className="text-sm">Tour Angkasa</span>
        </button>

        {/* Reset */}
        <button
          onClick={handleReset}
          className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-slate-800/80 text-blue-200 hover:bg-slate-700/80 transition-all duration-300 border border-blue-500/20 hover:border-blue-400/40"
        >
          <RotateCcw className="w-4 h-4" />
          <span className="text-sm">Reset</span>
        </button>
      </div>
    </div>
  );
};

export default ControlPanel;
