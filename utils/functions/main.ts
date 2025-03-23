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