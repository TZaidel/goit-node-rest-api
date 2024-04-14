export const catchAsync = fn => (req, res, next) => {
  fn(req,res,next).catch(error=> next(error))
}
