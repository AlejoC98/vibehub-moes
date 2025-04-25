import React, { useCallback, useState, useRef, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { Box, IconButton, Typography } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CloseIcon from '@mui/icons-material/Close';

type Props = {
  maxWidth?: number,
  productIMG: File | null;
  setProductIMG: (img: File | null) => void;
};

const ImageDropzone: React.FC<Props> = ({ productIMG, setProductIMG, maxWidth = 400}) => {
  const [preview, setPreview] = useState<string | null>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file && file.type.startsWith('image/')) {
      setProductIMG(file);
      const reader = new FileReader();
      reader.onload = () => setPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  }, [setProductIMG]);

  const removeImage = () => {
    setPreview(null);
    setProductIMG(null);
  };

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
    maxFiles: 1
  });

  return (
    <Box sx={{ display: 'grid', placeItems: productIMG ? 'center' : 'inherit' }}>
      {!productIMG ? (
        <Box
          {...getRootProps()}
          sx={{
            border: '2px dashed #ccc',
            borderRadius: 2,
            padding: 3,
            textAlign: 'center',
            cursor: 'pointer',
            backgroundColor: isDragActive ? '#f0f8ff' : '#fafafa',
            transition: '0.2s ease',
            '&:hover': {
              backgroundColor: '#f5f5f5'
            }
          }}
        >
          <input {...getInputProps()} />
          <CloudUploadIcon sx={{ fontSize: 40, color: '#42858C' }} />
          <Typography variant="body1" mt={1}>
            {isDragActive
              ? "Drop the image here..."
              : "Drag & drop or click to upload an image"}
          </Typography>
        </Box>
      ) : (
        <Box mt={2} sx={{ position: 'relative', width: 'fit-content' }}>
          <img
            ref={imageRef}
            src={preview || undefined}
            alt="Preview"
            style={{
              maxWidth: maxWidth,
              borderRadius: '8px',
              display: 'block'
            }}
          />
          <IconButton
            onClick={removeImage}
            sx={{
              position: 'absolute',
              top: 5,
              right: 5,
              backgroundColor: '#fff',
              border: '1px solid #ccc',
              width: 24,
              height: 24,
              '&:hover': {
                backgroundColor: '#eee'
              }
            }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>
      )}
    </Box>
  );
};

export default ImageDropzone;
