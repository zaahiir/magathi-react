import React, { createContext, useContext, useReducer, useEffect } from 'react';
import SettingsService from '../services/settingsService';

const SettingsContext = createContext();

const settingsReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_SAVING':
      return { ...state, saving: action.payload };
    case 'SET_SETTINGS':
      return { 
        ...state, 
        settings: action.payload, 
        hasChanges: false,
        loading: false 
      };
    case 'UPDATE_SETTING':
      return {
        ...state,
        settings: {
          ...state.settings,
          [action.category]: {
            ...state.settings[action.category],
            [action.field]: action.value
          }
        },
        hasChanges: true
      };
    case 'UPDATE_NESTED_SETTING':
      const newSettings = { ...state.settings };
      const pathArray = action.fieldPath.split('.');
      let current = newSettings[action.category] || {};
      
      // Navigate to the parent object
      for (let i = 0; i < pathArray.length - 1; i++) {
        if (!current[pathArray[i]]) {
          current[pathArray[i]] = {};
        }
        current = current[pathArray[i]];
      }
      
      // Set the final value
      current[pathArray[pathArray.length - 1]] = action.value;
      
      return {
        ...state,
        settings: {
          ...newSettings,
          [action.category]: {
            ...newSettings[action.category],
            ...current
          }
        },
        hasChanges: true
      };
    case 'SET_VALIDATION_ERRORS':
      return { ...state, validationErrors: action.payload };
    case 'SET_ACTIVE_CATEGORY':
      return { ...state, activeCategory: action.payload };
    case 'RESET_CHANGES':
      return { ...state, hasChanges: false };
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    default:
      return state;
  }
};

const initialState = {
  settings: {},
  loading: true,
  saving: false,
  hasChanges: false,
  validationErrors: {},
  activeCategory: 'general',
  error: null
};

export const SettingsProvider = ({ children }) => {
  const [state, dispatch] = useReducer(settingsReducer, initialState);

  // Load settings on mount
  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const response = await SettingsService.getSettingsCached();
      
      if (response.success) {
        dispatch({ type: 'SET_SETTINGS', payload: response.data });
      } else {
        dispatch({ type: 'SET_ERROR', payload: response.message || 'Failed to load settings' });
      }
    } catch (error) {
      console.error('Error loading settings:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to load settings' });
    }
  };

  const updateSetting = (category, field, value) => {
    dispatch({ type: 'UPDATE_SETTING', payload: { category, field, value } });
  };

  const updateNestedSetting = (category, fieldPath, value) => {
    dispatch({ type: 'UPDATE_NESTED_SETTING', payload: { category, fieldPath, value } });
  };

  const saveSettings = async () => {
    try {
      dispatch({ type: 'SET_SAVING', payload: true });
      const response = await SettingsService.updateSettings(
        state.activeCategory, 
        state.settings[state.activeCategory] || {}
      );
      
      if (response.success) {
        dispatch({ type: 'RESET_CHANGES' });
        return { success: true, message: response.message || 'Settings saved successfully' };
      } else {
        if (response.errors && response.errors.length > 0) {
          dispatch({ type: 'SET_VALIDATION_ERRORS', payload: response.errors });
        }
        return { success: false, message: response.message || 'Failed to save settings' };
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      return { success: false, message: 'Failed to save settings' };
    } finally {
      dispatch({ type: 'SET_SAVING', payload: false });
    }
  };

  const resetSettings = async () => {
    try {
      dispatch({ type: 'SET_SAVING', payload: true });
      const response = await SettingsService.resetSettings();
      
      if (response.success) {
        SettingsService.clearCache();
        await loadSettings();
        return { success: true, message: response.message || 'Settings reset to default' };
      } else {
        return { success: false, message: response.message || 'Failed to reset settings' };
      }
    } catch (error) {
      console.error('Error resetting settings:', error);
      return { success: false, message: 'Failed to reset settings' };
    } finally {
      dispatch({ type: 'SET_SAVING', payload: false });
    }
  };

  const setActiveCategory = (category) => {
    dispatch({ type: 'SET_ACTIVE_CATEGORY', payload: category });
  };

  const value = {
    state,
    updateSetting,
    updateNestedSetting,
    saveSettings,
    resetSettings,
    setActiveCategory,
    loadSettings
  };

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};
