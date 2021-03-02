export function errorHandler(err, req, res, next) {
  if (err.code === 11000) {
    return res.status(400).json({
      status: "error",
      message: "duplicate",
    });
  }
}
