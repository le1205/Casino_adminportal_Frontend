
export const convertLocalDateTime = (timeString) => new Date(timeString).toISOString().replace(/T/, ' ').replace(/\..+/, '') 
