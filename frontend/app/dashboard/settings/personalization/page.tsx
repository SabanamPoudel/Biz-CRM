"use client";
import { useState } from "react";

export default function PersonalizationSettings() {
  const [activeTab, setActiveTab] = useState('colors');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Tab Headers */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-5xl mx-auto px-8">
          <div className="flex gap-8 pt-6">
            <button
              onClick={() => setActiveTab('colors')}
              className={`pb-4 px-1 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'colors'
                  ? 'text-[#003174] border-[#003174]'
                  : 'text-gray-600 border-transparent hover:text-gray-900'
              }`}
            >
              Colors
            </button>
            <button
              onClick={() => setActiveTab('fonts')}
              className={`pb-4 px-1 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'fonts'
                  ? 'text-[#003174] border-[#003174]'
                  : 'text-gray-600 border-transparent hover:text-gray-900'
              }`}
            >
              Fonts
            </button>
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div className="max-w-5xl mx-auto px-8 py-8">
        {activeTab === 'colors' && (
          <div className="space-y-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Color Customization</h2>
            
            <div className="space-y-6">
              {/* Primary Colors */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Primary Brand Colors</h3>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Primary Color</label>
                    <div className="flex items-center space-x-4">
                      <input
                        type="color"
                        defaultValue="#003174"
                        className="h-12 w-20 rounded-lg cursor-pointer border border-gray-300"
                      />
                      <div className="flex-1">
                        <input
                          type="text"
                          defaultValue="#003174"
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003174] focus:border-transparent font-mono"
                        />
                      </div>
                    </div>
                    <p className="mt-2 text-sm text-gray-600">Used for buttons, links, and primary UI elements</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Secondary Color</label>
                    <div className="flex items-center space-x-4">
                      <input
                        type="color"
                        defaultValue="#0052a8"
                        className="h-12 w-20 rounded-lg cursor-pointer border border-gray-300"
                      />
                      <div className="flex-1">
                        <input
                          type="text"
                          defaultValue="#0052a8"
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003174] focus:border-transparent font-mono"
                        />
                      </div>
                    </div>
                    <p className="mt-2 text-sm text-gray-600">Accent color for gradients and highlights</p>
                  </div>
                </div>
              </div>

              {/* Status Colors */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Status & Alert Colors</h3>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Success Color</label>
                    <div className="flex items-center space-x-4">
                      <input
                        type="color"
                        defaultValue="#10b981"
                        className="h-12 w-20 rounded-lg cursor-pointer border border-gray-300"
                      />
                      <div className="flex-1">
                        <input
                          type="text"
                          defaultValue="#10b981"
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003174] focus:border-transparent font-mono"
                        />
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Warning Color</label>
                    <div className="flex items-center space-x-4">
                      <input
                        type="color"
                        defaultValue="#f59e0b"
                        className="h-12 w-20 rounded-lg cursor-pointer border border-gray-300"
                      />
                      <div className="flex-1">
                        <input
                          type="text"
                          defaultValue="#f59e0b"
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003174] focus:border-transparent font-mono"
                        />
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Error Color</label>
                    <div className="flex items-center space-x-4">
                      <input
                        type="color"
                        defaultValue="#ef4444"
                        className="h-12 w-20 rounded-lg cursor-pointer border border-gray-300"
                      />
                      <div className="flex-1">
                        <input
                          type="text"
                          defaultValue="#ef4444"
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003174] focus:border-transparent font-mono"
                        />
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Info Color</label>
                    <div className="flex items-center space-x-4">
                      <input
                        type="color"
                        defaultValue="#3b82f6"
                        className="h-12 w-20 rounded-lg cursor-pointer border border-gray-300"
                      />
                      <div className="flex-1">
                        <input
                          type="text"
                          defaultValue="#3b82f6"
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003174] focus:border-transparent font-mono"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Background Colors */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Background & Surfaces</h3>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Background Color</label>
                    <div className="flex items-center space-x-4">
                      <input
                        type="color"
                        defaultValue="#f9fafb"
                        className="h-12 w-20 rounded-lg cursor-pointer border border-gray-300"
                      />
                      <div className="flex-1">
                        <input
                          type="text"
                          defaultValue="#f9fafb"
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003174] focus:border-transparent font-mono"
                        />
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Surface Color</label>
                    <div className="flex items-center space-x-4">
                      <input
                        type="color"
                        defaultValue="#ffffff"
                        className="h-12 w-20 rounded-lg cursor-pointer border border-gray-300"
                      />
                      <div className="flex-1">
                        <input
                          type="text"
                          defaultValue="#ffffff"
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003174] focus:border-transparent font-mono"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Color Preview */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Preview</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="h-24 rounded-lg bg-[#003174] flex items-center justify-center text-white font-medium text-sm">
                      Primary Button
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="h-24 rounded-lg bg-green-500 flex items-center justify-center text-white font-medium text-sm">
                      Success
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="h-24 rounded-lg bg-red-500 flex items-center justify-center text-white font-medium text-sm">
                      Error
                    </div>
                  </div>
                </div>
              </div>

              {/* Save Button */}
              <div className="flex justify-end">
                <button className="px-6 py-2.5 bg-[#003174] text-white text-sm font-medium rounded-lg hover:bg-[#002557] transition-colors">
                  Save Colors
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'fonts' && (
          <div className="space-y-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Font Settings</h2>
            
            <div className="space-y-6">
              {/* Primary Font */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Primary Font Family</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Font Family</label>
                    <select className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003174] focus:border-transparent">
                      <option value="inter" style={{ fontFamily: 'Inter, sans-serif' }}>Inter</option>
                      <option value="roboto" style={{ fontFamily: 'Roboto, sans-serif' }}>Roboto</option>
                      <option value="poppins" style={{ fontFamily: 'Poppins, sans-serif' }}>Poppins</option>
                      <option value="opensans" style={{ fontFamily: 'Open Sans, sans-serif' }}>Open Sans</option>
                      <option value="lato" style={{ fontFamily: 'Lato, sans-serif' }}>Lato</option>
                      <option value="montserrat" style={{ fontFamily: 'Montserrat, sans-serif' }}>Montserrat</option>
                      <option value="raleway" style={{ fontFamily: 'Raleway, sans-serif' }}>Raleway</option>
                      <option value="nunito" style={{ fontFamily: 'Nunito, sans-serif' }}>Nunito</option>
                      <option value="sourcesans" style={{ fontFamily: 'Source Sans Pro, sans-serif' }}>Source Sans Pro</option>
                    </select>
                  </div>
                  <div className="p-6 bg-gray-50 rounded-lg">
                    <p className="text-2xl font-semibold mb-2">The quick brown fox jumps over the lazy dog</p>
                    <p className="text-lg mb-2">The quick brown fox jumps over the lazy dog</p>
                    <p className="text-base">The quick brown fox jumps over the lazy dog</p>
                  </div>
                </div>
              </div>

              {/* Heading Font */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Heading Font Family</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Font Family for Headings</label>
                    <select className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003174] focus:border-transparent">
                      <option value="same">Same as Primary Font</option>
                      <option value="inter" style={{ fontFamily: 'Inter, sans-serif' }}>Inter</option>
                      <option value="roboto" style={{ fontFamily: 'Roboto, sans-serif' }}>Roboto</option>
                      <option value="poppins" style={{ fontFamily: 'Poppins, sans-serif' }}>Poppins</option>
                      <option value="playfair" style={{ fontFamily: 'Playfair Display, serif' }}>Playfair Display</option>
                      <option value="merriweather" style={{ fontFamily: 'Merriweather, serif' }}>Merriweather</option>
                      <option value="oswald" style={{ fontFamily: 'Oswald, sans-serif' }}>Oswald</option>
                    </select>
                  </div>
                  <div className="p-6 bg-gray-50 rounded-lg">
                    <h1 className="text-3xl font-semibold mb-2">Heading Level 1</h1>
                    <h2 className="text-2xl font-semibold mb-2">Heading Level 2</h2>
                    <h3 className="text-xl font-semibold mb-1">Heading Level 3</h3>
                    <h4 className="text-lg font-semibold">Heading Level 4</h4>
                  </div>
                </div>
              </div>

              {/* Font Sizes */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Font Size Scale</h3>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Base Font Size (px)</label>
                    <input
                      type="number"
                      defaultValue="16"
                      min="12"
                      max="20"
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003174] focus:border-transparent"
                    />
                    <p className="mt-2 text-sm text-gray-600">Base size for body text (recommended: 16px)</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Scale Ratio</label>
                    <select className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003174] focus:border-transparent">
                      <option value="1.125">Minor Second (1.125)</option>
                      <option value="1.200">Minor Third (1.200)</option>
                      <option value="1.250" selected>Major Third (1.250)</option>
                      <option value="1.333">Perfect Fourth (1.333)</option>
                      <option value="1.414">Augmented Fourth (1.414)</option>
                      <option value="1.500">Perfect Fifth (1.500)</option>
                      <option value="1.618">Golden Ratio (1.618)</option>
                    </select>
                    <p className="mt-2 text-sm text-gray-600">Multiplier for heading sizes</p>
                  </div>
                </div>
              </div>

              {/* Font Weight */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Font Weights</h3>
                <div className="grid grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Regular Weight</label>
                    <select className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003174] focus:border-transparent">
                      <option value="300">Light (300)</option>
                      <option value="400" selected>Regular (400)</option>
                      <option value="500">Medium (500)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Medium Weight</label>
                    <select className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003174] focus:border-transparent">
                      <option value="500">Medium (500)</option>
                      <option value="600" selected>Semi-Bold (600)</option>
                      <option value="700">Bold (700)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Bold Weight</label>
                    <select className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003174] focus:border-transparent">
                      <option value="600">Semi-Bold (600)</option>
                      <option value="700" selected>Bold (700)</option>
                      <option value="800">Extra-Bold (800)</option>
                      <option value="900">Black (900)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Line Height */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Line Height</h3>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Body Line Height</label>
                    <select className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003174] focus:border-transparent">
                      <option value="1.4">Tight (1.4)</option>
                      <option value="1.5">Snug (1.5)</option>
                      <option value="1.6" selected>Normal (1.6)</option>
                      <option value="1.75">Relaxed (1.75)</option>
                      <option value="2">Loose (2)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Heading Line Height</label>
                    <select className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003174] focus:border-transparent">
                      <option value="1">None (1)</option>
                      <option value="1.1">Tight (1.1)</option>
                      <option value="1.2" selected>Snug (1.2)</option>
                      <option value="1.3">Normal (1.3)</option>
                      <option value="1.4">Relaxed (1.4)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Save Button */}
              <div className="flex justify-end">
                <button className="px-6 py-2.5 bg-[#003174] text-white text-sm font-medium rounded-lg hover:bg-[#002557] transition-colors">
                  Save Font Settings
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
