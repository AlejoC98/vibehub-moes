// import * as XLSX from 'xlsx'
import * as XLSX from 'xlsx-js-style';
import { saveAs } from 'file-saver';
import { toast } from "react-toastify";
import { AccountContent, ExcelRow, OrderContent } from "@/utils/interfaces";
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
      if (!col.field || col.field === 'actions') return

      const value = col.renderCell
        ? col.renderCell({
          id: row.id,
          field: col.field,
          row,
          value: row[col.field],
        } as any)
        : row[col.field]

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

export const exportShippingToExcel = (order: any, users: any[]) => {
  const sheetRows: any[][] = [];

  const findUsernameByUUID = (uuid: string): string | undefined => {
    const user = users.find(u => u.user_id === uuid);
    return user?.username;
  };

  const orderHeaders = [
    'Order ID', 'Assign To', 'Carrier', 'Trailer #', 'Closed At',
    'Closed By', 'Created At', 'Created By', 'Dock Door', 'Deleted',
    'Status', 'Total Shipped'
  ];
  sheetRows.push(orderHeaders);

  const orderRow = [
    order.id,
    findUsernameByUUID(order.assign_to),
    order.carrier,
    order.trailer_number,
    order.closed_at,
    findUsernameByUUID(order.closed_by),
    order.created_at,
    findUsernameByUUID(order.created_by),
    order.dock_door,
    order.deleted,
    order.status,
    order.total_shipped
  ];
  sheetRows.push(orderRow);

  const mergeRanges: XLSX.Range[] = [];

  order.shippings_pick_list?.forEach((pickList: any) => {
    const pickLabelRow = Array(orderHeaders.length).fill('');
    pickLabelRow[0] = 'Shipping Pick List';
    const pickLabelRowIndex = sheetRows.length;
    sheetRows.push(pickLabelRow);
    mergeRanges.push({ s: { r: pickLabelRowIndex, c: 0 }, e: { r: pickLabelRowIndex, c: orderHeaders.length - 1 } });

    const pickHeaders = [
      'PL #', 'Picked By', 'Verified By', 'BOL #',
      'Pick Status', 'Pick Created At', 'Pick Notes', 'Total Products'
    ];
    const pickHeadersRowIndex = sheetRows.length;
    sheetRows.push(pickHeaders);

    const pickRow = [
      pickList.pl_number,
      findUsernameByUUID(pickList.picked_by),
      findUsernameByUUID(pickList.verified_by),
      pickList.bol_number,
      pickList.status,
      pickList.created_at,
      pickList.notes,
      pickList.total_products
    ];
    sheetRows.push(pickRow);

    const prodLabelRow = Array(orderHeaders.length).fill('');
    prodLabelRow[0] = 'Shippings Products';
    const prodLabelRowIndex = sheetRows.length;
    sheetRows.push(prodLabelRow);
    mergeRanges.push({ s: { r: prodLabelRowIndex, c: 0 }, e: { r: prodLabelRowIndex, c: orderHeaders.length - 1 } });

    const productHeaders = [
      'Product SKU', 'Product Quantity', 'Ready',
      'Created At', 'Created By', 'Image'
    ];
    const productHeadersRowIndex = sheetRows.length;
    sheetRows.push(productHeaders);

    pickList.shippings_products?.forEach((product: any) => {
      const prodRow = [
        product.product_sku || '',
        product.product_quantity || '',
        product.is_ready || '',
        product.created_at || '',
        findUsernameByUUID(product.created_by) || '',
        product.img_url || ''
      ];
      sheetRows.push(prodRow);
    });
  });

  const worksheet = XLSX.utils.aoa_to_sheet(sheetRows);
  worksheet['!merges'] = mergeRanges;

  mergeRanges.forEach((range) => {
    const cellRef = XLSX.utils.encode_cell(range.s);
    if (worksheet[cellRef]) {
      worksheet[cellRef].s = {
        alignment: { horizontal: 'center', vertical: 'center' },
        font: { bold: true, sz: 16 }
      };
    }
  });

  orderHeaders.forEach((_, colIndex) => {
    const cellRef = XLSX.utils.encode_cell({ r: 0, c: colIndex });
    if (worksheet[cellRef]) {
      worksheet[cellRef].s = { font: { bold: true } };
    }
  });

  sheetRows.forEach((row, rowIndex) => {
    const isPickHeaders = row?.[0] === 'PL #' || row?.[0] === 'pl_number';
    const isProductHeaders = row?.[0] === 'Product SKU' || row?.[0] === 'product_sku';

    if (isPickHeaders || isProductHeaders) {
      row.forEach((_, colIndex) => {
        const cellRef = XLSX.utils.encode_cell({ r: rowIndex, c: colIndex });
        if (worksheet[cellRef]) {
          worksheet[cellRef].s = { font: { bold: true } };
        }
      });
    }
  });

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Shipping');

  const buffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array', cellStyles: true });
  const blob = new Blob([buffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  });

  saveAs(blob, 'shipping_data.xlsx');
};

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

export const useFindUserByUUID = () => {
  const { users } = useContext(GlobalContext);

  return (uuid: string): string | undefined => {
    const user = users?.find(u => u.user_id === uuid);
    return user?.username || 'Support';
  };
};

export const convertTimeByTimeZone = (sessionTimeZone: string, utcDate?: string) => {
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

  const supabase = createClient();

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
    console.log(error.message);
    toast.warning("Something went wrong.");
  }
}

export const handleUploadToBucket = async (bucket: string, path: string, image: File) => {
  const supabase = createClient();

  const extension = image.name.split('.').pop();
  const fullPath = `${path}.${extension}`;

  const { data: existingFile, error: statError } = await supabase
    .storage
    .from(bucket)
    .list('', { search: fullPath });

  if (statError) {
    throw new Error(statError.message);
  }

  const fileExists = existingFile?.some(file => file.name === fullPath.split('/').pop());

  if (fileExists) {
    const { error: deleteError } = await supabase
      .storage
      .from(bucket)
      .remove([fullPath]);

    if (deleteError) {
      throw new Error(deleteError.message);
    }
  }

  const { error: imageError } = await supabase
    .storage
    .from(bucket)
    .upload(fullPath, image, {
      cacheControl: '3600',
      upsert: false
    });

  if (imageError) {
    throw new Error(imageError.message);
  }

  // Create signed URL
  const { data: signedURL, error: urlError } = await supabase
    .storage
    .from(bucket)
    .createSignedUrl(fullPath, 31_536_000);

  if (urlError) {
    throw new Error(urlError.message);
  }

  return signedURL;
};

export const readExcelFile = async (file: File): Promise<ExcelRow[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      try {
        const data = new Uint8Array(event.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });

        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];

        const jsonData = XLSX.utils.sheet_to_json<string[]>(worksheet, { header: 1 });

        if (jsonData.length === 0) {
          resolve([]);
          return;
        }

        const headers = jsonData[0];
        const rows = jsonData.slice(1);

        const result: ExcelRow[] = rows.map((row) => {
          const obj: ExcelRow = {};

          headers.forEach((header, index) => {
            obj[header] = row[index] !== undefined ? row[index] : null;
          });

          return obj;
        });

        resolve(result);
      } catch (error) {
        reject(error);
      }
    };

    reader.onerror = (error) => reject(error);

    reader.readAsArrayBuffer(file);
  });
};