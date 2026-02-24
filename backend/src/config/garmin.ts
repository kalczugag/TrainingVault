import { GarminConnect } from "@flow-js/garmin-connect";
import { decrypt } from "../utils/crypto";

const clientsCache = new Map<string, GarminConnect>();

export const getGarminClient = async (
    userId: string,
    garminCredentials: {
        email: string;
        passwordEncrypted: string;
        iv: string;
    },
): Promise<GarminConnect> => {
    if (clientsCache.has(userId)) {
        return clientsCache.get(userId)!;
    }

    const plainPassword = decrypt(
        garminCredentials.passwordEncrypted,
        garminCredentials.iv,
    );

    const newClient = new GarminConnect({
        username: garminCredentials.email,
        password: plainPassword,
    });

    await newClient.login();

    clientsCache.set(userId, newClient);

    return newClient;
};

export const removeGarminClient = (userId: string) => {
    clientsCache.delete(userId);
};
