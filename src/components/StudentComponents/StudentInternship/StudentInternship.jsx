// pages/StudentInternship.jsx
import React, { useEffect, useState } from "react";
import SubmissionForm from "./components/SubmissionForm";
import FeedbackSection from "./components/FeedbackSection";
import CustomAlertDialog from "../../ui/custom_alert";
import { useTranslation } from "react-i18next";
import { finishInternship, getInternship } from "../../../api/StudentApi/internshipApi";
import { Building2, FileText } from "lucide-react";
import Loading from "../../LoadingComponent/Loading";
import { useMatches } from "react-router-dom";

const StudentInternship = () => {
  const matches = useMatches();
  const { t } = useTranslation();
  const currentMatch = matches[matches.length - 1];
  const titleKey = currentMatch?.handle?.titleKey;

  React.useEffect(() => {
    const baseTitle = 'IMS';
    document.title = titleKey ? `${baseTitle} | ${t(titleKey)}` : baseTitle;
  }, [titleKey, t]);

  const [internshipData, setInternshipData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [finishing, setFinishing] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  useEffect(() => {
    const fetchInternship = async () => {
      try {
        const res = await getInternship();
        
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
      if (res.status === 200) {
        setInternshipData(prev => ({ ...prev, status: 1 }));
      }
    } catch (err) {
      console.error("Finish error:", err);
    } finally {
      setFinishing(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center mt-10">
        <Loading />
      </div>
    );
  }

  if (!internshipData) {
    return (
      <div className="flex justify-center items-center m-screen text-2xl font-semibold text-gray-700 min-h-[80vh]">
        {t("noInternshipFound")}
      </div>
    );
  }

  const companyName =
    (internshipData.Application && internshipData.Application.Announcement.Company.name) || (internshipData.ManualApplication.companyName);
  const internshipTitle =
    (internshipData.Application && internshipData.Application.Announcement.announcementName) || "-";
  const internshipStatus = internshipData.status === 0 ? t("ongoing") : t("finished");

  return (
    <div className="min-h-screen px-4">
      {/* Status Bar */}
      <div className="max-w-6xl mx-auto flex justify-end p-4 border-b border-gray-400">
        <div
          className={`flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium ${internshipData.status === 0 ? 'bg-green-50 text-green-600' : 'bg-orange-50 text-orange-600'
            }`}
        >
          <div
            className={`h-2.5 w-2.5 rounded-full ${internshipData.status === 0 ? 'bg-green-500 animate-pulse' : 'bg-orange-500'
              }`}
          />
          {internshipStatus}
        </div>
      </div>

      {/* Company ve Internship Info */}
      <div className="p-6 space-y-8 relative max-w-6xl mx-auto">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2 rounded-lg border border-gray-200 p-4 hover:shadow-md flex flex-col justify-between">
            <div className="text-sm font-medium text-gray-500">{t("company")}</div>
            <div className="flex items-center gap-3 mt-2">
              <div className="w-8 h-8 flex items-center justify-center rounded-full bg-[#a51c30]/10">
                <Building2 className="h-4 w-4 text-[#a51c30]" />
              </div>
              <h2 className="text-base font-semibold">{companyName}</h2>
            </div>
          </div>
          <div className="space-y-2 rounded-lg border border-gray-200 p-4 hover:shadow-md flex flex-col justify-between">
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

      {/* Internship finish approval */}
      {internshipData.status === 0 && (
        <div className="max-w-6xl mx-auto text-center mt-8">
          <h3 className="text-2xl font-bold text-gray-800 mb-4">
            {t("isInternshipFinished")}
          </h3>
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


      {internshipData.status !== 0 && (
        <div className="mx-auto max-w-6xl flex flex-col md:flex-row items-stretch gap-6 mt-8">
          {/* SubmissionForm */}
          <div className="flex-1">
            <SubmissionForm
              status={internshipData.status}
              manualApplicationId={internshipData.manualApplicationId}
              studentStatus={internshipData.studentStatus}
              companyStatus={internshipData.companyStatus}
            />
          </div>
          {/* FeedbackSection */}
          {(internshipData.studentStatus !== 2 && internshipData.studentStatus !== 0 )  && (
            <div className="flex-1">
              <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                <FeedbackSection internshipData={internshipData} />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default StudentInternship;