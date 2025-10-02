-- Location: supabase/migrations/20250101105404_trading_portfolio_management.sql
-- Schema Analysis: Fresh project - no existing schema detected
-- Integration Type: Complete new trading portfolio management system
-- Dependencies: Creating all tables from scratch with authentication

-- 1. Extensions & Custom Types
CREATE TYPE public.user_role AS ENUM ('admin', 'manager', 'trader', 'viewer');
CREATE TYPE public.asset_class AS ENUM ('crypto', 'stocks', 'etf', 'forex', 'commodities', 'bonds');
CREATE TYPE public.transaction_type AS ENUM ('buy', 'sell', 'deposit', 'withdrawal', 'dividend', 'split', 'transfer');
CREATE TYPE public.order_status AS ENUM ('pending', 'filled', 'partially_filled', 'cancelled', 'rejected');
CREATE TYPE public.order_type AS ENUM ('market', 'limit', 'stop_loss', 'take_profit');
CREATE TYPE public.portfolio_status AS ENUM ('active', 'inactive', 'archived');

-- 2. Core User Table (Critical intermediary table)
CREATE TABLE public.user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id),
    email TEXT NOT NULL UNIQUE,
    full_name TEXT NOT NULL,
    role public.user_role DEFAULT 'trader'::public.user_role,
    avatar_url TEXT,
    is_active BOOLEAN DEFAULT true,
    preferences JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 3. Portfolio Management Tables
CREATE TABLE public.portfolios (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    status public.portfolio_status DEFAULT 'active'::public.portfolio_status,
    base_currency TEXT DEFAULT 'USD',
    initial_balance DECIMAL(20,8) DEFAULT 0,
    current_balance DECIMAL(20,8) DEFAULT 0,
    total_invested DECIMAL(20,8) DEFAULT 0,
    total_return DECIMAL(20,8) DEFAULT 0,
    return_percentage DECIMAL(10,4) DEFAULT 0,
    risk_level INTEGER DEFAULT 5 CHECK (risk_level >= 1 AND risk_level <= 10),
    is_default BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 4. Asset Management
CREATE TABLE public.assets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    symbol TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    asset_class public.asset_class NOT NULL,
    exchange TEXT,
    logo_url TEXT,
    description TEXT,
    is_active BOOLEAN DEFAULT true,
    market_data JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 5. Portfolio Holdings
CREATE TABLE public.holdings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    portfolio_id UUID REFERENCES public.portfolios(id) ON DELETE CASCADE,
    asset_id UUID REFERENCES public.assets(id) ON DELETE CASCADE,
    quantity DECIMAL(20,8) NOT NULL DEFAULT 0,
    average_cost DECIMAL(20,8) NOT NULL DEFAULT 0,
    current_price DECIMAL(20,8) DEFAULT 0,
    market_value DECIMAL(20,8) DEFAULT 0,
    unrealized_pnl DECIMAL(20,8) DEFAULT 0,
    unrealized_pnl_percentage DECIMAL(10,4) DEFAULT 0,
    cost_basis DECIMAL(20,8) DEFAULT 0,
    allocation_percentage DECIMAL(10,4) DEFAULT 0,
    last_updated TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(portfolio_id, asset_id)
);

-- 6. Trading Transactions
CREATE TABLE public.transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    portfolio_id UUID REFERENCES public.portfolios(id) ON DELETE CASCADE,
    asset_id UUID REFERENCES public.assets(id) ON DELETE CASCADE,
    transaction_type public.transaction_type NOT NULL,
    quantity DECIMAL(20,8) NOT NULL,
    price DECIMAL(20,8) NOT NULL,
    total_amount DECIMAL(20,8) NOT NULL,
    fees DECIMAL(20,8) DEFAULT 0,
    notes TEXT,
    executed_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 7. Trading Orders
CREATE TABLE public.orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    portfolio_id UUID REFERENCES public.portfolios(id) ON DELETE CASCADE,
    asset_id UUID REFERENCES public.assets(id) ON DELETE CASCADE,
    order_type public.order_type NOT NULL,
    transaction_type public.transaction_type NOT NULL,
    quantity DECIMAL(20,8) NOT NULL,
    price DECIMAL(20,8),
    stop_price DECIMAL(20,8),
    status public.order_status DEFAULT 'pending'::public.order_status,
    filled_quantity DECIMAL(20,8) DEFAULT 0,
    average_fill_price DECIMAL(20,8) DEFAULT 0,
    expires_at TIMESTAMPTZ,
    executed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 8. Portfolio Performance History
