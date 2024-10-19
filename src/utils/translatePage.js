import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      title: "IZTECH",
      subtitle: "Internship Management System",
      home: "Home",
      announcements: "Announcements",
      applications: "Applications",
      notifications: "Notifications",
      profile: "Profile",
      settings: "Settings",
      logout: "Logout",
      description: "Description",
      company: "Company",
      internship: "Internship",
      pendingCompanyRequest: "Pending Company Registration Requests",
      noPendingCompany: "No pending registration requests found.",
      approve: "Approve",
      reject: "Reject",
      representativeName: "Representative Name",
      address: "Address",
      email: "Email",
      announcementHeader: "Announcement Requests", 
      announcementErrorDIC: "There are no announcement requests",
      summerRegulations: "SUMMER PRACTICE REGULATIONS",
      summerRule1: "Student of Faculty of Engineering of IZTECH are required to participate in an industrial summer practice program in addition to the fullfillment of course and laboratory studies as required by the B.S. degree curriculum.",
      summerRule2: "Departments of the Faculty of Engineering specify the following regarding the summer practice: the year of practice, duration topics to be covered, time to be spent on each topic, type of companies acceptable for summer practice.",
      summerRule3: "Each department has a “Summer Practice Committee” including at least one member of the teaching staff. This commitee administers the department’s summer practice affairs and reports to the department chairperson. Members of the committee are appointed by the department chairperson.",
      summerRule4: "The Faculty of Engineering has a Faculty of engineering Summer Practice Committee meets when necessary. This Committee is composed of one advisor from every department which has a summer practice program. The committee meets under the chairmanship of the Dean to ensure that summer practice procedures are performed according to the rules common to all department of the Faculty.",
      summerRule5: "Students must submit satisfactory information about the prospective workplace to the Department Summer Practice Committee and should obtain an approval before starting the Summer Practice.",
      summerRule6: "Each summer practice candidate should obtain  a “Summer Practice Guide”. This guide gives general information on summer practice and contains the necessary paperwork. Students should daily record all the work  they perform according to the department summer practice program during the practice. These notes are later copied to the Report Book in accordance with the “Summer Practice Report Format”. The student submits the report to their department committee (for Chemical and Mechanical Engineering Department) or advisor (for Computer Engineering Department) until the end of add/drop period of the semester following the summer practice. Students Who do not submit theis reports at the end of the assigned period are considered not to have fullfilled the summer practice. In addition to this report, the departments may ask for documents covering additional information on the work accomplished. Departments are free to return or not to return successful reports to students.",
      summerRule7: "The students who completed summer practice must register for the related summer practice course at the semester following the summer practice.",
      summerRule8: "If a report does not confirm with the standards give by the “Summer Practice Report Format” and if the advisor determines the summer practice is perfumed in accordance with the rules the students will be asked to modify the report within two weeks. If the students do not hand in the updated report within this period or if the report is rejected the summer practice must be repeated by the students.",
      summerRule9: "Every student must deliver the summer practice performance report, marked “CONFIDENTAL” in this guide, to the employer at the start of the summer practice. At the end of the practice, one copy of these reports is sent directly to the departmental committee by registered mail. This is the students responsibility to ensure that the report is mailed by the employer. The second copy is retained in the employer’s files.",
      summerRule10: "In the evaluation of summer practice performance reports, the average of performance grade should be “C” (at least) for each department. A student who receives an average of less than “C” on his/her performance report or who receives an “F” in attendance grade, is requred to repeat the summer practice.",
      summerRule11: "After the internship documents are reviewed, the given internship grades are sent to the Student Affairs Department by the relevant departments and recorded in the students' files.",
      moreDetails: "More Details",
      loading: "Loading",
      noAnnouncement: "There are no available announcements or you have applied all announcements",
    },
  },
  tr: {
    translation: {
      title: "İYTE",
      subtitle: "Staj Yönetim Sistemi",
      home: "Ana Sayfa",
      announcements: "Duyurular",
      applications: "Başvurular",
      notifications: "Bildirimler",
      profile: "Profil",
      settings: "Ayarlar",
      logout: "Çıkış Yap",
      description: "Açıklama",
      company: "Şirket",
      internship: "Staj Sürecindekiler",
      pendingCompanyRequest: "Bekleyen şirket başvuruları",
      noPendingCompany: "Bekleyen şirket başvurusu bulunamadı",
      approve: "Onayla",
      reject: "Reddet",
      representativeName: "Şirket Temsilcisi",
      address: "Adres",
      email: "Email",
      announcementHeader: "Staj İlanı Talepleri",
      announcementErrorDIC: "Talep edilen ilan bulunamadı",
      summerRegulations: "YAZ STAJI KURALLARI",
      summerRule1: "İYTE Mühendislik Fakültesine bağlı Mühendislik Bölümlerinin öğrencileri Mühendislik (B.S.) derecesine hak kazanabilmeleri için gerekli ders ve laboratuvar çalışmalarını tamamlamaları yanında Endüstrideki kuruluşlarda yaz stajı da yapmak zorundadır.",
      summerRule2: "Stajların yapılacağı yıllar, süreleri, hangi konuları kapsayacağı, her konunun ne sürede olacağı ne tür işyerlerinde yapılacağı bölümlerce saptanır.",
      summerRule3: "Her bölümün en az bir öğretim üyesini içeren bir 'Staj Komitesi' vardır. Bu Komite bölümle ilgili işlerini Bölüm Başkanlığına karşı sorumlu olarak yürütür. Komitenin üyeleri Bölüm Başkanlığınca seçilir.",
      summerRule4: "Mühendislik Fakültesinin, gerektiğinde toplanan bir 'Fakülte Staj Komitesi' vardır. Bu komite yaz stajı olan her bölümden birer temsilcinin katılmasıyla oluşur. Dekan Başkanlığında toplanır ve staj uygulamalarının bölümlerce ortak kurallara göre yürütülmesini sağlar.",
      summerRule5: "Öğrenciler staj yapacakları yer ile ilgili bilgileri, staja başlamadan önce Bölüm Staj Komitesine sunmaları ve komitenin onayını almaları gerekir.",
      summerRule6: "Staja başlayacak her öğrenci bir 'Staj Rehberi' edinir. Bu rehbere Teams CENG400 kanalı üzerinden erişilebilir ve içinde staj ile ilgili bilgilerle gerekli formlar verilmiştir. Öğrenci, staj süresinde, programa göre yürüttüğü çalışmalarını günü gününe not eder ve bunlardan staj raporunu 'Yaz Stajı Raporu Formatı'na göre hazırlarken yararlanır. Öğrenci, staj raporunu stajı takip eden dönemde add/drop’un sonuna kadar Staj Komisyon Başkanı’na sunar. Bu tarihe kadar raporlarını vermeyen öğrencilerin stajları yapılmamış sayılır. Bölümler bu rapor dışında stajları ile ilgili başka belgeleri de isteyebilir.",
      summerRule7: "Stajını tamamlayan öğrenci takip eden ilk yarıyılda ilgili staj dersine kayıt olmak zorundadır.",
      summerRule8: "Raporunu istenen formata uygun olarak yazmayan öğrenciden, Bölüm Staj Komisyonu tarafından stajın kurallarına uygun olarak yapıldığı saptanır ise, raporun iki hafta içinde, istenilen formata uygun duruma getirmesi istenir. İstenilen raporu bu süre içinde getirmeyen veya raporları red edilen öğrenciler stajlarını tekrarlamak zorundadır.",
      summerRule9: "Her öğrenci staja başlarken, bu rehber içindeki 'GİZLİ' yazılı staj başarı belgelerini işyerine vermek zorundadır. Staj sonunda bu formlardan biri, işyerince, Bölüm Staj Komitesine eposta olarak yollanır. Bunu sağlamak öğrencinin sorumluluğundadır. Diğer form ise işyerince saklanır.",
      summerRule10: "Başarı belgesinde değerlendirmede öğrencinin staj yaptığı Bölümlerden almış olduğu başarı notlarının ortalaması en az 'C' olmalıdır. Başarı notu ortalaması 'C'nin altında veya herhangi bir bölümde devam durumu 'F' olan öğrencinin bu stajı yeniden yapması zorunludur.",
      summerRule11: "Staj belgeleri incelendikten sonra verilen staj notları ilgili bölümlerce Öğrenci İşleri Dairesi Başkanlığına gönderilerek öğrencilerin dosyalarına işlenir.",
      moreDetails: "Daha Fazla Detay",
      loading: "Yükleniyor",
      noAnnouncement: "Mevcut duyuru yok veya tüm duyurulara başvurmuşsunuz",
    },
  },
};

i18n
  .use(initReactI18next) // Pass i18n instance to react-i18next.
  .init({
    resources,
    lng: 'en', // Default language
    fallbackLng: 'en', // Fallback if translation is missing
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
