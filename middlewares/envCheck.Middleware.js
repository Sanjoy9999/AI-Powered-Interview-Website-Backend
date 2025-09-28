/**
 * Middleware to verify critical environment variables are present
 * Helps catch configuration issues early with clear error messages
 */

const checkRequiredEnvVars = (req, res, next) => {
  const requiredVars = ['MONGO_URL', 'JWT_SECRET'];
  const missingVars = [];

  requiredVars.forEach(varName => {
    if (!process.env[varName]) {
      missingVars.push(varName);
    }
  });

  if (missingVars.length > 0) {
    console.error(`Missing required environment variables: ${missingVars.join(', ')}`);
    return res.status(500).json({ 
      message: "Server configuration error",
      details: "The application is missing required configuration. Please contact support."
    });
  }

  next();
};

module.exports = { checkRequiredEnvVars };