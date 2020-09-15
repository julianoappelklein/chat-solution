export const jsonResponse = (
  res: any,
  data: any,
  options?: { statusCode: number }
) => {
  let opts = Object.assign({}, { statusCode: 200 }, options);
  res.status(opts.statusCode);
  res.setHeader("Content-Type", "application/json");
  res.write(data != null ? JSON.stringify(data) : "null");
  res.end();
};