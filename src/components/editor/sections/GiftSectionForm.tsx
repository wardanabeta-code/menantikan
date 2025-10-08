import React from 'react';
import { Gift } from 'lucide-react';
import type { GiftContent, BankAccount, Ewallet, ShippingAddress } from '@/types';

interface GiftSectionFormProps {
  data?: Partial<GiftContent>;
  onChange: (field: string, value: any) => void;
  onBankAccountChange: (index: number, field: string, value: any) => void;
  onEwalletChange: (index: number, field: string, value: any) => void;
  onShippingAddressChange: (field: string, value: any) => void;
  onAddBankAccount: () => void;
  onRemoveBankAccount: (index: number) => void;
  onAddEwallet: () => void;
  onRemoveEwallet: (index: number) => void;
}

const GiftSectionForm: React.FC<GiftSectionFormProps> = ({ 
  data, 
  onChange, 
  onBankAccountChange, 
  onEwalletChange, 
  onShippingAddressChange,
  onAddBankAccount,
  onRemoveBankAccount,
  onAddEwallet,
  onRemoveEwallet
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
        <Gift className="w-5 h-5 mr-2 text-pink-500" />
        Gift Information
      </h2>
      <div className="space-y-6">
        {/* Bank Accounts */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-md font-medium text-gray-900">Bank Accounts</h3>
            <button
              type="button"
              onClick={onAddBankAccount}
              className="px-3 py-1 bg-pink-600 text-white rounded-md text-sm font-medium hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-pink-500"
            >
              Add Account
            </button>
          </div>
          {data?.bankAccounts?.map((account: BankAccount, index: number) => (
            <div key={account.id} className="border border-gray-200 rounded-lg p-4 mb-4">
              <div className="flex justify-between items-center mb-2">
                <h4 className="font-medium text-gray-900">Bank Account {index + 1}</h4>
                <button
                  type="button"
                  onClick={() => onRemoveBankAccount(index)}
                  className="text-red-600 hover:text-red-800 text-sm font-medium"
                >
                  Remove
                </button>
              </div>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Bank Name</label>
                  <input
                    type="text"
                    value={account.bankName || ''}
                    onChange={(e) => onBankAccountChange(index, 'bankName', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                    placeholder="Bank Central Asia (BCA)"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Account Number</label>
                  <input
                    type="text"
                    value={account.accountNumber || ''}
                    onChange={(e) => onBankAccountChange(index, 'accountNumber', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                    placeholder="1234567890"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Account Name</label>
                  <input
                    type="text"
                    value={account.accountName || ''}
                    onChange={(e) => onBankAccountChange(index, 'accountName', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                    placeholder="Budi Santoso"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* E-Wallets */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-md font-medium text-gray-900">E-Wallets</h3>
            <button
              type="button"
              onClick={onAddEwallet}
              className="px-3 py-1 bg-pink-600 text-white rounded-md text-sm font-medium hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-pink-500"
            >
              Add E-Wallet
            </button>
          </div>
          {data?.ewallets?.map((ewallet: Ewallet, index: number) => (
            <div key={ewallet.id} className="border border-gray-200 rounded-lg p-4 mb-4">
              <div className="flex justify-between items-center mb-2">
                <h4 className="font-medium text-gray-900">E-Wallet {index + 1}</h4>
                <button
                  type="button"
                  onClick={() => onRemoveEwallet(index)}
                  className="text-red-600 hover:text-red-800 text-sm font-medium"
                >
                  Remove
                </button>
              </div>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Provider</label>
                  <select
                    value={ewallet.provider || ''}
                    onChange={(e) => onEwalletChange(index, 'provider', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                  >
                    <option value="gopay">GoPay</option>
                    <option value="ovo">OVO</option>
                    <option value="dana">DANA</option>
                    <option value="shopeepay">ShopeePay</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                  <input
                    type="text"
                    value={ewallet.phoneNumber || ''}
                    onChange={(e) => onEwalletChange(index, 'phoneNumber', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                    placeholder="081234567890"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Account Name</label>
                  <input
                    type="text"
                    value={ewallet.accountName || ''}
                    onChange={(e) => onEwalletChange(index, 'accountName', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                    placeholder="Budi Santoso"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Shipping Address */}
        {data?.shippingAddress && (
          <div>
            <h3 className="text-md font-medium text-gray-900 mb-2">Shipping Address</h3>
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Recipient Name</label>
                  <input
                    type="text"
                    value={data.shippingAddress.recipientName || ''}
                    onChange={(e) => onShippingAddressChange('recipientName', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                    placeholder="Budi & Ani"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                  <textarea
                    value={data.shippingAddress.address || ''}
                    onChange={(e) => onShippingAddressChange('address', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                    placeholder="Jl. Kebahagiaan No. 123, RT 01 RW 02"
                    rows={2}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                  <input
                    type="text"
                    value={data.shippingAddress.city || ''}
                    onChange={(e) => onShippingAddressChange('city', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                    placeholder="Jakarta Selatan"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Province</label>
                  <input
                    type="text"
                    value={data.shippingAddress.province || ''}
                    onChange={(e) => onShippingAddressChange('province', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                    placeholder="DKI Jakarta"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Postal Code</label>
                  <input
                    type="text"
                    value={data.shippingAddress.postalCode || ''}
                    onChange={(e) => onShippingAddressChange('postalCode', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                    placeholder="12345"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                  <input
                    type="text"
                    value={data.shippingAddress.country || ''}
                    onChange={(e) => onShippingAddressChange('country', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                    placeholder="Indonesia"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                  <input
                    type="text"
                    value={data.shippingAddress.phoneNumber || ''}
                    onChange={(e) => onShippingAddressChange('phoneNumber', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                    placeholder="+62812-3456-7890"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                  <textarea
                    value={data.shippingAddress.notes || ''}
                    onChange={(e) => onShippingAddressChange('notes', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                    placeholder="Silakan koordinasikan waktu pengiriman..."
                    rows={2}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Visibility Toggles */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={data?.showBankAccounts || false}
              onChange={(e) => onChange('showBankAccounts', e.target.checked)}
              className="h-4 w-4 text-pink-600 focus:ring-pink-500 border-gray-300 rounded"
            />
            <label className="ml-2 block text-sm text-gray-700">
              Show Bank Accounts
            </label>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={data?.showEwallets || false}
              onChange={(e) => onChange('showEwallets', e.target.checked)}
              className="h-4 w-4 text-pink-600 focus:ring-pink-500 border-gray-300 rounded"
            />
            <label className="ml-2 block text-sm text-gray-700">
              Show E-Wallets
            </label>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={data?.showShippingAddress || false}
              onChange={(e) => onChange('showShippingAddress', e.target.checked)}
              className="h-4 w-4 text-pink-600 focus:ring-pink-500 border-gray-300 rounded"
            />
            <label className="ml-2 block text-sm text-gray-700">
              Show Shipping Address
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GiftSectionForm;