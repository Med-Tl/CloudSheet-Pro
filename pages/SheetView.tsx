
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Navbar } from '../components/layout/Navbar';
import { Spreadsheet } from '../components/spreadsheet/Spreadsheet';
import { sheetsService } from '../features/sheets/sheets.service';
import { Sheet } from '../types';
import { Button } from '../components/ui/Button';

const SheetView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [sheet, setSheet] = useState<Sheet | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeCellInfo, setActiveCellInfo] = useState({ coord: '', value: '' });

  useEffect(() => {
    if (!id) return;
    sheetsService.getSheetById(id)
      .then(setSheet)
      .catch(() => navigate('/'))
      .finally(() => setLoading(false));
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent shadow-sm"></div>
          <span className="text-gray-500 font-medium animate-pulse">Opening your sheet...</span>
        </div>
      </div>
    );
  }

  if (!sheet || !id) return null;

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-white">
      <Navbar />
      
      {/* Toolbar / Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-2 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            className="!p-2 text-gray-400 hover:text-blue-600" 
            onClick={() => navigate('/')}
            title="Back to Dashboard"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </Button>
          <div className="flex flex-col">
            <h2 className="font-bold text-gray-800 leading-tight">{sheet.name}</h2>
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1 text-[10px] uppercase font-black text-blue-600 tracking-wider">
                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse" />
                Live Cloud Sync
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
           <div className="hidden md:flex items-center gap-2 text-xs text-gray-400 font-medium px-3 py-1 bg-gray-50 border border-gray-100 rounded-full">
             <svg className="w-3 h-3 text-green-500" fill="currentColor" viewBox="0 0 20 20">
               <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
             </svg>
             Auto-saved
           </div>
           <Button variant="primary" className="!py-1.5 !px-3 text-sm shadow-sm">
             Share
           </Button>
        </div>
      </div>

      {/* Formula Bar */}
      <div className="bg-gray-50 border-b border-gray-200 flex items-center px-4 py-1.5 gap-2 h-10">
        <div className="w-16 h-7 bg-white border border-gray-300 rounded flex items-center justify-center text-xs font-bold text-gray-500 shadow-inner">
          {activeCellInfo.coord || '-'}
        </div>
        <div className="text-gray-400 italic font-serif text-lg leading-none select-none mx-1">fx</div>
        <div className="flex-1 h-7 bg-white border border-gray-300 rounded px-3 flex items-center text-sm shadow-inner overflow-hidden whitespace-nowrap">
          {activeCellInfo.value}
        </div>
      </div>

      <div className="flex-1 overflow-hidden flex flex-col">
        <Spreadsheet 
          sheetId={id} 
          onCellSelect={(coord, value) => setActiveCellInfo({ coord, value })}
        />
      </div>
    </div>
  );
};

export default SheetView;
