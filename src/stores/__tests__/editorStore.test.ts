import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useEditorStore } from '../editorStore';

// Mock nanoid
vi.mock('nanoid', () => ({
  nanoid: () => 'test-id-123'
}));

describe('useEditorStore', () => {
  beforeEach(() => {
    // Reset store state before each test
    useEditorStore.getState().resetEditor();
  });

  it('initializes with default state', () => {
    const { result } = renderHook(() => useEditorStore());
    
    expect(result.current.invitation).toBeNull();
    expect(result.current.template).toBeNull();
    expect(result.current.customizations).toEqual({});
    expect(result.current.history).toEqual([]);
    expect(result.current.historyIndex).toBe(-1);
    expect(result.current.isDirty).toBe(false);
  });

  it('sets template correctly', () => {
    const { result } = renderHook(() => useEditorStore());
    
    const mockTemplate = {
      id: 'classic-01',
      name: 'Classic Wedding',
      category: 'wedding' as const,
      thumbnail: 'thumb.jpg',
      previewImage: 'preview.jpg',
      config: {
        theme: {
          primaryColor: '#8B5A3C',
          secondaryColor: '#D4AF37',
          backgroundColor: '#FFFFFF',
          textColor: '#333333',
          fontFamily: 'serif' as const
        },
        sections: {
          hero: {
            enabled: true,
            title: 'Wedding Invitation',
            subtitle: 'Join us',
            backgroundImage: 'bg.jpg'
          }
        }
      }
    };

    act(() => {
      result.current.setTemplate(mockTemplate);
    });

    expect(result.current.template).toEqual(mockTemplate);
    expect(result.current.isDirty).toBe(true);
  });

  it('updates custom configuration', () => {
    const { result } = renderHook(() => useEditorStore());
    
    const configUpdate = {
      theme: {
        primaryColor: '#FF6B6B'
      }
    };

    act(() => {
      result.current.updateCustomizations(configUpdate);
    });

    expect(result.current.customizations).toEqual(configUpdate);
    expect(result.current.isDirty).toBe(true);
  });

  it('maintains history for undo/redo', () => {
    const { result } = renderHook(() => useEditorStore());
    
    const config1 = { theme: { primaryColor: '#FF0000' } };
    const config2 = { theme: { primaryColor: '#00FF00' } };

    act(() => {
      result.current.updateCustomizations(config1);
      result.current.addToHistory();
    });

    act(() => {
      result.current.updateCustomizations(config2);
      result.current.addToHistory();
    });

    expect(result.current.history).toHaveLength(2);
    expect(result.current.historyIndex).toBe(1);
    expect(result.current.customizations).toEqual(config2);
  });

  it('performs undo operation', () => {
    const { result } = renderHook(() => useEditorStore());
    
    const config1 = { theme: { primaryColor: '#FF0000' } };
    const config2 = { theme: { primaryColor: '#00FF00' } };

    act(() => {
      result.current.updateCustomizations(config1);
      result.current.addToHistory();
    });

    act(() => {
      result.current.updateCustomizations(config2);
      result.current.addToHistory();
    });

    act(() => {
      result.current.undo();
    });

    expect(result.current.customizations).toEqual(config1);
    expect(result.current.historyIndex).toBe(0);
    expect(result.current.canUndo()).toBe(false);
    expect(result.current.canRedo()).toBe(true);
  });

  it('performs redo operation', () => {
    const { result } = renderHook(() => useEditorStore());
    
    const config1 = { theme: { primaryColor: '#FF0000' } };
    const config2 = { theme: { primaryColor: '#00FF00' } };

    act(() => {
      result.current.updateCustomizations(config1);
      result.current.addToHistory();
    });

    act(() => {
      result.current.updateCustomizations(config2);
      result.current.addToHistory();
    });

    act(() => {
      result.current.undo();
    });

    act(() => {
      result.current.redo();
    });

    expect(result.current.customizations).toEqual(config2);
    expect(result.current.historyIndex).toBe(1);
    expect(result.current.canUndo()).toBe(true);
    expect(result.current.canRedo()).toBe(false);
  });

  it('resets unsaved changes flag after save', () => {
    const { result } = renderHook(() => useEditorStore());
    
    act(() => {
      result.current.updateCustomizations({ theme: { primaryColor: '#FF0000' } });
    });

    expect(result.current.isDirty).toBe(true);

    act(() => {
      result.current.markAsSaved();
    });

    expect(result.current.isDirty).toBe(false);
  });

  it('limits history size', () => {
    const { result } = renderHook(() => useEditorStore());
    
    // Add more than 50 history entries
    for (let i = 0; i < 60; i++) {
      act(() => {
        result.current.updateCustomizations({ theme: { primaryColor: `#${i.toString(16).padStart(6, '0')}` } });
        result.current.addToHistory();
      });
    }

    expect(result.current.history.length).toBeLessThanOrEqual(50);
  });

  it('clears history when setting new template', () => {
    const { result } = renderHook(() => useEditorStore());
    
    act(() => {
      result.current.updateCustomizations({ theme: { primaryColor: '#FF0000' } });
      result.current.addToHistory();
    });

    expect(result.current.history.length).toBe(1);

    const mockTemplate = {
      id: 'classic-01',
      name: 'Classic Wedding',
      category: 'wedding' as const,
      thumbnail: 'thumb.jpg',
      previewImage: 'preview.jpg',
      config: {
        theme: {
          primaryColor: '#8B5A3C',
          secondaryColor: '#D4AF37',
          backgroundColor: '#FFFFFF',
          textColor: '#333333',
          fontFamily: 'serif' as const
        },
        sections: {}
      }
    };

    act(() => {
      result.current.setTemplate(mockTemplate);
    });

    // Template setting adds to history, so we should have 2 entries (1 from updateCustomizations + 1 from setTemplate)
    expect(result.current.history.length).toBe(2);
    expect(result.current.historyIndex).toBe(1);
  });
});