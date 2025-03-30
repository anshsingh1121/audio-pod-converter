import React, { useState, useEffect } from 'react';
import { toast } from "sonner";

import Header from '../components/Header';
import SourceSection from '../components/SourceSection';
import AudioPlayer from '../components/AudioPlayer';
import { convertTextToSpeech, readFileAsText } from '../utils/audioUtils';

interface SourceFile {
  id: string;
  name: string;
  content: string;
  audioUrl?: string;
}

const Index = () => {
  const [files, setFiles] = useState<SourceFile[]>([
    { 
      id: '2', 
      name: 'DEMO AUDIO', 
      content: 'This is a demo audio file with pre-loaded content.',
      audioUrl: 'https://res.cloudinary.com/dpyhcwi93/video/upload/v1743317667/combined_Conversation_vzkmvp.mp3'
    }
  ]);
  const [activeFileId, setActiveFileId] = useState<string | null>('2');
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isConverting, setIsConverting] = useState(false);

  useEffect(() => {
    const demoFile = files.find(file => file.id === '2');
    if (demoFile?.audioUrl) {
      setActiveFileId('2');
      setAudioUrl(demoFile.audioUrl);
    }
    
    const audioFiles = files.filter(file => file.audioUrl);
    if (audioFiles.length > 0) {
      const lastAudioFile = audioFiles[audioFiles.length - 1];
      setActiveFileId(lastAudioFile.id);
      setAudioUrl(lastAudioFile.audioUrl || null);
    }
  }, [files]);

  const handleFileSelect = async (fileId: string) => {
    setActiveFileId(fileId);
    
    const selectedFile = files.find(file => file.id === fileId);
    if (!selectedFile) return;
    
    if (selectedFile.audioUrl) {
      setIsConverting(false);
      setAudioUrl(selectedFile.audioUrl);
      return;
    }
    
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
      
      const newFile: SourceFile = {
        id: Date.now().toString(),
        name: file.name,
        content
      };
      
      setFiles(prevFiles => [...prevFiles, newFile]);
      
      setActiveFileId(newFile.id);
      
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

  const handleAddAudioUrl = (url: string, name: string) => {
    try {
      new URL(url);
      
      const newFile: SourceFile = {
        id: Date.now().toString(),
        name: name,
        content: `External audio from ${url}`,
        audioUrl: url
      };
      
      setFiles(prevFiles => [...prevFiles, newFile]);
      
      setActiveFileId(newFile.id);
      setAudioUrl(url);
      
      toast.success(`Added "${name}" successfully!`);
    } catch (error) {
      console.error('Invalid URL:', error);
      toast.error('Please enter a valid audio URL');
    }
  };

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
            onAddAudioUrl={handleAddAudioUrl}
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
