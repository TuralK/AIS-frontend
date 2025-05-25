import { CheckCircle, XCircle, Clock } from 'lucide-react';

export const formatDate = (dateString, locale) => {
  return new Date(dateString).toLocaleDateString(locale === 'tr' ? 'tr-TR' : 'en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

export const getStatusBadge = (status, t) => {
  const statusConfig = {
    Pending: {
      bg: 'bg-amber-100',
      text: 'text-amber-700',
      border: 'border-amber-200',
      icon: Clock,
      label: t('linkRequestsStatusPending')
    },
    Approved: {
      bg: 'bg-emerald-100',
      text: 'text-emerald-700',
      border: 'border-emerald-200',
      icon: CheckCircle,
      label: t('linkRequestsStatusApproved')
    },
    Rejected: {
      bg: 'bg-red-100',
      text: 'text-red-700',
      border: 'border-red-200',
      icon: XCircle,
      label: t('linkRequestsStatusRejected')
    }
  };

  const config = statusConfig[status] || statusConfig.Pending;
  const Icon = config.icon;

  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium ${config.bg} ${config.text} border ${config.border}`}>
      <Icon className="w-4 h-4" />
      {config.label}
    </span>
  );
};
