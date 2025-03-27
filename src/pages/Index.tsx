
import React, { useState } from 'react';
import { toast } from "sonner";

import Header from '../components/Header';
import SourceSection from '../components/SourceSection';
import AudioPlayer from '../components/AudioPlayer';
import { convertTextToSpeech, readFileAsText } from '../utils/audioUtils';

interface SourceFile {
  id: string;
  name: string;
  content: string;
}

const Index = () => {
  const [files, setFiles] = useState<SourceFile[]>([
    { id: '1', name: 'AI PODCAST', content: 'This is a sample podcast about artificial intelligence.' }
  ]);
  const [activeFileId, setActiveFileId] = useState<string | null>('1');
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isConverting, setIsConverting] = useState(false);

  const handleFileSelect = async (fileId: string) => {
    setActiveFileId(fileId);
    
    // Find the selected file
    const selectedFile = files.find(file => file.id === fileId);
    if (!selectedFile) return;
    
    // Start conversion
    setIsConverting(true);
    setAudioUrl(null);
    
    try {
      const result = await convertTextToSpeech(selectedFile.content);
      
      if (result.success && result.audioUrl) {
        setAudioUrl(result.audioUrl);
      } else {
        toast.error(result.error || 'Conversion failed');
      }
    } catch (error) {
      console.error('Error during conversion:', error);
      toast.error('An unexpected error occurred');
    } finally {
      setIsConverting(false);
    }
  };

  const handleFileUpload = async (file: File) => {
    try {
      const content = await readFileAsText(file);
      
      // Create a new file object
      const newFile: SourceFile = {
        id: Date.now().toString(),
        name: file.name,
        content
      };
      
      // Add to files list
      setFiles(prevFiles => [...prevFiles, newFile]);
      
      // Select and convert the new file
      setActiveFileId(newFile.id);
      
      // Start conversion
      setIsConverting(true);
      setAudioUrl(null);
      
      const result = await convertTextToSpeech(content);
      
      if (result.success && result.audioUrl) {
        setAudioUrl(result.audioUrl);
        toast.success(`${file.name} converted successfully!`);
      } else {
        toast.error(result.error || 'Conversion failed');
      }
    } catch (error) {
      console.error('Error processing file:', error);
      toast.error('Failed to process file');
    } finally {
      setIsConverting(false);
    }
  };

  // Get the active file for the audio player
  const activeFile = activeFileId ? files.find(file => file.id === activeFileId) : null;
  const activeFileName = activeFile?.name || 'Audio';
  const activeContent = activeFile?.content || '';

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-podcast-light">
      <div className="max-w-md mx-auto p-6">
        <Header />
        
        <main>
          <SourceSection 
            files={files}
            activeFileId={activeFileId}
            onFileSelect={handleFileSelect}
            onFileUpload={handleFileUpload}
          />
          
          <AudioPlayer 
            audioUrl={audioUrl} 
            fileName={activeFileName}
            isLoading={isConverting}
            subtitles={activeContent}
          />
        </main>
      </div>
    </div>
  );
};

export default Index;
