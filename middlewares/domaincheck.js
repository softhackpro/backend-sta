

export const strictDomainValidator = async (req, res, next) => {
  try {
    const origin = req.get('origin'); 
    console.log(req, "ye origin hai saala");
       
    // Fetch allowed domains from MongoDB
    const allowedDomains = process.env.FRONTEND_URL;
    
    // Block if none of the validations pass
    if (!allowedDomains) {
      return res.status(500).json({
        message: 'went wrong',
      });
    }

    next();
  } catch (error) {
    console.error('Domain validation error:', error);
    return res.status(500).json({
      error: 'Validation Error',
      message: 'Domain validation service unavailable'
    });
  }
};