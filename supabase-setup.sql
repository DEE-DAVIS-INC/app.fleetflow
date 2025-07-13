-- FleetFlow Database Schema for Supabase
-- Run this in your Supabase SQL editor: https://supabase.com/dashboard/project/your-project/sql

-- Enable RLS (Row Level Security) by default
ALTER DEFAULT PRIVILEGES REVOKE EXECUTE ON FUNCTIONS FROM PUBLIC;
ALTER DEFAULT PRIVILEGES IN SCHEMA public REVOKE EXECUTE ON FUNCTIONS FROM anon, authenticated;

-- Create user_profiles table
CREATE TABLE user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'Viewer' CHECK (role IN ('Admin', 'Manager', 'Dispatcher', 'Driver', 'Viewer')),
    permissions TEXT[] DEFAULT ARRAY['dashboard.view', 'loads.view'],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create notifications table
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    message TEXT NOT NULL,
    type TEXT NOT NULL DEFAULT 'info',
    read BOOLEAN DEFAULT FALSE,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    link TEXT
);

-- Create loads table
CREATE TABLE loads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    load_number TEXT UNIQUE NOT NULL,
    shipper_id UUID,
    origin TEXT NOT NULL,
    destination TEXT NOT NULL,
    pickup_date DATE,
    delivery_date DATE,
    weight DECIMAL,
    rate DECIMAL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'assigned', 'picked_up', 'in_transit', 'delivered', 'cancelled')),
    driver_id UUID,
    carrier_id UUID,
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create shippers table
CREATE TABLE shippers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_name TEXT NOT NULL,
    contact_name TEXT,
    email TEXT,
    phone TEXT,
    address TEXT,
    city TEXT,
    state TEXT,
    zip_code TEXT,
    performance_score INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create carriers table
CREATE TABLE carriers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_name TEXT NOT NULL,
    contact_name TEXT,
    email TEXT,
    phone TEXT,
    mc_number TEXT,
    dot_number TEXT,
    insurance_expiry DATE,
    performance_score INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create drivers table
