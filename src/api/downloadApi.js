import axios from 'axios';

const downloadTemplateFile = async (urlPath, fileName) => {
    try {
        const response = await axios.get(`${urlPath}/internship/download/${fileName}`, {
            responseType: 'blob',
            headers: {
                'Accept': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/octet-stream'
            },
            withCredentials: true
        });

        const url = window.URL.createObjectURL(new Blob([response.data]));

        const link = document.createElement('a');
        link.href = url;

        const contentDisposition = response.headers['content-disposition'];
        let downloadFileName = fileName;

        if (contentDisposition) {
            const fileNameMatch = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
            if (fileNameMatch && fileNameMatch[1]) {
                downloadFileName = fileNameMatch[1].replace(/['"]/g, '');
            }
        }

        link.setAttribute('download', downloadFileName);

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        window.URL.revokeObjectURL(url);

        return { success: true, message: 'Dosya başarıyla indirildi' };

    } catch (error) {
        console.error('Dosya indirme hatası:', error);

        if (error.response?.status === 404) {
            return { success: false, message: 'Dosya bulunamadı' };
        } else if (error.response?.status === 500) {
            return { success: false, message: 'Sunucu hatası' };
        } else {
            return { success: false, message: 'Dosya indirilemedi' };
        }
    }
};

export default downloadTemplateFile;