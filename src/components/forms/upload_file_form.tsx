import React, { FC, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Box, IconButton, Typography } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CloseIcon from '@mui/icons-material/Close';

type Props = {
  excelFile: File | null;
  setExcelFile: (file: File | null) => void;
};

const FileDropZone: FC<Props> = ({ excelFile, setExcelFile }) => {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file && file.name.endsWith('.xlsx')) {
      setExcelFile(file);
    }
  }, [setExcelFile]);
  const removeFile = () => {
    setExcelFile(null);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx']
    },
    maxFiles: 1
  });

  return (
    <Box sx={{ display: 'grid', placeItems: excelFile ? 'center' : 'inherit' }}>
      {!excelFile ? (
        <Box
          {...getRootProps()}
          sx={{
            border: '2px dashed #ccc',
            borderRadius: 2,
            padding: 3,
            minHeight: 200,
            display: 'grid',
            placeItems: 'center',
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
          <CloudUploadIcon sx={{ fontSize: 80, color: '#42858C' }} />
          <Typography variant="body1" mt={1}>
            {isDragActive
              ? "Drop the Excel file here..."
              : "Drag & drop or click to upload an Excel file (.xlsx)"}
          </Typography>
        </Box>
      ) : (
        <Box mt={2} sx={{ display: 'flex', flexDirection: 'column', placeItems: 'center', gap: 5}}>
            <img src="/static/img/excel-icon.png" alt="" style={{ width: 100 }} />
            <Box sx={{ display: 'flex', gap: 2 }}>
                <Typography fontWeight="bold">{excelFile.name}</Typography>
                <IconButton
                    onClick={removeFile}
                    sx={{
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
        </Box>
      )}
    </Box>
  );
};

export default FileDropZone;
