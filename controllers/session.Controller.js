const Session = require("../models/session.Model");
const Question = require("../models/question.Model");

//@Desc Create new session and linked questions
//@Route POST /api/sessions/create
//@Access Private
exports.createSession = async (req, res) => {
  try {
    const { role, experience, topicsToFocus, description, questions } =
      req.body;
    const userId = req.user._id; // Assuming req.user is populated by the protect middleware

    // Add validation
    if (!userId) {
      return res
        .status(401)
        .json({ success: false, message: "User not authenticated" });
    }

    if (!questions || !Array.isArray(questions)) {
      return res
        .status(400)
        .json({ success: false, message: "Questions array is required" });
    }

    // Create new session
    const newSession = await Session.create({
      user: userId,
      role,
      experience,
      topicsToFocus,
      description,
    });

    // Create and link questions to the session
    const questionDocs = await Promise.all(
      questions.map(async (q) => {
        const question = await Question.create({
          session: newSession._id,
          question: q.question,
          answer: q.answer,
        });
        return question._id;
      })
    );

    newSession.questions = questionDocs;
    await newSession.save();

    res.status(201).json({ success: true, data: newSession });
  } catch (error) {
    console.error("Create session error:", error.message);
    console.error("Full error:", error);
    res
      .status(500)
      .json({ success: false, message: "Server Error", error: error.message });
  }
};



// ...existing code...
//@Desc Get all sessions for logged-in user
//@Route GET /api/sessions/my-sessions
//@Access Private
exports.getMySessions = async (req, res) => {
  try {
    console.log('getMySessions called');
    console.log('User:', req.user);
    console.log('User ID:', req.user?._id);
    
    if (!req.user || !req.user._id) {
      return res.status(401).json({ 
        success: false, 
        message: "User not authenticated" 
      });
    }
    
    const sessions = await Session.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .populate("questions");

    console.log('Found sessions:', sessions.length);
    
    res.status(200).json({ 
      success: true, 
      count: sessions.length,
      data: sessions 
    });
  } catch (error) {
    console.error('Get sessions error:', error);
    res.status(500).json({ 
      success: false, 
      message: "Server Error", 
      error: error.message 
    });
  }
};
// ...existing code...





//@Desc Get session by ID with populated questions
//@Route GET /api/sessions/:id
//@Access Private
exports.getSessionById = async (req, res) => {
  try {
    const session = await Session.findById(req.params.id)
    .populate({
      path: 'questions',
      options: { sort: { createdAt: -1 } } 
    })
    .exec(); // Ensure execution of the query

    if (!session) {
      return res.status(404).json({ success: false, message: "Session not found" });
    }

    res.status(200).json({ success: true,session });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};




//@Desc Delete a session and its questions
//@Route DELETE /api/sessions/:id
//@Access Private
exports.deleteSession = async (req, res) => {
  try {
    const session = await Session.findById(req.params.id);
    if (!session) {
      return res.status(404).json({ success: false, message: "Session not found" });
    }
    // Check if the logged-in user is the owner of the session
    if (session.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ success: false, message: "Not authorized" });
    }

    //First delete all linked questions to this session
    await Question.deleteMany({ session: session._id });


    //Then delete the session
    await session.deleteOne();

    res.status(200).json({ success: true, message: "Session and linked questions deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
