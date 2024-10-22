import React, { useState } from 'react';
import axios from 'axios';
import './DICHome.css'; // CSS dosyasını içe aktar

const DICHome = () => {
  const [announcement, setAnnouncement] = useState('');

  const handleChange = (e) => {
    setAnnouncement(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('YOUR_API_ENDPOINT', {
        content: announcement,
      });
      console.log(response.data); // Başarılı yanıtı konsola yazdır
      setAnnouncement(''); // Formu temizle
    } catch (error) {
      console.error('Error posting announcement:', error);
    }
  };

  return (
    <div className="container">
      <div className="card">
        <h2 className="title">Duyuru Paylaş</h2>
        <form onSubmit={handleSubmit}>
          <textarea
            value={announcement}
            onChange={handleChange}
            rows="4"
            placeholder="Duyurunuzu buraya yazın..."
            className="textarea"
            required
          />
          <button type="submit" className="submit-button">
            Gönder
          </button>
        </form>
      </div>
    </div>
  );
};

export default DICHome;
