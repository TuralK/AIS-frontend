import { Eye, EyeOff } from "lucide-react"
import { useTranslation } from "react-i18next"

function PasswordField({ label, id, register, isPasswordVisible, toggleVisibility, error, disabled }) {
  const { t } = useTranslation()

  return (
    <div className="w-full">
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      <div className="relative">
        <input
          {...register}
          id={id}
          type={isPasswordVisible ? "text" : "password"}
          disabled={disabled}
          className={`w-full h-11 px-3 pr-12 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-primary transition-colors ${
            disabled ? "bg-gray-100 cursor-not-allowed" : ""
          } ${error ? "border-red-500 focus:ring-red-500 focus:border-red-500" : ""}`}
        />
        <div className="absolute inset-y-0 right-0 flex items-center pr-3">
          <button
            type="button"
            onClick={toggleVisibility}
            disabled={disabled}
            className="text-gray-400 hover:text-gray-600 focus:outline-none"
          >
            {isPasswordVisible ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
          </button>
        </div>
      </div>
      {error && <p className="mt-1.5 text-sm text-red-600">{t(error.message)}</p>}
    </div>
  )
}

export default PasswordField