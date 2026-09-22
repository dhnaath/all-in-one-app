import React, { useState, useEffect, useRef } from "react";
import { Play, Pause, RotateCcw, Coffee, Briefcase, Settings } from "lucide-react";
import { cn } from "../wira/lib/utils";

type Mode = "work" | "shortBreak" | "longBreak";

export default function PomodoroApp() {
  const [mode, setMode] = useState<Mode>("work");
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [cycles, setCycles] = useState(0);

  const workTime = 25 * 60;
  const shortBreakTime = 5 * 60;
  const longBreakTime = 15 * 60;

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => time - 1);
      }, 1000);
    } else if (isActive && timeLeft === 0) {
      handleComplete();
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeLeft]);

  const handleComplete = () => {
    setIsActive(false);
    if (mode === "work") {
      const newCycles = cycles + 1;
      setCycles(newCycles);
      if (newCycles % 4 === 0) {
        setMode("longBreak");
        setTimeLeft(longBreakTime);
      } else {
        setMode("shortBreak");
        setTimeLeft(shortBreakTime);
      }
    } else {
      setMode("work");
      setTimeLeft(workTime);
    }
  };

  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setIsActive(false);
    if (mode === "work") setTimeLeft(workTime);
    else if (mode === "shortBreak") setTimeLeft(shortBreakTime);
    else setTimeLeft(longBreakTime);
  };

  const changeMode = (newMode: Mode) => {
    setMode(newMode);
    setIsActive(false);
    if (newMode === "work") setTimeLeft(workTime);
    else if (newMode === "shortBreak") setTimeLeft(shortBreakTime);
    else setTimeLeft(longBreakTime);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const getProgress = () => {
    const total =
      mode === "work" ? workTime : mode === "shortBreak" ? shortBreakTime : longBreakTime;
    return ((total - timeLeft) / total) * 100;
  };

  const circumference = 2 * Math.PI * 120;
  const strokeDashoffset = circumference - (getProgress() / 100) * circumference;

  return (
    <div className="p-6 md:p-10 max-w-2xl mx-auto w-full h-full flex flex-col items-center justify-center">
      <div className="w-full flex flex-col items-center space-y-10">
        {/* Mode Selector */}
        <div className="flex bg-muted p-1.5 rounded-full">
          <button
            onClick={() => changeMode("work")}
            className={cn(
              "px-6 py-2 rounded-full text-sm font-semibold transition-colors flex items-center gap-2",
              mode === "work"
                ? "bg-card text-foreground shadow-sm"
                : "text-muted-foreground hover:text-card-foreground",
            )}
          >
            <Briefcase size={16} /> Work
          </button>
          <button
            onClick={() => changeMode("shortBreak")}
            className={cn(
              "px-6 py-2 rounded-full text-sm font-semibold transition-colors flex items-center gap-2",
              mode === "shortBreak"
                ? "bg-card text-foreground shadow-sm"
                : "text-muted-foreground hover:text-card-foreground",
            )}
          >
            <Coffee size={16} /> Short Break
          </button>
          <button
            onClick={() => changeMode("longBreak")}
            className={cn(
              "px-6 py-2 rounded-full text-sm font-semibold transition-colors flex items-center gap-2",
              mode === "longBreak"
                ? "bg-card text-foreground shadow-sm"
                : "text-muted-foreground hover:text-card-foreground",
            )}
          >
            <Coffee size={16} /> Long Break
          </button>
        </div>

        {/* Timer Circle */}
        <div className="relative w-72 h-72 flex items-center justify-center">
          <svg className="absolute top-0 left-0 w-full h-full transform -rotate-90">
            <circle
              cx="144"
              cy="144"
              r="120"
              fill="transparent"
              stroke="currentColor"
              strokeWidth="8"
              className="text-primary-foreground"
            />
            <circle
              cx="144"
              cy="144"
              r="120"
              fill="transparent"
              stroke="currentColor"
              strokeWidth="8"
              strokeLinecap="round"
              className={cn(
                "transition-all duration-1000 ease-linear",
                mode === "work"
                  ? "text-red-500"
                  : mode === "shortBreak"
                    ? "text-green-500"
                    : "text-blue-500",
              )}
              style={{
                strokeDasharray: circumference,
                strokeDashoffset: strokeDashoffset,
              }}
            />
          </svg>
          <div className="flex flex-col items-center">
            <span className="text-6xl font-bold text-foreground font-mono tracking-tighter">
              {formatTime(timeLeft)}
            </span>
            <span className="text-muted-foreground font-medium mt-2">
              {mode === "work" ? "Focus Time" : "Break Time"}
            </span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-6">
          <button
            onClick={toggleTimer}
            className={cn(
              "w-20 h-20 rounded-full flex items-center justify-center text-white shadow-lg shadow-black/10 transition-transform active:scale-95",
              mode === "work"
                ? "bg-red-500 hover:bg-red-600"
                : mode === "shortBreak"
                  ? "bg-green-500 hover:bg-green-600"
                  : "bg-blue-500 hover:bg-blue-600",
            )}
          >
            {isActive ? <Pause size={32} /> : <Play size={32} className="ml-2" />}
          </button>

          <button
            onClick={resetTimer}
            className="w-14 h-14 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:bg-accent transition-colors active:scale-95"
            title="Reset"
          >
            <RotateCcw size={24} />
          </button>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground mt-10">
          <span>Cycles Completed: </span>
          <span className="text-foreground bg-muted px-2 py-1 rounded-md">{cycles}</span>
        </div>
      </div>
    </div>
  );
}
