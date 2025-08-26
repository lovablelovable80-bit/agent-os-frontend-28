-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create custom types
CREATE TYPE public.user_role AS ENUM ('super_admin', 'admin', 'manager', 'technician', 'user');
CREATE TYPE public.service_status AS ENUM ('pending', 'in_progress', 'waiting_parts', 'completed', 'cancelled', 'quote');
CREATE TYPE public.service_priority AS ENUM ('low', 'medium', 'high', 'urgent');
CREATE TYPE public.device_category AS ENUM ('smartphone', 'laptop', 'tablet', 'watch', 'headphone', 'desktop', 'gaming', 'other');
CREATE TYPE public.payment_status AS ENUM ('pending', 'paid', 'partial', 'cancelled', 'refunded');

-- Companies/Organizations table (multitenancy root)
CREATE TABLE public.companies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    document TEXT UNIQUE, -- CNPJ/CPF
    email TEXT,
    phone TEXT,
    address JSONB,
    settings JSONB DEFAULT '{}',
    subscription_plan TEXT DEFAULT 'basic',
    subscription_status TEXT DEFAULT 'active',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- User profiles with company association
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    full_name TEXT,
    avatar_url TEXT,
    phone TEXT,
    role user_role DEFAULT 'user',
    is_active BOOLEAN DEFAULT true,
    last_login TIMESTAMPTZ,
    preferences JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Customers table
CREATE TABLE public.customers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    document TEXT, -- CPF/CNPJ
    address JSONB,
    notes TEXT,
    created_by UUID REFERENCES public.profiles(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Service orders table
CREATE TABLE public.service_orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
    customer_id UUID NOT NULL REFERENCES public.customers(id) ON DELETE CASCADE,
    order_number TEXT NOT NULL,
    device_info JSONB NOT NULL, -- {brand, model, category, serial_number, etc}
    problem_description TEXT NOT NULL,
    detailed_description TEXT,
    status service_status DEFAULT 'pending',
    priority service_priority DEFAULT 'medium',
    assigned_technician_id UUID REFERENCES public.profiles(id),
    estimated_cost DECIMAL(10,2),
    final_cost DECIMAL(10,2),
    labor_cost DECIMAL(10,2),
    parts_cost DECIMAL(10,2),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    due_date DATE,
    completion_date TIMESTAMPTZ,
    warranty_expires DATE,
    notes TEXT,
    internal_notes TEXT,
    created_by UUID REFERENCES public.profiles(id),
    UNIQUE(company_id, order_number)
);

-- Service order items/parts
CREATE TABLE public.service_order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
    service_order_id UUID NOT NULL REFERENCES public.service_orders(id) ON DELETE CASCADE,
    item_type TEXT NOT NULL, -- 'part', 'service', 'labor'
    description TEXT NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 1,
    unit_price DECIMAL(10,2) NOT NULL,
    total_price DECIMAL(10,2) GENERATED ALWAYS AS (quantity * unit_price) STORED,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Products/Parts inventory
CREATE TABLE public.products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
    sku TEXT NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    category TEXT,
    brand TEXT,
    model TEXT,
    cost_price DECIMAL(10,2),
    sale_price DECIMAL(10,2),
    stock_quantity INTEGER DEFAULT 0,
    min_stock INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    supplier_info JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(company_id, sku)
);

