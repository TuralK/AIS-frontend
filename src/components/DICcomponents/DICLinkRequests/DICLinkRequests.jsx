import { useTranslation } from "react-i18next"
import { useState } from 'react';
import { useLinkRequests } from "../../../utils/linkRequestHook";
import { AlertCircle } from 'lucide-react';
import LinkRequestCard from "./LinkRequestCard";
import Loading from "../../LoadingComponent/Loading";

function DICLinkRequests() {
  const { t } = useTranslation();
  const { requests, loading, error, handleApproval, refetch } = useLinkRequests();
  const [processingId, setProcessingId] = useState(null);
  const [notification, setNotification] = useState(null);

  const showNotification = (message, type) => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 5000);
  };

  const handleAction = async (id, isApproved) => {
    setProcessingId(id);
    const result = await handleApproval(id, isApproved);
    setProcessingId(null);

    if (result.success) {
      showNotification(
        isApproved ? t('linkRequestsApproveSuccess') : t('linkRequestsRejectSuccess'),
        isApproved ? 'success' : 'error'
      );
    } else {
      showNotification(result.error || t('linkRequestsErrorGeneric'), 'error');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">{t('linkRequestsTitle')}</h1>
        </div>

        {notification && (
          <div className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${
            notification.type === 'success' 
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' 
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}>
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            {notification.message}
          </div>
        )}

        {loading ? (
          <Loading />
        ) : error ? (
          <div className="text-center py-24">
            <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
            <p className="text-xl text-gray-700 mb-2">{t('linkRequestsError')}</p>
            <p className="text-gray-500">{error}</p>
          </div>
        ) : requests.length === 0 ? (
          <div className="text-center py-24">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-10 h-10 text-gray-400" />
            </div>
            <p className="text-xl text-gray-700">{t('linkRequestsEmptyTitle')}</p>
            <p className="text-gray-500 mt-2">{t('linkRequestsEmptyDescription')}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {requests.map((request) => (
              <LinkRequestCard
                key={request.id}
                request={request}
                onApprove={(id) => handleAction(id, true)}
                onReject={(id) => handleAction(id, false)}
                isProcessing={processingId === request.id}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default DICLinkRequests;