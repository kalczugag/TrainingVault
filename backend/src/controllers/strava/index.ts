import { connectStrava } from "./connectStrava";
import { readStravaAuthUrl } from "./readStravaAuthUrl";
import { verifyStravaWebhook } from "./verify";
import { stravaWebhook } from "./webhook";

const methods = {
    connectStrava,
    readStravaAuthUrl,
    verifyStravaWebhook,
    stravaWebhook,
};

export default methods;
