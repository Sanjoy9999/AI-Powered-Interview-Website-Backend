const {GoogleGenAI} = require("@google/genai")
const {conceptExplainPrompt, questionAnswerPrompt} = require("../utils/prompts");

const ai = new GoogleGenAI({
    apiKey:process.env.GEMINI_API_KEY
})

//@Desc Generate Interview Question and Answer using Gemini
//@Route POST /api/ai/generate-questions
//@Access Private
const generateInterviewQuestion = async(req,res)=>{
    try {
       const {role,experience,topicsToFocus,numberOfQuestions} = req.body;

       if(!role || !experience || !topicsToFocus || !numberOfQuestions){
        return res.status(400).json({message:"Please provide all required fields"})
       }

       const prompt = questionAnswerPrompt(role,experience,topicsToFocus,numberOfQuestions);


       const response = await ai.models.generateContent({
        model:"gemini-2.0-flash-lite", //gemini-2.0-flash-lite;
        contents: prompt,
       })

       let rawText = response.text;

       //Clean it:Remove ```json and ```from start and end
       const cleanedText = rawText
       .replace(/^```json\$*/, "") // Remove ``` from start
       .replace(/```$/, "") // Remove ``` from  ending
       .trim();// Remove any extra whitespace

       //Now save to parse 
       const data = JSON.parse(cleanedText);

       res.status(200).json(data);
    } catch (error) {
        res.status(500).json({
            message:"Failed to generate question",
            error:error.message
        })
    }
}


//@Desc Generate Concept Explanation a interview question using Gemini
//@Route POST /api/ai/generate-explanation
//@Access Private
const generateConceptExplanation = async(req,res)=>{
    try {
       const {question} = req.body;
       
       if(!question){
        return res.status(400).json({message:"Please provide all required fields"})
       }

       const prompt = conceptExplainPrompt(question);

       const response = await ai.models.generateContent({
        model:"gemini-2.0-flash-lite", //gemini-2.0-flash-lite;
        contents: prompt,
       })

         let rawText = response;

         //Clean it:Remove ```json and ```from start and end
            const cleanedText = rawText.text
            .replace(/^```json\$*/, "") // Remove ``` from start
            .replace(/```$/, "") // Remove ``` from  ending
            .trim();// Remove any extra whitespace

            //Now save to parse 
            const data = JSON.parse(cleanedText);

            res.status(200).json(data);
    } catch (error) {
        res.status(500).json({
            message:"Failed to generate explanation",
            error:error.message
        })
    }
}

module.exports = {
    generateInterviewQuestion,
    generateConceptExplanation
}