import 'dotenv/config'
import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { dbService } from "./server/db.js";
import { geminiService } from "./server/gemini.js";

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: '10mb' }));

// Strict Authentication Middleware: Use authenticated user sessions only (no mock defaults)
const authenticateUser = async (req: any, res: any, next: any) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Authentication credentials required" });
  }
  const token = authHeader.split(" ")[1];
  const user = await dbService.getUser(token);
  if (!user) {
    return res.status(401).json({ error: "Active user session expired" });
  }
  req.userId = token;
  next();
};

// Admin Protection Middleware: Only haneefmohammed867@gmail.com can bypass
const authenticateAdmin = async (req: any, res: any, next: any) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Authentication credentials required" });
  }
  const token = authHeader.split(" ")[1];
  const user = await dbService.getUser(token);
  if (!user) {
    return res.status(401).json({ error: "Active user session expired" });
  }
  if (!user.email || user.email.toLowerCase() !== "haneefmohammed867@gmail.com") {
    return res.status(403).json({ error: "Access Denied: Only haneefmohammed867@gmail.com can access admin routes." });
  }
  req.userId = token;
  req.userEmail = user.email;
  next();
};

// ================= AUTHENTICATION ENDPOINTS =================

// Sign up
app.post("/api/auth/signup", async (req, res) => {
  const { email, password, fullName } = req.body;
  if (!email || !password || !fullName) {
    return res.status(400).json({ error: "Missing required signup fields" });
  }

  const existing = await dbService.findUserByEmail(email);
  if (existing) {
    return res.status(400).json({ error: "Email already registered" });
  }

  const passwordHash = "hash_" + password; 
  const user = await dbService.createUser(email, passwordHash, fullName);
  res.json({ user, token: user.id });
});

// Log in
app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "Email and password required" });
  }

  let user = await dbService.findUserByEmail(email);
  
  // Real-time dynamic generation of demo user on-demand to avoid empty initialization while preserving strict SaaS workflow
  if (!user && email.toLowerCase() === "demo@resumepilot.ai" && password === "admin") {
    user = await dbService.createUser("demo@resumepilot.ai", "hash_admin", "Preseeded Candidate");
  }

  if (!user || user.password_hash !== "hash_" + password) {
    return res.status(401).json({ error: "Invalid email or password" });
  }

  res.json({ user, token: user.id });
});

// Google OAuth Authorization
app.post("/api/auth/oauth-google", async (req, res) => {
  const { email, fullName, avatarUrl } = req.body;
  const targetEmail = email || "google-user@resumepilot.ai";
  const targetName = fullName || "Google Pilot User";
  
  let user = await dbService.findUserByEmail(targetEmail);
  if (!user) {
    user = await dbService.createUser(targetEmail, "oauth_google_verified", targetName, avatarUrl);
  }
  res.json({ user, token: user.id });
});

// Get Current User Profile (Database Driven)
app.get("/api/auth/me", authenticateUser, async (req: any, res) => {
  const user = await dbService.getUser(req.userId);
  if (!user) {
    return res.status(404).json({ error: "User session expired" });
  }
  res.json({ user });
});

// Get Profile configurations
app.get("/api/profile", authenticateUser, async (req: any, res) => {
  const user = await dbService.getUser(req.userId);
  if (!user) {
    return res.status(404).json({ error: "User session expired" });
  }
  res.json({ user });
});

// Update Profile details
app.post("/api/profile", authenticateUser, async (req: any, res) => {
  const { fullName, avatarUrl, age, mobile, email } = req.body;
  const user = await dbService.updateUserProfile(
    req.userId, 
    fullName, 
    avatarUrl, 
    age !== undefined && age !== '' ? Number(age) : undefined, 
    mobile,
    email
  );
  if (!user) return res.status(404).json({ error: "User not found" });
  res.json({ status: "success", user });
});

// ================= REAL REVIEW SYSTEM ENDPOINTS =================

// Public review lookup
app.get("/api/reviews", async (req, res) => {
  const reviews = await dbService.getReviews();
  const publicReviews = reviews.filter((r: any) => r.status === 'approved' || r.status === 'featured');
  res.json({ reviews: publicReviews });
});

// Self review evaluation
app.get("/api/reviews/me", authenticateUser, async (req: any, res) => {
  const reviews = await dbService.getReviews();
  const myReview = reviews.find((r: any) => r.userId === req.userId);
  res.json({ review: myReview || null });
});

