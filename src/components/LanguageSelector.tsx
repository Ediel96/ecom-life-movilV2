import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';

interface LanguageSelectorProps {
  isVisible?: boolean;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({ isVisible = true }) => {
  const { i18n, t } = useTranslation();

  const changeLanguage = async (language: string) => {
    try {
      console.log('Attempting to change language to:', language);
      console.log('i18n instance:', i18n);
      console.log('changeLanguage method exists:', typeof i18n?.changeLanguage === 'function');
      
      if (i18n && typeof i18n.changeLanguage === 'function') {
        await i18n.changeLanguage(language);
        console.log(`Language successfully changed to: ${language}`);
        console.log('Current i18n language:', i18n.language);
      } else {
        console.error('i18n.changeLanguage is not available. i18n object:', i18n);
      }
    } catch (error) {
      console.error('Error changing language:', error);
    }
  };

  // Safety check for i18n
  if (!i18n) {
    console.warn('i18n not initialized in LanguageSelector');
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Language (Loading...)</Text>
      </View>
    );
  }

  if (!isVisible) return null;

  // Get language text with fallback
  const getLanguageLabel = () => {
    try {
      return t('settings.language');
    } catch (error) {
      console.warn('Error getting language label:', error);
      return 'Language';
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{getLanguageLabel()}</Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[
            styles.languageButton,
            i18n.language === 'es' && styles.activeButton
          ]}
          onPress={() => changeLanguage('es')}
        >
          <Text style={[
            styles.buttonText,
            i18n.language === 'es' && styles.activeText
          ]}>
            Español
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.languageButton,
            i18n.language === 'en' && styles.activeButton
          ]}
          onPress={() => changeLanguage('en')}
        >
          <Text style={[
            styles.buttonText,
            i18n.language === 'en' && styles.activeText
          ]}>
            English
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  languageButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#e0e0e0',
    backgroundColor: '#f8f9fa',
    alignItems: 'center',
  },
  activeButton: {
    borderColor: '#007bff',
    backgroundColor: '#007bff',
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
  },
  activeText: {
    color: 'white',
    fontWeight: '600',
  },
});