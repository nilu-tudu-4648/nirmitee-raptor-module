function getDateInSecs(date) {
    return (+new Date(date))/1000
  }
  
  function normalizeDate(date) {
    return isNumber(date)? date : getDateInSecs(date)
  }
  
  function isNumber(num) {
    return !isNaN(Number(num))
  }
  
  function isNonNullObject(input) {
    return !!input &&
           typeof input === "object" &&
           !Array.isArray(input);
  }
  
  function normalizeBoolean(bool) {
    if (bool === undefined) {
      return bool
    }
  
    return bool ? 1 : 0
  }
  
  function isDefined (value) {
  
    return typeof value !== "undefined";
  }
  function bytesToMB(bytes, decimals = 2) {
  if (bytes === 0) return "0";

  const MB = 1024 * 1024; // Conversion factor (1 KiB = 1024 bytes)
  const mb = bytes / MB;

  return mb.toFixed(decimals);
}
function formatDate (timestamp) {
  const date = new Date(timestamp);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Month starts from 0
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};



 export {
    normalizeDate,
    normalizeBoolean,
    isNumber,
    getDateInSecs,
    isDefined,
    isNonNullObject,
    bytesToMB,
    formatDate
  }
  