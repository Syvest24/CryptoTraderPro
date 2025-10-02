import { supabase } from '../lib/supabase';

class TradingService {
  // Portfolio Management
  async getPortfolios(userId) {
    try {
      const { data, error } = await supabase?.from('portfolios')?.select(`
          *,
          holdings (
            id,
            quantity,
            average_cost,
            market_value,
            unrealized_pnl,
            asset:assets (
              symbol,
              name,
              asset_class,
              logo_url
            )
          )
        `)?.eq('user_id', userId)?.eq('status', 'active')?.order('created_at', { ascending: false })

      return { data, error }
    } catch (error) {
      return { error: { message: 'Network error. Please try again.' } }
    }
  }

  async getPortfolioById(portfolioId) {
    try {
      const { data, error } = await supabase?.from('portfolios')?.select(`
          *,
          holdings (
            *,
            asset:assets (*)
          )
        `)?.eq('id', portfolioId)?.single()

      return { data, error }
    } catch (error) {
      return { error: { message: 'Network error. Please try again.' } }
    }
  }

  async createPortfolio(portfolioData) {
    try {
      const { data, error } = await supabase?.from('portfolios')?.insert(portfolioData)?.select()?.single()

      return { data, error }
    } catch (error) {
      return { error: { message: 'Network error. Please try again.' } }
    }
  }

  async updatePortfolio(portfolioId, updates) {
    try {
      const { data, error } = await supabase?.from('portfolios')?.update(updates)?.eq('id', portfolioId)?.select()?.single()

      return { data, error }
    } catch (error) {
      return { error: { message: 'Network error. Please try again.' } }
    }
  }

  // Holdings Management
  async getHoldings(portfolioId) {
    try {
      const { data, error } = await supabase?.from('holdings')?.select(`
          *,
          asset:assets (
            symbol,
            name,
            asset_class,
            logo_url,
            exchange
          )
        `)?.eq('portfolio_id', portfolioId)?.order('market_value', { ascending: false })

      return { data, error }
    } catch (error) {
      return { error: { message: 'Network error. Please try again.' } }
    }
  }

  async updateHolding(holdingId, updates) {
    try {
      const { data, error } = await supabase?.from('holdings')?.update(updates)?.eq('id', holdingId)?.select(`
          *,
          asset:assets (*)
        `)?.single()

      return { data, error }
    } catch (error) {
      return { error: { message: 'Network error. Please try again.' } }
    }
  }

  // Asset Management
  async getAssets(assetClass = null) {
    try {
      let query = supabase?.from('assets')?.select('*')?.eq('is_active', true)?.order('symbol')

      if (assetClass) {
        query = query?.eq('asset_class', assetClass)
      }

      const { data, error } = await query

      return { data, error }
    } catch (error) {
      return { error: { message: 'Network error. Please try again.' } }
    }
  }

  async searchAssets(searchTerm) {
    try {
      const { data, error } = await supabase?.from('assets')?.select('*')?.or(`symbol.ilike.%${searchTerm}%,name.ilike.%${searchTerm}%`)?.eq('is_active', true)?.limit(20)

      return { data, error }
    } catch (error) {
      return { error: { message: 'Network error. Please try again.' } }
    }
  }

  // Transactions
  async getTransactions(portfolioId, limit = 50) {
    try {
      const { data, error } = await supabase?.from('transactions')?.select(`
          *,
          asset:assets (
            symbol,
            name,
            logo_url
          )
        `)?.eq('portfolio_id', portfolioId)?.order('executed_at', { ascending: false })?.limit(limit)

      return { data, error }
    } catch (error) {
      return { error: { message: 'Network error. Please try again.' } }
    }
  }

  async createTransaction(transactionData) {
    try {
      const { data, error } = await supabase?.from('transactions')?.insert(transactionData)?.select(`
          *,
          asset:assets (*)
        `)?.single()

      return { data, error }
    } catch (error) {
      return { error: { message: 'Network error. Please try again.' } }
    }
  }

