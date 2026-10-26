import React, { useEffect, useState } from 'react';
import { useSession } from '../contexts/SessionContext';
import { useTemplates } from '../contexts/TemplateContext';
import { composeFinalImage } from '../utils/imageProcessing';
import jsPDF from 'jspdf';

export const FinalPreview: React.FC = () => {
  const { session, setFinalImage, goToStep, clearCurrentSession } = useSession();
  const { templates } = useTemplates();

  const [finalImageUrl, setFinalImageUrl] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    generateFinalImage();
  }, []);

  const generateFinalImage = async () => {
    if (!session) return;

    try {
      setIsGenerating(true);
      setError('');

      const template = templates.find((t) => t.id === session.templateId);
      if (!template) {
        throw new Error('Template not found');
      }

      // Pass ALL captured photos, not just selected ones
      // The assignments already specify which photos go where
      const finalImage = await composeFinalImage(
        template,
        session.capturedPhotos,
        session.photoAssignments
      );

      setFinalImageUrl(finalImage);
      setFinalImage(finalImage);
      setIsGenerating(false);
    } catch (err) {
      console.error('Error generating final image:', err);
      setError('Failed to generate final image. Please try again.');
      setIsGenerating(false);
    }
  };

  const handleDownload = () => {
    if (!finalImageUrl) return;

    const link = document.createElement('a');
    link.href = finalImageUrl;
    link.download = `photobooth-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadPDF = () => {
    if (!finalImageUrl || !session) return;

    try {
      const template = templates.find((t) => t.id === session.templateId);
      if (!template) return;

      // Convert pixels to inches at 300 DPI
      const widthInches = template.width / 300;
      const heightInches = template.height / 300;

      // Create PDF with exact template dimensions
      const pdf = new jsPDF({
        orientation: widthInches > heightInches ? 'landscape' : 'portrait',
        unit: 'in',
        format: [widthInches, heightInches]
      });

      // Add the image to PDF at full size
      pdf.addImage(
        finalImageUrl,
        'PNG',
        0,
        0,
        widthInches,
        heightInches,
        undefined,
        'FAST' // Use FAST for quicker generation, or 'SLOW' for better compression
      );

      // Save the PDF
      pdf.save(`photobooth-${Date.now()}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF. Please try PNG download instead.');
    }
  };

  const handlePrint = () => {
    if (!finalImageUrl) return;

    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    printWindow.document.write(`
      <html>
        <head>
          <title>Print Photo</title>
          <style>
            body { margin: 0; padding: 0; display: flex; justify-content: center; align-items: center; min-height: 100vh; }
            img { max-width: 100%; height: auto; }
            @media print {
              body { margin: 0; }
              img { max-width: 100%; page-break-inside: avoid; }
            }
          </style>
        </head>
        <body>
          <img src="${finalImageUrl}" onload="window.print(); window.close();" />
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const handleNewSession = () => {
    if (window.confirm('Start a new session? Current progress will be lost.')) {
      clearCurrentSession();
    }
  };

  if (isGenerating) {
    return (
<div 
  className="min-h-screen p-8"
  style={{
    backgroundImage: 'url(/backgrounds/preview-bg.jpg)',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat'
  }}
>        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-white mb-4"></div>
          <p className="text-white text-2xl font-semibold">Generating your photo...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 to-pink-500 flex items-center justify-center p-8">
        <div className="bg-white rounded-lg p-8 max-w-md text-center">
          <div className="text-red-500 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Error</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => goToStep('capture')}
            className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700"
          >
            Restart Session
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-500 to-red-500 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-white mb-4 drop-shadow-lg">
            Your Photo is Ready! 🎉
          </h1>
          <p className="text-2xl text-white opacity-90 drop-shadow">
            Download, print, or start a new session
          </p>
        </div>

        {/* Final Image */}
        <div className='padding- 20px'>
          <div className="flex justify-center height: 15% ">
            {finalImageUrl && (
              <img
                src={finalImageUrl}
                alt="Final Photo"
                className="width: 50% h-auto rounded-lg shadow-lg"
              />
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <button
            onClick={handleDownload}
            className="bg-blue-500 text-white px-6 py-4 rounded-lg font-bold hover:bg-blue-600 transition-all shadow-lg flex items-center justify-center gap-2"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Download PNG
          </button>
          <button
            onClick={handleDownloadPDF}
            className="bg-red-500 text-white px-6 py-4 rounded-lg font-bold hover:bg-red-600 transition-all shadow-lg flex items-center justify-center gap-2"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
            Download PDF
          </button>
          <button
            onClick={handlePrint}
            className="bg-green-500 text-white px-6 py-4 rounded-lg font-bold hover:bg-green-600 transition-all shadow-lg flex items-center justify-center gap-2"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
            Print Photo
          </button>
          <button
            onClick={handleNewSession}
            className="bg-yellow-400 text-gray-900 px-6 py-4 rounded-lg font-bold hover:bg-yellow-300 transition-all shadow-lg"
          >
            Start New Session
          </button>
        </div>
      </div>
    </div>
  );
};
