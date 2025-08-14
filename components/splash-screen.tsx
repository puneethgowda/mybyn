import React from "react";

const SplashScreen = () => {
  return (
    <div className="h-screen w-screen fixed top-0 left-0 z-50 bg-background">
      <div className="h-full w-full flex items-center justify-center">
        <h1 className="font-bold text-4xl animate-pulse">Kollabit</h1>
      </div>
    </div>
  );
};

export default SplashScreen;
