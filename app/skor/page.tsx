"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function Score() {
  const [scoreA, setScoreA] = useState(0);
  const [scoreB, setScoreB] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [winner, setWinner] = useState<"A" | "B" | null>(null);
  const [history, setHistory] = useState<
    Array<{ scoreA: number; scoreB: number; team: "A" | "B" }>
  >([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const savedData = localStorage.getItem("badmintonScore");
    if (savedData) {
      try {
        const data = JSON.parse(savedData);
        setScoreA(data.scoreA || 0);
        setScoreB(data.scoreB || 0);
        setGameOver(data.gameOver || false);
        setWinner(data.winner || null);
        setHistory(data.history || []);
      } catch (error) {
        console.error("Error loading saved score:", error);
      }
    }
    setIsLoaded(true);
  }, []);

  // Save to localStorage whenever state changes
  useEffect(() => {
    if (isLoaded) {
      const data = {
        scoreA,
        scoreB,
        gameOver,
        winner,
        history,
      };
      localStorage.setItem("badmintonScore", JSON.stringify(data));
    }
  }, [scoreA, scoreB, gameOver, winner, history, isLoaded]);

  const checkWinner = (newScoreA: number, newScoreB: number) => {
    // Standard badminton rules: First to 21, must win by 2
    // If tied at 20-20, play continues until one team leads by 2
    // Maximum score is 30 (at 29-29, next point wins)

    if (newScoreA >= 30 || newScoreB >= 30) {
      setGameOver(true);
      setWinner(newScoreA > newScoreB ? "A" : "B");
      return;
    }

    if (newScoreA >= 21 || newScoreB >= 21) {
      const difference = Math.abs(newScoreA - newScoreB);
      if (difference >= 2) {
        setGameOver(true);
        setWinner(newScoreA > newScoreB ? "A" : "B");
      }
    }
  };

  const handleScoreA = () => {
    if (gameOver) return;
    const newScore = scoreA + 1;
    setScoreA(newScore);
    setHistory([...history, { scoreA: newScore, scoreB, team: "A" }]);
    checkWinner(newScore, scoreB);
  };

  const handleScoreB = () => {
    if (gameOver) return;
    const newScore = scoreB + 1;
    setScoreB(newScore);
    setHistory([...history, { scoreA, scoreB: newScore, team: "B" }]);
    checkWinner(scoreA, newScore);
  };

  const handleUndo = () => {
    if (history.length === 0) return;

    const lastEntry = history[history.length - 1];
    const newHistory = history.slice(0, -1);

    if (newHistory.length === 0) {
      setScoreA(0);
      setScoreB(0);
    } else {
      const previousEntry = newHistory[newHistory.length - 1];
      setScoreA(previousEntry.scoreA);
      setScoreB(previousEntry.scoreB);
    }

    setHistory(newHistory);
    setGameOver(false);
    setWinner(null);
  };

  const handleReset = () => {
    setShowResetConfirm(true);
  };

  const confirmReset = () => {
    setScoreA(0);
    setScoreB(0);
    setGameOver(false);
    setWinner(null);
    setHistory([]);
    localStorage.removeItem("badmintonScore");
    setShowResetConfirm(false);
  };

  const cancelReset = () => {
    setShowResetConfirm(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm shadow-lg border-b border-emerald-100/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="text-center sm:text-left">
              <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 bg-clip-text text-transparent mb-2">
                🏸 Badminton Scoreboard
              </h1>
              <p className="text-gray-600 text-lg">Game to 21 Points</p>
            </div>
            <div className="flex gap-3">
              <Button
                onClick={handleUndo}
                variant="outline"
                size="sm"
                disabled={history.length === 0}
                className="border-2 border-emerald-200 text-emerald-700 hover:bg-emerald-50"
              >
                Undo
              </Button>
              <Button
                onClick={handleReset}
                variant="outline"
                size="sm"
                disabled={scoreA === 0 && scoreB === 0}
                className="border-2 border-red-200 text-red-700 hover:bg-red-50"
              >
                Reset
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Winner Banner */}
        {gameOver && winner && (
          <div className="mb-8">
            <Card className="bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 border-none shadow-2xl">
              <CardContent className="py-8 text-center">
                <h2 className="text-5xl font-bold text-white mb-2">
                  🏆 Tim {winner} Menang!
                </h2>
                <p className="text-white/90 text-xl">
                  Final Score: {scoreA} - {scoreB}
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Scoreboard */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Tim A */}
          <button
            onClick={handleScoreA}
            disabled={gameOver}
            className="group relative overflow-hidden rounded-3xl transition-all duration-300 hover:scale-[1.02] disabled:hover:scale-100 disabled:opacity-60"
          >
            <Card className="border-none shadow-2xl bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 h-full">
              <CardContent className="p-12 text-center relative z-10">
                <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-all duration-300" />

                <div className="relative">
                  <div className="mb-6">
                    <div className="w-24 h-24 mx-auto bg-white/20 rounded-full flex items-center justify-center mb-4 backdrop-blur-sm group-hover:scale-110 transition-transform">
                      <span className="text-6xl">🏸</span>
                    </div>
                    <h3 className="text-4xl font-bold text-white mb-2">
                      Tim A
                    </h3>
                    <p className="text-blue-200 text-sm font-medium">
                      Klik untuk tambah poin
                    </p>
                  </div>

                  <div className="mb-6">
                    <div className="text-[140px] leading-none font-black text-white drop-shadow-2xl">
                      {scoreA}
                    </div>
                  </div>

                  {!gameOver && (
                    <div className="inline-flex items-center gap-2 px-6 py-3 bg-white/20 rounded-full backdrop-blur-sm">
                      <svg
                        className="w-6 h-6 text-white"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="text-white font-semibold">
                        Tambah Poin
                      </span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </button>

          {/* Tim B */}
          <button
            onClick={handleScoreB}
            disabled={gameOver}
            className="group relative overflow-hidden rounded-3xl transition-all duration-300 hover:scale-[1.02] disabled:hover:scale-100 disabled:opacity-60"
          >
            <Card className="border-none shadow-2xl bg-gradient-to-br from-red-600 via-red-700 to-red-800 h-full">
              <CardContent className="p-12 text-center relative z-10">
                <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-all duration-300" />

                <div className="relative">
                  <div className="mb-6">
                    <div className="w-24 h-24 mx-auto bg-white/20 rounded-full flex items-center justify-center mb-4 backdrop-blur-sm group-hover:scale-110 transition-transform">
                      <span className="text-6xl">🏸</span>
                    </div>
                    <h3 className="text-4xl font-bold text-white mb-2">
                      Tim B
                    </h3>
                    <p className="text-red-200 text-sm font-medium">
                      Klik untuk tambah poin
                    </p>
                  </div>

                  <div className="mb-6">
                    <div className="text-[140px] leading-none font-black text-white drop-shadow-2xl">
                      {scoreB}
                    </div>
                  </div>

                  {!gameOver && (
                    <div className="inline-flex items-center gap-2 px-6 py-3 bg-white/20 rounded-full backdrop-blur-sm">
                      <svg
                        className="w-6 h-6 text-white"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="text-white font-semibold">
                        Tambah Poin
                      </span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </button>
        </div>

        {/* Game Info */}
        <Card className="mt-8 shadow-xl border-emerald-100">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div>
                <div className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-2">
                  {scoreA} - {scoreB}
                </div>
                <div className="text-gray-600 text-sm font-medium">
                  Current Score
                </div>
              </div>
              <div>
                <div className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-2">
                  {history.length}
                </div>
                <div className="text-gray-600 text-sm font-medium">
                  Total Points
                </div>
              </div>
              <div>
                <div className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-2">
                  {gameOver ? "Game Over" : "In Progress"}
                </div>
                <div className="text-gray-600 text-sm font-medium">Status</div>
              </div>
            </div>

            {/* Rules Info */}
            <div className="mt-6 pt-6 border-t border-emerald-100">
              <h4 className="text-gray-800 font-semibold mb-3">
                Aturan Badminton:
              </h4>
              <ul className="text-gray-600 text-sm space-y-2">
                <li>• Game pertama mencapai 21 poin menang</li>
                <li>• Harus menang dengan selisih minimal 2 poin</li>
                <li>
                  • Jika skor 20-20, permainan berlanjut sampai ada yang unggul
                  2 poin
                </li>
                <li>
                  • Skor maksimal 30 (pada 29-29, poin berikutnya menentukan
                  pemenang)
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Reset Confirmation Dialog */}
        {showResetConfirm && (
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
            <Card className="w-full max-w-md mx-4 shadow-2xl">
              <CardContent className="pt-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">
                  Konfirmasi Reset
                </h3>
                <p className="text-gray-600 mb-6">
                  Apakah kamu yakin ingin mereset? Semua skor akan dihapus dan
                  tidak dapat dikembalikan.
                </p>
                <div className="flex gap-3 justify-end">
                  <Button
                    variant="outline"
                    onClick={cancelReset}
                    className="px-6"
                  >
                    Batal
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={confirmReset}
                    className="px-6 text-white"
                  >
                    Ya
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