  // Portfolio Performance
  async getPortfolioPerformance(portfolioId, days = 30) {
    try {
      const startDate = new Date()
      startDate?.setDate(startDate?.getDate() - days)
      
      const { data, error } = await supabase?.from('portfolio_performance')?.select('*')?.eq('portfolio_id', portfolioId)?.gte('date', startDate?.toISOString()?.split('T')?.[0])?.order('date', { ascending: true })

      return { data, error }
    } catch (error) {
      return { error: { message: 'Network error. Please try again.' } }
    }
  }

  // Orders Management
  async getOrders(portfolioId, status = null) {
    try {
      let query = supabase?.from('orders')?.select(`
          *,
          asset:assets (
            symbol,
            name,
            logo_url
          )
        `)?.eq('portfolio_id', portfolioId)?.order('created_at', { ascending: false })

      if (status) {
        query = query?.eq('status', status)
      }

      const { data, error } = await query

      return { data, error }
    } catch (error) {
      return { error: { message: 'Network error. Please try again.' } }
    }
  }

  async createOrder(orderData) {
    try {
      const { data, error } = await supabase?.from('orders')?.insert(orderData)?.select(`
          *,
          asset:assets (*)
        `)?.single()

      return { data, error }
    } catch (error) {
      return { error: { message: 'Network error. Please try again.' } }
    }
  }

  async updateOrder(orderId, updates) {
    try {
      const { data, error } = await supabase?.from('orders')?.update(updates)?.eq('id', orderId)?.select(`
          *,
          asset:assets (*)
        `)?.single()

      return { data, error }
    } catch (error) {
      return { error: { message: 'Network error. Please try again.' } }
    }
  }

  // Portfolio Analytics
  async getPortfolioAllocation(portfolioId) {
    try {
      const { data, error } = await supabase?.from('holdings')?.select(`
          market_value,
          allocation_percentage,
          asset:assets (
            name,
            asset_class,
            symbol
          )
        `)?.eq('portfolio_id', portfolioId)?.gt('quantity', 0)

      return { data, error }
    } catch (error) {
      return { error: { message: 'Network error. Please try again.' } }
    }
  }

  async getPortfolioSummary(portfolioId) {
    try {
      const { data: portfolio, error: portfolioError } = await supabase?.from('portfolios')?.select('*')?.eq('id', portfolioId)?.single()

      if (portfolioError) return { error: portfolioError }

      const { data: holdings, error: holdingsError } = await supabase?.from('holdings')?.select(`
          *,
          asset:assets (symbol, name, asset_class)
        `)?.eq('portfolio_id', portfolioId)

      if (holdingsError) return { error: holdingsError }

      const summary = {
        ...portfolio,
        totalAssets: holdings?.length || 0,
        totalValue: holdings?.reduce((sum, h) => sum + Number(h?.market_value || 0), 0) || 0,
        totalReturn: holdings?.reduce((sum, h) => sum + Number(h?.unrealized_pnl || 0), 0) || 0,
        assetClasses: [...new Set(holdings?.map(h => h?.asset?.asset_class) || [])]
      }

      return { data: summary, error: null }
    } catch (error) {
      return { error: { message: 'Network error. Please try again.' } }
    }
  }

  // Real-time data subscriptions
  setupPortfolioSubscription(portfolioId, callback) {
    return supabase?.channel(`portfolio:${portfolioId}`)?.on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'holdings', filter: `portfolio_id=eq.${portfolioId}` },
        callback
      )?.on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'transactions', filter: `portfolio_id=eq.${portfolioId}` },
        callback
      )?.subscribe();
  }

  setupOrdersSubscription(portfolioId, callback) {
    return supabase?.channel(`orders:${portfolioId}`)?.on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'orders', filter: `portfolio_id=eq.${portfolioId}` },
        callback
      )?.subscribe();
  }
}

export const tradingService = new TradingService()