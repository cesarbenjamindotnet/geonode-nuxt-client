import CryptoJS from 'crypto-js';

export default function useStringToMD5() {
  return (value: string): string => {
    const lowercaseString = value.trim().toLowerCase();
    const md5Hash = CryptoJS.MD5(lowercaseString).toString();
    return md5Hash;
  };
}