import express from "express";

export const readStravaAuthUrl = (
    req: express.Request,
    res: express.Response,
) => {
    const redirectUri = `${process.env.FRONTEND_URL}/strava/callback`;
    const url = `https://www.strava.com/oauth/authorize?client_id=${process.env.STRAVA_CLIENT_ID}&response_type=code&redirect_uri=${redirectUri}&approval_prompt=force&scope=read`;
    res.json({ url });
};
