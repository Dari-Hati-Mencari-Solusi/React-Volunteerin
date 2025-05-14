import React, {
  useState,
  useRef,
  forwardRef,
  useImperativeHandle,
  useEffect,
} from "react";

const BannerUpload = forwardRef(({ onUpdate }, ref) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [bannerFile, setBannerFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [error, setError] = useState("");
  const fileInputRef = useRef(null);

  // Keep track of whether onUpdate has been called already for this file
  const hasUpdatedRef = useRef(false);

  // Expose validate function to parent component
  useImperativeHandle(ref, () => ({
    validate: () => {
      if (!bannerFile) {
        return ["Banner event harus diunggah"];
      }
      return [];
    },
  }));

  // FIXED: Use useEffect with bannerFile dependency only
  // Call onUpdate only when bannerFile changes and only once per file
  useEffect(() => {
    // Only update if we have a file and haven't already updated for this file
    if (bannerFile && onUpdate && !hasUpdatedRef.current) {
      console.log(
        `Updating with banner: ${bannerFile.name}, size: ${bannerFile.size}`
      );
      onUpdate({ banner: bannerFile });
      hasUpdatedRef.current = true;
    }

    // Reset the flag if bannerFile changes to null
    if (!bannerFile) {
      hasUpdatedRef.current = false;
    }

    // Cleanup function for preview URL
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [bannerFile]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];

    if (!file) {
      setBannerFile(null);
      setPreviewUrl("");
      setError("");
      return;
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setError("File harus berupa gambar (JPG, PNG, dll)");
      return;
    }

    // Validate file size (1MB max)
    if (file.size > 1024 * 1024) {
      setError("Ukuran gambar maksimal 1MB");
      return;
    }

    // Reset the update flag for the new file
    hasUpdatedRef.current = false;

    // Create preview URL
    const url = URL.createObjectURL(file);

    // Update state
    setBannerFile(file);
    setPreviewUrl(url);
    setError("");
  };

  const handleRemoveBanner = () => {
    setBannerFile(null);
    setPreviewUrl("");
    setError("");

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

    // Notify parent component
    if (onUpdate) {
      onUpdate({ banner: null });
    }
  };

  const toggleExpandCollapse = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="border rounded-lg p-6 bg-white shadow-sm">
      <div
        className="flex justify-between items-center cursor-pointer"
        onClick={toggleExpandCollapse}
      >
        <h2 className="text-xl font-medium">Banner Event</h2>
        <button
          type="button"
          className="text-gray-400 hover:text-gray-500"
          aria-expanded={isExpanded}
          aria-label={isExpanded ? "Collapse section" : "Expand section"}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`h-6 w-6 transition-transform ${
              isExpanded ? "rotate-180" : ""
            }`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>
      </div>

      {isExpanded && (
        <div className="mt-4 space-y-4">
          <div className="space-y-2">
            <label htmlFor="banner" className="block text-gray-700">
              Upload Banner
            </label>
            <input
              ref={fileInputRef}
              type="file"
              id="banner"
              accept="image/*"
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-full file:border-0
                file:text-sm file:font-semibold
                file:bg-blue-50 file:text-blue-700
                hover:file:bg-blue-100"
            />
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <p className="text-sm text-gray-500">
              Format gambar: JPG, PNG. Ukuran maksimal: 1MB
            </p>
          </div>

          {previewUrl && (
            <div className="space-y-2">
              <p className="font-medium">Preview Banner</p>
              <div className="relative">
                <img
                  src={previewUrl}
                  alt="Banner Preview"
                  className="w-full h-auto max-h-64 object-cover rounded"
                />
                <button
                  type="button"
                  onClick={handleRemoveBanner}
                  className="absolute top-2 right-2 bg-red-600 text-white p-1 rounded-full hover:bg-red-700"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
});

BannerUpload.displayName = "BannerUpload";

export default BannerUpload;
