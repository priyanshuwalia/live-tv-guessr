import React from 'react';


import { Trash2 } from 'lucide-react';
import { countryCoordinates, haversine } from './utils/distance';
import { VideoPlayer } from './components/VideoPlayer';
import { WorldMap } from './components/WorldMap';

interface Channel {
  id: string;
  streamUrl: string;
  countryCode: string;
  countryName: string;
}

interface Player {
  username: string;
}

interface PlayPageProps {
  channel: Channel | null;
  setChannel: React.Dispatch<React.SetStateAction<Channel | null>>;
  selectedGuess: { code: string; name: string } | null;
  setSelectedGuess: React.Dispatch<React.SetStateAction<{ code: string; name: string } | null>>;
  loading: boolean;
  error: string | null;
  setError: React.Dispatch<React.SetStateAction<string | null>>;
  players: Player[];
  setPlayers: React.Dispatch<React.SetStateAction<Player[]>>;
  handleCountrySelect: (code: string, name: string) => void;
  handleSubmitGuess: () => void;
}

const PlayPage: React.FC<PlayPageProps> = ({
  channel,
  setChannel,
  selectedGuess,
  setSelectedGuess,
  loading,
  error,
  setError,
  players,
  setPlayers,
  handleCountrySelect,
  handleSubmitGuess
}) => {
  const handleDeleteStream = async () => {
    if (!channel) return;

    // Optional: Add a quick confirmation so you don't accidentally click it
    const confirmDelete = window.confirm(`Permanently delete ${channel.countryName} stream from database?`);
    if (!confirmDelete) return;

    try {
      const response = await fetch(`http://localhost:8080/api/channels/${channel.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete channel');

      console.log('🗑️ Stream deleted successfully');
      // Immediately pull a new working channel
      setChannel(null);
    } catch (err) {
      console.error(err);
      alert('Could not delete the stream.');
    }
  };

  const fetchRandomChannel = async () => {
    setError(null);
    setSelectedGuess(null);
    try {
      // Create a quick backend endpoint for this or fetch all and pick one for MVP testing
      const response = await fetch('http://localhost:8080/api/channels'); // Make sure you expose this on backend!
      if (!response.ok) throw new Error('Failed to retrieve channels');
      const data = await response.json();

      if (data && data.length > 0) {
        // Pick a random stream from our seed list
        const randomStream = data[Math.floor(Math.random() * data.length)];
        setChannel(randomStream);
      } else {
        setError('No channels found. Did you run the database seed?');
      }
    } catch (err: any) {
      setError(err.message || 'Could not connect to backend server.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col items-center p-6">
      <header className="w-full max-w-6xl mb-8 flex justify-between items-center border-b border-gray-800 pb-4">
        <h1 className="text-2xl font-bold tracking-wider text-blue-500">📺 LiveTVGuessr</h1>
        {/* NEW: Updated Header Buttons */}
        <div className="flex gap-3">
          <button 
            onClick={handleDeleteStream}
            disabled={!channel || loading}
            className="flex items-center gap-2 px-4 py-2 bg-red-900/40 hover:bg-red-800/80 text-red-200 transition rounded-lg text-sm font-semibold border border-red-800/50 disabled:opacity-50"
            title="Delete this broken stream from the database"
          >
            <Trash2 size={16} />
            <span>Remove Broken</span>
          </button>

          <button 
            onClick={fetchRandomChannel}
            disabled={loading}
            className="px-4 py-2 bg-gray-800 hover:bg-gray-700 transition rounded-lg text-sm font-semibold border border-gray-700 disabled:opacity-50"
          >
            Skip Stream
          </button>
        </div>
      </header>

      <main className="w-full max-w-6xl flex flex-col gap-6">
        {error && (
          <div className="bg-red-900/30 border border-red-500/50 text-red-200 p-4 rounded-xl text-center">
            {error}
          </div>
        )}

        <div className="w-full">
          {channel && <VideoPlayer streamUrl={channel.streamUrl} />}
        </div>

        <div className="w-full">
          <WorldMap 
            onCountrySelect={handleCountrySelect} 
            selectedCountryCode={selectedGuess?.code} 
          />
        </div>

        <div className="flex justify-end mt-2">
          <button
            disabled={!selectedGuess || loading}
            onClick={handleSubmitGuess}
            className="px-8 py-3 bg-blue-600 hover:bg-blue-500 disabled:opacity-40 disabled:hover:bg-blue-600 text-white font-bold rounded-xl shadow-lg shadow-blue-600/20 transition-all duration-200 uppercase tracking-wide"
          >
            Lock In Guess
          </button>
        </div>

        
      </main>
    </div>
  );
};

export default PlayPage;