CREATE TABLE public.portfolio_performance (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    portfolio_id UUID REFERENCES public.portfolios(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    total_value DECIMAL(20,8) NOT NULL,
    daily_return DECIMAL(20,8) DEFAULT 0,
    daily_return_percentage DECIMAL(10,4) DEFAULT 0,
    benchmark_return DECIMAL(10,4) DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(portfolio_id, date)
);

-- 9. Essential Indexes
CREATE INDEX idx_user_profiles_email ON public.user_profiles(email);
CREATE INDEX idx_user_profiles_role ON public.user_profiles(role);
CREATE INDEX idx_portfolios_user_id ON public.portfolios(user_id);
CREATE INDEX idx_portfolios_status ON public.portfolios(status);
CREATE INDEX idx_assets_symbol ON public.assets(symbol);
CREATE INDEX idx_assets_asset_class ON public.assets(asset_class);
CREATE INDEX idx_holdings_portfolio_id ON public.holdings(portfolio_id);
CREATE INDEX idx_holdings_asset_id ON public.holdings(asset_id);
CREATE INDEX idx_transactions_portfolio_id ON public.transactions(portfolio_id);
CREATE INDEX idx_transactions_asset_id ON public.transactions(asset_id);
CREATE INDEX idx_transactions_executed_at ON public.transactions(executed_at);
CREATE INDEX idx_orders_portfolio_id ON public.orders(portfolio_id);
CREATE INDEX idx_orders_status ON public.orders(status);
CREATE INDEX idx_portfolio_performance_portfolio_id ON public.portfolio_performance(portfolio_id);
CREATE INDEX idx_portfolio_performance_date ON public.portfolio_performance(date);

-- 10. Enable RLS
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.holdings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolio_performance ENABLE ROW LEVEL SECURITY;

-- 11. RLS Policies (Following the 7-pattern system)

-- Pattern 1: Core user table (user_profiles) - Simple only, no functions
CREATE POLICY "users_manage_own_user_profiles"
ON public.user_profiles
FOR ALL
TO authenticated
USING (id = auth.uid())
WITH CHECK (id = auth.uid());

-- Pattern 2: Simple user ownership for portfolios
CREATE POLICY "users_manage_own_portfolios"
ON public.portfolios
FOR ALL
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- Pattern 4: Public read, private write for assets (market data)
CREATE POLICY "public_can_read_assets"
ON public.assets
FOR SELECT
TO public
USING (true);

CREATE POLICY "admins_manage_assets"
ON public.assets
FOR ALL
TO authenticated
USING (EXISTS (
    SELECT 1 FROM public.user_profiles up
    WHERE up.id = auth.uid() AND up.role = 'admin'
))
WITH CHECK (EXISTS (
    SELECT 1 FROM public.user_profiles up
    WHERE up.id = auth.uid() AND up.role = 'admin'
));

-- Pattern 7: Complex relationship for portfolio-related tables
CREATE OR REPLACE FUNCTION public.can_access_portfolio_data(target_portfolio_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
SELECT EXISTS (
    SELECT 1 FROM public.portfolios p
    WHERE p.id = target_portfolio_id AND p.user_id = auth.uid()
)
$$;

-- Apply portfolio access pattern to holdings
CREATE POLICY "users_access_portfolio_holdings"
ON public.holdings
FOR ALL
TO authenticated
USING (public.can_access_portfolio_data(portfolio_id))
WITH CHECK (public.can_access_portfolio_data(portfolio_id));

-- Apply to transactions
CREATE POLICY "users_access_portfolio_transactions"
ON public.transactions
FOR ALL
TO authenticated
USING (public.can_access_portfolio_data(portfolio_id))
WITH CHECK (public.can_access_portfolio_data(portfolio_id));

-- Apply to orders
CREATE POLICY "users_access_portfolio_orders"
ON public.orders
FOR ALL
TO authenticated
USING (public.can_access_portfolio_data(portfolio_id))
WITH CHECK (public.can_access_portfolio_data(portfolio_id));

-- Apply to performance
CREATE POLICY "users_access_portfolio_performance"
ON public.portfolio_performance
FOR ALL
TO authenticated
USING (public.can_access_portfolio_data(portfolio_id))
WITH CHECK (public.can_access_portfolio_data(portfolio_id));

-- 12. Functions for automatic profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
SECURITY DEFINER
LANGUAGE plpgsql
AS $$
BEGIN
  INSERT INTO public.user_profiles (id, email, full_name, role)
  VALUES (
    NEW.id, 
    NEW.email, 
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'role', 'trader')::public.user_role
  );
  RETURN NEW;
END;
$$;

-- Trigger for new user creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 13. Update functions
CREATE OR REPLACE FUNCTION public.update_portfolio_totals()
RETURNS TRIGGER
SECURITY DEFINER
LANGUAGE plpgsql
AS $$
BEGIN
    -- Update portfolio totals when holdings change
    UPDATE public.portfolios 
    SET 
        current_balance = (
            SELECT COALESCE(SUM(market_value), 0) 
            FROM public.holdings 
            WHERE portfolio_id = COALESCE(NEW.portfolio_id, OLD.portfolio_id)
        ),
        total_return = (
            SELECT COALESCE(SUM(unrealized_pnl), 0) 
            FROM public.holdings 
            WHERE portfolio_id = COALESCE(NEW.portfolio_id, OLD.portfolio_id)
        ),
        updated_at = CURRENT_TIMESTAMP
    WHERE id = COALESCE(NEW.portfolio_id, OLD.portfolio_id);
    
    RETURN COALESCE(NEW, OLD);
END;
$$;

CREATE TRIGGER update_portfolio_totals_trigger
    AFTER INSERT OR UPDATE OR DELETE ON public.holdings
    FOR EACH ROW EXECUTE FUNCTION public.update_portfolio_totals();

-- 14. Complete Mock Data with Authentication
DO $$
DECLARE
    admin_uuid UUID := gen_random_uuid();
    trader_uuid UUID := gen_random_uuid();
    portfolio1_uuid UUID := gen_random_uuid();
    portfolio2_uuid UUID := gen_random_uuid();
    btc_uuid UUID := gen_random_uuid();
    eth_uuid UUID := gen_random_uuid();
    aapl_uuid UUID := gen_random_uuid();
    tsla_uuid UUID := gen_random_uuid();
    spy_uuid UUID := gen_random_uuid();
    ada_uuid UUID := gen_random_uuid();
BEGIN
    -- Create auth users with required fields (for testing)
    INSERT INTO auth.users (
        id, instance_id, aud, role, email, encrypted_password, email_confirmed_at,
        created_at, updated_at, raw_user_meta_data, raw_app_meta_data,
        is_sso_user, is_anonymous, confirmation_token, confirmation_sent_at,
        recovery_token, recovery_sent_at, email_change_token_new, email_change,
        email_change_sent_at, email_change_token_current, email_change_confirm_status,
        reauthentication_token, reauthentication_sent_at, phone, phone_change,
        phone_change_token, phone_change_sent_at
    ) VALUES
        (admin_uuid, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
         'admin@tradingpro.com', crypt('admin123', gen_salt('bf', 10)), now(), now(), now(),
         '{"full_name": "Trading Admin", "role": "admin"}'::jsonb, '{"provider": "email", "providers": ["email"]}'::jsonb,
         false, false, '', null, '', null, '', '', null, '', 0, '', null, null, '', '', null),
        (trader_uuid, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
         'trader@tradingpro.com', crypt('trader123', gen_salt('bf', 10)), now(), now(), now(),
         '{"full_name": "Pro Trader", "role": "trader"}'::jsonb, '{"provider": "email", "providers": ["email"]}'::jsonb,
         false, false, '', null, '', null, '', '', null, '', 0, '', null, null, '', '', null);

    -- Create portfolios
    INSERT INTO public.portfolios (id, user_id, name, description, initial_balance, current_balance, is_default) VALUES
        (portfolio1_uuid, admin_uuid, 'Main Portfolio', 'Primary trading portfolio with crypto and stocks', 100000.00, 125847.32, true),
        (portfolio2_uuid, trader_uuid, 'Growth Portfolio', 'High-risk growth focused portfolio', 50000.00, 67234.89, true);

    -- Create assets
    INSERT INTO public.assets (id, symbol, name, asset_class, exchange, logo_url) VALUES
        (btc_uuid, 'BTC', 'Bitcoin', 'crypto'::public.asset_class, 'Binance', 'https://cryptologos.cc/logos/bitcoin-btc-logo.png'),
        (eth_uuid, 'ETH', 'Ethereum', 'crypto'::public.asset_class, 'Binance', 'https://cryptologos.cc/logos/ethereum-eth-logo.png'),
        (aapl_uuid, 'AAPL', 'Apple Inc.', 'stocks'::public.asset_class, 'NASDAQ', 'https://logo.clearbit.com/apple.com'),
        (tsla_uuid, 'TSLA', 'Tesla, Inc.', 'stocks'::public.asset_class, 'NASDAQ', 'https://logo.clearbit.com/tesla.com'),
        (spy_uuid, 'SPY', 'SPDR S&P 500 ETF', 'etf'::public.asset_class, 'NYSE', 'https://logo.clearbit.com/spdrs.com'),
        (ada_uuid, 'ADA', 'Cardano', 'crypto'::public.asset_class, 'Binance', 'https://cryptologos.cc/logos/cardano-ada-logo.png');

    -- Create holdings for portfolio 1 (admin user)
    INSERT INTO public.holdings (portfolio_id, asset_id, quantity, average_cost, current_price, market_value, unrealized_pnl) VALUES
        (portfolio1_uuid, btc_uuid, 1.31, 41800.50, 43250.67, 56658.38, 1896.23),
        (portfolio1_uuid, eth_uuid, 11.75, 2450.30, 2678.45, 31471.79, -391.45),
        (portfolio1_uuid, aapl_uuid, 85, 165.20, 175.23, 14894.55, 313.78),
        (portfolio1_uuid, tsla_uuid, 42, 220.45, 245.67, 10318.14, 418.92),
        (portfolio1_uuid, spy_uuid, 23, 410.50, 428.91, 9864.93, 181.23),
        (portfolio1_uuid, ada_uuid, 9125, 0.35, 0.456, 4161.00, 264.12);

    -- Create transactions for portfolio 1
    INSERT INTO public.transactions (portfolio_id, asset_id, transaction_type, quantity, price, total_amount, fees, executed_at) VALUES
        (portfolio1_uuid, btc_uuid, 'buy'::public.transaction_type, 1.31, 41800.50, 54758.66, 58.66, now() - interval '30 days'),
        (portfolio1_uuid, eth_uuid, 'buy'::public.transaction_type, 11.75, 2450.30, 28791.03, 91.03, now() - interval '25 days'),
        (portfolio1_uuid, aapl_uuid, 'buy'::public.transaction_type, 85, 165.20, 14042.00, 42.00, now() - interval '20 days'),
        (portfolio1_uuid, tsla_uuid, 'buy'::public.transaction_type, 42, 220.45, 9258.90, 58.90, now() - interval '15 days'),
        (portfolio1_uuid, spy_uuid, 'buy'::public.transaction_type, 23, 410.50, 9441.50, 41.50, now() - interval '10 days'),
        (portfolio1_uuid, ada_uuid, 'buy'::public.transaction_type, 9125, 0.35, 3193.75, 43.75, now() - interval '5 days');

    -- Create performance history
    INSERT INTO public.portfolio_performance (portfolio_id, date, total_value, daily_return, daily_return_percentage) VALUES
        (portfolio1_uuid, CURRENT_DATE - 30, 100000.00, 0, 0),
        (portfolio1_uuid, CURRENT_DATE - 29, 98234.50, -1765.50, -1.77),
        (portfolio1_uuid, CURRENT_DATE - 28, 101456.80, 3222.30, 3.28),
        (portfolio1_uuid, CURRENT_DATE - 27, 103567.20, 2110.40, 2.08),
        (portfolio1_uuid, CURRENT_DATE - 26, 107234.60, 3667.40, 3.54),
        (portfolio1_uuid, CURRENT_DATE - 25, 109456.90, 2222.30, 2.07),
        (portfolio1_uuid, CURRENT_DATE - 24, 111567.80, 2110.90, 1.93),
        (portfolio1_uuid, CURRENT_DATE - 23, 115234.70, 3666.90, 3.29),
        (portfolio1_uuid, CURRENT_DATE - 22, 118234.50, 2999.80, 2.60),
        (portfolio1_uuid, CURRENT_DATE - 21, 121456.90, 3222.40, 2.73),
        (portfolio1_uuid, CURRENT_DATE - 20, 123678.20, 2221.30, 1.83),
        (portfolio1_uuid, CURRENT_DATE - 19, 122234.80, -1443.40, -1.17),
        (portfolio1_uuid, CURRENT_DATE - 18, 119876.50, -2358.30, -1.93),
        (portfolio1_uuid, CURRENT_DATE - 17, 121456.80, 1580.30, 1.32),
        (portfolio1_uuid, CURRENT_DATE - 16, 123789.40, 2332.60, 1.92),
        (portfolio1_uuid, CURRENT_DATE - 15, 125234.70, 1445.30, 1.17),
        (portfolio1_uuid, CURRENT_DATE - 14, 127456.90, 2222.20, 1.77),
        (portfolio1_uuid, CURRENT_DATE - 13, 124567.80, -2889.10, -2.27),
        (portfolio1_uuid, CURRENT_DATE - 12, 122345.60, -2222.20, -1.78),
        (portfolio1_uuid, CURRENT_DATE - 11, 123789.40, 1443.80, 1.18),
        (portfolio1_uuid, CURRENT_DATE - 10, 125678.90, 1889.50, 1.53),
        (portfolio1_uuid, CURRENT_DATE - 9, 127234.60, 1555.70, 1.24),
        (portfolio1_uuid, CURRENT_DATE - 8, 129456.80, 2222.20, 1.75),
        (portfolio1_uuid, CURRENT_DATE - 7, 128234.50, -1222.30, -0.94),
        (portfolio1_uuid, CURRENT_DATE - 6, 126789.40, -1445.10, -1.13),
        (portfolio1_uuid, CURRENT_DATE - 5, 125456.70, -1332.70, -1.05),
        (portfolio1_uuid, CURRENT_DATE - 4, 126234.80, 778.10, 0.62),
        (portfolio1_uuid, CURRENT_DATE - 3, 127456.90, 1222.10, 0.97),
        (portfolio1_uuid, CURRENT_DATE - 2, 126789.60, -667.30, -0.52),
        (portfolio1_uuid, CURRENT_DATE - 1, 125234.80, -1554.80, -1.23),
        (portfolio1_uuid, CURRENT_DATE, 125847.32, 612.52, 0.49);

END $$;

-- 15. Cleanup function for development
CREATE OR REPLACE FUNCTION public.cleanup_trading_test_data()
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    auth_user_ids_to_delete UUID[];
BEGIN
    -- Get auth user IDs first
    SELECT ARRAY_AGG(id) INTO auth_user_ids_to_delete
    FROM auth.users
    WHERE email LIKE '%@tradingpro.com';

    -- Delete in dependency order (children first)
    DELETE FROM public.portfolio_performance WHERE portfolio_id IN (
        SELECT id FROM public.portfolios WHERE user_id = ANY(auth_user_ids_to_delete)
    );
    DELETE FROM public.orders WHERE portfolio_id IN (
        SELECT id FROM public.portfolios WHERE user_id = ANY(auth_user_ids_to_delete)
    );
    DELETE FROM public.transactions WHERE portfolio_id IN (
        SELECT id FROM public.portfolios WHERE user_id = ANY(auth_user_ids_to_delete)
    );
    DELETE FROM public.holdings WHERE portfolio_id IN (
        SELECT id FROM public.portfolios WHERE user_id = ANY(auth_user_ids_to_delete)
    );
    DELETE FROM public.portfolios WHERE user_id = ANY(auth_user_ids_to_delete);
    DELETE FROM public.user_profiles WHERE id = ANY(auth_user_ids_to_delete);

    -- Delete auth.users last (after all references are removed)
    DELETE FROM auth.users WHERE id = ANY(auth_user_ids_to_delete);
EXCEPTION
    WHEN foreign_key_violation THEN
        RAISE NOTICE 'Foreign key constraint prevents deletion: %', SQLERRM;
    WHEN OTHERS THEN
        RAISE NOTICE 'Cleanup failed: %', SQLERRM;
END;
$$;