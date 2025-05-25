import { getStatusBadge, formatDate } from '../../../utils/linkRequestUtils';
import { CheckCircle, XCircle, Building2, User, Mail, Calendar } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const LinkRequestCard = ({ request, onApprove, onReject, isProcessing }) => {
  const { t, i18n } = useTranslation();
  const isPending = request.status === 'Pending';

  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 border border-gray-100 overflow-hidden">
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {t('linkRequestsCardTitle')} {request.companyName}
            </h3>
            {getStatusBadge(request.status, t)}
          </div>
        </div>

        <div className="space-y-3 mb-6">
          <div className="flex items-center gap-3 text-sm">
            <User className="w-4 h-4 text-gray-400" />
            <span className="text-gray-600">{t('id')}</span>
            <span className="font-medium text-gray-900">{request.studentId}</span>
          </div>
          
          {/* <div className="flex items-center gap-3 text-sm">
            <Mail className="w-4 h-4 text-gray-400" />
            <span className="text-gray-600">{t('linkRequestsStudentEmail')}:</span>
            <span className="font-medium text-gray-900">{request.Student?.email}</span>
          </div> */}

          <div className="flex items-center gap-3 text-sm">
            <Building2 className="w-4 h-4 text-gray-400" />
            <span className="text-gray-600">{t('company')}:</span>
            <span className="font-medium text-gray-900">{request.companyName}</span>
          </div>

          <div className="flex items-center gap-3 text-sm">
            <Mail className="w-4 h-4 text-gray-400" />
            <span className="text-gray-600">{t('companyEmail')}:</span>
            <span className="font-medium text-gray-900">{request.companyEmail}</span>
          </div>

          <div className="flex items-center gap-3 text-sm">
            <Calendar className="w-4 h-4 text-gray-400" />
            <span className="text-gray-600">{t('linkRequestsRequestDate')}:</span>
            <span className="font-medium text-gray-900">{formatDate(request.createdAt, i18n.language)}</span>
          </div>
        </div>

        {isPending && (
          <div className="flex gap-3">
            <button
              onClick={() => onApprove(request.id)}
              disabled={isProcessing}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 focus:ring-4 focus:ring-emerald-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium"
            >
              <CheckCircle className="w-4 h-4" />
              {t('linkRequestsApprove')}
            </button>
            <button
              onClick={() => onReject(request.id)}
              disabled={isProcessing}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 focus:ring-4 focus:ring-red-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium"
            >
              <XCircle className="w-4 h-4" />
              {t('linkRequestsReject')}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default LinkRequestCard;
