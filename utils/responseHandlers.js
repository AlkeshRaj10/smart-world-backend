module.exports = {
  okResponse: (res, status, data, message, token = null) => {
    const response = {
      success: true,
      message,
      status,
      data,
      token,
    };
    return res.status(status).json(response);
  },
  handleError: (res, status, data, message) => {
    let response = {
      success: false,
      message,
      status,
      data,
    };
    return res.status(response.status).json(response);
  },
};
