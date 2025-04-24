import { FC, useEffect, useRef } from 'react';

interface Props {
  onScan: (barcode: string) => void;
}

const BarcodeListener: FC<Props> = ({ onScan }) => {
  const buffer = useRef('');
  const lastKeyTime = useRef(Date.now());

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const now = Date.now();

      // Reset buffer if time between keys is too long (user typing)
      if (now - lastKeyTime.current > 100) {
        buffer.current = '';
      }

      // End scan when scanner presses Enter or Tab
      if (e.key === 'Enter' || e.key === 'Tab') {
        if (buffer.current.length > 5) {
          onScan(buffer.current);
        }
        buffer.current = '';
        e.preventDefault(); // ⛔ prevent submitting forms etc.
      } else {
        buffer.current += e.key;
      }

      lastKeyTime.current = now;
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onScan]);

  return null;
};

export default BarcodeListener;
