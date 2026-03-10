import { useState } from 'react';
import { fetchReport } from '../services/api';

export default function ReportForm({ onPdf }) {
  const [placa, setPlaca] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { data } = await fetchReport(placa);
      const url = URL.createObjectURL(new Blob([data], { type: 'application/pdf' }));
      onPdf(url);
    } catch (err) {
      console.error('Error generating report:', err);
      setError('Error generating report. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  return (
    <form onSubmit={handleSubmit}>
      <input
        value={placa}
        onChange={e => setPlaca(e.target.value)}
        placeholder="Plate"
        required
      />
      <button type="submit" disabled={loading}>
        {loading ? 'Generating...' : 'Generate PDF'}
      </button>
      {error && <div style={{ color: 'red', marginTop: '10px' }}>{error}</div>}
    </form>
  );
}
