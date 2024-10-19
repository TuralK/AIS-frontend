import React from 'react';
import { useNavigate } from 'react-router-dom';
import './AnnouncementCard.css';

const AnnouncementCard = ({ announcement }) => {
  const navigate = useNavigate(); 

  const handleClick = () => {
    navigate(`/admin/announcement/${announcement.id}`);
  };

  return (
    <div className="announcement-card" onClick={handleClick}>
      <div className="card-logo">
        <img src={announcement.image} alt={announcement.Company.name} />
      </div>
      <div className="card-content">
        <h2>{announcement.Company.name}</h2>
        <h3>{announcement.announcementName}</h3>
        <p>{announcement.description}</p>
      </div>
    </div>
  );
};

export default AnnouncementCard;

