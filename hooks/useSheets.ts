
import { useState, useEffect, useCallback } from 'react';
import { Sheet } from '../types';
import { sheetsService } from '../features/sheets/sheets.service';

export const useSheets = () => {
  const [sheets, setSheets] = useState<Sheet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSheets = useCallback(async () => {
    try {
      setLoading(true);
      const data = await sheetsService.getSheets();
      setSheets(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const createSheet = async (name: string) => {
    try {
      const newSheet = await sheetsService.createSheet(name);
      setSheets((prev) => [newSheet, ...prev]);
      return newSheet;
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const deleteSheet = async (id: string) => {
    try {
      await sheetsService.deleteSheet(id);
      setSheets((prev) => prev.filter(s => s.id !== id));
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  useEffect(() => {
    fetchSheets();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { sheets, loading, error, createSheet, deleteSheet, refresh: fetchSheets };
};