-- Stock movements
CREATE TABLE public.stock_movements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    movement_type TEXT NOT NULL, -- 'in', 'out', 'adjustment'
    quantity INTEGER NOT NULL,
    reference_type TEXT, -- 'service_order', 'purchase', 'sale', 'adjustment'
    reference_id UUID,
    notes TEXT,
    created_by UUID REFERENCES public.profiles(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Invoices
CREATE TABLE public.invoices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
    customer_id UUID NOT NULL REFERENCES public.customers(id) ON DELETE CASCADE,
    service_order_id UUID REFERENCES public.service_orders(id),
    invoice_number TEXT NOT NULL,
    status payment_status DEFAULT 'pending',
    subtotal DECIMAL(10,2) NOT NULL,
    tax_amount DECIMAL(10,2) DEFAULT 0,
    discount_amount DECIMAL(10,2) DEFAULT 0,
    total_amount DECIMAL(10,2) NOT NULL,
    payment_method TEXT,
    payment_date TIMESTAMPTZ,
    due_date DATE,
    notes TEXT,
    created_by UUID REFERENCES public.profiles(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(company_id, invoice_number)
);

-- AI Assistant configurations
CREATE TABLE public.ai_assistants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
    nome_assistente TEXT NOT NULL,
    prompt_sistema TEXT NOT NULL,
    temperatura DECIMAL(3,2) DEFAULT 0.7,
    max_tokens INTEGER DEFAULT 1000,
    ativo BOOLEAN DEFAULT true,
    usar_dados_empresa BOOLEAN DEFAULT false,
    tabelas_autorizadas TEXT[] DEFAULT '{}',
    conhecimento_personalizado TEXT,
    created_by UUID REFERENCES public.profiles(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- File uploads (photos, videos, documents)
CREATE TABLE public.file_uploads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
    reference_type TEXT NOT NULL, -- 'service_order', 'customer', 'product'
    reference_id UUID NOT NULL,
    file_name TEXT NOT NULL,
    file_path TEXT NOT NULL,
    file_size INTEGER NOT NULL,
    mime_type TEXT NOT NULL,
    file_type TEXT NOT NULL, -- 'photo', 'video', 'document'
    description TEXT,
    uploaded_by UUID REFERENCES public.profiles(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Activity logs
CREATE TABLE public.activity_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.profiles(id),
    action TEXT NOT NULL,
    resource_type TEXT NOT NULL,
    resource_id UUID,
    details JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on all tables
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stock_movements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_assistants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.file_uploads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;

-- Helper function to get user's company_id
CREATE OR REPLACE FUNCTION public.get_user_company_id()
RETURNS UUID AS $$
  SELECT company_id FROM public.profiles WHERE id = auth.uid();
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- Helper function to check if user has role
CREATE OR REPLACE FUNCTION public.user_has_role(_role user_role)
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = _role
  );
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- Helper function to check if user is admin or higher
CREATE OR REPLACE FUNCTION public.user_is_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role IN ('super_admin', 'admin')
  );
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- Companies policies
CREATE POLICY "Users can view their own company" ON public.companies
    FOR SELECT TO authenticated
    USING (id = public.get_user_company_id());

CREATE POLICY "Super admins can view all companies" ON public.companies
    FOR SELECT TO authenticated
    USING (public.user_has_role('super_admin'));

CREATE POLICY "Admins can update their company" ON public.companies
    FOR UPDATE TO authenticated
    USING (id = public.get_user_company_id() AND public.user_is_admin());

-- Profiles policies
CREATE POLICY "Users can view profiles in their company" ON public.profiles
    FOR SELECT TO authenticated
    USING (company_id = public.get_user_company_id());

CREATE POLICY "Users can update their own profile" ON public.profiles
    FOR UPDATE TO authenticated
    USING (id = auth.uid());

CREATE POLICY "Admins can manage profiles in their company" ON public.profiles
    FOR ALL TO authenticated
    USING (company_id = public.get_user_company_id() AND public.user_is_admin());

-- Generic company data policies for all business tables
CREATE POLICY "Users access company data" ON public.customers
    FOR ALL TO authenticated
    USING (company_id = public.get_user_company_id());

CREATE POLICY "Users access company data" ON public.service_orders
    FOR ALL TO authenticated
    USING (company_id = public.get_user_company_id());

CREATE POLICY "Users access company data" ON public.service_order_items
    FOR ALL TO authenticated
    USING (company_id = public.get_user_company_id());

CREATE POLICY "Users access company data" ON public.products
    FOR ALL TO authenticated
    USING (company_id = public.get_user_company_id());

CREATE POLICY "Users access company data" ON public.stock_movements
    FOR ALL TO authenticated
    USING (company_id = public.get_user_company_id());

CREATE POLICY "Users access company data" ON public.invoices
    FOR ALL TO authenticated
    USING (company_id = public.get_user_company_id());

CREATE POLICY "Users access company data" ON public.ai_assistants
    FOR ALL TO authenticated
    USING (company_id = public.get_user_company_id());

CREATE POLICY "Users access company data" ON public.file_uploads
    FOR ALL TO authenticated
    USING (company_id = public.get_user_company_id());

CREATE POLICY "Users access company data" ON public.activity_logs
    FOR ALL TO authenticated
    USING (company_id = public.get_user_company_id());

-- Trigger function for updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add updated_at triggers
CREATE TRIGGER update_companies_updated_at
    BEFORE UPDATE ON public.companies
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_customers_updated_at
    BEFORE UPDATE ON public.customers
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_service_orders_updated_at
    BEFORE UPDATE ON public.service_orders
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_products_updated_at
    BEFORE UPDATE ON public.products
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_invoices_updated_at
    BEFORE UPDATE ON public.invoices
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_ai_assistants_updated_at
    BEFORE UPDATE ON public.ai_assistants
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name, company_id, role)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data ->> 'full_name', NEW.email),
        -- For now, we'll need to set company_id manually after user creation
        NULL,
        'user'
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user creation
CREATE OR REPLACE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create storage buckets
INSERT INTO storage.buckets (id, name, public) VALUES 
    ('service-photos', 'service-photos', false),
    ('service-videos', 'service-videos', false),
    ('documents', 'documents', false),
    ('avatars', 'avatars', true);

-- Storage policies
CREATE POLICY "Users can upload files to their company" ON storage.objects
    FOR INSERT TO authenticated
    WITH CHECK (
        bucket_id IN ('service-photos', 'service-videos', 'documents', 'avatars') AND
        (storage.foldername(name))[1] = public.get_user_company_id()::text
    );

CREATE POLICY "Users can view files from their company" ON storage.objects
    FOR SELECT TO authenticated
    USING (
        bucket_id IN ('service-photos', 'service-videos', 'documents', 'avatars') AND
        (storage.foldername(name))[1] = public.get_user_company_id()::text
    );

CREATE POLICY "Users can update files from their company" ON storage.objects
    FOR UPDATE TO authenticated
    USING (
        bucket_id IN ('service-photos', 'service-videos', 'documents', 'avatars') AND
        (storage.foldername(name))[1] = public.get_user_company_id()::text
    );

CREATE POLICY "Users can delete files from their company" ON storage.objects
    FOR DELETE TO authenticated
    USING (
        bucket_id IN ('service-photos', 'service-videos', 'documents', 'avatars') AND
        (storage.foldername(name))[1] = public.get_user_company_id()::text
    );

-- Avatar storage is public for viewing
CREATE POLICY "Avatars are publicly viewable" ON storage.objects
    FOR SELECT TO anon
    USING (bucket_id = 'avatars');