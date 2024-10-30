import React from 'react';
import AnnouncementList from '../AnnouncementList';
import ShareAnnouncement from '../ShareAnnouncement';
import Messaging from '../../MessagingComponent';

const DICHome = () => {
  const sampleAnnouncements = [
    { id: 1, content: "Lorem Ipsum, dizgi ve baskı endüstrisinde kullanılan mıgır metinlerdir. Lorem Ipsum, adı bilinmeyen bir matbaacının bir hurufat numune kitabı oluşturmak üzere bir yazı galerisini alarak karıştırdığı 1500'lerden beri endüstri standardı sahte metinler olarak kullanılmıştır. Beşyüz yıl boyunca varlığını sürdürmekle kalmamış, aynı zamanda pek değişmeden elektronik dizgiye de sıçramıştır. 1960'larda Lorem Ipsum pasajları da içeren Letraset yapraklarının yayınlanması ile ve yakın zamanda Aldus PageMaker gibi Lorem Ipsum sürümleri içeren masaüstü yayıncılık yazılımları ile popüler olmuştur." },
    { id: 2, content: "Lorem Ipsum, dizgi ve baskı endüstrisinde kullanılan mıgır metinlerdir. Lorem Ipsum, adı bilinmeyen bir matbaacının bir hurufat numune kitabı oluşturmak üzere bir yazı galerisini alarak karıştırdığı 1500'lerden beri endüstri standardı sahte metinler olarak kullanılmıştır. Beşyüz yıl boyunca varlığını sürdürmekle kalmamış, aynı zamanda pek değişmeden elektronik dizgiye de sıçramıştır. 1960'larda Lorem Ipsum pasajları da içeren Letraset yapraklarının yayınlanması ile ve yakın zamanda Aldus PageMaker gibi Lorem Ipsum sürümleri içeren masaüstü yayıncılık yazılımları ile popüler olmuştur." },
    { id: 3, content: 'Announcement 3' },
    { id: 4, content: 'Announcement 4' },
    { id: 5, content: 'Announcement 5' },
  ];

  return (
    <div className="flex h-screen">
      <div className="flex-grow p-4">
        <AnnouncementList announcements={sampleAnnouncements} />
      </div>
      <div className="flex flex-col">
        <div className="flex-1">
          <Messaging />
        </div>
        <div className="flex-1 p-2 mt-12">
          <ShareAnnouncement />
        </div>
      </div>
    </div>
  );
};

export default DICHome;