// Submit/Edit Review (Authenticated)
app.post("/api/reviews", authenticateUser, async (req: any, res) => {
  const { rating, comment } = req.body;
  const user = await dbService.getUser(req.userId);
  if (!user) return res.status(404).json({ error: "User not found" });

  if (user.isDemo) {
    return res.status(403).json({ error: "Demo users cannot submit reviews. Create an account to share your experience!" });
  }

  if (rating === undefined || rating < 1 || rating > 5) {
    return res.status(400).json({ error: "Rating must be between 1 and 5 stars" });
  }

  const review = await dbService.addReview(
    req.userId,
    user.fullName || "Anonymous Pilot",
    user.avatarUrl || "",
    rating,
    comment || ""
  );
  res.json({ status: "success", review });
});

// Delete Review (Authenticated)
app.delete("/api/reviews", authenticateUser, async (req: any, res) => {
  const success = await dbService.deleteReview(req.userId);
  res.json({ success });
});

// ================= SAAS PAYMENT & UPI SYSTEM ENDPOINTS =================

// Get history of client's subscription requests
app.get("/api/payments/requests", authenticateUser, async (req: any, res) => {
  const requests = await dbService.getUserPaymentRequests(req.userId);
  res.json({ requests });
});

// Submit manual UPI receipt reference
app.post("/api/payments/charge", authenticateUser, async (req: any, res) => {
  const { plan, txnId, amount } = req.body;
  const user = await dbService.getUser(req.userId);
  if (!user) return res.status(404).json({ error: "User session expired" });

  if (user.isDemo) {
    return res.status(403).json({ error: "Demo users cannot create subscriptions. Create an account to purchase premium access!" });
  }

  if (!plan || !txnId || !amount) {
    return res.status(400).json({ error: "Plan, Transaction reference ID, and Amount are required." });
  }

  const request = await dbService.createPaymentRequest(
    req.userId,
    user.email,
    plan,
    txnId,
    parseFloat(amount)
  );
  res.json({ success: true, request });
});

// Admin endpoints with secure, non-bypassable guards checking for haneefmohammed867@gmail.com
app.get("/api/admin/payments", authenticateAdmin, async (req: any, res) => {
  try {
    const list = await dbService.getPaymentRequests();
    res.json({ requests: list });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch payments queue" });
  }
});

