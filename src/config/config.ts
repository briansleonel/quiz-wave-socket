const config = {
    PORT: Number(process.env.PORT) || 3002,
    HOSTNAME: process.env.HOSTNAME || "localhost",
    MONGODB_URI:
        process.env.MONGODB_URI || "mongodb://0.0.0.0:27017/quizz-game",
    TOKEN_SECRET: "development",
    QUIZ_WAVE_API_URL: process.env.QUIZ_WAVE_API_URL,
};

export default config;
