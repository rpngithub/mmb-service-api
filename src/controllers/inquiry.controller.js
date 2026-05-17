const inquiryService = require('../services/inquiry.service');

exports.submit = async (req, res, next) => {
  try {
    const inquiry = await inquiryService.submitInquiry(req.body);
    res.status(201).json(inquiry);
  } catch (err) { next(err); }
};

exports.list = async (req, res, next) => {
  try {
    const { status, page, limit } = req.query;
    const result = await inquiryService.listInquiries({
      status,
      page: page ? parseInt(page, 10) : 1,
      limit: limit ? parseInt(limit, 10) : 20,
    });
    res.json(result);
  } catch (err) { next(err); }
};

exports.updateStatus = async (req, res, next) => {
  try {
    const inquiry = await inquiryService.updateInquiryStatus(
      parseInt(req.params.id, 10),
      req.body.status,
    );
    res.json(inquiry);
  } catch (err) { next(err); }
};
