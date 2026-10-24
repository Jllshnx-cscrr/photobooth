import React from 'react';
import { useSession } from '../contexts/SessionContext';

export const WelcomeScreen: React.FC = () => {
  const { startNewSession, countdownSeconds, setCountdownSeconds } = useSession();

  const timerOptions = [
    { value: 3, label: '3 seconds' },
    { value: 5, label: '5 seconds'},
    { value: 10, label: '10 seconds' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-500 to-red-500 flex items-center justify-center p-8">
      <div className="max-w-4xl w-full text-center">
        <div className="mb-8">
          <div className="inline-block rounded-full p-6 mb-6 shadow-2xl">
            <img
              src="/logo.png"
              alt="Logo"
              className="w-24 h-24 object-contain"
            />
          </div>
          <h1 className="text-6xl font-bold text-white mb-4 drop-shadow-lg">
            Photo Booth
          </h1>
          <p className="text-2xl text-white opacity-90 drop-shadow">
            Create amazing memories in seconds!
          </p>
        </div>

        {/* Timer Selection */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-white mb-4 drop-shadow">
            Choose Countdown Timer
          </h2>
          <div className="flex justify-center gap-4">
            {timerOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => setCountdownSeconds(option.value)}
                className={`
                  px-8 py-4 rounded-xl font-bold text-lg transition-all duration-200
                  ${
      countdownSeconds === option.value
        ? 'bg-white text-purple-600 shadow-2xl scale-105'
        : 'bg-white bg-opacity-20 text-white hover:bg-opacity-30 hover:scale-105'
    }
                `}
              >
                <div>{option.label}</div>
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={startNewSession}
          className="bg-white text-purple-600 px-12 py-6 rounded-full text-2xl font-bold shadow-2xl hover:bg-purple-50 hover:scale-105 transition-all duration-200 active:scale-95"
        >
          START PHOTO SESSION
        </button>

        <div className="mt-8">
          <a
            href="/admin"
            className="text-white opacity-60 hover:opacity-100 transition-opacity text-sm"
          >
            Admin Access
          </a>
        </div>
      </div>
    </div>
  );
};