CREATE TABLE drivers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    phone TEXT,
    license_number TEXT,
    license_expiry DATE,
    status TEXT DEFAULT 'available' CHECK (status IN ('available', 'busy', 'offline')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create vehicles table
CREATE TABLE vehicles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    vehicle_number TEXT NOT NULL,
    make TEXT,
    model TEXT,
    year INTEGER,
    vin TEXT,
    license_plate TEXT,
    status TEXT DEFAULT 'available' CHECK (status IN ('available', 'in_use', 'maintenance', 'offline')),
    driver_id UUID REFERENCES drivers(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create sticky_notes table
CREATE TABLE sticky_notes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    content TEXT,
    color TEXT DEFAULT '#fbbf24',
    position_x INTEGER DEFAULT 100,
    position_y INTEGER DEFAULT 100,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE loads ENABLE ROW LEVEL SECURITY;
ALTER TABLE shippers ENABLE ROW LEVEL SECURITY;
ALTER TABLE carriers ENABLE ROW LEVEL SECURITY;
ALTER TABLE drivers ENABLE ROW LEVEL SECURITY;
ALTER TABLE vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE sticky_notes ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for user_profiles
CREATE POLICY "Users can view their own profile" ON user_profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON user_profiles
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON user_profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

-- Create RLS policies for notifications
CREATE POLICY "Users can view their own notifications" ON notifications
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own notifications" ON notifications
    FOR UPDATE USING (auth.uid() = user_id);

-- Create RLS policies for loads (Allow all authenticated users to view/modify)
CREATE POLICY "Authenticated users can view loads" ON loads
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can insert loads" ON loads
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update loads" ON loads
    FOR UPDATE USING (auth.role() = 'authenticated');

-- Create RLS policies for shippers (Allow all authenticated users)
CREATE POLICY "Authenticated users can view shippers" ON shippers
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can insert shippers" ON shippers
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update shippers" ON shippers
    FOR UPDATE USING (auth.role() = 'authenticated');

-- Create RLS policies for carriers (Allow all authenticated users)
CREATE POLICY "Authenticated users can view carriers" ON carriers
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can insert carriers" ON carriers
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update carriers" ON carriers
    FOR UPDATE USING (auth.role() = 'authenticated');

-- Create RLS policies for drivers (Allow all authenticated users)
CREATE POLICY "Authenticated users can view drivers" ON drivers
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can insert drivers" ON drivers
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update drivers" ON drivers
    FOR UPDATE USING (auth.role() = 'authenticated');

-- Create RLS policies for vehicles (Allow all authenticated users)
CREATE POLICY "Authenticated users can view vehicles" ON vehicles
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can insert vehicles" ON vehicles
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update vehicles" ON vehicles
    FOR UPDATE USING (auth.role() = 'authenticated');

-- Create RLS policies for sticky_notes
CREATE POLICY "Users can view their own sticky notes" ON sticky_notes
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own sticky notes" ON sticky_notes
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own sticky notes" ON sticky_notes
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own sticky notes" ON sticky_notes
    FOR DELETE USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_timestamp ON notifications(timestamp);
CREATE INDEX idx_loads_status ON loads(status);
CREATE INDEX idx_loads_pickup_date ON loads(pickup_date);
CREATE INDEX idx_drivers_status ON drivers(status);
CREATE INDEX idx_vehicles_status ON vehicles(status);

-- Create a function to automatically create user profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.user_profiles (id, name, email, role)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'full_name', 'Fleet User'),
        NEW.email,
        'Viewer'
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to automatically create user profile
CREATE OR REPLACE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create a function to update timestamps
CREATE OR REPLACE FUNCTION public.update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updating timestamps
CREATE TRIGGER update_user_profiles_timestamp
    BEFORE UPDATE ON user_profiles
    FOR EACH ROW EXECUTE FUNCTION public.update_timestamp();

CREATE TRIGGER update_loads_timestamp
    BEFORE UPDATE ON loads
    FOR EACH ROW EXECUTE FUNCTION public.update_timestamp();

CREATE TRIGGER update_shippers_timestamp
    BEFORE UPDATE ON shippers
    FOR EACH ROW EXECUTE FUNCTION public.update_timestamp();

CREATE TRIGGER update_carriers_timestamp
    BEFORE UPDATE ON carriers
    FOR EACH ROW EXECUTE FUNCTION public.update_timestamp();

CREATE TRIGGER update_drivers_timestamp
    BEFORE UPDATE ON drivers
    FOR EACH ROW EXECUTE FUNCTION public.update_timestamp();

CREATE TRIGGER update_vehicles_timestamp
    BEFORE UPDATE ON vehicles
    FOR EACH ROW EXECUTE FUNCTION public.update_timestamp();

CREATE TRIGGER update_sticky_notes_timestamp
    BEFORE UPDATE ON sticky_notes
    FOR EACH ROW EXECUTE FUNCTION public.update_timestamp();

-- Insert sample data (optional)
INSERT INTO shippers (company_name, contact_name, email, phone, address, city, state, zip_code) VALUES
    ('ABC Manufacturing', 'John Smith', 'john@abcmfg.com', '555-0101', '123 Industrial Way', 'Detroit', 'MI', '48201'),
    ('XYZ Logistics', 'Sarah Johnson', 'sarah@xyzlogistics.com', '555-0102', '456 Commerce St', 'Chicago', 'IL', '60601'),
    ('Global Shipping Co', 'Mike Wilson', 'mike@globalship.com', '555-0103', '789 Harbor Blvd', 'Los Angeles', 'CA', '90001');

INSERT INTO carriers (company_name, contact_name, email, phone, mc_number, dot_number) VALUES
    ('FastTrack Transport', 'David Brown', 'david@fasttrack.com', '555-0201', 'MC-123456', 'DOT-7890123'),
    ('Reliable Freight', 'Lisa Davis', 'lisa@reliable.com', '555-0202', 'MC-234567', 'DOT-8901234'),
    ('Express Delivery', 'Tom Anderson', 'tom@express.com', '555-0203', 'MC-345678', 'DOT-9012345');

-- Grant permissions to authenticated users
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;