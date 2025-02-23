import SubmissionForm from "./components/SubmissionForm"
import FeedbackSection from "./components/FeedbackSection"

const StudentInternship = () => {
  // Örnek geri bildirim verisi
  const feedbackData = {
    feedback:
      "The student has shown excellent progress throughout the internship. Their technical skills and problem-solving abilities have improved significantly. They have successfully completed all assigned tasks and demonstrated great teamwork.They have successfully completed all assigned tasks and demonstrated great teamwork.They have successfully completed all assigned tasks and demonstrated great teamwork.They have successfully completed all assigned tasks and demonstrated great teamwork.",
    companyStatus: "accepted",
    coordinatorStatus: "pending",
    score: 85,
  }

  return (
    <div className="min-h-screen">
      <div className="mx-auto grid h-screen max-w-[1800px] grid-cols-1 lg:grid-cols-2">
        {/* Sol Taraf - Başvuru Formu */}
        <div className="">
          <SubmissionForm />
        </div>

        {/* Sağ Taraf - Geri Bildirim Bölümü */}
        <div className="bg-white p-6">
          <FeedbackSection {...feedbackData} />
        </div>
      </div>
    </div>
  )
}

export default StudentInternship;