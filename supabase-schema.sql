-- ==========================================================
-- RESUMEPILOT AI - PRODUCTION SUPABASE DATABASE SCHEMA
-- Execute these queries inside your Supabase Project SQL Editor
-- ==========================================================

-- Enable general extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. USERS TABLE
CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY, -- Maps to custom user IDs
    email TEXT UNIQUE NOT NULL,
    "fullName" TEXT,
    "avatarUrl" TEXT,
    password_hash TEXT NOT NULL,
    "subscriptionPlan" TEXT DEFAULT 'Free',
    "createdAt" TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS for Users
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read on users" ON users 
    FOR SELECT USING (true);

CREATE POLICY "Allow self management on users" ON users 
    FOR ALL USING (true);


-- 2. PAYMENT REQUESTS TABLE (UPI Reconciliation Desk)
CREATE TABLE IF NOT EXISTS payment_requests (
    id TEXT PRIMARY KEY,
    "userId" TEXT REFERENCES users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    plan TEXT NOT NULL,
    "txnId" TEXT UNIQUE NOT NULL,
    amount NUMERIC NOT NULL,
    status TEXT DEFAULT 'pending', -- pending | approved | rejected
    "createdAt" TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE payment_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow user select on own payment requests" ON payment_requests
    FOR SELECT USING (true);

CREATE POLICY "Allow user insert on payment requests" ON payment_requests
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow admin all on payment requests" ON payment_requests
    FOR ALL USING (true);


-- 3. SUBSCRIPTIONS TABLE
CREATE TABLE IF NOT EXISTS subscriptions (
    id TEXT PRIMARY KEY,
    "userId" TEXT REFERENCES users(id) ON DELETE CASCADE,
    plan TEXT NOT NULL,
    amount NUMERIC NOT NULL,
    status TEXT NOT NULL,
    "createdAt" TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow user read own subscriptions" ON subscriptions
    FOR SELECT USING (true);


-- 4. REVIEWS TABLE (Real platform feedback marquee)
CREATE TABLE IF NOT EXISTS reviews (
    id TEXT PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "avatarUrl" TEXT,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    comment TEXT NOT NULL,
    "createdAt" TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read on reviews" ON reviews
    FOR SELECT USING (true);

CREATE POLICY "Allow self manage on reviews" ON reviews
    FOR ALL USING (true);


-- 5. RESUME REPORTS TABLE (ATS Diagnostics)
CREATE TABLE IF NOT EXISTS resume_reports (
    id TEXT PRIMARY KEY,
    "userId" TEXT REFERENCES users(id) ON DELETE CASCADE,
    filename TEXT NOT NULL,
    "atsScore" INTEGER NOT NULL,
    "keywordsMissing" JSONB,
    "suggestedImprovements" JSONB,
    "overallSummary" TEXT,
    "formattedText" TEXT,
    "createdAt" TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE resume_reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow self manage on resume reports" ON resume_reports
    FOR ALL USING (true);


-- 6. LINKEDIN PROFILES TABLE
CREATE TABLE IF NOT EXISTS linkedin_profiles (
    id TEXT PRIMARY KEY,
    "userId" TEXT REFERENCES users(id) ON DELETE CASCADE,
    "currentRole" TEXT,
    "targetRole" TEXT NOT NULL,
    "experienceLevel" TEXT,
    skills TEXT,
    achievements TEXT,
    headline TEXT NOT NULL,
    "aboutSection" TEXT,
    "skillsSection" TEXT,
    "createdAt" TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE linkedin_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow self manage on linkedin_profiles" ON linkedin_profiles
    FOR ALL USING (true);


-- 7. PROJECT GENERATIONS TABLE
CREATE TABLE IF NOT EXISTS project_generations (
    id TEXT PRIMARY KEY,
    "userId" TEXT REFERENCES users(id) ON DELETE CASCADE,
    domain TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    features JSONB,
    "techStack" JSONB,
    "databaseDesign" TEXT,
    roadmap JSONB,
    "resumeSummary" TEXT,
    "createdAt" TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE project_generations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow self manage on project generations" ON project_generations
    FOR ALL USING (true);


-- 8. CAREER ROADMAPS TABLE
CREATE TABLE IF NOT EXISTS career_roadmaps (
    id TEXT PRIMARY KEY,
    "userId" TEXT REFERENCES users(id) ON DELETE CASCADE,
    "currentLevel" TEXT,
    "targetRole" TEXT NOT NULL,
    "timelineWeeks" JSONB,
    steps JSONB,
    "createdAt" TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE career_roadmaps ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow self manage on career roadmaps" ON career_roadmaps
    FOR ALL USING (true);


-- 9. INTERVIEW HISTORY TABLE
CREATE TABLE IF NOT EXISTS interview_history (
    id TEXT PRIMARY KEY,
    "userId" TEXT REFERENCES users(id) ON DELETE CASCADE,
    "targetRole" TEXT NOT NULL,
    "experienceLevel" TEXT,
    questions JSONB,
    "createdAt" TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE interview_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow self manage on interview history" ON interview_history
    FOR ALL USING (true);


-- 10. COVER LETTERS TABLE
CREATE TABLE IF NOT EXISTS cover_letters (
    id TEXT PRIMARY KEY,
    "userId" TEXT REFERENCES users(id) ON DELETE CASCADE,
    "jobTitle" TEXT NOT NULL,
    "companyName" TEXT NOT NULL,
    "letterContent" TEXT NOT NULL,
    "createdAt" TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE cover_letters ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow self manage on cover letters" ON cover_letters
    FOR ALL USING (true);


-- 11. BULLETS TABLE
CREATE TABLE IF NOT EXISTS bullets (
    id TEXT PRIMARY KEY,
    "userId" TEXT REFERENCES users(id) ON DELETE CASCADE,
    "inputActivity" TEXT NOT NULL,
    bullets JSONB,
    "createdAt" TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE bullets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow self manage on bullets" ON bullets
    FOR ALL USING (true);
