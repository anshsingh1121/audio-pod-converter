
import React, { useState } from 'react';
import Header from '../components/Header';
import AudioPlayer from '../components/AudioPlayer';

const Index = () => {
  // Single audio file from Google Drive (converted to a direct playable link)
  const audioUrl = "https://drive.google.com/uc?export=download&id=150-O1iKysYz9VGVfojgCm8-M6sLl-oDT";
  const fileName = "My Audio Clip";
  const content = ""; // No subtitles needed

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-podcast-light">
      <div className="max-w-md mx-auto p-6">
        <Header />
        
        <main>
          <AudioPlayer 
            audioUrl={audioUrl} 
            fileName={fileName}
            isLoading={false}
            subtitles={content}
          />
        </main>
      </div>
    </div>
  );
};

export default Index;
