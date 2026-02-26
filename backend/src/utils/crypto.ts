import crypto from "crypto";

const ALGORITHM = "aes-256-cbc";

const ENCRYPTION_KEY = process.env.GARMIN_ENCRYPTION_KEY!;

export const encrypt = (text: string) => {
    const iv = crypto.randomBytes(16);

    const cipher = crypto.createCipheriv(
        ALGORITHM,
        Buffer.from(ENCRYPTION_KEY),
        iv,
    );

    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);

    return {
        iv: iv.toString("hex"),
        passwordEncrypted: encrypted.toString("hex"),
    };
};

export const decrypt = (encryptedText: string, ivHex: string) => {
    const iv = Buffer.from(ivHex, "hex");
    const encryptedBuffer = Buffer.from(encryptedText, "hex");

    const decipher = crypto.createDecipheriv(
        ALGORITHM,
        Buffer.from(ENCRYPTION_KEY),
        iv,
    );

    let decrypted = decipher.update(encryptedBuffer);
    decrypted = Buffer.concat([decrypted, decipher.final()]);

    return decrypted.toString();
};
