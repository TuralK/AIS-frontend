import axios from 'axios';

export const fillApplicationForm = async (applicationId,internshipStartDate,internshipEndDate, internshipDuration, 
                                        dutyNtitle, workOnSaturday, question2, question3, workDays) => {
    try {
        
        const response = await axios.post(
          `http://localhost:3005/applications/${applicationId}/fillApplicationForm`, 
          {
            internStartDate: internshipStartDate,
            internEndDate: internshipEndDate,
            internDuration: internshipDuration,
            dutyAndTitle: dutyNtitle,
            workOnSaturday: workOnSaturday,
            workOnHoliday: question2,
            sgk: question3,
            day: workDays,
          },
          { withCredentials: true }
        );
        return response.data;
    } catch (error) {
        throw new Error(error);
    }
}