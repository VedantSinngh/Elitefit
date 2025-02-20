import React, { useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import axios from "axios";
import tw from "tailwind-react-native-classnames";
import { useRouter } from "expo-router";

export default function OnboardingScreen() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    experience: "",
    age: "",
    weight: "",
    height: "",
    gender: "",
  });

  const handleContinue = async () => {
    if (step === 2 && (isNaN(formData.age) || formData.age <= 0)) {
      alert("Please enter a valid age.");
      return;
    }
    if (step === 3 && (isNaN(formData.weight) || formData.weight <= 0)) {
      alert("Please enter a valid weight.");
      return;
    }
    if (step === 3 && !formData.height) {
      alert("Please enter a valid height.");
      return;
    }
    if (step < 4) {
      setStep(step + 1);
    } else {
      try {
        const response = await axios.post("http://YOUR_MACHINE_IP:5000/api/onboarding", formData);
        console.log("Onboarding data saved:", response.data);
        router.push("/auth/signup");
      } catch (error) {
        console.error("Error saving onboarding data:", error);
      }
    }
  };

  const ExperienceStep = () => (
    <View style={tw`flex-1 p-4`}>
      <Text style={tw`text-2xl font-bold mb-2`}>How experienced are you?</Text>
      <Text style={tw`text-base text-gray-600 mb-6`}>Tell us how best to personalise your plan.</Text>
      {["Beginner", "Intermediate", "Advanced"].map((level) => (
        <TouchableOpacity
          key={level}
          style={[
            tw`p-4 rounded-lg border border-gray-300 mb-3`,
            formData.experience === level && tw`border-blue-500 bg-blue-50`,
          ]}
          onPress={() => setFormData({ ...formData, experience: level })}
        >
          <Text style={tw`text-base`}>{level}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  const AgeStep = () => (
    <View style={tw`flex-1 p-4`}>
      <Text style={tw`text-2xl font-bold mb-2`}>What's your age?</Text>
      <Text style={tw`text-base text-gray-600 mb-6`}>We would like to create a personalised plan with your age in mind.</Text>
      <TextInput
        style={tw`border border-gray-300 rounded-lg p-3 text-base mb-4`}
        keyboardType="numeric"
        value={formData.age}
        onChangeText={(text) => setFormData({ ...formData, age: text })}
        placeholder="Enter your age"
      />
    </View>
  );

  const MeasurementsStep = () => (
    <View style={tw`flex-1 p-4`}>
      <View style={tw`flex-row justify-between`}>
        <View style={tw`flex-1 mx-2`}>
          <Text style={tw`text-2xl font-bold mb-2`}>What's your weight?</Text>
          <TextInput
            style={tw`border border-gray-300 rounded-lg p-3 text-base mb-4`}
            keyboardType="numeric"
            value={formData.weight}
            onChangeText={(text) => setFormData({ ...formData, weight: text })}
            placeholder="Weight in kg"
          />
        </View>
        <View style={tw`flex-1 mx-2`}>
          <Text style={tw`text-2xl font-bold mb-2`}>What's your height?</Text>
          <TextInput
            style={tw`border border-gray-300 rounded-lg p-3 text-base mb-4`}
            value={formData.height}
            onChangeText={(text) => setFormData({ ...formData, height: text })}
            placeholder="Height in ft/in"
          />
        </View>
      </View>
    </View>
  );

  const GenderStep = () => (
    <View style={tw`flex-1 p-4`}>
      <Text style={tw`text-2xl font-bold mb-2`}>What's your gender?</Text>
      <Text style={tw`text-base text-gray-600 mb-6`}>We need to know your gender to better personalize your experience.</Text>
      {["Male", "Female"].map((gender) => (
        <TouchableOpacity
          key={gender}
          style={[
            tw`p-4 rounded-lg border border-gray-300 mb-3`,
            formData.gender === gender && tw`border-blue-500 bg-blue-50`,
          ]}
          onPress={() => setFormData({ ...formData, gender })}
        >
          <Text style={tw`text-base`}>{gender}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderStep = () => {
    switch (step) {
      case 1: return <ExperienceStep />;
      case 2: return <AgeStep />;
      case 3: return <MeasurementsStep />;
      case 4: return <GenderStep />;
      default: return null;
    }
  };

  return (
    <SafeAreaView style={tw`flex-1 bg-white`}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={tw`flex-1`}>
        <ScrollView contentContainerStyle={tw`flex-grow`}>
          <View style={tw`flex-row justify-between items-center p-4`}>
            {step === 1 ? null : (
              <TouchableOpacity onPress={() => setStep(step - 1)}>
                <Text style={tw`text-2xl p-2`}>←</Text>
              </TouchableOpacity>
            )}
            <Text style={tw`text-base text-gray-600`}>{step}/4</Text>
          </View>
          {renderStep()}
        </ScrollView>
      </KeyboardAvoidingView>
      <TouchableOpacity style={tw`bg-blue-500 m-4 p-4 rounded-lg items-center`} onPress={handleContinue}>
        <Text style={tw`text-white text-base font-bold`}>Continue</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}