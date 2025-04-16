import * as XLSX from 'xlsx'
import { saveAs } from 'file-saver';
import { toast } from "react-toastify";
import { AccountContent, OrderContent } from "@/utils/interfaces";
import { GridColDef } from '@mui/x-data-grid';
import { RefObject, useContext } from 'react';
import { formatInTimeZone } from 'date-fns-tz';
import { GlobalContext } from '../context/global_provider';
import { createClient } from '../supabase/client';

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

export const deepSearch = (data: any[], key: string, exactMatch: boolean = false): any[] => {
  const lowerKey = key.toLowerCase();

  const hasMatch = (obj: any): boolean => {
    if (obj === null || obj === undefined) return false;

    if (typeof obj === 'string' || typeof obj === 'number' || typeof obj === 'boolean') {
      if (exactMatch) {
        return obj.toString().toLowerCase() === lowerKey; // Exact match
      }
      return obj.toString().toLowerCase().includes(lowerKey); // Partial match
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

export function prepareExportData(data: any[], columns: GridColDef[]) {
  return data.map((row) => {
    const formattedRow: Record<string, any> = {}

    columns.forEach((col) => {
      // Skip if no field (like actions column)
      if (!col.field || col.field === 'actions') return

      // Use renderCell if it exists, else raw value
      const value = col.renderCell
        ? col.renderCell({
          id: row.id,
          field: col.field,
          row,
          value: row[col.field],
        } as any) // cast to any to avoid typing issues
        : row[col.field]

      // Assign value to header name
      formattedRow[col.headerName ?? col.field] = value
    })

    return formattedRow
  })
}

export function exportToExcel(data: any[], columns: GridColDef[], fileName: string = 'table-export') {

  const rowsForExport = prepareExportData(data, columns);

  const worksheet = XLSX.utils.json_to_sheet(rowsForExport)
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1')

  const excelBuffer = XLSX.write(workbook, {
    bookType: 'xlsx',
    type: 'array',
  })

  const blob = new Blob([excelBuffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  })

  saveAs(blob, `${fileName}.xlsx`)
}

export const startCountdown = (
  ref: RefObject<HTMLElement | null>,
  onComplete: () => void,
  startValue = 3,
  text?: string,
) => {
  let count = startValue
  if (ref.current) {
    ref.current.textContent = `${text} ${count}`
  }

  const interval = setInterval(() => {
    count--
    if (ref.current) {
      ref.current.textContent = `${text} ${count}`
    }

    if (count <= 0) {
      clearInterval(interval)
      onComplete()
    }
  }, 1000)
}

export const findUserByUUID = (users: AccountContent[], match: string) => {

  try {
    const userFound = users.find(u => u.user_id == match);

    if (userFound == undefined) {
      throw new Error('User not found!');
    }

    return userFound.username;

  } catch (error: any) {
    return undefined;
  }
}

export const convertTimeByTimeZone = (sessionTimeZone: string, utcDate?: string) => {
  // const utcFormatted = formatInTimeZone(utcDate, 'UTC', 'MMMM d, yyyy h:mm a');
  try {

    var formatted;
    if (utcDate != undefined) {
      formatted = formatInTimeZone(utcDate, sessionTimeZone, 'MMMM d, yyyy h:mm a');
    } else {
      formatted = formatInTimeZone(new Date(), sessionTimeZone, 'MMMM d, yyyy h:mm a');
    }
    return formatted;
  } catch (error) {
    console.log(error);
  }
}

export const createNotification = async (roles: number[], redirect_to: string) => {

  const supabase = await createClient();

  try {
    const { data: newNoti, error } = await supabase.from('notifications').insert({
      'title': 'Shipping Order Created',
      'text': 'Someone has cerate a new shipping order.',
      'type': 'Shipping',
      'status': 'New',
      'redirect_to': redirect_to,
      // 'redirect_to': `/shipping/${newOrder['trailer_number']}`,
    }).select().single();

    if (error) {
      throw new Error(error.message);
    }

    for (var role of roles) {
      await supabase.from('roles_notifications').insert({
        'notification_id': newNoti!['id'],
        'role_id': role,
      });
    }
  } catch (error: any) {
    toast.warning(error.message);
    console.log(error.message);
  }
}

export const hadleUploadToBucket = async (bucket: string, path: string, image: File) => {

  const supabase = createClient();

  const { error: imageError } = await supabase
    .storage
    .from(bucket)
    .upload(path, image, {
      cacheControl: '3600',
      upsert: false
    });

  if (imageError) {
    throw new Error(imageError.message);
  }

  const { data: signedURL, error: urlError } = await supabase
    .storage
    .from(bucket)
    .createSignedUrl(path, 31_536_000);

  if (urlError) {
    throw new Error(urlError.message);
  }

  return signedURL;
}
