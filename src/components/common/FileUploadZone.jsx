import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { FaCloudUploadAlt, FaTimes } from 'react-icons/fa';

const FileUploadZone = ({ 
  onUpload, 
  accept = 'image/*',
  maxSize = 5, // MB
  preview = true,
  label = 'Upload File'
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [error, setError] = useState('');
  const inputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const validateFile = (file) => {
    // Check file size
    if (file.size > maxSize * 1024 * 1024) {
      setError(`File size must be less than ${maxSize}MB`);
      return false;
    }

    // Check file type
    const acceptedTypes = accept.split(',').map(type => type.trim());
    const fileType = file.type;
    const isValid = acceptedTypes.some(type => {
      if (type.endsWith('/*')) {
        return fileType.startsWith(type.replace('/*', ''));
      }
      return fileType === type;
    });

    if (!isValid) {
      setError('Invalid file type');
      return false;
    }

    setError('');
    return true;
  };

  const handleFile = (file) => {
    if (!validateFile(file)) return;

    setFile(file);

    // Create preview for images
    if (preview && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }

    // Call the onUpload callback
    onUpload(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleRemove = () => {
    setFile(null);
    setPreviewUrl(null);
    setError('');
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  return (
    <div className="w-full">
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={handleChange}
        className="hidden"
        id="file-upload"
      />

      {!file ? (
        <motion.label
          htmlFor="file-upload"
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          whileHover={{ scale: 1.01 }}
          className={`
            flex flex-col items-center justify-center
            w-full h-48 border-2 border-dashed rounded-xl
            cursor-pointer transition-all duration-200
            ${dragActive 
              ? 'border-green bg-green bg-opacity-10' 
              : 'border-darkGray hover:border-green'
            }
          `}
        >
          <FaCloudUploadAlt className="text-5xl text-lightGray mb-3" />
          <p className="text-lg font-medium text-white mb-1">{label}</p>
          <p className="text-sm text-textSecondary">
            Drag & drop or click to browse
          </p>
          <p className="text-xs text-textSecondary mt-2">
            Max size: {maxSize}MB
          </p>
        </motion.label>
      ) : (
        <div className="relative w-full border-2 border-green rounded-xl p-4 bg-popup">
          <button
            onClick={handleRemove}
            className="absolute top-2 right-2 p-2 rounded-full bg-background hover:bg-darkBg transition-colors"
          >
            <FaTimes className="text-white" />
          </button>

          {previewUrl ? (
            <div className="flex flex-col items-center">
              <img
                src={previewUrl}
                alt="Preview"
                className="max-h-48 rounded-lg object-contain"
              />
              <p className="text-sm text-lightGray mt-3">{file.name}</p>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <FaCloudUploadAlt className="text-3xl text-green" />
              <div>
                <p className="text-white font-medium">{file.name}</p>
                <p className="text-sm text-textSecondary">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {error && (
        <p className="text-red-500 text-sm mt-2">{error}</p>
      )}
    </div>
  );
};

export default FileUploadZone;
