import axios from 'axios';
import adminAPI from './adminAPI';

class LinkRequestService {
  constructor() {
  }

  async getLinkRequests() {
    try {
      const response = await adminAPI.get('/internship/linkRequests', {withCredentials: true});
      console.log('Link Requests:', response.data);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async approveLinkRequest(id, isApproved) {
    try {
      const response = await adminAPI.put(`/internship/approveLinkRequest/${id}`, { isApproved }, {withCredentials: true});
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  handleError(error) {
    if (error.response) {
      return new Error(error.response.data.message || 'Bir hata oluştu');
    } else if (error.request) {
      return new Error('Sunucuya ulaşılamıyor');
    } else {
      return new Error('Beklenmeyen bir hata oluştu');
    }
  }
}

export default LinkRequestService;