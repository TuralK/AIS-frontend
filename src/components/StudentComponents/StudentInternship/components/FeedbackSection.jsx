import { useTranslation } from 'react-i18next';

const FeedbackSection = ({ feedback, companyStatus, coordinatorStatus, score }) => {
  const { t, i18n } = useTranslation();

  return (
    <div className="flex h-full flex-col mt-10">
      {/* Status Indicators */}
      <div className="space-y-3">
        <div className="flex items-center justify-between rounded-lg border bg-background p-4">
          <span className="text-sm font-medium">{t('companySupervisorStatus')}</span>
          <div className="flex items-center gap-2">
            <div
              className={`h-2 w-2 rounded-full ${companyStatus === "accepted"
                  ? "bg-green-500"
                  : companyStatus === "rejected"
                    ? "bg-red-500"
                    : "bg-yellow-500"
                }`}
            />
            <span className="text-sm capitalize">{companyStatus}</span>
          </div>
        </div>

        <div className="flex items-center justify-between rounded-lg border bg-background p-4">
          <span className="text-sm font-medium">{t('coordinatorStatus')}</span>
          <div className="flex items-center gap-2">
            <div
              className={`h-2 w-2 rounded-full ${coordinatorStatus === "accepted"
                  ? "bg-green-500"
                  : coordinatorStatus === "rejected"
                    ? "bg-red-500"
                    : "bg-yellow-500"
                }`}
            />
            <span className="text-sm capitalize">{coordinatorStatus}</span>
          </div>
        </div>
      </div>

      {/* Feedback Area */}
      <div className="mt-6 flex-1! space-y-2">
        <h3 className="text-sm font-medium">{t('feedback')}</h3>
        <div className="rounded-lg border bg-gray-50 p-4">
          <p className="text-sm text-gray-600">{feedback}</p>
        </div>
      </div>

      {/* Score */}
      <div className="flex mt-5 items-center justify-between rounded-lg border bg-background p-4">
        <span className="text-sm font-medium">{t('score')}</span>
        <span className="text-lg font-semibold text-primary">{score}/100</span>
      </div>
    </div>
  )
}

export default FeedbackSection;