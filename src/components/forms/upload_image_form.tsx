import { Box, IconButton } from '@mui/material'
import React, { useRef, useState } from 'react'
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CloseIcon from '@mui/icons-material/Close';

const UploadImageForm = ({ productIMG, setProductIMG } : { productIMG: File | null, setProductIMG: (img: File | null) => void }) => {

  const [preview, setPreview] = useState<string | null>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setProductIMG(file);

      const reader = new FileReader();
      reader.onload = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setPreview(null);
    setProductIMG(null);
  }

  return (
    <Box>

      { productIMG == undefined ? (
        <label htmlFor="file-upload">
        <input
          id="file-upload"
          type="file"
          accept="image/*"
          hidden
          onChange={handleFileChange}
        />
        <IconButton
          component="span"
          sx={{
            background: '#f0f0f0',
            display: 'flex',
            justifyContent: 'center',
            placeItems: 'center',
            width: 100,
            height: 100,
            borderRadius: 2,
            WebkitBoxShadow: '0px 10px 15px -8px rgba(0,0,0,0.75)',
            boxShadow: '0px 10px 15px -8px rgba(0,0,0,0.75)',
          }}
        >
          <CloudUploadIcon sx={{ color: "#42858C", fontSize: 60}} />
        </IconButton>
      </label>
      ) : (
        <Box mt={2} sx={{
          position: 'relative',
          '&:hover .hover-cover': {
            opacity: 1,
            pointerEvents: 'auto',
          },
          '&:hover .hover-close': {
            background: '#fff'
          },
        }}>
          <Box className='hover-cover'
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              bottom: 0,
              right: 0,
              background: 'rgba(0, 0, 0, 0.2)',
              opacity: 0,
              transition: '0.3s ease',
              pointerEvents: 'none',
              borderRadius: 2

            }}
          />
          <IconButton className="hover-close" sx={{ position: 'absolute', top: 5, right: 5, width: 20, height: 20}} onClick={removeImage}>
            <CloseIcon fontSize='small' />
          </IconButton>
          <img
            ref={imageRef}
            src={preview || undefined}
            alt="Preview"
            onLoad={() => console.log('Image loaded!')}
            style={{ maxWidth: '200px', borderRadius: '8px'}}
          />
        </Box>
      )}
    </Box>
  )
}

export default UploadImageForm
