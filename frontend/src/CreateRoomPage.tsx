import React from 'react';

const CreateRoomPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col items-center p-6">
      <header className="w-full max-w-6xl mb-8 flex justify-between items-center border-b border-gray-800 pb-4">
        <h1 className="text-2xl font-bold tracking-wider text-blue-500">📺 LiveTVGuessr</h1>
        {/* NEW: Updated Header Buttons */}
        <div className="flex gap-3">
          <button 
            onClick={() => {}}
            disabled={true}
            className="flex items-center gap-2 px-4 py-2 bg-red-900/40 hover:bg-red-800/80 text-red-200 transition rounded-lg text-sm font-semibold border border-red-800/50 disabled:opacity-50"
            title="Delete this broken stream from the database"
          >
            <Trash2 size={16} />
            <span>Remove Broken</span>
          </button>

          <button 
            onClick={() => {}}
            disabled={true}
            className="px-4 py-2 bg-gray-800 hover:bg-gray-700 transition rounded-lg text-sm font-semibold border border-gray-700 disabled:opacity-50"
          >
            Skip Stream
          </button>
        </div>
      </header>

      <main className="w-full max-w-6xl flex flex-col gap-6">
        <h2 className="text-3xl font-bold mb-4">Create Room</h2>
        {/* Add room creation form here */}
      </main>
    </div>
  );
};

export default CreateRoomPage;
