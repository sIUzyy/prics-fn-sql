import { MdOutlineFileUpload } from "react-icons/md";
import PropTypes from "prop-types";
// toast
import { toast } from "sonner";

export default function UserImageUpload({ uploadedImages, setUploadedImages }) {
  const MAX_FILES = 5;
  const MAX_SIZE_MB = 10; // 10MB per image

  // Handle file selection
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);

    // Check file size
    const oversizedFiles = files.filter(
      (file) => file.size > MAX_SIZE_MB * 1024 * 1024
    );
    if (oversizedFiles.length > 0) {
      toast.warning(`Each image must be under ${MAX_SIZE_MB}MB.`, {
        style: {
          backgroundColor: "#FFA500",
          color: "#fff",
        },
      });
      alert(`Some files exceed ${MAX_SIZE_MB}MB. Please upload smaller files.`);
      return;
    }

    // Check file count
    if (uploadedImages.length + files.length > MAX_FILES) {
      toast.warning(`You can only upload up to ${MAX_FILES} images.`, {
        style: {
          backgroundColor: "#FFA500",
          color: "#fff",
        },
      });
      return;
    }

    setUploadedImages((prevImages) => [...prevImages, ...files]);
  };

  // handle drag and drop
  const handleDrop = (e) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);

    // check file size
    const oversizedFiles = files.filter(
      (file) => file.size > MAX_SIZE_MB * 1024 * 1024
    );
    if (oversizedFiles.length > 0) {
      toast.warning(`Each image must be under ${MAX_SIZE_MB}MB.`, {
        style: {
          backgroundColor: "#FFA500",
          color: "#fff",
        },
      });
      alert(`Some files exceed ${MAX_SIZE_MB}MB. Please upload smaller files.`);
      return;
    }

    // Check file count
    if (uploadedImages.length + files.length > MAX_FILES) {
      toast.warning(`You can only upload up to ${MAX_FILES} images.`, {
        style: {
          backgroundColor: "#FFA500",
          color: "#fff",
        },
      });
      return;
    }

    setUploadedImages((prevImages) => [...prevImages, ...files]);
  };

  // remove an image from the list
  const removeImage = (index) => {
    setUploadedImages((prevImages) => prevImages.filter((_, i) => i !== index));
  };

  return (
    <div>
      <div className="flex items-center gap-2">
        <label className="font-work font-medium tracking-wider">
          Upload Image <span className="text-gray-400">*</span>
        </label>
        <p className="text-[#979090] text-sm">( Max: {MAX_FILES} images )</p>
      </div>

      <div
        className="border mt-1 border-dashed border-gray-400 w-full font-inter rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer transition bg-gray-100 text-gray-500 hover:bg-gray-200"
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
      >
        <input
          type="file"
          className="hidden"
          accept=".jpg,.jpeg,.png"
          multiple
          onChange={handleFileChange}
          id="fileInput"
          disabled={uploadedImages.length >= MAX_FILES}
        />
        <label htmlFor="fileInput" className="cursor-pointer text-center">
          <div className="flex flex-col items-center">
            <MdOutlineFileUpload size={35} />
            <p className="text-blue-500 underline mt-2">Click to upload</p>
            <p className="text-xs text-gray-500">or drag and drop</p>
            <p className="text-xs text-gray-500 mt-3">
              Max. File Size: {MAX_SIZE_MB}MB per image
            </p>
          </div>
        </label>
      </div>

      {/* display image names */}
      <ul className="mt-3 text-sm text-gray-700">
        {uploadedImages.map((file, index) => (
          <li
            key={index}
            className="flex justify-between items-center border-b py-1"
          >
            {file.name}
            <button
              onClick={() => removeImage(index)}
              className="text-red-500 text-xs ml-2"
            >
              ✕
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

// Props validation
UserImageUpload.propTypes = {
  uploadedImages: PropTypes.arrayOf(PropTypes.object).isRequired,
  setUploadedImages: PropTypes.func.isRequired,
};
