import { useEffect, useState } from 'react';
import { VideoPlayer } from './components/VideoPlayer';
import { WorldMap } from './components/WorldMap';
import { Trash2 } from 'lucide-react';
import { countryCoordinates, haversine } from './utils/distance';

interface Channel {
  id: string;
  streamUrl: string;
  countryCode: string;
  countryName: string;
}

function App() {
  const [channel, setChannel] = useState<Channel | null>(null);
  const [selectedGuess, setSelectedGuess] = useState<{ code: string; name: string } | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
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
      fetchRandomChannel();
    } catch (err) {
      console.error(err);
      alert('Could not delete the stream.');
    }
  };
  // Fetch a random channel from our Port 8080 Backend API on load
  const fetchRandomChannel = async () => {
    setLoading(true);
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
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRandomChannel();
  }, []);

  const handleCountrySelect = (code: string, name: string) => {
    setSelectedGuess({ code, name });
  };

const handleSubmitGuess = () => {
    if (!selectedGuess || !channel) return;
    
    // Strict, reliable code comparison
    if (selectedGuess.code === channel.countryCode) {
      alert(`🎉 Correct! It was indeed ${channel.countryName}!`);
    } else {
      // Get coordinates for both countries
      const actualCoords = countryCoordinates[channel.countryCode];
      const guessCoords = countryCoordinates[selectedGuess.code];
      
      if (!actualCoords || !guessCoords) {
        alert(`❌ Incorrect! You guessed ${selectedGuess.name}, but it was actually ${channel.countryName}.`);
        return;
      }
      
      const distance = haversine(
        guessCoords.lat,
        guessCoords.lon,
        actualCoords.lat,
        actualCoords.lon
      );
      
      alert(`❌ Incorrect! You guessed ${selectedGuess.name}, which is ${distance.toFixed(0)} km away from the actual location.`);
    }
    
    fetchRandomChannel();
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
        <button 
          onClick={fetchRandomChannel}
          className="px-4 py-2 bg-gray-800 hover:bg-gray-700 transition rounded-lg text-sm font-semibold border border-gray-700"
        >
          Skip Stream
        </button>
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
}

export default App;
