import express from "express";

export const verifyStravaWebhook = (
    req: express.Request,
    res: express.Response,
) => {
    const mode = req.query["hub.mode"];
    const token = req.query["hub.verify_token"];
    const challenge = req.query["hub.challenge"];

    if (mode && token) {
        if (mode === "subscribe" && token === process.env.VERIFY_TOKEN) {
            console.log("WEBHOOK_VERIFIED");
            return res.status(200).json({ "hub.challenge": challenge });
        } else {
            return res.sendStatus(403);
        }
    }
    return res.sendStatus(400);
};