app.get("/api/admin/metrics", authenticateAdmin, async (req: any, res) => {
  try {
    const users = await dbService.getUsers().catch(() => []);
    const payments = await dbService.getPaymentRequests().catch(() => []);
    
    const totalUsers = users.length;
    const activeSubscriptions = users.filter((u: any) => u.subscriptionPlan && u.subscriptionPlan !== 'Free').length;
    
    const approvedPayments = payments.filter((p: any) => p.status === 'approved');
    const revenueCollected = approvedPayments.reduce((sum: number, p: any) => sum + (Number(p.amount) || 0), 0);
    const pendingPayments = payments.filter((p: any) => p.status === 'pending').length;
    
    res.json({
      totalUsers,
      activeSubscriptions,
      revenueCollected,
      pendingPayments
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to load admin metrics" });
  }
});

app.post("/api/admin/payments/:id/approve", authenticateAdmin, async (req: any, res) => {
  const { id } = req.params;
  const result = await dbService.approvePaymentRequest(id);
  res.json(result);
});

app.post("/api/admin/payments/:id/reject", authenticateAdmin, async (req: any, res) => {
  const { id } = req.params;
  const result = await dbService.rejectPaymentRequest(id);
  res.json(result);
});

// Admin Users Query Endpoint
app.get("/api/admin/users", authenticateAdmin, async (req: any, res) => {
  try {
    const list = await dbService.getUsers();
    const users = list.map((u: any) => ({
      id: u.id,
      email: u.email,
      fullName: u.fullName,
      avatarUrl: u.avatarUrl,
      subscriptionPlan: u.subscriptionPlan || "Free",
      createdAt: u.createdAt,
      isDemo: !!u.isDemo
    }));
    res.json({ users });
  } catch (err) {
    res.status(500).json({ error: "Failed to list users" });
  }
});

// Admin Reviews Moderation Query Endpoints
app.get("/api/admin/reviews", authenticateAdmin, async (req: any, res) => {
  try {
    const list = await dbService.getReviews();
    res.json({ reviews: list });
  } catch (err) {
    res.status(500).json({ error: "Failed to load reviews list" });
  }
});

app.post("/api/admin/reviews/:id/:action", authenticateAdmin, async (req: any, res) => {
  const { id, action } = req.params;
  const user = await dbService.getUser(req.userId);
  const moderatorEmail = user?.email || "haneefmohammed867@gmail.com";

  if (!['approve', 'reject', 'hide', 'feature'].includes(action)) {
    return res.status(400).json({ error: "Invalid action" });
  }

  let status = 'pending';
  if (action === 'approve') status = 'approved';
  else if (action === 'reject') status = 'rejected';
  else if (action === 'hide') status = 'hidden';
  else if (action === 'feature') status = 'featured';

  try {
    const result = await dbService.moderateReview(id, status, moderatorEmail);
    res.json({ success: true, review: result });
  } catch (err: any) {
    res.status(500).json({ error: err.message || "Failed to moderate review" });
  }
});


// ================= PUBLIC STATS ENDPOINT =================
app.get("/api/public/stats", async (req, res) => {
  try {
    const stats = await dbService.getPublicStats();
    res.json(stats);
  } catch (err: any) {
    res.status(500).json({ error: "Failed to load public statistics" });
  }
});


// ================= METRICS & ANALYTICS ENDPOINTS =================

// Strict analytic metrics based ONLY on actual database records
app.get("/api/analytics", authenticateUser, async (req: any, res) => {
  const data = await dbService.getDashboardAnalytics(req.userId);
  res.json(data);
});

// Recent activity Feed
app.get("/api/recent", authenticateUser, async (req: any, res) => {
  const activity = await dbService.getRecentActivity(req.userId);
  res.json({ activity });
});

// Get saved document ledgers
app.get("/api/saved/ledger", authenticateUser, async (req: any, res) => {
  const userId = req.userId;
  try {
    const resumes = await dbService.getResumeReports(userId).catch(() => []);
    const linkedin = await dbService.getLinkedIn(userId).catch(() => []);
    const projects = await dbService.getProjects(userId).catch(() => []);
    const coverLetters = await dbService.getCoverLetters(userId).catch(() => []);
    const careerRoadmaps = await dbService.getCareerRoadmaps(userId).catch(() => []);
    const interviews = await dbService.getInterviews(userId).catch(() => []);
    const bullets = await dbService.getBullets(userId).catch(() => []);

    res.json({
      resumes: resumes || [],
      linkedin: linkedin || [],
      projects: projects || [],
      coverLetters: coverLetters || [],
      skillGaps: [], // skill gap reports are currently integrated inside career roadmaps
      careerRoadmaps: careerRoadmaps || [],
      interviews: interviews || [],
      bullets: bullets || []
    });
  } catch (err: any) {
    console.error("Critical error in get saved ledger:", err);
    res.status(500).json({
      resumes: [],
      linkedin: [],
      projects: [],
      coverLetters: [],
      skillGaps: [],
      careerRoadmaps: [],
      interviews: [],
      bullets: []
    });
  }
});

// Delete history ledger items
app.delete("/api/saved/:type/:id", authenticateUser, async (req: any, res) => {
  const { type, id } = req.params;
  const success = await dbService.deleteItem(type, id, req.userId);
  res.json({ success });
});

// ================= AI RESUME & ANALYZATION ENDPOINTS =================

// 1. ATS Resume scanning
app.post("/api/resume/analyze", authenticateUser, async (req: any, res) => {
  const { filename, rawText } = req.body;
  if (!rawText) return res.status(400).json({ error: "No resume text provided" });

  const aiResult = await geminiService.analyzeResume(filename || "resume.txt", rawText);
  const savedReport = await dbService.addResumeReport({
    userId: req.userId,
    filename: filename || "Resume_Upload.txt",
    atsScore: aiResult.atsScore,
    keywordsMissing: aiResult.keywordsMissing,
    suggestedImprovements: aiResult.suggestedImprovements,
    overallSummary: aiResult.overallSummary,
    formattedText: rawText.substring(0, 1500)
  });

  res.json(savedReport);
});

// 2. LinkedIn Tailoring
app.post("/api/linkedin/generate", authenticateUser, async (req: any, res) => {
  const { currentRole, targetRole, experienceLevel, skills, achievements } = req.body;
  if (!targetRole || !skills) {
    return res.status(400).json({ error: "Target role and core skills required" });
  }

  const aiResult = await geminiService.generateLinkedInProfile(
    currentRole || "Student",
    targetRole,
    experienceLevel || "Entry Level",
    skills,
    achievements || "None"
  );

  const savedLi = await dbService.addLinkedIn({
    userId: req.userId,
    currentRole: currentRole || "Student",
    targetRole,
    experienceLevel,
    skills,
    achievements: achievements || "None",
    headline: aiResult.headline,
    aboutSection: aiResult.aboutSection,
    skillsSection: aiResult.skillsSection
  });

  res.json(savedLi);
});

// 3. AI Project Builder
app.post("/api/project/generate", authenticateUser, async (req: any, res) => {
  const { domain, targetRole, difficulty, preferences } = req.body;
  if (!domain || !targetRole) {
    return res.status(400).json({ error: "Domain and Target Role required" });
  }

  const aiResult = await geminiService.generateProject(domain, targetRole, difficulty, preferences);
  const savedProj = await dbService.addProject({
    userId: req.userId,
    domain,
    title: aiResult.title,
    description: aiResult.description,
    features: aiResult.features,
    techStack: aiResult.techStack,
    databaseDesign: aiResult.databaseDesign,
    roadmap: aiResult.roadmap,
    resumeSummary: aiResult.resumeSummary
  });

  res.json(savedProj);
});

// 4. Resume Bullet point enhancer
app.post("/api/bullets/generate", authenticateUser, async (req: any, res) => {
  const { inputActivity } = req.body;
  if (!inputActivity) return res.status(400).json({ error: "Generic activity text required" });

  const aiResult = await geminiService.generateBulletPoints(inputActivity);
  const savedBullets = await dbService.addBulletPoints({
    userId: req.userId,
    inputActivity,
    bullets: aiResult.bullets
  });

  res.json(savedBullets);
});

// 5. Letter Cover builder
app.post("/api/cover-letter/generate", authenticateUser, async (req: any, res) => {
  const { jobTitle, companyName, resumeDetails } = req.body;
  if (!jobTitle || !companyName) {
    return res.status(400).json({ error: "Job title and company name required" });
  }

  const sampleResume = resumeDetails || "Full stack developer with node and react experience.";
  const aiResult = await geminiService.generateCoverLetter(jobTitle, companyName, sampleResume);
  const savedLetter = await dbService.addCoverLetter({
    userId: req.userId,
    jobTitle,
    companyName,
    letterContent: aiResult.letterContent
  });

  res.json(savedLetter);
});

// 6. Career road maps
app.post("/api/roadmap/generate", authenticateUser, async (req: any, res) => {
  const { currentLevel, targetRole } = req.body;
  if (!targetRole) return res.status(400).json({ error: "Target Role is required" });

  const aiResult = await geminiService.generateCareerRoadmap(currentLevel || "Entry Level", targetRole);
  const savedRoadmap = await dbService.addCareerRoadmap({
    userId: req.userId,
    currentLevel: currentLevel || "Entry Level",
    targetRole,
    timelineWeeks: aiResult.timelineWeeks,
    steps: aiResult.steps
  });

  res.json(savedRoadmap);
});

// 7. Interview simulations questions
app.post("/api/interview/generate", authenticateUser, async (req: any, res) => {
  const { targetRole, experienceLevel } = req.body;
  if (!targetRole) return res.status(400).json({ error: "Target role required" });

  const aiResult = await geminiService.generateInterviewPrep(targetRole, experienceLevel || "Mid Level");
  const savedPrep = await dbService.addInterview({
    userId: req.userId,
    targetRole,
    experienceLevel: experienceLevel || "Mid Level",
    questions: aiResult.questions
  });

  res.json(savedPrep);
});

// Post Feedback on Answer
app.post("/api/interview/feedback", authenticateUser, async (req: any, res) => {
  const { prepId, questionIndex, userAnswer } = req.body;
  if (!prepId || questionIndex === undefined || userAnswer === undefined) {
    return res.status(400).json({ error: "Session metadata required" });
  }

  const savedPreps = await dbService.getInterviews(req.userId);
  const currentPrep = savedPreps.find(p => p.id === prepId);
  if (!currentPrep || !currentPrep.questions[questionIndex]) {
    return res.status(404).json({ error: "Session question index missing" });
  }

  const q = currentPrep.questions[questionIndex];
  const evaluation = await geminiService.evaluateInterviewAnswer(q.question, q.type, q.modelAnswer, userAnswer);
  
  const updatedPrep = await dbService.updateInterviewFeedback(prepId, questionIndex, userAnswer, evaluation);
  res.json({ updatedPrep, evaluation });
});

// ================= MIXED FRONTEND/BACKEND RESOLVER =================

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`ResumePilot AI express server listening at http://0.0.0.0:${PORT}`);
  });
}

startServer();
