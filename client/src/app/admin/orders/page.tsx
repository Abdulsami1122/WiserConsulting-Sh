'use client';

import { useState, useEffect } from 'react';
import { FormSubmission } from '@/redux/slices/formSubmission/formSubmissionService';

interface PDFMergeModalProps {
  isOpen: boolean;
  onClose: () => void;
  submission: FormSubmission | null;
}

const PDFMergeModal: React.FC<PDFMergeModalProps> = ({ isOpen, onClose, submission }) => {
  const [selectedDocuments, setSelectedDocuments] = useState<string[]>([]);
  const [mergeLoading, setMergeLoading] = useState(false);
  const [mergeProgress, setMergeProgress] = useState(0);

  if (!isOpen || !submission) return null;

  // Filter only uploaded documents (documents with cloudinaryUrl)
  const uploadedDocuments = submission.documents.filter(doc => doc.cloudinaryUrl);

  const handleDocumentToggle = (documentId: string) => {
    setSelectedDocuments(prev => 
      prev.includes(documentId) 
        ? prev.filter(id => id !== documentId)
        : [...prev, documentId]
    );
  };

  const handleMergePDFs = async () => {
    if (selectedDocuments.length === 0) {
      alert('Please select at least one document to merge.');
      return;
    }

    setMergeLoading(true);
    setMergeProgress(0);

    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
      
      const response = await fetch(`${API_URL}/merge-pdfs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          submissionId: submission._id,
          documentIds: selectedDocuments,
          customerName: submission.name,
          customerEmail: submission.email
        }),
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${submission.name}_merged_documents.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        
        alert('PDF merged successfully!');
        onClose();
      } else {
        throw new Error('Failed to merge PDFs');
      }
    } catch (error) {
      console.error('Error merging PDFs:', error);
      alert('Failed to merge PDFs. Please try again.');
    } finally {
      setMergeLoading(false);
      setMergeProgress(0);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Merge PDF Documents</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ×
          </button>
        </div>

        <div className="mb-4">
          <p className="text-gray-600 mb-2">
            Customer: <strong>{submission.name}</strong> ({submission.email})
          </p>
          <p className="text-sm text-gray-500">
            Select uploaded documents to merge into a single PDF file
          </p>
          <p className="text-xs text-gray-400 mt-1">
            Showing {uploadedDocuments.length} uploaded document{uploadedDocuments.length !== 1 ? 's' : ''}
          </p>
        </div>

        {uploadedDocuments.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-gray-400 text-4xl mb-4">📄</div>
            <p className="text-gray-600">No documents have been uploaded yet.</p>
            <p className="text-sm text-gray-500 mt-2">Documents will appear here once they are uploaded.</p>
          </div>
        ) : (
          <div className="space-y-3 mb-6">
            {uploadedDocuments.map((doc) => (
              <div key={doc._id} className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50">
                <input
                  type="checkbox"
                  id={doc._id}
                  checked={selectedDocuments.includes(doc._id)}
                  onChange={() => handleDocumentToggle(doc._id)}
                  className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                />
                <label htmlFor={doc._id} className="flex-1 cursor-pointer">
                  <div className="flex items-center space-x-2">
                    <span className="text-lg">
                      {doc.mimetype === 'application/pdf' ? '📄' : '🖼️'}
                    </span>
                    <div>
                      <p className="font-medium text-gray-900">{doc.fieldName}</p>
                      <p className="text-sm text-gray-500">{doc.originalname}</p>
                      <p className="text-xs text-gray-400">
                        Size: {(doc.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                </label>
                <a
                  href={doc.cloudinaryUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 text-sm bg-blue-50 hover:bg-blue-100 px-2 py-1 rounded transition"
                >
                  View
                </a>
              </div>
            ))}
          </div>
        )}

        {mergeLoading && (
          <div className="mb-4">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-green-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${mergeProgress}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-600 mt-2">Merging documents... {mergeProgress}%</p>
          </div>
        )}

        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition"
            disabled={mergeLoading}
          >
            Cancel
          </button>
          <button
            onClick={handleMergePDFs}
            disabled={selectedDocuments.length === 0 || mergeLoading || uploadedDocuments.length === 0}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:opacity-50"
          >
            {mergeLoading ? 'Merging...' : `Merge ${selectedDocuments.length} Document${selectedDocuments.length !== 1 ? 's' : ''}`}
          </button>
        </div>
      </div>
    </div>
  );
};

const CompressPDFModal: React.FC<{ isOpen: boolean; onClose: () => void; submission: FormSubmission | null }> = ({ isOpen, onClose, submission }) => {
  const [selectedDocuments, setSelectedDocuments] = useState<string[]>([]);
  const [compressionLevel, setCompressionLevel] = useState<'low' | 'medium' | 'high' | '5mb'>('medium');
  const [compressing, setCompressing] = useState(false);

  if (!isOpen || !submission) return null;

  const pdfDocuments = submission.documents.filter(doc => 
    doc.cloudinaryUrl && doc.mimetype === 'application/pdf'
  );

  const handleDocumentToggle = (documentId: string) => {
    setSelectedDocuments(prev => 
      prev.includes(documentId) 
        ? prev.filter(id => id !== documentId)
        : [...prev, documentId]
    );
  };

  const handleCompressPDFs = async () => {
    if (selectedDocuments.length === 0) {
      alert('Please select at least one PDF to compress.');
      return;
    }

    setCompressing(true);

    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
      
      const response = await fetch(`${API_URL}/compress-pdfs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          submissionId: submission._id,
          documentIds: selectedDocuments,
          compressionLevel,
          customerName: submission.name
        }),
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${submission.name}_compressed_pdfs.zip`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        
        alert('PDFs compressed successfully!');
        onClose();
      } else {
        throw new Error('Failed to compress PDFs');
      }
    } catch (error) {
      console.error('Error compressing PDFs:', error);
      alert('Failed to compress PDFs. Please try again.');
    } finally {
      setCompressing(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Compress PDF Documents</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-2xl">×</button>
        </div>

        <div className="mb-4">
          <p className="text-gray-600 mb-2">
            Customer: <strong>{submission.name}</strong>
          </p>
          <p className="text-sm text-gray-500">
            Select PDF documents to compress and reduce file size
          </p>
        </div>

        {/* Compression Level Selection */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Compression Level:
          </label>
          <select
            value={compressionLevel}
            onChange={(e) => setCompressionLevel(e.target.value as 'low' | 'medium' | 'high' | '5mb')}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
            <option value="low">Low (Better quality, larger size)</option>
            <option value="medium">Medium (Balanced quality/size)</option>
            <option value="high">High (Smaller size, lower quality)</option>
            <option value="5mb">5MB Target (Maximum compression)</option>
          </select>
          {compressionLevel === '5mb' && (
            <p className="text-xs text-blue-600 mt-1">
              ⚠️ This will compress files to approximately 5MB maximum size
            </p>
          )}
        </div>

        {pdfDocuments.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-gray-400 text-4xl mb-4">📄</div>
            <p className="text-gray-600">No PDF documents found.</p>
          </div>
        ) : (
          <div className="space-y-3 mb-6">
            {pdfDocuments.map((doc) => (
              <div key={doc._id} className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50">
                <input
                  type="checkbox"
                  id={doc._id}
                  checked={selectedDocuments.includes(doc._id)}
                  onChange={() => handleDocumentToggle(doc._id)}
                  className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                />
                <label htmlFor={doc._id} className="flex-1 cursor-pointer">
                  <div>
                    <p className="font-medium text-gray-900">{doc.fieldName}</p>
                    <p className="text-sm text-gray-500">{doc.originalname}</p>
                    <p className="text-xs text-gray-400">
                      Size: {(doc.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </label>
              </div>
            ))}
          </div>
        )}

        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition"
            disabled={compressing}
          >
            Cancel
          </button>
          <button
            onClick={handleCompressPDFs}
            disabled={selectedDocuments.length === 0 || compressing || pdfDocuments.length === 0}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:opacity-50"
          >
            {compressing ? 'Compressing...' : `Compress ${selectedDocuments.length} PDF${selectedDocuments.length !== 1 ? 's' : ''}`}
          </button>
        </div>
      </div>
    </div>
  );
};

const AdminOrders = () => {
  const [submissions, setSubmissions] = useState<FormSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [showPDFMergeModal, setShowPDFMergeModal] = useState(false);
  const [showCompressModal, setShowCompressModal] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState<FormSubmission | null>(null);

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const fetchSubmissions = async () => {
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
      const response = await fetch(`${API_URL}/form-submissions`, {
        credentials: 'include'
      });

      if (response.ok) {
        const data = await response.json();
        setSubmissions(data.submissions || []);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenPDFMerge = (submission: FormSubmission) => {
    setSelectedSubmission(submission);
    setShowPDFMergeModal(true);
  };

  const handleOpenCompress = (submission: FormSubmission) => {
    setSelectedSubmission(submission);
    setShowCompressModal(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Form Submissions</h1>
          <p className="text-gray-600">Manage visa assessment submissions and merge documents</p>
        </div>
      </div>

      {/* Form Submissions Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Submissions</h2>
          <p className="text-gray-600">Manage visa assessment submissions and merge documents</p>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Destination
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Visa Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Documents
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {submissions.map((submission) => (
                <tr key={submission._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{submission.name}</div>
                      <div className="text-sm text-gray-500">{submission.email}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {submission.destinationCountry}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {submission.visaType}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {submission.documents.length} docs
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(submission.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleOpenPDFMerge(submission)}
                        className="text-green-600 hover:text-green-900 bg-green-50 hover:bg-green-100 px-3 py-1 rounded-md text-xs font-medium transition"
                      >
                        📄 Merge PDFs
                      </button>
                      <button
                        onClick={() => handleOpenCompress(submission)}
                        className="text-blue-600 hover:text-blue-900 bg-blue-50 hover:bg-blue-100 px-3 py-1 rounded-md text-xs font-medium transition"
                      >
                        🗜️ Compress PDFs
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* PDF Merge Modal */}
      <PDFMergeModal
        isOpen={showPDFMergeModal}
        onClose={() => {
          setShowPDFMergeModal(false);
          setSelectedSubmission(null);
        }}
        submission={selectedSubmission}
      />

      {/* Compress PDF Modal */}
      <CompressPDFModal
        isOpen={showCompressModal}
        onClose={() => {
          setShowCompressModal(false);
          setSelectedSubmission(null);
        }}
        submission={selectedSubmission}
      />
    </div>
  );
};

export default AdminOrders;