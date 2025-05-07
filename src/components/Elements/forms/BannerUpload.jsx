import React, { useState, useRef } from "react";
import { Icon } from "@iconify/react";
import Banner from "../../../assets/images/banner2.jpg";

const BannerUpload = ({ onClose }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [bannerFile, setBannerFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [showExampleModal, setShowExampleModal] = useState(false);
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

  const toggleExampleModal = () => {
    setShowExampleModal(!showExampleModal);
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
        <div
          className="flex items-center justify-between bg-[#0A3E54] text-white p-3 rounded-t-xl cursor-pointer"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <h2 className="text-lg font-semibold">Upload Banner</h2>
          <button className="text-white focus:outline-none">
            <Icon
              icon={isExpanded ? "mdi:chevron-up" : "mdi:chevron-down"}
              className="text-3xl"
            />
          </button>
        </div>

        <div
          className={`bg-[#F7F7F7] border border-[#ECECEC] overflow-hidden transition-all rounded-b-xl duration-300 w-full ${
            isExpanded ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="p-6 space-y-6">
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
                  Ukuran file terlalu besar. Maksimal 1MB. Silakan pilih file yang lebih kecil.
                </div>
              )}

              <div className="mt-2">
                <div
                  className={`border-2 border-dashed rounded-lg text-center cursor-pointer bg-white
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
                            <p className="text-blue-500 underline">Klik untuk buka</p>
                            {bannerFile && (
                              <p className="text-gray-500 text-sm mt-1">
                                {bannerFile.name} ({formatFileSize(bannerFile.size)})
                              </p>
                            )}
                          </div>
                        ) : (
                          <div className="flex flex-col items-center justify-center p-8">
                            <Icon
                              icon="mdi:file-outline"
                              className="text-gray-400 text-5xl mb-2"
                            />
                            <p className="text-gray-400">Seret banner anda disini</p>
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

            <div>
              <h3 className="font-medium">Ketentuan:</h3>
              <p className="text-gray-500 mt-1">
                Lorem Ipsum is simply dummy text of the printing and typesetting
                industry. Lorem Ipsum has been the industry's standard dummy
                text ever since the 1500s, when an unknown printer took a galley
                of type and scrambled it to make a type specimen book.{" "}
                <button
                  onClick={toggleExampleModal}
                  className="text-black font-medium hover:underline"
                >
                  Lihat contoh banner
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>

      {showExampleModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Contoh Banner</h2>
              <button
                onClick={toggleExampleModal}
                className="text-gray-500 hover:text-gray-700"
              >
                <Icon icon="mdi:close" className="text-2xl" />
              </button>
            </div>
            <img
              src={Banner}
              alt="Contoh Banner"
              className="w-full h-auto"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default BannerUpload;