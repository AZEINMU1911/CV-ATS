const { User, CV, AnalysisHistory } = require("../models")
const { GoogleGenAI } = require("@google/genai");
const axios = require("axios")


const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API });

class AnalysisController {
    static async analyzeCv(req, res, next) {
        try {
            const { cvId } = req.params
            const userId = req.user.id

            const cv = await CV.findOne({
                where: {
                    "id": cvId,
                    "userId": userId
                }
            })

            if (!cv) throw new Error('NOT_FOUND')

            const response = await axios.get(cv.fileUrl, {
                responseType: 'arraybuffer'
            })

            //DOWNLOADED CV FROM CLOUDINARY
            const fileBuffer = Buffer.from(response.data)

            //MODEL CONFIG
            const config = {
                temperature: 1,
                thinkingConfig: {
                    thinkingBudget: 10000,
                },
            };
            //MODEL VERSION
            const model = "gemini-2.5-pro";

            //CONTENT
            const contents = [{
                role: 'user',
                parts: [
                    {
                        inlineData: {
                            data: fileBuffer.toString("base64"),
                            mimeType: "application/pdf"
                        }
                    },
                    {
                        text: `
                You are an expert ATS (Applicant Tracking System) analyzer for CVs.
                Analyze the provided CV document thoroughly.
                Provide a detailed analysis focusing on ATS compatibility, keyword optimization, and formatting.
                Your response MUST be a valid JSON object with the following structure:
                {
                  "atsScore": <an integer between 0 and 100>,
                  "feedback": {
                    "positive": [<an array of strings highlighting good points>],
                    "improvements": [<an array of strings with specific suggestions for improvement>]
                  },
                  "keywords": {
                    "extracted": [<an array of keywords and skills extracted from the CV>],
                    "missing": [<an array of common keywords for the likely industry that are missing>]
                  }
                }
            `
                    }
                ]
            }]

            //AI CONTENT GENERATION
            const result = await ai.models.generateContent({ model, config, contents });
            const candidate = result.candidates?.[0];
            let aiResponseText = candidate?.content?.parts?.map(p => p.text).join("") || "";

            // Remove Markdown code fences if present
            aiResponseText = aiResponseText.replace(/```json|```/g, "").trim();

            let analysisData;
            try {
                analysisData = JSON.parse(aiResponseText);
            } catch (e) {
                console.error("Failed to parse AI response:", aiResponseText);
                throw new Error("Failed to parse AI response. The AI may have returned an invalid format.");
            }

            // Save to DB
            await AnalysisHistory.create({
                cvId: cv.id,
                userId: userId,
                score: analysisData.atsScore,
                feedback: analysisData.feedback,
                suggestions: analysisData.keywords,
            });

            cv.atsScore = analysisData.atsScore;
            cv.analyzedAt = new Date();
            await cv.save();

            res.status(200).json(analysisData);

        } catch (error) {
            next(error)
        }
    }

    static async getLatestAnalysis(req, res, next) {
        try {
            const { cvId } = req.params;
            const userId = req.user.id;

            // Find the most recent analysis for this CV, ensuring it belongs to the user
            const latestAnalysis = await AnalysisHistory.findOne({
                where: {
                    cvId: cvId,
                    userId: userId,
                },
                order: [['createdAt', 'DESC']], // This gets the newest one
            });

            if (!latestAnalysis) {
                return res.status(404).json({ message: "No analysis found for this CV." });
            }

            res.status(200).json(latestAnalysis);
        } catch (error) {
            next(error);
        }
    }
}

module.exports = { AnalysisController }