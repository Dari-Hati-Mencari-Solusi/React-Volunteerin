import React, { useState, useRef } from "react";
import { Icon } from "@iconify/react";

const BannerProfilePartner = ({ onClose }) => {
  const [bannerFile, setBannerFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [sizeError, setSizeError] = useState(false);
  const fileInputRef = useRef(null);

  const MAX_FILE_SIZE = 1 * 1024 * 1024;
  const validateFileSize = (file) => {
    if (file.size > MAX_FILE_SIZE) {
      setSizeError(true);
      return false;
    }

    setSizeError(false);
    return true;
  };

  const handleBannerUpload = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      if (!validateFileSize(file)) {
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
        return;
      }

      setBannerFile(file);

      // Create preview URL
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isDragging) {
      setIsDragging(true);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];

      if (!validateFileSize(file)) {
        return;
      }

      setBannerFile(file);

      const reader = new FileReader();
      reader.onload = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);

      if (fileInputRef.current) {
        fileInputRef.current.files = e.dataTransfer.files;
      }
    }
  };

  const togglePreview = () => {
    if (previewUrl) {
      setShowPreview(!showPreview);
    }
  };

  const removeFile = (e) => {
    e.stopPropagation();
    setBannerFile(null);
    setPreviewUrl(null);
    setShowPreview(false);
    setSizeError(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const downloadImage = () => {
    const link = document.createElement("a");
    link.href = previewUrl;
    link.download = bannerFile.name || "banner-image";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleContainerClick = (e) => {
    if (previewUrl && !showPreview) {
      e.preventDefault();
      togglePreview();
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + " B";
    else if (bytes < 1048576) return (bytes / 1024).toFixed(2) + " KB";
    else return (bytes / 1048576).toFixed(2) + " MB";
  };

  return (
    <div className="w-full max-w-full mx-auto">
      <div className="w-full">
        <div>
          <div className="flex justify-between items-center">
            <label className="block text-sm font-medium">
              Upload Banner <span className="text-red-500">*</span>
            </label>
            <span className="text-red-500 text-sm">
              Ukuran maksimal banner adalah 300px × 600px Max 1MB
            </span>
          </div>

          {sizeError && (
            <div className="mt-2 text-red-500 text-sm font-medium">
              Ukuran fil e terlalu besar. Maksimal 1MB. Silakan pilih file yang
              lebih kecil.
            </div>
          )}

          <div className="mt-2">
            <div
              className={`border rounded-lg text-center cursor-pointer bg-white
                    ${
                      isDragging
                        ? "border-blue-500 bg-blue-50"
                        : sizeError
                        ? "border-red-500 bg-red-50"
                        : "border-gray-300"
                    }
                    ${bannerFile && !sizeError ? "border-none" : ""}`}
              onDragEnter={handleDragEnter}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={handleContainerClick}
            >
              {(!previewUrl || !showPreview) && (
                <>
                  <input
                    type="file"
                    onChange={handleBannerUpload}
                    className="hidden"
                    id="banner-upload"
                    ref={fileInputRef}
                    accept="image/*"
                  />
                  <label
                    htmlFor={previewUrl ? "" : "banner-upload"}
                    className="cursor-pointer w-full h-full block"
                    onClick={(e) => {
                      if (previewUrl) {
                        e.preventDefault();
                      }
                    }}
                  >
                    {previewUrl ? (
                      <div className="flex flex-col items-center justify-center p-8">
                        <Icon
                          icon="mdi:file-image-outline"
                          className="text-gray-400 text-5xl mb-2"
                        />
                        <p className="text-blue-500 underline">
                          Klik untuk buka
                        </p>
                        {bannerFile && (
                          <p className="text-gray-500 text-sm mt-1">
                            {bannerFile.name} ({formatFileSize(bannerFile.size)}
                            )
                          </p>
                        )}
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center p-8">
                        <Icon
                          icon="mdi:file-outline"
                          className="text-gray-400 text-5xl mb-2"
                        />
                        <p className="text-gray-400">
                          Seret banner anda disini
                        </p>
                        <p className="text-gray-400 text-sm mt-1">
                          Atau klik untuk memilih file (Max 1MB)
                        </p>
                      </div>
                    )}
                  </label>
                </>
              )}

              {previewUrl && showPreview && (
                <div className="relative w-full">
                  <img
                    src={previewUrl}
                    alt="Banner preview"
                    className="w-full h-auto object-contain rounded-lg"
                  />
                  <button
                    onClick={removeFile}
                    className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full"
                  >
                    <Icon icon="mdi:close" className="text-xl" />
                  </button>
                  <button
                    onClick={downloadImage}
                    className="absolute bottom-2 right-2 bg-blue-500 text-white p-1 rounded-full"
                  >
                    <Icon icon="mdi:download" className="text-xl" />
                  </button>
                  {bannerFile && (
                    <div className="absolute bottom-2 left-2 bg-black bg-opacity-70 text-white px-2 py-1 rounded text-sm">
                      {bannerFile.name} ({formatFileSize(bannerFile.size)})
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BannerProfilePartner;
