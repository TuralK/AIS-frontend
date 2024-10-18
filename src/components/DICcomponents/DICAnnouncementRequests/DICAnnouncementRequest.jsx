import React, { useEffect, useState } from 'react';
import styles from './DICAnnouncementRequests.module.css'; // CSS modülünü içe aktar
import Loading from '../../LoadingComponent/Loading';

const AnnouncementRequest = () => {
    const [announcements, setAnnouncements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchAnnouncementRequests = async () => {
            try {
                const response = await fetchAnnouncementRequests(); 
                if (!response.ok) {
                    throw new Error('Failed to fetch announcements');
                }
                const data = await response.json();
                setAnnouncements(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchAnnouncementRequests();
    }, []); 

    if (loading) {
        return (<Loading />);
    }

    if (error) {
        return <div>Error: {error}</div>; // Hata mesajı
    }

    return (
        <div className={styles.announcementContainer}>
            <div className={styles.contentContainer}>
                {announcements.length > 0 ? (
                    <div className={styles.content2} id="content">
                        {announcements.map((announcement) => (
                            <div className={styles.card} key={announcement.id}>
                                <img
                                    src={announcement.image || '/announcement.jpg'}
                                    alt="Announcement Logo"
                                />
                                <div className={styles.cardBody}>
                                    <p className={styles.cardTitle}>{announcement.Company.name}</p>
                                    <p className={styles.cardText}>{announcement.announcementName}</p>
                                    <button
                                        className={styles.detailsButton}
                                        onClick={() => window.location.href = `/admin/announcement/${announcement.id}`}
                                    >
                                        More Details
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <h2 style={{ width: '1000px' }}>There are no announcement requests</h2>
                )}
            </div>
        </div>
    );
};

export default AnnouncementRequest;
