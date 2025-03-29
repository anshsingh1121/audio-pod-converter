
import React from 'react';
import FileItem from './FileItem';
import UploadButton from './UploadButton';
import AudioUrlInput from './AudioUrlInput';

interface SourceFile {
  id: string;
  name: string;
  content: string;
}

interface SourceSectionProps {
  files: SourceFile[];
  activeFileId: string | null;
  onFileSelect: (fileId: string) => void;
  onFileUpload: (file: File) => void;
  onAddAudioUrl?: (url: string, name: string) => void;
}

const SourceSection: React.FC<SourceSectionProps> = ({
  files,
  activeFileId,
  onFileSelect,
  onFileUpload,
  onAddAudioUrl
}) => {
  return (
    <section className="mb-6 animate-fade-in" style={{ animationDelay: '0.1s' }}>
      <h2 className="text-sm font-medium text-gray-500 mb-3">Source</h2>
      <div className="border border-dashed border-podcast-medium rounded-lg p-4 bg-white bg-opacity-40 backdrop-blur-sm">
        <div className="space-y-2 min-h-[180px]">
          {files.length === 0 ? (
            <div className="text-center py-6 text-gray-400 italic text-sm">
              Upload a text file to convert to audio
            </div>
          ) : (
            files.map((file) => (
              <FileItem
                key={file.id}
                name={file.name}
                isActive={file.id === activeFileId}
                onClick={() => onFileSelect(file.id)}
              />
            ))
          )}
        </div>
        <UploadButton onFileSelect={onFileUpload} />
        {onAddAudioUrl && <AudioUrlInput onAddAudio={onAddAudioUrl} />}
      </div>
    </section>
  );
};

export default SourceSection;
