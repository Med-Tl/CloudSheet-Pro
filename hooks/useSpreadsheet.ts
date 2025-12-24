
import { useState, useEffect, useCallback } from 'react';
import { Cell, GridData } from '../types';
import { cellsService } from '../features/cells/cells.service';

export const useSpreadsheet = (sheetId: string) => {
  const [grid, setGrid] = useState<GridData>({});
  const [rows, setRows] = useState(50);
  const [cols, setCols] = useState(26); // A-Z
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCells = useCallback(async () => {
    if (!sheetId) return;
    try {
      setLoading(true);
      const cells = await cellsService.getCellsBySheet(sheetId);
      const newGrid: GridData = {};
      
      let maxRow = 49;
      let maxCol = 25;

      cells.forEach((cell) => {
        const colKey = getColumnName(cell.col_index);
        if (!newGrid[colKey]) newGrid[colKey] = {};
        newGrid[colKey][cell.row_index] = cell.value;
        
        maxRow = Math.max(maxRow, cell.row_index);
        maxCol = Math.max(maxCol, cell.col_index);
      });

      setGrid(newGrid);
      setRows(Math.max(rows, maxRow + 10));
      setCols(Math.max(cols, maxCol + 5));
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [sheetId]);

  useEffect(() => {
    fetchCells();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sheetId]);

  const updateCell = async (rowIndex: number, colIndex: number, value: string) => {
    const colKey = getColumnName(colIndex);
    
    // Optimistic update
    setGrid(prev => ({
      ...prev,
      [colKey]: {
        ...(prev[colKey] || {}),
        [rowIndex]: value
      }
    }));

    try {
      await cellsService.updateCell(sheetId, rowIndex, colIndex, value);
    } catch (err: any) {
      console.error('Failed to save cell:', err);
      // Optional: Rollback on error
    }
  };

  const addRow = () => setRows(prev => prev + 1);
  const addColumn = () => setCols(prev => prev + 1);

  return { grid, rows, cols, loading, error, updateCell, addRow, addColumn };
};

// Helper: 0 -> A, 1 -> B, 26 -> AA
export const getColumnName = (index: number): string => {
  let name = '';
  while (index >= 0) {
    name = String.fromCharCode((index % 26) + 65) + name;
    index = Math.floor(index / 26) - 1;
  }
  return name;
};
