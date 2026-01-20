"use client";

import { useState, useCallback } from "react";
import Cropper from "react-easy-crop";
import getCroppedImg from "@/lib/cropImage";
import { HiCheck, HiXMark } from "react-icons/hi2";

type Props = {
  imageSrc: string;
  onCancel: () => void;
  onCropComplete: (croppedFile: File) => void;
};

export default function ImageCropperModal({ imageSrc, onCancel, onCropComplete }: Props) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const onCropChange = (crop: { x: number; y: number }) => {
    setCrop(crop);
  };

  const onCropCompleteCallback = useCallback((croppedArea: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleSave = async () => {
    setIsProcessing(true);
    try {
      const croppedFile = await getCroppedImg(imageSrc, croppedAreaPixels);
      if (croppedFile) {
        onCropComplete(croppedFile);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in">
      <div className="bg-white dark:bg-gray-800 w-full max-w-lg rounded-2xl overflow-hidden shadow-2xl flex flex-col h-[500px]">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 dark:border-white/10 flex justify-between items-center z-10 bg-white dark:bg-gray-800">
            <h3 className="font-bold text-gray-800 dark:text-white">Sesuaikan Foto</h3>
            <button onClick={onCancel} className="text-gray-500 hover:text-red-500"><HiXMark size={24} /></button>
        </div>

        {/* Area Crop */}
        <div className="relative flex-1 bg-gray-900">
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            aspect={1} // Rasio 1:1 (Kotak/Bulat)
            onCropChange={onCropChange}
            onCropComplete={onCropCompleteCallback}
            onZoomChange={setZoom}
            cropShape="round" // Preview berbentuk BULAT
            showGrid={false}
          />
        </div>

        {/* Footer (Slider & Buttons) */}
        <div className="p-6 bg-white dark:bg-gray-800 space-y-4 z-10">
           <div className="flex items-center gap-4">
              <span className="text-xs font-bold text-gray-500">Zoom</span>
              <input 
                type="range" 
                value={zoom} 
                min={1} 
                max={3} 
                step={0.1} 
                aria-labelledby="Zoom"
                onChange={(e) => setZoom(Number(e.target.value))}
                className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 accent-blue-600"
              />
           </div>

           <div className="flex gap-3">
              <button onClick={onCancel} className="flex-1 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-bold hover:bg-gray-50 dark:hover:bg-white/5">
                Batal
              </button>
              <button 
                onClick={handleSave} 
                disabled={isProcessing}
                className="flex-1 py-2.5 rounded-lg bg-blue-600 text-white font-bold hover:bg-blue-700 flex items-center justify-center gap-2"
              >
                {isProcessing ? "Memproses..." : <><HiCheck size={18} /> Simpan Foto</>}
              </button>
           </div>
        </div>
      </div>
    </div>
  );
}