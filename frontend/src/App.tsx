import { useEffect, useState, useRef } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';

import { countryCoordinates, haversine } from './utils/distance';
import PlayPage from './PlayPage';
import CreateRoomPage from './CreateRoomPage';

interface Channel {
  id: string;
  streamUrl: string;
  countryCode: string;
  countryName: string;
}

interface Player {
  username: string;
}

function App() {
  const [channel, setChannel] = useState<Channel | null>(null);
  const [selectedGuess, setSelectedGuess] = useState<{ code: string; name: string } | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [players, setPlayers] = useState<Player[]>([]);
  const socketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const socket = new WebSocket('ws://localhost:8080');
    socketRef.current = socket;

    socket.onopen = () => {
      console.log('Connected to WebSocket server');
      const username = `Player_${Math.floor(Math.random() * 1000)}`;
      socket.send(JSON.stringify({ type: "join_room", roomId: "lobby-777", username }));
    };

    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === "room_update") {
          setPlayers(data.players);
        }
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    };

    socket.onclose = () => {
      console.log('Disconnected from WebSocket server');
    };

    return () => {
      if (socketRef.current) {
        socketRef.current.close();
        socketRef.current = null;
      }
    };
  }, []);

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
      //@ts-ignore
      const actualCoords = countryCoordinates[channel.countryCode];
      //@ts-ignore
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
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/play" />} />
        <Route path="/play" element={<PlayPage channel={channel} setChannel={setChannel} selectedGuess={selectedGuess} setSelectedGuess={setSelectedGuess} loading={loading} error={error} setError={setError} players={players} setPlayers={setPlayers} handleCountrySelect={handleCountrySelect} handleSubmitGuess={handleSubmitGuess} />} />
        <Route path="/create-room" element={<CreateRoomPage />} />
      </Routes>
    </Router>
  );
}

export default App;
