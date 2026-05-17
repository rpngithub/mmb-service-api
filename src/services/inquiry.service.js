const inquiryRepository = require('../repositories/inquiry.repository');
const { sendMail } = require('../utils/mailer.util');

function generateInquiryNumber() {
  const date = new Date();
  const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '');
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const suffix = Array.from({ length: 6 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
  return `INQ-${dateStr}-${suffix}`;
}

class InquiryService {
  async submitInquiry(data) {
    const inquiry_number = generateInquiryNumber();
    const inquiry = await inquiryRepository.create({ ...data, inquiry_number });

    sendMail({
      to: process.env.SMTP_USER,
      subject: `New Inquiry [${inquiry_number}] from ${inquiry.name}`,
      html: `
        <h2>New Customer Inquiry</h2>
        <p><strong>Inquiry Number:</strong> ${inquiry_number}</p>
        <p><strong>Name:</strong> ${inquiry.name}</p>
        <p><strong>Email:</strong> ${inquiry.email}</p>
        <p><strong>Phone:</strong> ${inquiry.phone || '—'}</p>
        <p><strong>Query Type:</strong> ${inquiry.query_type || '—'}</p>
        <p><strong>Notes:</strong></p>
        <p>${inquiry.notes}</p>
      `,
    }).catch((err) => console.error('Inquiry admin email failed:', err.message));

    return inquiry;
  }

  async listInquiries({ status, page = 1, limit = 20 } = {}) {
    const where = status ? { status } : {};
    const offset = (page - 1) * limit;
    const { count, rows } = await inquiryRepository.findAll({
      where,
      order: [['created_at', 'DESC']],
      limit,
      offset,
    });
    return { data: rows, total: count, page, limit };
  }

  async updateInquiryStatus(id, status) {
    const inquiry = await inquiryRepository.findById(id);
    if (!inquiry) {
      const err = new Error('Inquiry not found');
      err.status = 404;
      throw err;
    }
    return inquiryRepository.update(id, { status });
  }
}

module.exports = new InquiryService();
