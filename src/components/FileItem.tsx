
import React from 'react';

interface FileItemProps {
  name: string;
  isActive: boolean;
  onClick: () => void;
}

const FileItem: React.FC<FileItemProps> = ({ name, isActive, onClick }) => {
  return (
    <div 
      className={`file-item animate-scale-in ${isActive ? 'file-item-active' : ''}`}
      onClick={onClick}
    >
      <div className={`w-6 h-6 rounded flex-shrink-0 ${isActive ? 'bg-podcast-accent' : 'bg-podcast-medium'} flex items-center justify-center`}>
        {isActive && (
          <span className="text-white text-xs">▶</span>
        )}
      </div>
      <span className="font-medium truncate">{name}</span>
    </div>
  );
};

export default FileItem;
