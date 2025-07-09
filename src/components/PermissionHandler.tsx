
import React from 'react';
import { Button } from '@/components/ui/button';
import { Smartphone } from 'lucide-react';

interface PermissionHandlerProps {
  onPermissionGranted: () => void;
}

const PermissionHandler: React.FC<PermissionHandlerProps> = ({ onPermissionGranted }) => {
  const requestPermissions = async () => {
    try {
      if ('DeviceMotionEvent' in window && typeof (DeviceMotionEvent as any).requestPermission === 'function') {
        const response = await (DeviceMotionEvent as any).requestPermission();
        if (response === 'granted') {
          onPermissionGranted();
        }
      } else {
        // Android or browsers that don't require explicit permission
        onPermissionGranted();
      }
    } catch (error) {
      console.error('Permission request failed:', error);
    }
  };

  return (
    <div className="text-center space-y-4">
      <Smartphone className="w-16 h-16 text-white/80 mx-auto mb-4" />
      <h2 className="text-xl font-semibold text-white mb-2">Motion Access Required</h2>
      <p className="text-white/80 mb-6 text-sm">
        This app needs access to your device's motion sensors to count steps accurately.
      </p>
      <Button
        onClick={requestPermissions}
        className="bg-white/20 hover:bg-white/30 text-white border-white/30"
        size="lg"
      >
        Enable Step Counting
      </Button>
    </div>
  );
};

export default PermissionHandler;
