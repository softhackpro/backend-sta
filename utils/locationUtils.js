// utils/locationUtils.js
import axios from "axios";

export const getLocationInfo = async (ip) => {
  try {
    const locationRes = await axios.get(`http://ip-api.com/json/${ip}`);
    
    if (locationRes.data.status === "success") {
      return {
        country: locationRes.data.country,
        region: locationRes.data.regionName,
        city: locationRes.data.city,
        isp: locationRes.data.isp,
        status: "success"
      };
    }
    return { status: "failed", message: "Location lookup failed" };
  } catch (err) {
    console.warn("Could not fetch location info:", err.message);
    return { status: "error", message: err.message };
  }
};