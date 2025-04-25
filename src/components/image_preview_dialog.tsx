import { Box, Dialog, DialogContent } from '@mui/material';
import { useState } from 'react';

export const ImagePreviewDialog = ({ imageUrl }: { imageUrl: string }) => {
  const [open, setOpen] = useState(false);

  return (
    <Box>
      <img
        src={imageUrl}
        alt="thumbnail"
        onClick={() => setOpen(true)}
        style={{ maxWidth: 150, cursor: 'pointer' }}
      />

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="lg">
        <DialogContent>
          <img
            src={imageUrl}
            alt="full preview"
            style={{ maxWidth: '100%', height: 'auto' }}
          />
        </DialogContent>
      </Dialog>
    </Box>
  );
};
