const sendResponse = ({res, status=500, data=null, error=null}) => {
  if(!error) return res.status(status).json({data});
  console.error(error);
  return res.status(status).json({error});
}

class CustomError extends Error {
  constructor({message, status=500, data=null, error=null}) {
      super(message);
      this.status = status;
      this.data = data;
      this.error = error;
  }
}

const throwError = (message,error,status=500) => {
  console.error(error);
  throw new CustomError({message,status,error});
}

module.exports = {
  sendResponse,
  CustomError,
  throwError
}