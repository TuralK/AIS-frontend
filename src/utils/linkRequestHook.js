import { useState, useEffect } from 'react';
import LinkRequestService from '../services/linkRequest'; 

export const useLinkRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const service = new LinkRequestService();

  const fetchRequests = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await service.getLinkRequests();
      setRequests(data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleApproval = async (id, isApproved) => {
    try {
      await service.approveLinkRequest(id, isApproved);
      await fetchRequests();
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  return {
    requests,
    loading,
    error,
    handleApproval,
    refetch: fetchRequests
  };
};