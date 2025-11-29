import Cryptr from "cryptr"

const cryptr = new Cryptr(process.env.ENCYPTION_KEY!);

export const decrypt = (text: string) => cryptr.decrypt(text);
export const encrypt = (text: string) => cryptr.encrypt(text);