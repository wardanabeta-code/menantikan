// Editor sidebar component with customization controls
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Palette, 
  Type, 
  Layout, 
  Settings, 
  Eye, 
  Save, 
  Undo, 
  Redo,
  ChevronDown,
  ChevronUp,
  X
} from 'lucide-react';
import { Button } from './ui/button';
import { useEditorStore } from '../stores/editorStore';
import type { TemplateConfig, DeepPartial } from '../types';

interface EditorSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const EditorSidebar: React.FC<EditorSidebarProps> = ({ isOpen, onClose }) => {
  const [activeSection, setActiveSection] = useState<string>('colors');
  const { 
    customizations, 
    updateCustomizations, 
    saveInvitation, 
    undo, 
    redo, 
    isDirty, 
    isSaving, 
    lastSaved,
    history,
    historyIndex
  } = useEditorStore();

  const sections = [
    { id: 'colors', label: 'Colors', icon: Palette },
    { id: 'typography', label: 'Typography', icon: Type },
    { id: 'layout', label: 'Layout', icon: Layout },
    { id: 'sections', label: 'Sections', icon: Settings }
  ];

  const handleColorChange = (colorKey: string, value: string) => {
    updateCustomizations({
      colors: {
        ...customizations.colors,
        [colorKey]: value
      }
    });
  };

  const handleTypographyChange = (fontKey: string, value: string) => {
    updateCustomizations({
      typography: {
        ...customizations.typography,
        [fontKey]: value
      }
    });
  };

  const handleLayoutChange = (layoutKey: string, value: string) => {
    updateCustomizations({
      layout: {
        ...customizations.layout,
        [layoutKey]: value
      }
    });
  };

  const canUndo = historyIndex > 0;
  const canRedo = historyIndex < history.length - 1;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={onClose}
          />

          {/* Sidebar */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-80 bg-white shadow-xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-lg font-semibold">Customize</h2>
              <div className="flex items-center space-x-2">
                {/* Undo/Redo */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={undo}
                  disabled={!canUndo}
                  title="Undo"
                >
                  <Undo className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={redo}
                  disabled={!canRedo}
                  title="Redo"
                >
                  <Redo className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClose}
                  className="lg:hidden"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Save Status */}
            <div className="px-4 py-2 bg-gray-50 border-b">
              <div className="flex items-center justify-between text-sm">
                <span className={isDirty ? 'text-orange-600' : 'text-green-600'}>
                  {isSaving 
                    ? 'Saving...' 
                    : isDirty 
                    ? 'Unsaved changes' 
                    : 'All changes saved'
                  }
                </span>
                {lastSaved && (
                  <span className="text-gray-500">
                    {new Date(lastSaved).toLocaleTimeString()}
                  </span>
                )}
              </div>
            </div>

