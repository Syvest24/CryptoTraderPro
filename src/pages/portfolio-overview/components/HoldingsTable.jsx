import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';

const HoldingsTable = ({ holdings, onExport }) => {
  const [sortConfig, setSortConfig] = useState({ key: 'marketValue', direction: 'desc' });
  const [filterAssetClass, setFilterAssetClass] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const assetClasses = ['all', 'crypto', 'stocks', 'etf', 'bonds'];

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })?.format(value);
  };

  const formatPercentage = (value) => {
    return `${value >= 0 ? '+' : ''}${value?.toFixed(2)}%`;
  };

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig?.key === key && sortConfig?.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const filteredAndSortedHoldings = holdings?.filter(holding => {
      const matchesAssetClass = filterAssetClass === 'all' || holding?.assetClass === filterAssetClass;
      const matchesSearch = holding?.symbol?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
                           holding?.name?.toLowerCase()?.includes(searchTerm?.toLowerCase());
      return matchesAssetClass && matchesSearch;
    })?.sort((a, b) => {
      if (sortConfig?.direction === 'asc') {
        return a?.[sortConfig?.key] > b?.[sortConfig?.key] ? 1 : -1;
      }
      return a?.[sortConfig?.key] < b?.[sortConfig?.key] ? 1 : -1;
    });

  const getSortIcon = (columnKey) => {
    if (sortConfig?.key !== columnKey) {
      return <Icon name="ArrowUpDown" size={14} className="text-muted-foreground" />;
    }
    return sortConfig?.direction === 'asc' 
      ? <Icon name="ArrowUp" size={14} className="text-primary" />
      : <Icon name="ArrowDown" size={14} className="text-primary" />;
  };

  const getAssetClassBadge = (assetClass) => {
    const colors = {
      crypto: 'bg-orange-500/10 text-orange-500',
      stocks: 'bg-blue-500/10 text-blue-500',
      etf: 'bg-green-500/10 text-green-500',
      bonds: 'bg-purple-500/10 text-purple-500'
    };
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors?.[assetClass] || 'bg-muted text-muted-foreground'}`}>
        {assetClass?.toUpperCase()}
      </span>
    );
  };

  return (
    <div className="bg-card rounded-xl border border-border overflow-hidden">
      {/* Table Header */}
      <div className="p-6 border-b border-border">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-foreground mb-1">
              Holdings
            </h2>
            <p className="text-sm text-muted-foreground">
              {filteredAndSortedHoldings?.length} assets • Real-time prices
            </p>
          </div>
          
          <div className="flex items-center space-x-3">
            {/* Search */}
            <div className="relative">
              <Icon name="Search" size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search assets..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e?.target?.value)}
                className="pl-10 pr-4 py-2 bg-muted/20 border border-border rounded-lg text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all duration-200"
              />
            </div>
            
            {/* Asset Class Filter */}
            <select
              value={filterAssetClass}
              onChange={(e) => setFilterAssetClass(e?.target?.value)}
              className="px-3 py-2 bg-muted/20 border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all duration-200"
            >
              {assetClasses?.map(assetClass => (
                <option key={assetClass} value={assetClass}>
                  {assetClass === 'all' ? 'All Assets' : assetClass?.toUpperCase()}
                </option>
              ))}
            </select>
            
            {/* Export Button */}
            <button
              onClick={onExport}
              className="flex items-center space-x-2 px-3 py-2 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors duration-200"
            >
              <Icon name="Download" size={16} />
              <span className="text-sm font-medium hidden sm:inline">Export</span>
            </button>
          </div>
        </div>
      </div>
      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/10">
            <tr>
              <th className="text-left p-4 text-sm font-medium text-muted-foreground">
                Asset
              </th>
              <th 
                className="text-left p-4 text-sm font-medium text-muted-foreground cursor-pointer hover:text-foreground transition-colors duration-200"
                onClick={() => handleSort('currentPrice')}
              >
                <div className="flex items-center space-x-1">
                  <span>Price</span>
                  {getSortIcon('currentPrice')}
                </div>
              </th>
              <th 
                className="text-right p-4 text-sm font-medium text-muted-foreground cursor-pointer hover:text-foreground transition-colors duration-200"
                onClick={() => handleSort('quantity')}
              >
                <div className="flex items-center justify-end space-x-1">
                  <span>Holdings</span>
                  {getSortIcon('quantity')}
                </div>
              </th>
              <th 
                className="text-right p-4 text-sm font-medium text-muted-foreground cursor-pointer hover:text-foreground transition-colors duration-200"
                onClick={() => handleSort('marketValue')}
              >
                <div className="flex items-center justify-end space-x-1">
                  <span>Market Value</span>
                  {getSortIcon('marketValue')}
                </div>
              </th>
              <th 
                className="text-right p-4 text-sm font-medium text-muted-foreground cursor-pointer hover:text-foreground transition-colors duration-200"
                onClick={() => handleSort('change24h')}
              >
                <div className="flex items-center justify-end space-x-1">
                  <span>24h Change</span>
                  {getSortIcon('change24h')}
                </div>
              </th>
              <th className="text-right p-4 text-sm font-medium text-muted-foreground">
                Allocation
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredAndSortedHoldings?.map((holding, index) => (
              <tr 
                key={holding?.symbol}
                className="border-t border-border hover:bg-muted/20 transition-colors duration-200"
              >
                <td className="p-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full overflow-hidden bg-muted/20 flex items-center justify-center">
                      <Image
                        src={holding?.logo}
                        alt={holding?.name}
                        className="w-8 h-8 object-cover"
                      />
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-medium text-foreground">
                          {holding?.symbol}
                        </span>
                        {getAssetClassBadge(holding?.assetClass)}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {holding?.name}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="p-4">
                  <div className="text-foreground font-medium">
                    {formatCurrency(holding?.currentPrice)}
                  </div>
                </td>
                <td className="p-4 text-right">
                  <div className="text-foreground font-medium">
                    {holding?.quantity?.toLocaleString(undefined, { 
                      minimumFractionDigits: holding?.quantity < 1 ? 6 : 2,
                      maximumFractionDigits: holding?.quantity < 1 ? 6 : 2
                    })}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {holding?.symbol}
                  </div>
                </td>
                <td className="p-4 text-right">
                  <div className="text-foreground font-medium">
                    {formatCurrency(holding?.marketValue)}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {((holding?.marketValue / holdings?.reduce((sum, h) => sum + h?.marketValue, 0)) * 100)?.toFixed(1)}% of portfolio
                  </div>
                </td>
                <td className="p-4 text-right">
                  <div className={`flex items-center justify-end space-x-1 font-medium ${
                    holding?.change24h >= 0 ? 'text-success' : 'text-error'
                  }`}>
                    <Icon 
                      name={holding?.change24h >= 0 ? 'ArrowUp' : 'ArrowDown'} 
                      size={14}
                    />
                    <span>{formatPercentage(holding?.change24h)}</span>
                  </div>
                  <div className={`text-sm ${
                    holding?.change24hValue >= 0 ? 'text-success' : 'text-error'
                  }`}>
                    {formatCurrency(holding?.change24hValue)}
                  </div>
                </td>
                <td className="p-4 text-right">
                  <div className="w-16 h-2 bg-muted/20 rounded-full overflow-hidden ml-auto">
                    <div 
                      className="h-full bg-primary rounded-full transition-all duration-300"
                      style={{ 
                        width: `${(holding?.marketValue / holdings?.reduce((sum, h) => sum + h?.marketValue, 0)) * 100}%` 
                      }}
                    ></div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {filteredAndSortedHoldings?.length === 0 && (
        <div className="p-8 text-center">
          <Icon name="Search" size={48} className="text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">No assets found</h3>
          <p className="text-muted-foreground">
            Try adjusting your search or filter criteria
          </p>
        </div>
      )}
    </div>
  );
};

export default HoldingsTable;