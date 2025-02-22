import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Animated,
  Dimensions,
} from "react-native";
import tw from "tailwind-react-native-classnames";
import { useRouter } from "expo-router";

const { width } = Dimensions.get("window");

export default function OnboardingScreen() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [slideAnim] = useState(new Animated.Value(0));
  const [formData, setFormData] = useState({
    experience: "",
    age: "",
    weight: "",
    height: "",
    gender: "",
  });

  useEffect(() => {
    Animated.spring(slideAnim, {
      toValue: 0,
      tension: 20,
      friction: 7,
      useNativeDriver: true,
    }).start();
  }, [step]);

  const handleStepChange = (newStep) => {
    Animated.timing(slideAnim, {
      toValue: newStep > step ? width : -width,
      duration: 0,
      useNativeDriver: true,
    }).start(() => {
      setStep(newStep);
    });
  };

  const validateInput = () => {
    switch (step) {
      case 1:
        return formData.experience !== "";
      case 2:
        return !isNaN(formData.age) && formData.age > 0 && formData.age < 120;
      case 3:
        return (
          !isNaN(formData.weight) && 
          formData.weight > 0 && 
          formData.weight < 300 &&
          formData.height.trim() !== ""
        );
      case 4:
        return formData.gender !== "";
      default:
        return false;
    }
  };

  const handleContinue = () => {
    if (!validateInput()) {
      let message = "Please fill in all required fields";
      switch (step) {
        case 1:
          message = "Please select your experience level";
          break;
        case 2:
          message = "Please enter a valid age (1-120)";
          break;
        case 3:
          message = "Please enter valid weight (1-300 kg) and height";
          break;
        case 4:
          message = "Please select your gender";
          break;
      }
      alert(message);
      return;
    }

    if (step < 4) {
      handleStepChange(step + 1);
    } else {
      router.push("/auth/signup");
    }
  };

  const ProgressBar = () => (
    <View style={tw`flex-row justify-between px-4 mb-4`}>
      {[1, 2, 3, 4].map((num) => (
        <View
          key={num}
          style={[
            tw`flex-1 h-1 mx-1 rounded-full`,
            step >= num ? tw`bg-blue-500` : tw`bg-gray-200`,
          ]}
        />
      ))}
    </View>
  );

  const StepButton = ({ label, selected, onPress }) => (
    <TouchableOpacity
      style={[
        tw`p-4 rounded-xl border-2 mb-3`,
        selected 
          ? tw`border-blue-500 bg-blue-50` 
          : tw`border-gray-200 bg-gray-50`,
      ]}
      onPress={onPress}
    >
      <Text style={[
        tw`text-base font-medium text-center`,
        selected ? tw`text-blue-500` : tw`text-gray-700`
      ]}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  const ExperienceStep = () => (
    <View style={tw`flex-1 px-6`}>
      <Text style={tw`text-3xl font-bold mb-2 text-gray-800`}>
        Fitness Experience
      </Text>
      <Text style={tw`text-base text-gray-600 mb-8`}>
        Help us create your perfect workout plan
      </Text>
      {["Beginner", "Intermediate", "Advanced"].map((level) => (
        <StepButton
          key={level}
          label={level}
          selected={formData.experience === level}
          onPress={() => setFormData({ ...formData, experience: level })}
        />
      ))}
    </View>
  );

  const AgeStep = () => (
    <View style={tw`flex-1 px-6`}>
      <Text style={tw`text-3xl font-bold mb-2 text-gray-800`}>Your Age</Text>
      <Text style={tw`text-base text-gray-600 mb-8`}>
        Let's personalize your journey
      </Text>
      <TextInput
        style={[
          tw`border-2 border-gray-200 rounded-xl p-4 text-lg mb-4 bg-gray-50`,
          formData.age && tw`border-blue-500 bg-blue-50`,
        ]}
        keyboardType="numeric"
        value={formData.age}
        onChangeText={(text) => {
          const numericValue = text.replace(/[^0-9]/g, '');
          setFormData({ ...formData, age: numericValue });
        }}
        placeholder="Enter your age"
        maxLength={3}
      />
    </View>
  );

  const MeasurementsStep = () => (
    <View style={tw`flex-1 px-6`}>
      <Text style={tw`text-3xl font-bold mb-2 text-gray-800`}>
        Body Measurements
      </Text>
      <Text style={tw`text-base text-gray-600 mb-8`}>
        Help us understand your body better
      </Text>
      <View style={tw`mb-6`}>
        <Text style={tw`text-lg font-medium mb-2 text-gray-700`}>Weight (kg)</Text>
        <TextInput
          style={[
            tw`border-2 border-gray-200 rounded-xl p-4 text-lg bg-gray-50`,
            formData.weight && tw`border-blue-500 bg-blue-50`,
          ]}
          keyboardType="numeric"
          value={formData.weight}
          onChangeText={(text) => {
            const numericValue = text.replace(/[^0-9.]/g, '');
            setFormData({ ...formData, weight: numericValue });
          }}
          placeholder="Enter weight in kg"
          maxLength={5}
        />
      </View>
      <View>
        <Text style={tw`text-lg font-medium mb-2 text-gray-700`}>Height</Text>
        <TextInput
          style={[
            tw`border-2 border-gray-200 rounded-xl p-4 text-lg bg-gray-50`,
            formData.height && tw`border-blue-500 bg-blue-50`,
          ]}
          value={formData.height}
          onChangeText={(text) => setFormData({ ...formData, height: text })}
          placeholder="e.g., 5'11'' or 180cm"
        />
      </View>
    </View>
  );

  const GenderStep = () => (
    <View style={tw`flex-1 px-6`}>
      <Text style={tw`text-3xl font-bold mb-2 text-gray-800`}>Your Gender</Text>
      <Text style={tw`text-base text-gray-600 mb-8`}>
        For a more personalized experience
      </Text>
      {["Male", "Female", "Other"].map((gender) => (
        <StepButton
          key={gender}
          label={gender}
          selected={formData.gender === gender}
          onPress={() => setFormData({ ...formData, gender })}
        />
      ))}
    </View>
  );

  const renderStep = () => {
    const steps = {
      1: <ExperienceStep />,
      2: <AgeStep />,
      3: <MeasurementsStep />,
      4: <GenderStep />,
    };

    return (
      <Animated.View
        style={[
          { transform: [{ translateX: slideAnim }] },
          tw`flex-1`,
        ]}
      >
        {steps[step]}
      </Animated.View>
    );
  };

  return (
    <SafeAreaView style={tw`flex-1 bg-white`}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"} 
        style={tw`flex-1`}
      >
        <View style={tw`flex-row justify-between items-center p-4`}>
          {step > 1 && (
            <TouchableOpacity 
              onPress={() => handleStepChange(step - 1)}
              style={tw`p-2`}
            >
              <Text style={tw`text-2xl text-gray-800`}>←</Text>
            </TouchableOpacity>
          )}
          <View style={tw`flex-1 items-center`}>
            <Text style={tw`text-base font-medium text-gray-600`}>
              Step {step} of 4
            </Text>
          </View>
          {step > 1 && <View style={tw`w-8`} />}
        </View>

        <ProgressBar />
        
        <ScrollView 
          contentContainerStyle={tw`flex-grow`}
          keyboardShouldPersistTaps="handled"
        >
          {renderStep()}
        </ScrollView>

        <View style={tw`p-6`}>
          <TouchableOpacity
            style={[
              tw`p-4 rounded-xl items-center`,
              validateInput() ? tw`bg-blue-500` : tw`bg-gray-300`,
            ]}
            onPress={handleContinue}
          >
            <Text style={tw`text-white text-lg font-bold`}>
              {step === 4 ? 'Complete' : 'Continue'}
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}