            {/* Navigation */}
            <div className="flex border-b">
              {sections.map(section => {
                const Icon = section.icon;
                return (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`flex-1 flex flex-col items-center py-3 px-2 text-xs font-medium transition-colors ${
                      activeSection === section.id
                        ? 'text-pink-600 bg-pink-50 border-b-2 border-pink-600'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="h-4 w-4 mb-1" />
                    {section.label}
                  </button>
                );
              })}
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto">
              {activeSection === 'colors' && (
                <ColorSection 
                  colors={customizations.colors || {}}
                  onChange={handleColorChange}
                />
              )}
              {activeSection === 'typography' && (
                <TypographySection 
                  typography={customizations.typography || {}}
                  onChange={handleTypographyChange}
                />
              )}
              {activeSection === 'layout' && (
                <LayoutSection 
                  layout={customizations.layout || {}}
                  onChange={handleLayoutChange}
                />
              )}
              {activeSection === 'sections' && (
                <SectionsSection 
                  sections={customizations.sections || []}
                  onChange={(sections) => updateCustomizations({ sections })}
                />
              )}
            </div>

            {/* Actions */}
            <div className="p-4 border-t space-y-2">
              <Button 
                onClick={saveInvitation}
                disabled={!isDirty || isSaving}
                className="w-full"
              >
                <Save className="h-4 w-4 mr-2" />
                {isSaving ? 'Saving...' : 'Save Changes'}
              </Button>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => window.open('/preview', '_blank')}
              >
                <Eye className="h-4 w-4 mr-2" />
                Preview
              </Button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

// Color customization section
const ColorSection: React.FC<{
  colors: Record<string, string>;
  onChange: (key: string, value: string) => void;
}> = ({ colors, onChange }) => {
  const colorOptions = [
    { key: 'primary', label: 'Primary Color', default: '#db2777' },
    { key: 'secondary', label: 'Secondary Color', default: '#6b7280' },
    { key: 'accent', label: 'Accent Color', default: '#f59e0b' },
    { key: 'background', label: 'Background', default: '#ffffff' },
    { key: 'text', label: 'Text Color', default: '#111827' },
    { key: 'textSecondary', label: 'Secondary Text', default: '#6b7280' }
  ];

  return (
    <div className="p-4 space-y-4">
      <h3 className="font-medium">Color Palette</h3>
      {colorOptions.map(option => (
        <div key={option.key} className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            {option.label}
          </label>
          <div className="flex items-center space-x-3">
            <input
              type="color"
              value={colors[option.key] || option.default}
              onChange={(e) => onChange(option.key, e.target.value)}
              className="w-10 h-10 rounded border border-gray-300 cursor-pointer"
            />
            <input
              type="text"
              value={colors[option.key] || option.default}
              onChange={(e) => onChange(option.key, e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded text-sm"
              placeholder={option.default}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

// Typography customization section
const TypographySection: React.FC<{
  typography: Record<string, any>;
  onChange: (key: string, value: string) => void;
}> = ({ typography, onChange }) => {
  const fontOptions = [
    'Inter', 'Playfair Display', 'Dancing Script', 'Nunito', 
    'Roboto', 'Open Sans', 'Lato', 'Montserrat'
  ];

  return (
    <div className="p-4 space-y-4">
      <h3 className="font-medium">Typography</h3>
      
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Heading Font
        </label>
        <select
          value={typography.headingFont || 'Playfair Display'}
          onChange={(e) => onChange('headingFont', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded"
        >
          {fontOptions.map(font => (
            <option key={font} value={font}>{font}</option>
          ))}
        </select>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Body Font
        </label>
        <select
          value={typography.bodyFont || 'Inter'}
          onChange={(e) => onChange('bodyFont', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded"
        >
          {fontOptions.map(font => (
            <option key={font} value={font}>{font}</option>
          ))}
        </select>
      </div>
    </div>
  );
};

// Layout customization section
const LayoutSection: React.FC<{
  layout: Record<string, string>;
  onChange: (key: string, value: string) => void;
}> = ({ layout, onChange }) => {
  return (
    <div className="p-4 space-y-4">
      <h3 className="font-medium">Layout</h3>
      
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Max Width
        </label>
        <select
          value={layout.maxWidth || '1200px'}
          onChange={(e) => onChange('maxWidth', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded"
        >
          <option value="1024px">1024px</option>
          <option value="1200px">1200px</option>
          <option value="1400px">1400px</option>
          <option value="100%">Full Width</option>
        </select>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Border Radius
        </label>
        <select
          value={layout.borderRadius || '0.5rem'}
          onChange={(e) => onChange('borderRadius', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded"
        >
          <option value="0">None</option>
          <option value="0.25rem">Small</option>
          <option value="0.5rem">Medium</option>
          <option value="1rem">Large</option>
        </select>
      </div>
    </div>
  );
};

// Sections management
const SectionsSection: React.FC<{
  sections: any[];
  onChange: (sections: any[]) => void;
}> = ({ sections, onChange }) => {
  const toggleSection = (sectionId: string) => {
    const updated = sections.map(section => 
      section.id === sectionId 
        ? { ...section, isVisible: !section.isVisible }
        : section
    );
    onChange(updated);
  };

  return (
    <div className="p-4 space-y-4">
      <h3 className="font-medium">Sections</h3>
      {sections.map(section => (
        <div key={section.id} className="flex items-center justify-between py-2">
          <span className="text-sm capitalize">{section.type.replace('-', ' ')}</span>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={section.isVisible}
              onChange={() => toggleSection(section.id)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-pink-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-pink-600"></div>
          </label>
        </div>
      ))}
    </div>
  );
};

export default EditorSidebar;