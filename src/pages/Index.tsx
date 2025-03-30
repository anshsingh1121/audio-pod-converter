
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
    { id: '1', name: 'AI PODCAST', content: 'This is a sample podcast about artificial intelligence.' },
    { 
      id: '2', 
      name: 'DEMO AUDIO', 
      content: 'This is a demo audio file with pre-loaded content.',
      audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3'
    }
  ]);
  const [activeFileId, setActiveFileId] = useState<string | null>('1');
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isConverting, setIsConverting] = useState(false);

  // Get the most recently added audio file (if any)
  useEffect(() => {
    // Find the last file with an audioUrl
    const audioFiles = files.filter(file => file.audioUrl);
    if (audioFiles.length > 0) {
      const lastAudioFile = audioFiles[audioFiles.length - 1];
      setActiveFileId(lastAudioFile.id);
      setAudioUrl(lastAudioFile.audioUrl || null);
    }
  }, [files.length]); // Only run when the files array changes length

  const handleFileSelect = async (fileId: string) => {
    setActiveFileId(fileId);
    
    // Find the selected file
    const selectedFile = files.find(file => file.id === fileId);
    if (!selectedFile) return;
    
    // If file has a predefined audioUrl, use it directly
    if (selectedFile.audioUrl) {
      setIsConverting(false);
      setAudioUrl(selectedFile.audioUrl);
      return;
    }
    
    // Otherwise proceed with conversion
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

  const handleAddAudioUrl = (url: string, name: string) => {
    try {
      // Validate the URL (simple check)
      new URL(url); // This will throw if URL is invalid
      
      // Test if the URL is accessible by creating a temporary audio element
      const testAudio = new Audio();
      
      // Create a new audio file entry
      const newFile: SourceFile = {
        id: Date.now().toString(),
        name: name,
        content: `External audio from ${url}`,
        audioUrl: url
      };
      
      // Add to files list
      setFiles(prevFiles => [...prevFiles, newFile]);
      
      // Select the new file
      setActiveFileId(newFile.id);
      setAudioUrl(url);
      
      toast.success(`Added "${name}" successfully!`);
      
      // Add event listener to test loading
      testAudio.addEventListener('error', () => {
        toast.warning("Audio might not be playable. Please check if the URL is correct and accessible.");
      });
      
      // Set the source and load
      testAudio.src = url;
      testAudio.load();
    } catch (error) {
      console.error('Invalid URL:', error);
      toast.error('Please enter a valid audio URL');
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
