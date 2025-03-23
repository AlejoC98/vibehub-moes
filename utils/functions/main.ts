import { toast } from "react-toastify";
import { OrderContent } from "../interfaces";

export const calculateRevenue = (data: OrderContent[]) => {
    let totalReturn = 0;

    if (data !== undefined) {
        data.forEach(order => {
            totalReturn += order.total;
        });
    }

    return totalReturn;
}

export function generateRandomNumberString(length: number) {
    const array = new Uint8Array(length);
    crypto.getRandomValues(array);
    return Array.from(array, (byte) => byte % 10).join('');
}

export function generateBarcodesWithSeparator(name: string, rows: number, columns: number): string[] {
    const barcodes: string[] = [];
  
    for (let row = 1; row <= rows; row++) {
      for (let col = 1; col <= columns; col++) {
        barcodes.push(`${name.replaceAll(' ', '-').toLocaleUpperCase()}-${row}-${col}`);
      }
    }
  
    return barcodes;
  }

  export const searchSku = (data: Array<any>, value: string) => {

    if (value.length === 15) {
      const search = data?.find(i => i.sku === value);
  
      if (search) {
        return search;
      } else {
        toast.warning("Sku didn't find!");
      }
    }
  }

export const deepSearch = (data: any[], key: string): any[] => {
  const lowerKey = key.toLowerCase();

  const hasMatch = (obj: any): boolean => {
    if (obj === null || obj === undefined) return false;

    if (typeof obj === 'string' || typeof obj === 'number' || typeof obj === 'boolean') {
      return obj.toString().toLowerCase().includes(lowerKey);
    }

    if (Array.isArray(obj)) {
      return obj.some(item => hasMatch(item));
    }

    if (typeof obj === 'object') {
      return Object.values(obj).some(value => hasMatch(value));
    }

    return false;
  };

  const result = data.filter(parentObj => hasMatch(parentObj));

  return result.length > 0 ? result : [];
};
