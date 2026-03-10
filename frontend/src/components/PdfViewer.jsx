export default function PdfViewer({ url }) {
    if (!url) return null;
    return (
      <div className="pdf-container">
        <h3 className="pdf-title">Report preview</h3>
        <iframe
          src={url}
          className="pdf-frame"
          title="PDF Report"
        />
      </div>
    );
  }
  