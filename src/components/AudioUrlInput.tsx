
import React, { useState } from 'react';
import { Input } from './ui/input';
import { PlusCircle } from 'lucide-react';

interface AudioUrlInputProps {
  onAddAudio: (url: string, name: string) => void;
}

const AudioUrlInput: React.FC<AudioUrlInputProps> = ({ onAddAudio }) => {
  const [audioUrl, setAudioUrl] = useState('');
  const [audioName, setAudioName] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (audioUrl.trim()) {
      onAddAudio(audioUrl, audioName || 'External Audio');
      setAudioUrl('');
      setAudioName('');
      setIsExpanded(false);
    }
  };

  return (
    <div className="mt-3 animate-fade-in bg-white bg-opacity-50 rounded-lg p-3">
      {!isExpanded ? (
        <button 
          onClick={() => setIsExpanded(true)}
          className="flex items-center gap-2 text-sm text-podcast-accent hover:text-podcast-dark transition-colors"
        >
          <PlusCircle size={16} />
          <span>Add audio URL</span>
        </button>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-2">
          <Input
            type="text"
            placeholder="Audio Name (optional)"
            value={audioName}
            onChange={(e) => setAudioName(e.target.value)}
            className="text-sm"
          />
          <div className="flex gap-2">
            <Input
              type="url"
              placeholder="https://example.com/audio.mp3"
              value={audioUrl}
              onChange={(e) => setAudioUrl(e.target.value)}
              className="text-sm flex-1"
              required
            />
            <button 
              type="submit"
              className="bg-podcast-accent hover:bg-podcast-dark text-white px-3 py-1 rounded text-sm transition-colors"
            >
              Add
            </button>
          </div>
          <button 
            type="button"
            onClick={() => setIsExpanded(false)} 
            className="text-xs text-gray-500 hover:text-gray-700"
          >
            Cancel
          </button>
        </form>
      )}
    </div>
  );
};

export default AudioUrlInput;
