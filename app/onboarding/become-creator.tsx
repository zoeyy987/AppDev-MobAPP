import AsyncStorage from '@react-native-async-storage/async-storage';
import { Feather, Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { styles } from '@/styles/BecomeCreatorScreen.styles';
import { CREATOR_TERMS_OF_SERVICE, getFormattedToS } from '@/constants/creatorTermsOfService';
import { MOCK_USER_ROLE_STORAGE_KEY } from '@/constants/mockUser';
import { useTheme } from '@/context/ThemeContext';

type Country = {
  code: string;
  dialCode: string;
  name: string;
  validationRegex: RegExp;
  validationError: string;
};

type AlertType = 'success' | 'warning' | 'error' | 'info';
type AlertAction = {
  text: string;
  onPress?: () => void;
  style?: 'default' | 'cancel';
};

const MAIN_CATEGORIES = [
  { id: 'design', label: 'Design & Creative', icon: 'color-palette-outline' },
  { id: 'dev', label: 'Development & IT', icon: 'code-slash-outline' },
  { id: 'writing', label: 'Writing & Translation', icon: 'document-text-outline' },
  { id: 'marketing', label: 'Digital Marketing', icon: 'trending-up-outline' },
  { id: 'video', label: 'Video & Animation', icon: 'videocam-outline' },
  { id: 'audio', label: 'Music & Audio', icon: 'musical-notes-outline' },
] as const;

const SUBCATEGORY_MAP: Record<string, string[]> = {
  'Design & Creative': ['Logo Design', 'Brand Identity', 'Illustration', 'UI/UX Design', 'Social Media Posts'],
  'Development & IT': ['Web Development', 'Mobile App Development', 'Frontend Support', 'Backend APIs', 'QA Testing'],
  'Writing & Translation': ['Blog Writing', 'Copywriting', 'Proofreading', 'Translation', 'Script Writing'],
  'Digital Marketing': ['Social Media Marketing', 'SEO', 'Content Strategy', 'Ads Management', 'Email Marketing'],
  'Video & Animation': ['Video Editing', 'Motion Graphics', '2D Animation', '3D Product Animation', 'Visual Effects'],
  'Music & Audio': ['Voice Over', 'Podcast Editing', 'Mixing & Mastering', 'Jingles', 'Singing'],
};

const COUNTRIES: Country[] = [
  {
    code: 'PH',
    dialCode: '+63',
    name: 'Philippines',
    validationRegex: /^09\d{9}$/,
    validationError: 'Please enter a valid 11-digit PH mobile number starting with 09',
  },
  {
    code: 'US',
    dialCode: '+1',
    name: 'United States',
    validationRegex: /^\d{10}$/,
    validationError: 'Please enter a valid 10-digit US phone number',
  },
  {
    code: 'GB',
    dialCode: '+44',
    name: 'United Kingdom',
    validationRegex: /^07\d{9}$/,
    validationError: 'Please enter a valid UK mobile number starting with 07',
  },
];

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export default function BecomeCreatorScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const scrollRef = useRef<ScrollView>(null);

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [showCountryModal, setShowCountryModal] = useState(false);
  const [showCustomSkillModal, setShowCustomSkillModal] = useState(false);
  const [showFullTerms, setShowFullTerms] = useState(false);

  const [firstName, setFirstName] = useState('');
  const [middleName, setMiddleName] = useState('');
  const [lastName, setLastName] = useState('');
  const [streetAddress, setStreetAddress] = useState('');
  const [city, setCity] = useState('');
  const [province, setProvince] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [phone, setPhone] = useState('');
  const [idNumber, setIdNumber] = useState('');
  const [selectedCountry, setSelectedCountry] = useState<Country>(COUNTRIES[0]);

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [customSkills, setCustomSkills] = useState<string[]>([]);
  const [customSkillInput, setCustomSkillInput] = useState('');
  const [experience, setExperience] = useState('');
  const [minRate, setMinRate] = useState('');
  const [turnaround, setTurnaround] = useState('');
  const [portfolio, setPortfolio] = useState('');
  const [bio, setBio] = useState('');
  const [agreed, setAgreed] = useState(false);

  const [alertVisible, setAlertVisible] = useState(false);
  const [alertConfig, setAlertConfig] = useState<{
    type: AlertType;
    title: string;
    message: string;
    actions?: AlertAction[];
  }>({
    type: 'info',
    title: '',
    message: '',
  });

  const skillsForCategory = useMemo(
    () => (selectedCategory ? SUBCATEGORY_MAP[selectedCategory] ?? [] : []),
    [selectedCategory]
  );

  const themeStyles = {
    container: { backgroundColor: theme.background },
    card: { backgroundColor: theme.card, borderColor: theme.cardBorder },
    text: { color: theme.text },
    textSecondary: { color: theme.textSecondary },
    input: {
      backgroundColor: theme.inputBackground,
      borderColor: theme.inputBorder,
      color: theme.text,
    },
  };

  const showAlert = (type: AlertType, title: string, message: string, actions?: AlertAction[]) => {
    setAlertConfig({ type, title, message, actions });
    setAlertVisible(true);
  };

  const closeAlert = () => {
    setAlertVisible(false);
  };

  const scrollToTop = () => {
    scrollRef.current?.scrollTo({ y: 0, animated: true });
  };

  const cleanDigits = (value: string) => value.replace(/[^0-9]/g, '');

  const toggleSkill = (skill: string) => {
    setSelectedSkills((current) =>
      current.includes(skill) ? current.filter((item) => item !== skill) : [...current, skill]
    );
  };

  const addCustomSkill = () => {
    const trimmed = customSkillInput.trim();
    if (!trimmed) {
      return;
    }

    if (!customSkills.includes(trimmed) && !selectedSkills.includes(trimmed)) {
      setCustomSkills((current) => [...current, trimmed]);
      setSelectedSkills((current) => [...current, trimmed]);
    }

    setCustomSkillInput('');
    setShowCustomSkillModal(false);
  };

  const removeCustomSkill = (skill: string) => {
    setCustomSkills((current) => current.filter((item) => item !== skill));
    setSelectedSkills((current) => current.filter((item) => item !== skill));
  };

  const validateStepOne = () => {
    if (!firstName.trim() || !lastName.trim() || !streetAddress.trim() || !city.trim()) {
      showAlert('warning', 'Missing details', 'Please complete your name and address details before continuing.');
      return false;
    }

    const cleanedPhone = cleanDigits(phone);
    if (!selectedCountry.validationRegex.test(cleanedPhone)) {
      showAlert('warning', 'Invalid phone number', selectedCountry.validationError);
      return false;
    }

    if (!/^\d{8,16}$/.test(cleanDigits(idNumber))) {
      showAlert('warning', 'Invalid ID number', 'Please enter a valid government ID number with 8 to 16 digits.');
      return false;
    }

    setPhone(cleanedPhone);
    return true;
  };

  const validateStepTwo = () => {
    if (!selectedCategory) {
      showAlert('warning', 'Category required', 'Choose your main creator category first.');
      return false;
    }

    if (selectedSkills.length === 0) {
      showAlert('warning', 'Skills required', 'Select at least one skill to describe what you offer.');
      return false;
    }

    if (!experience.trim() || !minRate.trim() || !turnaround.trim() || !bio.trim()) {
      showAlert('warning', 'Incomplete profile', 'Please complete your experience, rate, turnaround, and bio.');
      return false;
    }

    return true;
  };

  const handleNext = () => {
    const isValid = step === 1 ? validateStepOne() : validateStepTwo();
    if (!isValid) {
      return;
    }

    setStep((current) => current + 1);
    scrollToTop();
  };

  const handleBack = () => {
    setStep((current) => current - 1);
    scrollToTop();
  };

  const handleSubmit = async () => {
    if (!agreed) {
      showAlert('warning', 'Agreement required', 'You must agree to the Creator Terms of Service before submitting.');
      return;
    }

    setLoading(true);
    try {
      await wait(900);
      await AsyncStorage.setItem(MOCK_USER_ROLE_STORAGE_KEY, 'creator');

      showAlert('success', 'Creator profile ready', 'Your creator onboarding has been completed for this app build.', [
        {
          text: 'Go to Profile',
          onPress: () => router.replace('/(tabs)/profile'),
        },
      ]);
    } catch {
      showAlert('error', 'Submission failed', 'Unable to save your creator status right now. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderAlert = () => {
    const color =
      alertConfig.type === 'success'
        ? '#10b981'
        : alertConfig.type === 'error'
          ? '#ef4444'
          : alertConfig.type === 'warning'
            ? '#f59e0b'
            : theme.tint;

    const iconName =
      alertConfig.type === 'success'
        ? 'checkmark-circle'
        : alertConfig.type === 'error'
          ? 'alert-circle'
          : alertConfig.type === 'warning'
            ? 'warning'
            : 'information-circle';

    return (
      <Modal transparent visible={alertVisible} animationType="fade" onRequestClose={closeAlert}>
        <View style={styles.modalBackdrop}>
          <View style={[styles.alertCard, { backgroundColor: theme.card }]}>
            <View style={[styles.alertIconWrap, { backgroundColor: color + '18' }]}>
              <Ionicons name={iconName} size={30} color={color} />
            </View>
            <Text style={[styles.alertTitle, themeStyles.text]}>{alertConfig.title}</Text>
            <Text style={[styles.alertMessage, themeStyles.textSecondary]}>{alertConfig.message}</Text>
            <View style={styles.alertActions}>
              {alertConfig.actions?.length ? (
                alertConfig.actions.map((action) => (
                  <Pressable
                    key={action.text}
                    style={[
                      styles.alertButton,
                      action.style === 'cancel'
                        ? { backgroundColor: 'transparent', borderColor: theme.cardBorder, borderWidth: 1 }
                        : { backgroundColor: color },
                    ]}
                    onPress={() => {
                      closeAlert();
                      action.onPress?.();
                    }}
                  >
                    <Text
                      style={[
                        styles.alertButtonText,
                        { color: action.style === 'cancel' ? theme.text : '#FFFFFF' },
                      ]}
                    >
                      {action.text}
                    </Text>
                  </Pressable>
                ))
              ) : (
                <Pressable style={[styles.alertButton, { backgroundColor: color }]} onPress={closeAlert}>
                  <Text style={styles.alertButtonText}>Okay</Text>
                </Pressable>
              )}
            </View>
          </View>
        </View>
      </Modal>
    );
  };

  const renderStepOne = () => (
    <View>
      <View style={styles.trustBanner}>
        <Ionicons name="shield-checkmark" size={22} color="#059669" />
        <Text style={styles.trustBannerText}>
          Creator onboarding starts with identity and contact details so client trust features can be enabled.
        </Text>
      </View>

      <Text style={[styles.label, themeStyles.text]}>First Name</Text>
      <TextInput
        style={[styles.input, themeStyles.input]}
        placeholder="Given name"
        placeholderTextColor={theme.textSecondary}
        value={firstName}
        onChangeText={setFirstName}
      />

      <Text style={[styles.label, themeStyles.text]}>Middle Name (Optional)</Text>
      <TextInput
        style={[styles.input, themeStyles.input]}
        placeholder="Middle name"
        placeholderTextColor={theme.textSecondary}
        value={middleName}
        onChangeText={setMiddleName}
      />

      <Text style={[styles.label, themeStyles.text]}>Last Name</Text>
      <TextInput
        style={[styles.input, themeStyles.input]}
        placeholder="Family name"
        placeholderTextColor={theme.textSecondary}
        value={lastName}
        onChangeText={setLastName}
      />

      <Text style={[styles.label, themeStyles.text]}>Street Address</Text>
      <TextInput
        style={[styles.input, themeStyles.input]}
        placeholder="House no., street, building"
        placeholderTextColor={theme.textSecondary}
        value={streetAddress}
        onChangeText={setStreetAddress}
      />

      <View style={styles.row}>
        <View style={styles.rowItem}>
          <Text style={[styles.label, themeStyles.text]}>City</Text>
          <TextInput
            style={[styles.input, themeStyles.input]}
            placeholder="City"
            placeholderTextColor={theme.textSecondary}
            value={city}
            onChangeText={setCity}
          />
        </View>
        <View style={[styles.rowItem, styles.rowItemRight]}>
          <Text style={[styles.label, themeStyles.text]}>Province</Text>
          <TextInput
            style={[styles.input, themeStyles.input]}
            placeholder="Province"
            placeholderTextColor={theme.textSecondary}
            value={province}
            onChangeText={setProvince}
          />
        </View>
      </View>

      <Text style={[styles.label, themeStyles.text]}>Postal Code</Text>
      <TextInput
        style={[styles.input, themeStyles.input]}
        placeholder="Postal code"
        placeholderTextColor={theme.textSecondary}
        keyboardType="number-pad"
        value={postalCode}
        onChangeText={(text) => setPostalCode(cleanDigits(text))}
      />

      <Text style={[styles.label, themeStyles.text]}>Phone Number</Text>
      <View style={[styles.phoneRow, themeStyles.input]}>
        <Pressable style={styles.countryPicker} onPress={() => setShowCountryModal(true)}>
          <Text style={[styles.countryPickerText, themeStyles.text]}>{selectedCountry.code}</Text>
          <Feather name="chevron-down" size={16} color={theme.text} />
        </Pressable>
        <Text style={[styles.dialCode, themeStyles.text]}>{selectedCountry.dialCode}</Text>
        <TextInput
          style={[styles.phoneInput, { color: theme.text }]}
          placeholder="Mobile number"
          placeholderTextColor={theme.textSecondary}
          keyboardType="phone-pad"
          value={phone}
          onChangeText={(text) => setPhone(cleanDigits(text))}
        />
      </View>

      <Text style={[styles.label, themeStyles.text]}>Government ID Number</Text>
      <TextInput
        style={[styles.input, themeStyles.input]}
        placeholder="Numbers only"
        placeholderTextColor={theme.textSecondary}
        keyboardType="number-pad"
        value={idNumber}
        onChangeText={(text) => setIdNumber(cleanDigits(text))}
      />

      <View style={[styles.infoCard, themeStyles.card]}>
        <Text style={[styles.infoCardTitle, themeStyles.text]}>Verification uploads</Text>
        <Text style={[styles.infoCardText, themeStyles.textSecondary]}>
          The reference app includes ID photo uploads. This repo does not have that backend wired in yet, so the onboarding keeps the identity form and terms flow ready.
        </Text>
      </View>
    </View>
  );

  const renderStepTwo = () => (
    <View>
      <Text style={[styles.sectionTitle, themeStyles.text]}>Choose your main category</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryScroll}>
        {MAIN_CATEGORIES.map((category) => {
          const selected = selectedCategory === category.label;
          return (
            <Pressable
              key={category.id}
              style={[
                styles.categoryCard,
                themeStyles.card,
                selected && { borderColor: theme.tint, backgroundColor: theme.tint + '10' },
              ]}
              onPress={() => setSelectedCategory(category.label)}
            >
              <Ionicons name={category.icon} size={22} color={selected ? theme.tint : theme.text} />
              <Text style={[styles.categoryTitle, { color: selected ? theme.tint : theme.text }]}>{category.label}</Text>
            </Pressable>
          );
        })}
      </ScrollView>

      <Text style={[styles.sectionTitle, themeStyles.text]}>Select your skills</Text>
      <View style={styles.chipsWrap}>
        {skillsForCategory.map((skill) => {
          const selected = selectedSkills.includes(skill);
          return (
            <Pressable
              key={skill}
              style={[
                styles.chip,
                themeStyles.card,
                selected && { borderColor: theme.tint, backgroundColor: theme.tint + '10' },
              ]}
              onPress={() => toggleSkill(skill)}
            >
              <Text style={[styles.chipText, { color: selected ? theme.tint : theme.text }]}>{skill}</Text>
            </Pressable>
          );
        })}
      </View>

      <Pressable style={[styles.addSkillButton, { borderColor: theme.cardBorder }]} onPress={() => setShowCustomSkillModal(true)}>
        <Ionicons name="add-circle-outline" size={18} color={theme.text} />
        <Text style={[styles.addSkillText, themeStyles.text]}>Add custom skill</Text>
      </Pressable>

      {customSkills.length > 0 && (
        <View style={styles.customSkillsWrap}>
          {customSkills.map((skill) => (
            <View key={skill} style={[styles.customSkillChip, { backgroundColor: theme.card }]}>
              <Text style={[styles.customSkillText, themeStyles.text]}>{skill}</Text>
              <Pressable onPress={() => removeCustomSkill(skill)}>
                <Feather name="x" size={14} color={theme.textSecondary} />
              </Pressable>
            </View>
          ))}
        </View>
      )}

      <Text style={[styles.label, themeStyles.text]}>Years of Experience</Text>
      <TextInput
        style={[styles.input, themeStyles.input]}
        placeholder="e.g. 3 years"
        placeholderTextColor={theme.textSecondary}
        value={experience}
        onChangeText={setExperience}
      />

      <Text style={[styles.label, themeStyles.text]}>Starting Rate</Text>
      <TextInput
        style={[styles.input, themeStyles.input]}
        placeholder="e.g. PHP 1,500"
        placeholderTextColor={theme.textSecondary}
        value={minRate}
        onChangeText={setMinRate}
      />

      <Text style={[styles.label, themeStyles.text]}>Typical Turnaround</Text>
      <TextInput
        style={[styles.input, themeStyles.input]}
        placeholder="e.g. 2-3 days"
        placeholderTextColor={theme.textSecondary}
        value={turnaround}
        onChangeText={setTurnaround}
      />

      <Text style={[styles.label, themeStyles.text]}>Portfolio Link (Optional)</Text>
      <TextInput
        style={[styles.input, themeStyles.input]}
        placeholder="https://"
        placeholderTextColor={theme.textSecondary}
        value={portfolio}
        onChangeText={setPortfolio}
        autoCapitalize="none"
      />

      <Text style={[styles.label, themeStyles.text]}>Professional Bio</Text>
      <TextInput
        style={[styles.input, styles.textArea, themeStyles.input]}
        placeholder="Tell clients what you do best and how you work."
        placeholderTextColor={theme.textSecondary}
        multiline
        value={bio}
        onChangeText={setBio}
      />
    </View>
  );

  const renderStepThree = () => (
    <View>
      <View style={[styles.summaryCard, themeStyles.card]}>
        <Text style={[styles.summaryTitle, themeStyles.text]}>Application Summary</Text>
        <Text style={[styles.summaryLine, themeStyles.textSecondary]}>
          <Text style={[styles.summaryLabel, themeStyles.text]}>Name: </Text>
          {[firstName, middleName, lastName].filter(Boolean).join(' ')}
        </Text>
        <Text style={[styles.summaryLine, themeStyles.textSecondary]}>
          <Text style={[styles.summaryLabel, themeStyles.text]}>Category: </Text>
          {selectedCategory}
        </Text>
        <Text style={[styles.summaryLine, themeStyles.textSecondary]}>
          <Text style={[styles.summaryLabel, themeStyles.text]}>Skills: </Text>
          {selectedSkills.join(', ')}
        </Text>
        <Text style={[styles.summaryLine, themeStyles.textSecondary]}>
          <Text style={[styles.summaryLabel, themeStyles.text]}>Rate: </Text>
          {minRate}
        </Text>
        <Text style={[styles.summaryLine, themeStyles.textSecondary]}>
          <Text style={[styles.summaryLabel, themeStyles.text]}>Turnaround: </Text>
          {turnaround}
        </Text>
      </View>

      <View style={[styles.termsCard, themeStyles.card]}>
        <Text style={[styles.summaryTitle, themeStyles.text]}>Creator Terms of Service</Text>
        <Text style={[styles.termsSummary, themeStyles.textSecondary]}>{CREATOR_TERMS_OF_SERVICE.summary}</Text>
        <Pressable style={styles.readTermsLink} onPress={() => setShowFullTerms(true)}>
          <Text style={[styles.readTermsText, { color: theme.tint }]}>Read full terms</Text>
          <Feather name="arrow-up-right" size={16} color={theme.tint} />
        </Pressable>
      </View>

      <Pressable style={styles.checkboxRow} onPress={() => setAgreed((current) => !current)}>
        <Ionicons name={agreed ? 'checkbox' : 'square-outline'} size={24} color={theme.tint} />
        <Text style={[styles.checkboxText, themeStyles.text]}>
          I agree to the Creator Terms of Service and confirm the information above is accurate.
        </Text>
      </Pressable>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, themeStyles.container]}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.closeButton}>
            <Ionicons name="close" size={26} color={theme.text} />
          </Pressable>
          <View style={styles.stepIndicator}>
            <View style={[styles.stepDot, step >= 1 && { backgroundColor: theme.tint }]} />
            <View style={[styles.stepLine, step >= 2 && { backgroundColor: theme.tint }]} />
            <View style={[styles.stepDot, step >= 2 && { backgroundColor: theme.tint }]} />
            <View style={[styles.stepLine, step >= 3 && { backgroundColor: theme.tint }]} />
            <View style={[styles.stepDot, step >= 3 && { backgroundColor: theme.tint }]} />
          </View>
          <View style={styles.closeSpacer} />
        </View>

        <View style={styles.headerText}>
          <Text style={[styles.title, themeStyles.text]}>
            {step === 1 ? 'Identity Verification' : step === 2 ? 'Professional Profile' : 'Review & Agree'}
          </Text>
          <Text style={[styles.subtitle, themeStyles.textSecondary]}>Step {step} of 3</Text>
        </View>

        <ScrollView ref={scrollRef} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          {step === 1 && renderStepOne()}
          {step === 2 && renderStepTwo()}
          {step === 3 && renderStepThree()}

          <View style={styles.footer}>
            {step > 1 && (
              <Pressable
                style={[styles.footerButton, styles.secondaryButton, { borderColor: theme.cardBorder }]}
                onPress={handleBack}
              >
                <Text style={[styles.secondaryButtonText, themeStyles.text]}>Back</Text>
              </Pressable>
            )}
            <Pressable
              style={[styles.footerButton, styles.primaryButton, { backgroundColor: theme.tint, flex: step === 1 ? 1 : 0.62 }]}
              onPress={step === 3 ? handleSubmit : handleNext}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.primaryButtonText}>{step === 3 ? 'Submit Application' : 'Next Step'}</Text>
              )}
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {renderAlert()}

      <Modal visible={showCountryModal} animationType="slide" onRequestClose={() => setShowCountryModal(false)}>
        <SafeAreaView style={[styles.modalScreen, themeStyles.container]}>
          <View style={[styles.modalHeader, { borderBottomColor: theme.cardBorder }]}>
            <Text style={[styles.modalTitle, themeStyles.text]}>Select country</Text>
            <Pressable onPress={() => setShowCountryModal(false)}>
              <Feather name="x" size={22} color={theme.text} />
            </Pressable>
          </View>
          <ScrollView contentContainerStyle={styles.modalContent}>
            {COUNTRIES.map((country) => (
              <Pressable
                key={country.code}
                style={[styles.countryRow, { borderBottomColor: theme.cardBorder }]}
                onPress={() => {
                  setSelectedCountry(country);
                  setShowCountryModal(false);
                }}
              >
                <View>
                  <Text style={[styles.countryName, themeStyles.text]}>{country.name}</Text>
                  <Text style={[styles.countryDial, themeStyles.textSecondary]}>
                    {country.code} {country.dialCode}
                  </Text>
                </View>
                {selectedCountry.code === country.code && <Feather name="check" size={18} color={theme.tint} />}
              </Pressable>
            ))}
          </ScrollView>
        </SafeAreaView>
      </Modal>

      <Modal visible={showCustomSkillModal} animationType="slide" onRequestClose={() => setShowCustomSkillModal(false)}>
        <SafeAreaView style={[styles.modalScreen, themeStyles.container]}>
          <View style={[styles.modalHeader, { borderBottomColor: theme.cardBorder }]}>
            <Text style={[styles.modalTitle, themeStyles.text]}>Add custom skill</Text>
            <Pressable onPress={() => setShowCustomSkillModal(false)}>
              <Feather name="x" size={22} color={theme.text} />
            </Pressable>
          </View>
          <View style={styles.modalContent}>
            <Text style={[styles.label, themeStyles.text]}>Skill Name</Text>
            <TextInput
              style={[styles.input, themeStyles.input]}
              placeholder="e.g. Storyboarding"
              placeholderTextColor={theme.textSecondary}
              value={customSkillInput}
              onChangeText={setCustomSkillInput}
              autoFocus
            />
            <Pressable style={[styles.primaryInlineButton, { backgroundColor: theme.tint }]} onPress={addCustomSkill}>
              <Text style={styles.primaryButtonText}>Add Skill</Text>
            </Pressable>
          </View>
        </SafeAreaView>
      </Modal>

      <Modal visible={showFullTerms} animationType="slide" onRequestClose={() => setShowFullTerms(false)}>
        <SafeAreaView style={[styles.modalScreen, themeStyles.container]}>
          <View style={[styles.modalHeader, { borderBottomColor: theme.cardBorder }]}>
            <Text style={[styles.modalTitle, themeStyles.text]}>Creator Terms</Text>
            <Pressable onPress={() => setShowFullTerms(false)}>
              <Feather name="x" size={22} color={theme.text} />
            </Pressable>
          </View>
          <ScrollView contentContainerStyle={styles.modalContent}>
            <Text style={[styles.fullTermsText, themeStyles.text]}>{getFormattedToS()}</Text>
          </ScrollView>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}
