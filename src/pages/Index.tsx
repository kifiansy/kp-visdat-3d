import React, { useState, useEffect } from "react";
import DataVisualization3D from "@/components/DataVisualization3D";
import DataPanel from "@/components/DataPanel";
import ControlPanel from "@/components/ControlPanel";
import LoadingScreen from "@/components/LoadingScreen";
import ErrorBoundary from "@/components/ErrorBoundary";
import { studentData } from "@/data/studentData";

const Index = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [selectedData, setSelectedData] = useState(null);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [isStoryMode, setIsStoryMode] = useState(false);
  const [currentStoryStep, setCurrentStoryStep] = useState(0);

  const handleDataSelect = (data: any) => {
    console.log("Data selected:", data);
    setSelectedData(data);
    setIsPanelOpen(true);
  };

  const handleStoryMode = (enabled: boolean) => {
    console.log("Story mode:", enabled);
    setIsStoryMode(enabled);

    if (enabled) {
      setCurrentStoryStep(0);
      // Mulai dengan data poin pertama
      if (studentData.length > 0) {
        setSelectedData(studentData[0]);
        setIsPanelOpen(true);
      }
    } else {
      setCurrentStoryStep(0);
      setSelectedData(null);
      setIsPanelOpen(false);
    }
  };

  const handleReset = () => {
    console.log("Reset triggered");
    setSelectedData(null);
    setIsPanelOpen(false);
    setIsStoryMode(false);
    setCurrentStoryStep(0);
  };

  const handleLoadingComplete = () => {
    console.log("Loading completed");
    setIsLoading(false);
  };

  // Mode story progresif
  useEffect(() => {
    if (isStoryMode && studentData.length > 0) {
      const interval = setInterval(() => {
        setCurrentStoryStep((prev) => {
          const nextStep = (prev + 1) % studentData.length;
          setSelectedData(studentData[nextStep]);
          setIsPanelOpen(true);
          return nextStep;
        });
      }, 5000); // Ganti setiap 5 detik

      return () => clearInterval(interval);
    }
  }, [isStoryMode]);

  console.log(
    "Index rendering, isLoading:",
    isLoading,
    "data length:",
    studentData.length
  );

  return (
    <div className="relative w-full h-screen overflow-hidden bg-gradient-to-br from-black via-indigo-950 to-purple-950">
      {/* Animasi bintang di background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="stars"></div>
        <div className="twinkling"></div>
      </div>

      {isLoading && <LoadingScreen onComplete={handleLoadingComplete} />}

      {!isLoading && (
        <>
          {/* Header */}
          <div className="absolute top-0 left-0 right-0 z-30 p-6">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-300 via-purple-300 to-pink-300 bg-clip-text text-transparent">
                  Alasan Anak IF Telat Lulus
                </h1>
                <p className="text-blue-200 mt-1">
                  UIN Sunan Gunung Djati Bandung
                </p>
              </div>

              <div className="flex items-center space-x-4">
                <div className="bg-black/60 backdrop-blur-sm px-4 py-2 rounded-lg border border-blue-500/30 shadow-lg shadow-blue-500/20">
                  <p className="text-sm text-blue-200">Total Alasan</p>
                  <p className="text-2xl font-bold text-blue-300">
                    {studentData.length}
                  </p>
                </div>

                <div className="bg-black/60 backdrop-blur-sm px-4 py-2 rounded-lg border border-purple-500/30 shadow-lg shadow-purple-500/20">
                  <p className="text-sm text-purple-200">Total Mahasiswa</p>
                  <p className="text-2xl font-bold text-purple-300">
                    {studentData.reduce(
                      (sum, item) => sum + item.jumlah_mahasiswa,
                      0
                    )}
                  </p>
                </div>

                {isStoryMode && (
                  <div className="bg-black/60 backdrop-blur-sm px-4 py-2 rounded-lg border border-yellow-500/30 shadow-lg shadow-yellow-500/20">
                    <p className="text-sm text-yellow-200">Tour Angkasa</p>
                    <p className="text-2xl font-bold text-yellow-300">
                      {currentStoryStep + 1}/{studentData.length}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* 3D Visualisasi */}
          <div className="absolute inset-0">
            <ErrorBoundary>
              <DataVisualization3D
                data={studentData}
                onDataSelect={handleDataSelect}
                selectedData={selectedData}
                isStoryMode={isStoryMode}
                currentStoryStep={currentStoryStep}
              />
            </ErrorBoundary>
          </div>

          {/* Control Panel */}
          <ControlPanel
            onStoryMode={handleStoryMode}
            onReset={handleReset}
            isStoryMode={isStoryMode}
          />

          {/* Data Panel */}
          <DataPanel
            data={selectedData}
            isOpen={isPanelOpen}
            onClose={() => {
              setIsPanelOpen(false);
              setSelectedData(null);
            }}
          />
        </>
      )}
    </div>
  );
};

export default Index;
