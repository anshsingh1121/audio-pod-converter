
import React, { useRef } from 'react';
import { Upload } from 'lucide-react';

interface UploadButtonProps {
  onFileSelect: (file: File) => void;
}

const UploadButton: React.FC<UploadButtonProps> = ({ onFileSelect }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      onFileSelect(files[0]);
      // Reset the input so the same file can be uploaded again if needed
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <div className="mt-4 animate-slide-up" style={{ animationDelay: '0.3s' }}>
      <button onClick={handleClick} className="upload-button group">
        <Upload size={18} className="upload-button-icon" />
        <span className="text-sm text-podcast-accent">UPLOAD</span>
        <span className="ml-auto">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-podcast-accent">
            <path d="m9 18 6-6-6-6"/>
          </svg>
        </span>
      </button>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".txt,.md"
        className="hidden"
      />
    </div>
  );
};

export default UploadButton;
