// Login ke baad har role apne "home" par jaata hai
export const homeFor = (role) => (role === "doctor" ? "/patients" : "/");
