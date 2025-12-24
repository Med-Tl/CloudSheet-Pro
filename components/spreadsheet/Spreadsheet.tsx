
import React, { useState, useEffect } from 'react';
import { useSpreadsheet, getColumnName } from '../../hooks/useSpreadsheet';
import { EditableCell } from './EditableCell';
import { Button } from '../ui/Button';

interface SpreadsheetProps {
  sheetId: string;
  onCellSelect?: (coord: string, value: string) => void;
}

export const Spreadsheet: React.FC<SpreadsheetProps> = ({ sheetId, onCellSelect }) => {
  const { grid, rows, cols, updateCell, addRow, addColumn, loading } = useSpreadsheet(sheetId);
  const [selectedCell, setSelectedCell] = useState<{ row: number; col: number } | null>(null);

  const columnHeaders = Array.from({ length: cols }, (_, i) => getColumnName(i));

  useEffect(() => {
    if (selectedCell && onCellSelect) {
      const colName = getColumnName(selectedCell.col);
      const val = grid[colName]?.[selectedCell.row] || '';
      onCellSelect(`${colName}${selectedCell.row + 1}`, val);
    }
  }, [selectedCell, grid, onCellSelect]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!selectedCell) return;
      
      // Don't navigate if user is typing in an input
      if (document.activeElement?.tagName === 'INPUT') return;

      switch (e.key) {
        case 'ArrowUp':
          e.preventDefault();
          setSelectedCell(prev => prev ? { ...prev, row: Math.max(0, prev.row - 1) } : null);
          break;
        case 'ArrowDown':
          e.preventDefault();
          setSelectedCell(prev => prev ? { ...prev, row: Math.min(rows - 1, prev.row + 1) } : null);
          break;
        case 'ArrowLeft':
          e.preventDefault();
          setSelectedCell(prev => prev ? { ...prev, col: Math.max(0, prev.col - 1) } : null);
          break;
        case 'ArrowRight':
          e.preventDefault();
          setSelectedCell(prev => prev ? { ...prev, col: Math.min(cols - 1, prev.col + 1) } : null);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedCell, rows, cols]);

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-gray-400 text-sm font-medium">Syncing Grid...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-auto bg-gray-100 border-t border-gray-300 relative">
      <table className="border-collapse table-fixed bg-white">
        <thead className="sticky top-0 z-50 shadow-sm">
          <tr className="bg-gray-100">
            <th className="w-12 border border-gray-300 bg-gray-100 sticky left-0 z-[60]"></th>
            {columnHeaders.map((header, idx) => (
              <th 
                key={header} 
                className={`w-32 px-4 py-1.5 border border-gray-300 text-xs font-bold transition-colors ${
                  selectedCell?.col === idx ? 'bg-blue-100 text-blue-700' : 'text-gray-500'
                }`}
              >
                {header}
              </th>
            ))}
            <th className="w-12 border-none">
              <Button 
                variant="ghost" 
                className="w-full h-full !p-0 hover:bg-gray-200 rounded-none border border-gray-300 border-l-0"
                onClick={addColumn}
              >
                +
              </Button>
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {Array.from({ length: rows }, (_, rowIndex) => (
            <tr key={rowIndex} className="h-8">
              <td className={`w-12 border border-gray-300 bg-gray-100 text-[10px] text-center font-bold sticky left-0 z-10 select-none transition-colors ${
                selectedCell?.row === rowIndex ? 'bg-blue-100 text-blue-700' : 'text-gray-400'
              }`}>
                {rowIndex + 1}
              </td>
              {columnHeaders.map((colName, colIndex) => (
                <td key={colName} className="border border-gray-200 p-0 relative min-w-[128px]">
                  <EditableCell
                    value={grid[colName]?.[rowIndex] || ''}
                    isSelected={selectedCell?.row === rowIndex && selectedCell?.col === colIndex}
                    onSelect={() => setSelectedCell({ row: rowIndex, col: colIndex })}
                    onSave={(val) => updateCell(rowIndex, colIndex, val)}
                  />
                </td>
              ))}
              <td className="border-none"></td>
            </tr>
          ))}
          <tr className="h-10">
            <td className="sticky left-0 bg-white border border-gray-300">
              <Button 
                variant="ghost" 
                className="w-full h-full !p-0 hover:bg-gray-200 rounded-none"
                onClick={addRow}
              >
                +
              </Button>
            </td>
            {columnHeaders.map((_, i) => (
              <td key={i} className="border-none"></td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
};
