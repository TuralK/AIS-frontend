import { useState } from "react"
import StudentInternship from "./StudentInternship"
import { useTranslation } from "react-i18next"
import { finishInternship } from "../../../api/StudentApi/internshipApi"

const StudentInternshipWrapper = ({ internshipId }) => {
  const [isInternshipFinished, setIsInternshipFinished] = useState(false)
  const [loading, setLoading] = useState(false)
  const { t } = useTranslation()

  const finishInternshipApi = async () => {
    try {
      setLoading(true)
      const response = await finishInternship(internshipId)
    
      console.log("Response:", response)
      if (response?.status === 200) {
        setIsInternshipFinished(true)
      }
    } catch (error) {
      console.error("Error:", error.response?.data || error.message)
    } finally {
      setLoading(false)
    }
  }

  if (isInternshipFinished) return <StudentInternship />

  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center p-8">
      <h2 className="text-2xl font-semibold mb-6">{t("isInternshipFinished")}</h2>
      <button
        onClick={finishInternshipApi}
        className="bg-green-600 text-white px-5 py-2 rounded hover:bg-green-700 disabled:opacity-50"
        disabled={loading }
      >
        {loading ? t("loading") : t("yes")}
      </button>
    </div>
  )
}

export default StudentInternshipWrapper
