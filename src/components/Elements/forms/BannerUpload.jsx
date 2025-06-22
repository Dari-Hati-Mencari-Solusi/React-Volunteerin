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
  const [isResizing, setIsResizing] = useState(false);
  const fileInputRef = useRef(null);

  // Track whether onUpdate has been called for this file
  const hasUpdatedRef = useRef(false);

  // Expose validation method to parent component
  useImperativeHandle(ref, () => ({
    validate: () => {
      if (!bannerFile) {
        return ["Event banner must be uploaded"];
      }
      return [];
    },
  }));

  // Call onUpdate when bannerFile changes and only once per file
  useEffect(() => {
    // Only update if we have a file and haven't already updated for this file
    if (bannerFile && onUpdate && !hasUpdatedRef.current) {
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
  }, [bannerFile, onUpdate]);

  // Resize image to 600x300 dimensions
  const resizeImageTo600x300 = (file) => {
    return new Promise((resolve, reject) => {
      setIsResizing(true);
      
      // Create FileReader to read the file
      const reader = new FileReader();
      
      reader.onload = (e) => {
        // Create image element
        const img = new Image();
        
        img.onload = () => {
          // Create canvas with target dimensions 600x300
          const canvas = document.createElement('canvas');
          canvas.width = 600;
          canvas.height = 300;
          const ctx = canvas.getContext('2d');
          
          // Fill background with white color
          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(0, 0, 600, 300);
          
          // Calculate dimensions to maintain aspect ratio
          let sourceWidth = img.width;
          let sourceHeight = img.height;
          let destX = 0;
          let destY = 0;
          let destWidth = 600;
          let destHeight = 300;
          
          const sourceAspect = sourceWidth / sourceHeight;
          const destAspect = destWidth / destHeight;
          
          if (sourceAspect > destAspect) {
            // Image too wide, adjust height
            destHeight = destWidth / sourceAspect;
            destY = (canvas.height - destHeight) / 2;
          } else {
            // Image too tall, adjust width
            destWidth = destHeight * sourceAspect;
            destX = (canvas.width - destWidth) / 2;
          }
          
          // Draw image to canvas with center position and proper size
          ctx.drawImage(
            img,
            0, 0, sourceWidth, sourceHeight,
            destX, destY, destWidth, destHeight
          );
          
          // Convert canvas to blob
          canvas.toBlob((blob) => {
            if (!blob) {
              setIsResizing(false);
              reject(new Error('Failed to resize image'));
              return;
            }
            
            // Create new file from blob
            const resizedFile = new File([blob], file.name, {
              type: 'image/jpeg',
              lastModified: Date.now()
            });
            
            setIsResizing(false);
            resolve(resizedFile);
          }, 'image/jpeg', 0.92); // 92% quality
        };
        
        img.onerror = () => {
          setIsResizing(false);
          reject(new Error('Failed to load image for resizing'));
        };
        
        img.src = e.target.result;
      };
      
      reader.onerror = () => {
        setIsResizing(false);
        reject(new Error('Failed to read image file'));
      };
      
      reader.readAsDataURL(file);
    });
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];

    if (!file) {
      setBannerFile(null);
      setPreviewUrl("");
      setError("");
      return;
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setError("File must be an image (JPG, PNG, etc)");
      return;
    }

    // Validate file size (1MB max)
    if (file.size > 1024 * 1024) {
      setError("Image size maximum 1MB");
      return;
    }

    try {
      // Reset the update flag for the new file
      hasUpdatedRef.current = false;

      // Resize image to 600x300
      const resizedFile = await resizeImageTo600x300(file);
      
      // Create preview URL
      const url = URL.createObjectURL(resizedFile);

      // Update state with resized file
      setBannerFile(resizedFile);
      setPreviewUrl(url);
      setError("");
    } catch (error) {
      setError("Failed to resize image: " + error.message);
    }
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
        <h2 className="text-xl font-medium">Event Banner</h2>
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
              disabled={isResizing}
              className="block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-full file:border-0
                file:text-sm file:font-semibold
                file:bg-blue-50 file:text-blue-700
                hover:file:bg-blue-100"
            />
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <p className="text-sm text-gray-500">
              Image format: JPG, PNG. Maximum size: 1MB
            </p>
            <p className="text-sm text-blue-600 font-medium">
              Image will be automatically resized to 600x300 pixels
            </p>
            {isResizing && (
              <p className="text-sm text-orange-500">
                Resizing image...
              </p>
            )}
          </div>

          {previewUrl && (
            <div className="space-y-2">
              <p className="font-medium">Banner Preview (600x300)</p>
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