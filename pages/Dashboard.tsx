
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '../components/layout/Navbar';
import { useSheets } from '../hooks/useSheets';
import { Button } from '../components/ui/Button';
import { Loader } from '../components/ui/Loader';

const Dashboard: React.FC = () => {
  const { sheets, loading, createSheet, deleteSheet } = useSheets();
  const [newSheetName, setNewSheetName] = useState('');
  const [creating, setCreating] = useState(false);
  const navigate = useNavigate();

  const handleCreate = async () => {
    if (!newSheetName.trim()) return;
    setCreating(true);
    try {
      const sheet = await createSheet(newSheetName);
      setNewSheetName('');
      navigate(`/sheet/${sheet.id}`);
    } catch (err) {
      console.error(err);
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      
      <main className="flex-1 max-w-6xl w-full mx-auto p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Your Spreadsheets</h1>
            <p className="text-gray-500 mt-1">Manage and edit your data in real-time.</p>
          </div>
          
          <div className="flex items-center gap-3">
            <input
              type="text"
              placeholder="New Sheet Name"
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none w-48 sm:w-64"
              value={newSheetName}
              onChange={(e) => setNewSheetName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
            />
            <Button onClick={handleCreate} isLoading={creating}>
              Create Sheet
            </Button>
          </div>
        </div>

        {loading ? (
          <Loader />
        ) : sheets.length === 0 ? (
          <div className="bg-white border-2 border-dashed border-gray-200 rounded-2xl p-20 flex flex-col items-center justify-center text-center">
            <div className="bg-blue-50 p-6 rounded-full mb-6">
              <svg className="w-12 h-12 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No sheets yet</h3>
            <p className="text-gray-500 max-w-sm mb-8">
              Start by creating your first spreadsheet to organize your business, finances, or personal data.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sheets.map((sheet) => (
              <div 
                key={sheet.id}
                className="bg-white group rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
                onClick={() => navigate(`/sheet/${sheet.id}`)}
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="bg-green-50 p-3 rounded-lg group-hover:bg-green-100 transition-colors">
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <Button 
                    variant="ghost" 
                    className="!p-1 text-gray-400 hover:text-red-500"
                    onClick={(e) => {
                      e.stopPropagation();
                      if(confirm('Delete this sheet?')) deleteSheet(sheet.id);
                    }}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </Button>
                </div>
                <div>
                  <h3 className="font-bold text-lg text-gray-900 truncate">{sheet.name}</h3>
                  <p className="text-sm text-gray-400 mt-1">
                    Created {new Date(sheet.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
