import { useEffect, useState } from "react";
import SubmissionForm from "./components/SubmissionForm";
import FeedbackSection from "./components/FeedbackSection";
import CustomAlertDialog from "../../ui/custom_alert";
import { useTranslation } from "react-i18next";
import { finishInternship, getInternship } from "../../../api/StudentApi/internshipApi";
import { Building2, FileText } from "lucide-react";
import Loading from "../../LoadingComponent/Loading";

const StudentInternship = () => {
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const [internshipData, setInternshipData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [finishing, setFinishing] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    const fetchInternship = async () => {
      try {
        const res = await getInternship();
        console.log("Internship data:", res);
        setInternshipData(res);
      } catch (err) {
        console.error("Get internship error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchInternship();
  }, []);

  const handleFinishConfirm = () => setConfirmOpen(true);

  const handleFinishInternship = async () => {
    setConfirmOpen(false);
    setFinishing(true);
    try {
      const res = await finishInternship(internshipData.id);
      if (res.status === 200) setInternshipData(prev => ({ ...prev, status: 1 }));
    } catch (err) {
      console.error("Finish error:", err);
    } finally {
      setFinishing(false);
    }
  };

  if (loading) return <div className="text-center mt-10"><Loading /></div>;

  let companyName;
  let internshipTitle;
  let internshipStatus;
  if (!internshipData) {
    return (
      <div className="flex justify-center items-center m-screen text-2xl font-semibold text-gray-700 min-h-[80vh]">
        No Active Internship
      </div>
    );
  }
  
  else {
    companyName = internshipData.Application.Announcement.Company.name || t("companyNameNotFound");
    internshipTitle = internshipData.Application.Announcement.announcementName || t("internshipTitleNotFound");
    internshipStatus = internshipData.status === 0 ? t("ongoing") : t("finished");
  }

  return (
    <div className="min-h-screen px-4">
      {/* Status Bar (same width as info) */}
      <div className="max-w-5xl mx-auto flex justify-end p-4 border-b">
        <div className={`flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium ${internshipData.status === 0 ? 'bg-green-50 text-green-600' : 'bg-orange-50 text-orange-600'}`}>
          <div className={`h-2.5 w-2.5 rounded-full ${internshipData.status === 0 ? 'bg-green-500 animate-pulse' : 'bg-orange-500'}`} />
          {internshipStatus}
        </div>
      </div>

      {/* Company and Internship Info */}
      <div className="p-6 space-y-8 relative max-w-6xl mx-auto">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2 rounded-lg border border-gray-200 p-4 hover:shadow-md">
            <div className="text-sm font-medium text-gray-500">{t("company")}</div>
            <div className="flex items-center gap-3 mt-2">
              <div className="w-8 h-8 flex items-center justify-center rounded-full bg-[#a51c30]/10">
                <Building2 className="h-4 w-4 text-[#a51c30]" />
              </div>
              <h2 className="text-base font-semibold">{companyName}</h2>
            </div>
          </div>
          <div className="space-y-2 rounded-lg border border-gray-200 p-4 hover:shadow-md">
            <div className="text-sm font-medium text-gray-500">{t("internshipName")}</div>
            <div className="flex items-center gap-3 mt-2">
              <div className="w-8 h-8 flex items-center justify-center rounded-full bg-[#a51c30]/10">
                <FileText className="h-4 w-4 text-[#a51c30]" />
              </div>
              <h2 className="text-base font-semibold">{internshipTitle}</h2>
            </div>
          </div>
        </div>
      </div>

      {/* Ongoing: prompt question + button */}
      {internshipData.status === 0 && (
        <div className="max-w-6xl mx-auto text-center mt-8">
          <h3 className="text-2xl font-bold text-gray-800 mb-4">{t("isInternshipFinished")}</h3>
          <button
            onClick={handleFinishConfirm}
            disabled={finishing}
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded text-lg font-semibold"
          >
            {finishing ? t("finishing") : t("yes")}
          </button>
        </div>
      )}

      {/* Confirm Dialog */}
      <CustomAlertDialog
        isOpen={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        title={t("isInternshipFinished")}
        description={t("finishInternshipConfirm")}
        onConfirm={handleFinishInternship}
        confirmLabel={t("yes")}
      />

      {/* Finished: Submission & Feedback */}
      {internshipData.status !== 0 && (
        <div className="mx-auto max-w-6xl flex gap-6 mt-8">
          <div className={`${internshipData.status === 4 ? "w-1/2" : "w-full"}`}>
            <SubmissionForm
              status={internshipData.status}
              manualApplicationId={internshipData.manualApplicationId}

            />
          </div>
          {internshipData.status === 4 && (
            <div className="w-1/2">
              <FeedbackSection
                feedback="Örnek geri bildirim..."
                companyStatus={internshipData.isApprovedByCompany}
                coordinatorStatus={internshipData.isApprovedByDIC}
                score={internshipData.score}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default StudentInternship;