
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { RotateCcw, Footprints } from 'lucide-react';
import { toast } from 'sonner';

const Index = () => {
  const [stepCount, setStepCount] = useState(0);
  const [isSupported, setIsSupported] = useState(true);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    let sensor: any = null;
    
    const startStepCounting = () => {
      if ('DeviceMotionEvent' in window) {
        // Check if we can access device motion
        if (typeof (DeviceMotionEvent as any).requestPermission === 'function') {
          // iOS 13+ permission request
          (DeviceMotionEvent as any).requestPermission()
            .then((response: string) => {
              if (response === 'granted') {
                initializeStepCounter();
              } else {
                setIsSupported(false);
                toast.error('Motion sensor permission denied');
              }
            })
            .catch(() => {
              setIsSupported(false);
              toast.error('Motion sensors not available');
            });
        } else {
          // Android or older iOS
          initializeStepCounter();
        }
      } else {
        setIsSupported(false);
        toast.error('Device motion not supported');
      }
    };

    const initializeStepCounter = () => {
      let lastAcceleration = { x: 0, y: 0, z: 0 };
      let stepThreshold = 15;
      let stepTimeout: NodeJS.Timeout | null = null;
      
      const handleMotion = (event: DeviceMotionEvent) => {
        if (event.accelerationIncludingGravity) {
          const { x, y, z } = event.accelerationIncludingGravity;
          
          if (x !== null && y !== null && z !== null) {
            const acceleration = Math.sqrt(x * x + y * y + z * z);
            const lastMagnitude = Math.sqrt(
              lastAcceleration.x * lastAcceleration.x +
              lastAcceleration.y * lastAcceleration.y +
              lastAcceleration.z * lastAcceleration.z
            );
            
            const delta = Math.abs(acceleration - lastMagnitude);
            
            if (delta > stepThreshold && !stepTimeout) {
              setStepCount(prev => prev + 1);
              stepTimeout = setTimeout(() => {
                stepTimeout = null;
              }, 300); // Prevent double counting
            }
            
            lastAcceleration = { x, y, z };
          }
        }
      };

      window.addEventListener('devicemotion', handleMotion);
      setIsActive(true);
      toast.success('Step counting started!');
      
      return () => {
        window.removeEventListener('devicemotion', handleMotion);
        if (stepTimeout) clearTimeout(stepTimeout);
      };
    };

    startStepCounting();

    return () => {
      if (sensor) {
        sensor();
      }
    };
  }, []);

  const resetSteps = () => {
    setStepCount(0);
    toast.success('Step count reset!');
  };

  const requestPermissions = () => {
    if (typeof (DeviceMotionEvent as any).requestPermission === 'function') {
      (DeviceMotionEvent as any).requestPermission()
        .then((response: string) => {
          if (response === 'granted') {
            setIsSupported(true);
            toast.success('Permissions granted!');
            window.location.reload();
          }
        });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="backdrop-blur-lg bg-white/20 border-white/30 shadow-2xl p-8 text-center">
          <div className="mb-6">
            <Footprints className="w-12 h-12 text-white mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-white mb-2">Step Counter</h1>
            <p className="text-white/80 text-sm">Track your daily steps</p>
          </div>

          {!isSupported ? (
            <div className="space-y-4">
              <div className="text-white/90">
                <p className="mb-4">Motion sensors need permission to work.</p>
                <Button 
                  onClick={requestPermissions}
                  className="bg-white/20 hover:bg-white/30 text-white border-white/30"
                >
                  Enable Step Counting
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="bg-white/10 rounded-3xl p-8 backdrop-blur-sm">
                <div className="text-6xl font-bold text-white mb-2 font-mono">
                  {stepCount.toLocaleString()}
                </div>
                <div className="text-white/80 text-lg">
                  {stepCount === 1 ? 'Step' : 'Steps'}
                </div>
              </div>

              <div className="flex items-center justify-center space-x-2 text-white/80 text-sm">
                <div className={`w-2 h-2 rounded-full ${isActive ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`} />
                <span>{isActive ? 'Counting steps...' : 'Sensor inactive'}</span>
              </div>

              <Button
                onClick={resetSteps}
                className="w-full bg-white/20 hover:bg-white/30 text-white border-white/30 transition-all duration-200"
                size="lg"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Reset Steps
              </Button>
            </div>
          )}

          <div className="mt-6 text-xs text-white/60 text-center">
            Keep your phone with you to track steps accurately
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Index;
