/**
 * Helper to translate raw Axios exceptions into helpful, senior-grade diagnostic alerts
 */
export function parseApiError(error) {
  console.error("API error details:", error);

  // 1. Backend Not Running / Connection Refused
  if (error.code === "ERR_NETWORK" || !error.response) {
    return "Server Connection Failed: Backend is not running. Please start the Spring Boot server on port 8080.";
  }

  const status = error.response.status;
  const serverMessage = error.response.data?.message || "";

  // 2. Invalid API URL (404)
  if (status === 404) {
    return `API Error (404): Endpoint not found. Verify the URL base path and controllers mapping.`;
  }

  // 3. Database Connection Failure / Internal Server Error (500)
  if (status === 500) {
    if (serverMessage.toLowerCase().includes("mongo") || serverMessage.toLowerCase().includes("database")) {
      return "Database Error (500): Connection to MongoDB refused. Please start your local MongoDB daemon on port 27017.";
    }
    return `Server Error (500): ${serverMessage || "Internal server compile exception. See backend console logs."}`;
  }

  // 4. Client Errors (400, 401, 403)
  if (status === 401) {
    return serverMessage || "Session expired or credentials incorrect.";
  }

  if (status === 400) {
    return serverMessage || "Bad Request. Please review the submitted form fields.";
  }

  // Fallback
  return serverMessage || `API Request failed with status code ${status}.`;
}
