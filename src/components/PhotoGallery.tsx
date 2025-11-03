"use client";

import { useState } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

type Photo = {
  id: string;
  url: string;
  caption: string;
  type: string;
  uploadedAt: string;
  uploadedBy: string;
};

type PhotoGalleryProps = {
  photos: Photo[];
  title?: string;
};

export default function PhotoGallery({ photos, title = "Jobb bilder" }: PhotoGalleryProps) {
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number | null>(null);

  if (!photos || photos.length === 0) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
        <div className="text-gray-400 mb-2">
          <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        <p className="text-gray-600">Ingen bilder lastet opp ennå</p>
      </div>
    );
  }

  const openLightbox = (index: number) => {
    setSelectedPhotoIndex(index);
  };

  const closeLightbox = () => {
    setSelectedPhotoIndex(null);
  };

  const goToPrevious = () => {
    if (selectedPhotoIndex === null) return;
    setSelectedPhotoIndex(selectedPhotoIndex === 0 ? photos.length - 1 : selectedPhotoIndex - 1);
  };

  const goToNext = () => {
    if (selectedPhotoIndex === null) return;
    setSelectedPhotoIndex(selectedPhotoIndex === photos.length - 1 ? 0 : selectedPhotoIndex + 1);
  };

  const getPhotoTypeLabel = (type: string) => {
    switch (type) {
      case "before":
        return "📸 Før arbeid";
      case "after":
        return "📸 Etter arbeid";
      case "chat":
        return "💬 Chat bilde";
      default:
        return "📷 Bilde";
    }
  };

  const getUploaderLabel = (uploadedBy: string) => {
    return uploadedBy === "employer" ? "Arbeidsgiver" : "Arbeidstaker";
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        <span className="text-sm text-gray-500">{photos.length} bilde{photos.length !== 1 ? "r" : ""}</span>
      </div>

      {/* Photo Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {photos.map((photo, index) => (
          <div
            key={photo.id}
            className="relative group cursor-pointer rounded-lg overflow-hidden border border-gray-200 hover:border-orange-300 transition-colors"
            onClick={() => openLightbox(index)}
          >
            <div className="aspect-square relative">
              <Image
                src={photo.url}
                alt={photo.caption}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-opacity" />
            </div>

            {/* Photo type badge */}
            <div className="absolute top-2 left-2">
              <span className="px-2 py-1 bg-black bg-opacity-75 text-white text-xs rounded">
                {getPhotoTypeLabel(photo.type)}
              </span>
            </div>

            {/* Caption overlay on hover */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-3 opacity-0 group-hover:opacity-100 transition-opacity">
              <p className="text-white text-sm font-medium truncate">{photo.caption}</p>
              <p className="text-white text-xs opacity-75">
                {getUploaderLabel(photo.uploadedBy)} • {new Date(photo.uploadedAt).toLocaleDateString('no-NO')}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox */}
      {selectedPhotoIndex !== null && (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4">
          <div className="relative max-w-4xl max-h-full">
            {/* Close button */}
            <button
              onClick={closeLightbox}
              className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors"
            >
              <X className="w-8 h-8" />
            </button>

            {/* Navigation buttons */}
            {photos.length > 1 && (
              <>
                <button
                  onClick={goToPrevious}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 transition-colors bg-black bg-opacity-50 rounded-full p-2"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={goToNext}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 transition-colors bg-black bg-opacity-50 rounded-full p-2"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}

            {/* Main image */}
            <div className="relative">
              <Image
                src={photos[selectedPhotoIndex].url}
                alt={photos[selectedPhotoIndex].caption}
                width={800}
                height={600}
                className="max-w-full max-h-[80vh] object-contain rounded-lg"
              />
            </div>

            {/* Photo info */}
            <div className="mt-4 text-center">
              <h4 className="text-white text-lg font-medium mb-1">
                {photos[selectedPhotoIndex].caption}
              </h4>
              <div className="flex items-center justify-center gap-4 text-white text-sm opacity-75">
                <span>{getPhotoTypeLabel(photos[selectedPhotoIndex].type)}</span>
                <span>•</span>
                <span>{getUploaderLabel(photos[selectedPhotoIndex].uploadedBy)}</span>
                <span>•</span>
                <span>{new Date(photos[selectedPhotoIndex].uploadedAt).toLocaleString('no-NO')}</span>
              </div>
            </div>

            {/* Thumbnail navigation */}
            {photos.length > 1 && (
              <div className="mt-4 flex justify-center gap-2 overflow-x-auto max-w-full">
                {photos.map((photo, index) => (
                  <button
                    key={photo.id}
                    onClick={() => setSelectedPhotoIndex(index)}
                    className={`flex-shrink-0 w-16 h-16 rounded border-2 overflow-hidden ${
                      index === selectedPhotoIndex ? 'border-orange-400' : 'border-gray-600'
                    }`}
                  >
                    <Image
                      src={photo.url}
                      alt={photo.caption}
                      width={64}
                      height={64}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}