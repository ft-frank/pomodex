import React, { useState, useEffect } from 'react';
import './PomodoroTimer.css';

const PomodoroTimer = () => {
  const [seconds, setSeconds] = useState(1500); // 25 minutes
  const [isRunning, setIsRunning] = useState(false);
  const [sessionLength, setSessionLength] = useState(25);
  const [totalSessions, setTotalSessions] = useState(3);
  const [caughtPokemon, setCaughtPokemon] = useState(12);
  const [streak, setStreak] = useState(5);

  useEffect(() => {
    let interval;
    if (isRunning && seconds > 0) {
        interval = setInterval(() => {
        setSeconds((prev) => prev - 1);
        }, 1000);
    } else if (seconds === 0) {
        setIsRunning(false);
      // Here you would trigger the Pokemon encounter logic
    }
    return () => clearInterval(interval);
    }, [isRunning, seconds]);

    const formatTime = (totalSeconds) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    };

    const handleStart = () => {
    setIsRunning(!isRunning);
    };

    const handleReset = () => {
    setIsRunning(false);
    setSeconds(sessionLength * 60);
    };

  const progressPercentage = (seconds / (sessionLength * 60)) * 100;

    return (
    <div className="game-container">
        <Clouds />
        <Grass />
        
        <div className="timer-container">
        <div className="pokemon-window">
            <div className="session-type">⚔ Focus Session ⚔</div>
            <div className="timer-display">{formatTime(seconds)}</div>
            <div className="session-length">Current Session: {sessionLength} Minutes</div>

            <div className="progress-container">
            <div 
                className="progress-bar" 
                style={{ width: `${progressPercentage}%` }}
            ></div>
            </div>

            <div className="controls">
            <button className="btn" onClick={handleStart}>
                {isRunning ? 'Pause' : 'Start'}
            </button>
            <button className="btn secondary" onClick={handleReset}>
                Reset
            </button>
            </div>

            <div className="stats">
            <div className="stat-item">
                <div className="stat-label">Sessions</div>
                <div className="stat-value">{totalSessions}</div>
            </div>
            <div className="stat-item">
                <div className="stat-label">Caught</div>
                <div className="stat-value">{caughtPokemon}</div>
            </div>
            <div className="stat-item">
                <div className="stat-label">Streak</div>
                <div className="stat-value">{streak}🔥</div>
            </div>
            </div>

            <Pokeball />
        </div>
        </div>
    </div>
    );
};

const Clouds = () => {
    return (
    <div className="clouds">
        <div className="cloud cloud1"></div>
        <div className="cloud cloud2"></div>
        <div className="cloud cloud3"></div>
    </div>
    );
};

const Grass = () => {
    const grassBlades = Array.from({ length: 200 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    delay: Math.random() * 3,
    height: 15 + Math.random() * 15,
    }));

    return (
    <div className="grass">
        {grassBlades.map((blade) => (
        <div
            key={blade.id}
            className="grass-blade"
            style={{
            left: `${blade.left}%`,
            animationDelay: `${blade.delay}s`,
            height: `${blade.height}px`,
            }}
        ></div>
        ))}
    </div>
    );
};

const Pokeball = () => {
    return (
    <div className="pokeball-corner">
        <div className="pokeball-top"></div>
        <div className="pokeball-bottom"></div>
        <div className="pokeball-center">
        <div className="pokeball-center-inner"></div>
        </div>
    </div>
    );
};

export default PomodoroTimer;
