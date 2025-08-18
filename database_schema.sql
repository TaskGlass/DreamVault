-- DreamVault Database Schema
-- Complete Stripe integration with usage-based billing

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Profiles table (users)
CREATE TABLE IF NOT EXISTS profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email TEXT UNIQUE,
    first_name TEXT,
    last_name TEXT,
    name TEXT, -- Keep for backward compatibility
    birthday DATE,
    zodiac TEXT,
    bio TEXT,
    notifications BOOLEAN DEFAULT true,
    dream_reminders BOOLEAN DEFAULT true,
    weekly_reports BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Subscriptions table (Stripe integration)
CREATE TABLE IF NOT EXISTS subscriptions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    plan TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'active',
    billing_cycle TEXT DEFAULT 'monthly',
    stripe_customer_id TEXT,
    stripe_subscription_id TEXT,
    current_period_start TIMESTAMP WITH TIME ZONE,
    current_period_end TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Usage tracking table (monthly usage per user)
CREATE TABLE IF NOT EXISTS usage_monthly (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    period_start DATE NOT NULL,
    period_end DATE NOT NULL,
    dream_interpretation_used INTEGER DEFAULT 0,
    daily_horoscope_used INTEGER DEFAULT 0,
    affirmation_used INTEGER DEFAULT 0,
    moon_phase_used INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Dreams table
CREATE TABLE IF NOT EXISTS dreams (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    date DATE NOT NULL,
    mood TEXT,
    symbols TEXT[],
    lucidity BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Daily horoscopes cache table
CREATE TABLE IF NOT EXISTS daily_horoscopes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    zodiac_sign TEXT NOT NULL,
    date DATE NOT NULL,
    content TEXT NOT NULL,
    lucky_element TEXT,
    dream_focus TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create unique indexes
CREATE UNIQUE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);
CREATE UNIQUE INDEX IF NOT EXISTS idx_subscriptions_user_id ON subscriptions(user_id);
CREATE UNIQUE INDEX IF NOT EXISTS idx_usage_monthly_user_period ON usage_monthly(user_id, period_start);
CREATE UNIQUE INDEX IF NOT EXISTS idx_daily_horoscopes_zodiac_date ON daily_horoscopes(zodiac_sign, date);

-- Create performance indexes
CREATE INDEX IF NOT EXISTS idx_dreams_user_id ON dreams(user_id);
CREATE INDEX IF NOT EXISTS idx_dreams_date ON dreams(date);
CREATE INDEX IF NOT EXISTS idx_usage_monthly_user_id ON usage_monthly(user_id);
CREATE INDEX IF NOT EXISTS idx_usage_monthly_period ON usage_monthly(period_start);
CREATE INDEX IF NOT EXISTS idx_daily_horoscopes_date ON daily_horoscopes(date);
CREATE INDEX IF NOT EXISTS idx_daily_horoscopes_zodiac ON daily_horoscopes(zodiac_sign);

-- Updated timestamp trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_subscriptions_updated_at
    BEFORE UPDATE ON subscriptions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_usage_monthly_updated_at
    BEFORE UPDATE ON usage_monthly
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_dreams_updated_at
    BEFORE UPDATE ON dreams
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_daily_horoscopes_updated_at
    BEFORE UPDATE ON daily_horoscopes
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) policies
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE usage_monthly ENABLE ROW LEVEL SECURITY;
ALTER TABLE dreams ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_horoscopes ENABLE ROW LEVEL SECURITY;

-- Profiles RLS policies
CREATE POLICY "Users can view own profile" ON profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

-- Subscriptions RLS policies
CREATE POLICY "Users can view own subscription" ON subscriptions
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own subscription" ON subscriptions
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own subscription" ON subscriptions
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Usage monthly RLS policies
CREATE POLICY "Users can view own usage" ON usage_monthly
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own usage" ON usage_monthly
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own usage" ON usage_monthly
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Dreams RLS policies
CREATE POLICY "Users can view own dreams" ON dreams
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own dreams" ON dreams
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own dreams" ON dreams
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own dreams" ON dreams
    FOR DELETE USING (auth.uid() = user_id);

-- Daily horoscopes RLS policies (read-only for all authenticated users)
CREATE POLICY "Authenticated users can view horoscopes" ON daily_horoscopes
    FOR SELECT USING (auth.role() = 'authenticated');

-- Cleanup functions
CREATE OR REPLACE FUNCTION cleanup_old_horoscopes()
RETURNS void AS $$
BEGIN
    DELETE FROM daily_horoscopes 
    WHERE date < CURRENT_DATE - INTERVAL '30 days';
END;
$$ LANGUAGE 'plpgsql';

CREATE OR REPLACE FUNCTION cleanup_old_usage()
RETURNS void AS $$
BEGIN
    DELETE FROM usage_monthly 
    WHERE period_start < CURRENT_DATE - INTERVAL '6 months';
END;
$$ LANGUAGE 'plpgsql';

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;
