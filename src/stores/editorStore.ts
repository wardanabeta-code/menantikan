// Editor store for invitation editing state
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { 
  Invitation, 
  Template, 
  TemplateConfig, 
  InvitationContent,
  DeepPartial 
} from '../types';
import { updateInvitation, getInvitation } from '../lib/firestore';

interface EditorState {
  invitation: Invitation | null;
  template: Template | null;
  customizations: DeepPartial<TemplateConfig>;
  content: Partial<InvitationContent>;
  isLoading: boolean;
  isSaving: boolean;
  isDirty: boolean;
  lastSaved: Date | null;
  error: string | null;
  history: Array<{
    state: DeepPartial<TemplateConfig>;
    content: Partial<InvitationContent>;
    timestamp: Date;
  }>;
  historyIndex: number;
}

interface EditorActions {
  loadInvitation: (invitationId: string) => Promise<void>;
  setTemplate: (template: Template) => void;
  updateCustomizations: (customizations: DeepPartial<TemplateConfig>) => void;
  updateContent: (content: Partial<InvitationContent>) => void;
  saveInvitation: () => Promise<void>;
  autoSave: () => Promise<void>;
  resetEditor: () => void;
  undo: () => void;
  redo: () => void;
  canUndo: () => boolean;
  canRedo: () => boolean;
  addToHistory: () => void;
  setError: (error: string | null) => void;
  markAsSaved: () => void;
}

type EditorStore = EditorState & EditorActions;

const MAX_HISTORY_SIZE = 50;

export const useEditorStore = create<EditorStore>()(
  devtools(
    (set, get) => ({
      // State
      invitation: null,
      template: null,
      customizations: {},
      content: {},
      isLoading: false,
      isSaving: false,
      isDirty: false,
      lastSaved: null,
      error: null,
      history: [],
      historyIndex: -1,

      // Actions
      loadInvitation: async (invitationId: string) => {
        set({ isLoading: true, error: null });
        
        try {
          const invitation = await getInvitation(invitationId);
          if (!invitation) {
            throw new Error('Invitation not found');
          }

          set({
            invitation,
            customizations: invitation.customTheme || {},
            content: invitation.content || {},
            isLoading: false,
            isDirty: false,
            lastSaved: invitation.updatedAt
          });

          // Add initial state to history
          get().addToHistory();
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Failed to load invitation',
            isLoading: false
          });
        }
      },

      setTemplate: (template: Template) => {
        set({ 
          template,
          customizations: {},
          isDirty: true
        });
        get().addToHistory();
      },

      updateCustomizations: (newCustomizations: DeepPartial<TemplateConfig>) => {
        set((state) => ({
          customizations: {
            ...state.customizations,
            ...newCustomizations
          },
          isDirty: true
        }));
      },

      updateContent: (newContent: Partial<InvitationContent>) => {
        set((state) => ({
          content: {
            ...state.content,
            ...newContent
          },
          isDirty: true
        }));
      },

      saveInvitation: async () => {
        const { invitation, customizations, content, isSaving } = get();
        
        if (!invitation || isSaving) return;

        set({ isSaving: true, error: null });

        try {
          await updateInvitation(invitation.invitationId, {
            customTheme: customizations,
            content: content as InvitationContent,
            updatedAt: new Date()
          });

          set({
            isSaving: false,
            isDirty: false,
            lastSaved: new Date()
          });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Failed to save invitation',
            isSaving: false
          });
        }
      },

      autoSave: async () => {
        const { isDirty, isSaving } = get();
        
        if (isDirty && !isSaving) {
          await get().saveInvitation();
        }
      },

      resetEditor: () => {
        set({
          invitation: null,
          template: null,
          customizations: {},
          content: {},
          isLoading: false,
          isSaving: false,
          isDirty: false,
          lastSaved: null,
          error: null,
          history: [],
          historyIndex: -1
        });
      },

      undo: () => {
        const { history, historyIndex } = get();
        
        if (historyIndex > 0) {
          const newIndex = historyIndex - 1;
          const previousState = history[newIndex];
          
          set({
            customizations: previousState.state,
            content: previousState.content,
            historyIndex: newIndex,
            isDirty: true
          });
        }
      },

      redo: () => {
        const { history, historyIndex } = get();
        
        if (historyIndex < history.length - 1) {
          const newIndex = historyIndex + 1;
          const nextState = history[newIndex];
          
          set({
            customizations: nextState.state,
            content: nextState.content,
            historyIndex: newIndex,
            isDirty: true
          });
        }
      },

      canUndo: () => {
        const { historyIndex } = get();
        return historyIndex > 0;
      },

      canRedo: () => {
        const { history, historyIndex } = get();
        return historyIndex < history.length - 1;
      },

      markAsSaved: () => {
        set({ isDirty: false, lastSaved: new Date() });
      },

      addToHistory: () => {
        const { customizations, content, history, historyIndex } = get();
        
        const newHistoryItem = {
          state: structuredClone(customizations),
          content: structuredClone(content),
          timestamp: new Date()
        };

        // Remove any history items after current index (when adding after undo)
        const newHistory = history.slice(0, historyIndex + 1);
        newHistory.push(newHistoryItem);

        // Keep history within max size
        if (newHistory.length > MAX_HISTORY_SIZE) {
          newHistory.shift();
        }

        set({
          history: newHistory,
          historyIndex: newHistory.length - 1
        });
      },

      setError: (error: string | null) => {
        set({ error });
      }
    }),
    { name: 'editor-store' }
  )
);