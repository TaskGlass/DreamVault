-- Create daily_horoscopes table for caching daily horoscopes
CREATE TABLE daily_horoscopes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    zodiac_sign TEXT NOT NULL,
    date DATE NOT NULL,
    content TEXT NOT NULL,
    lucky_element TEXT,
    dream_focus TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create unique index to ensure only one horoscope per zodiac sign per day
CREATE UNIQUE INDEX idx_daily_horoscopes_zodiac_date ON daily_horoscopes(zodiac_sign, date);

-- Create indexes for better query performance
CREATE INDEX idx_daily_horoscopes_date ON daily_horoscopes(date);
CREATE INDEX idx_daily_horoscopes_zodiac ON daily_horoscopes(zodiac_sign);

-- Add updated_at trigger for automatic timestamp updates
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE 'plpgsql';

CREATE TRIGGER update_daily_horoscopes_updated_at
    BEFORE UPDATE ON daily_horoscopes
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Optional: Add cleanup function to remove old horoscopes (older than 30 days)
CREATE OR REPLACE FUNCTION cleanup_old_horoscopes()
RETURNS void AS $$
BEGIN
    DELETE FROM daily_horoscopes 
    WHERE date < CURRENT_DATE - INTERVAL '30 days';
END;
$$ LANGUAGE 'plpgsql';

-- You can run this periodically to clean up old horoscopes
-- SELECT cleanup_old_horoscopes(); 