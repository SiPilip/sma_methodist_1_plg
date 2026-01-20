// src/lib/cropImage.ts

export const createImage = (url: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener("load", () => resolve(image));
    image.addEventListener("error", (error) => reject(error));
    image.setAttribute("crossOrigin", "anonymous"); 
    image.src = url;
  });

export function getRadianAngle(degreeValue: number) {
  return (degreeValue * Math.PI) / 180;
}

/**
 * Fungsi ini menerima URL gambar dan area crop (pixel),
 * lalu mengembalikan File Object baru hasil potongan.
 */
export default async function getCroppedImg(
  imageSrc: string,
  pixelCrop: { x: number; y: number; width: number; height: number },
  rotation = 0,
  fileName = "cropped.jpg"
): Promise<File | null> {
  const image = await createImage(imageSrc);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    return null;
  }

  const rotRad = getRadianAngle(rotation);

  // Hitung ukuran bounding box setelah rotasi
  const { width: bBoxWidth, height: bBoxHeight } = {
    width: Math.abs(Math.cos(rotRad) * image.width) + Math.abs(Math.sin(rotRad) * image.height),
    height: Math.abs(Math.sin(rotRad) * image.width) + Math.abs(Math.cos(rotRad) * image.height),
  };

  canvas.width = bBoxWidth;
  canvas.height = bBoxHeight;

  // Pindahkan titik pusat canvas agar rotasi benar
  ctx.translate(bBoxWidth / 2, bBoxHeight / 2);
  ctx.rotate(rotRad);
  ctx.translate(-image.width / 2, -image.height / 2);

  // Gambar citra asli ke canvas
  ctx.drawImage(image, 0, 0);

  // Ambil data dari area crop
  const data = ctx.getImageData(pixelCrop.x, pixelCrop.y, pixelCrop.width, pixelCrop.height);

  // Set ukuran canvas sesuai hasil crop final
  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;

  // Paste data crop ke canvas final
  ctx.putImageData(data, 0, 0);

  // Konversi Canvas -> Blob -> File
  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      if (!blob) {
        console.error("Canvas is empty");
        return resolve(null);
      }
      const file = new File([blob], fileName, { type: "image/jpeg" });
      resolve(file);
    }, "image/jpeg", 0.9); // Kualitas JPG 90%
  });
}