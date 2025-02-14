import { Crown, Briefcase, GraduationCap, Building } from "lucide-react"
import { useTranslation } from "react-i18next"

export const UserAvatar = ({ email }) => {
  const { t } = useTranslation()

  const getRole = () => {
    if(email === "buketoksuzoglu@iyte.edu.tr") return "coordinator"
    const domain = email.split("@")[1]
    if(domain === "iyte.edu.tr") return "secretary"
    if(domain === "std.iyte.edu.tr") return "student"
    return "company"
  }

  const role = getRole()

  const roleStyles = {
    coordinator: {
      bg: "bg-purple-100",
      icon: <Crown className="w-4 h-4 text-purple-600" />,
      text: t("coordinator")
    },
    secretary: {
      bg: "bg-blue-100",
      icon: <Briefcase className="w-4 h-4 text-blue-600" />,
      text: t("secretary")
    },
    student: {
      bg: "bg-green-100",
      icon: <GraduationCap className="w-4 h-4 text-green-600" />,
      text: t("student")
    },
    company: {
      bg: "bg-orange-100",
      icon: <Building className="w-4 h-4 text-orange-600" />,
      text: t("company")
    }
  }

  return (
    <div className={`${roleStyles[role].bg} rounded-full p-2 flex items-center gap-2`}>
      {roleStyles[role].icon}
      <span className="text-xs font-medium text-gray-700 hidden sm:inline">
        {roleStyles[role].text}
      </span>
    </div>
  )
}