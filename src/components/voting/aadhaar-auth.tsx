'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Fingerprint, Smartphone, Shield, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/utils/cn';

interface AadhaarAuthProps {
  onSuccess: (authData: { aadhaarNumber: string; otp: string }) => void;
  onBack: () => void;
  className?: string;
  isLoading?: boolean;
}

export function AadhaarAuth({ onSuccess, onBack, className, isLoading = false }: AadhaarAuthProps) {
  const [step, setStep] = useState<'aadhaar' | 'otp' | 'biometric'>('aadhaar');
  const [aadhaarNumber, setAadhaarNumber] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes
  const [attempts, setAttempts] = useState(0);
  const [errors, setErrors] = useState<string>('');
  const [biometricSupport, setBiometricSupport] = useState(false);
  
  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Check for biometric support
  useEffect(() => {
    if ('credentials' in navigator && 'create' in navigator.credentials) {
      setBiometricSupport(true);
    }
  }, []);

  // OTP Timer
  useEffect(() => {
    if (step === 'otp' && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [step, timeLeft]);

  const formatAadhaarInput = (value: string) => {
    // Remove all non-digit characters
    const digits = value.replace(/\D/g, '');
    // Limit to 12 digits
    const limited = digits.slice(0, 12);
    // Add spaces for formatting: 1234 5678 9012
    return limited.replace(/(\d{4})(\d{4})(\d{4})/, '$1 $2 $3').trim();
  };

  const handleAadhaarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatAadhaarInput(e.target.value);
    setAadhaarNumber(formatted);
    setErrors('');
  };

  const validateAadhaar = (number: string) => {
    const digits = number.replace(/\s/g, '');
    if (digits.length !== 12) return false;
    if (!/^\d{12}$/.test(digits)) return false;
    // Add Verhoeff algorithm validation here if needed
    return true;
  };

  const handleSendOTP = async () => {
    setErrors('');
    
    if (!validateAadhaar(aadhaarNumber)) {
      setErrors('Please enter a valid 12-digit Aadhaar number');
      return;
    }

    try {
      // Mock API call to send OTP
      await new Promise(resolve => setTimeout(resolve, 1000));
      setStep('otp');
      setTimeLeft(300);
    } catch (error) {
      setErrors('Failed to send OTP. Please try again.');
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1); // Only take the last character
    setOtp(newOtp);
    setErrors('');

    // Auto-focus next input
    if (value && index < 5) {
      otpInputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerifyOTP = async () => {
    const otpValue = otp.join('');
    
    if (otpValue.length !== 6) {
      setErrors('Please enter the complete 6-digit OTP');
      return;
    }

    if (attempts >= 3) {
      setErrors('Maximum attempts exceeded. Please request a new OTP.');
      return;
    }

    try {
      // Mock OTP verification
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // For demo, accept any OTP starting with '1'
      if (otpValue.startsWith('1')) {
        if (biometricSupport) {
          setStep('biometric');
        } else {
          onSuccess({ aadhaarNumber: aadhaarNumber.replace(/\s/g, ''), otp: otpValue });
        }
      } else {
        setAttempts(attempts + 1);
        setErrors(`Invalid OTP. ${3 - attempts - 1} attempts remaining.`);
        setOtp(['', '', '', '', '', '']);
        otpInputRefs.current[0]?.focus();
      }
    } catch (error) {
      setErrors('OTP verification failed. Please try again.');
    }
  };

  const handleBiometricAuth = async () => {
    try {
      if ('credentials' in navigator && 'create' in navigator.credentials) {
        // Mock biometric authentication
        await new Promise(resolve => setTimeout(resolve, 2000));
        onSuccess({ 
          aadhaarNumber: aadhaarNumber.replace(/\s/g, ''), 
          otp: otp.join('') 
        });
      } else {
        // Fallback to success without biometric
        onSuccess({ 
          aadhaarNumber: aadhaarNumber.replace(/\s/g, ''), 
          otp: otp.join('') 
        });
      }
    } catch (error) {
      setErrors('Biometric authentication failed. Proceeding without biometric verification.');
      setTimeout(() => {
        onSuccess({ 
          aadhaarNumber: aadhaarNumber.replace(/\s/g, ''), 
          otp: otp.join('') 
        });
      }, 2000);
    }
  };

  const handleResendOTP = async () => {
    setTimeLeft(300);
    setAttempts(0);
    setOtp(['', '', '', '', '', '']);
    setErrors('');
    // Mock resend API call
    await new Promise(resolve => setTimeout(resolve, 1000));
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className={cn('w-full max-w-md mx-auto p-6 space-y-6', className)}>
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center mb-6">
          <div className="w-16 h-3 bg-saffron-500 rounded-full"></div>
          <div className="w-16 h-3 bg-white-500 border border-gray-300 rounded-full mx-1"></div>
          <div className="w-16 h-3 bg-green-500 rounded-full"></div>
        </div>
        
        <div className="flex items-center justify-center w-16 h-16 bg-saffron-100 rounded-full mx-auto">
          <Shield className="w-8 h-8 text-saffron-600" />
        </div>
        
        <h1 className="text-2xl font-bold text-gray-900">
          {step === 'aadhaar' && 'Verify Your Identity'}
          {step === 'otp' && 'Enter OTP'}
          {step === 'biometric' && 'Biometric Verification'}
        </h1>
        
        <p className="text-sm text-gray-600">
          {step === 'aadhaar' && 'Enter your 12-digit Aadhaar number to continue'}
          {step === 'otp' && `Enter the 6-digit OTP sent to your registered mobile number`}
          {step === 'biometric' && 'Complete biometric verification for enhanced security'}
        </p>
      </div>

      {/* Error Display */}
      {errors && (
        <div className="flex items-center space-x-2 p-3 bg-red-50 border border-red-200 rounded-lg">
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
          <span className="text-sm text-red-700">{errors}</span>
        </div>
      )}

      {/* Aadhaar Input Step */}
      {step === 'aadhaar' && (
        <div className="space-y-4">
          <div>
            <label htmlFor="aadhaar" className="block text-sm font-medium text-gray-700 mb-2">
              Aadhaar Number
            </label>
            <input
              id="aadhaar"
              type="text"
              value={aadhaarNumber}
              onChange={handleAadhaarChange}
              placeholder="1234 5678 9012"
              className={cn(
                'w-full p-4 border-2 rounded-lg text-lg tracking-widest text-center',
                'focus:outline-none focus:ring-2 focus:ring-saffron-500 focus:border-saffron-500',
                'placeholder-gray-400',
                errors && 'border-red-300'
              )}
              maxLength={14} // 12 digits + 2 spaces
              autoComplete="off"
              aria-describedby={errors ? 'aadhaar-error' : undefined}
            />
          </div>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start space-x-2">
              <Shield className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-blue-700">
                <p className="font-medium">Your privacy is protected</p>
                <p>Your Aadhaar number is encrypted and used only for voter verification. It will not be stored or shared.</p>
              </div>
            </div>
          </div>

          <Button
            onClick={handleSendOTP}
            className="w-full"
            size="lg"
            disabled={!validateAadhaar(aadhaarNumber) || isLoading}
            loading={isLoading}
          >
            Send OTP
          </Button>
        </div>
      )}

      {/* OTP Input Step */}
      {step === 'otp' && (
        <div className="space-y-4">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Smartphone className="w-5 h-5 text-gray-400" />
            <span className="text-sm text-gray-600">
              OTP sent to +91 ****{aadhaarNumber.slice(-4)}
            </span>
          </div>

          <div className="flex justify-center space-x-3">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (otpInputRefs.current[index] = el)}
                type="text"
                value={digit}
                onChange={(e) => handleOtpChange(index, e.target.value)}
                onKeyDown={(e) => handleOtpKeyDown(index, e)}
                className={cn(
                  'w-12 h-12 text-center text-lg font-bold border-2 rounded-lg',
                  'focus:outline-none focus:ring-2 focus:ring-saffron-500 focus:border-saffron-500',
                  'transition-colors',
                  digit && 'border-saffron-300 bg-saffron-50',
                  errors && 'border-red-300'
                )}
                maxLength={1}
                autoComplete="off"
              />
            ))}
          </div>

          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-1 text-gray-500">
              <Clock className="w-4 h-4" />
              <span>Time remaining: {formatTime(timeLeft)}</span>
            </div>
            
            {timeLeft === 0 ? (
              <button
                onClick={handleResendOTP}
                className="text-saffron-600 hover:text-saffron-700 font-medium"
              >
                Resend OTP
              </button>
            ) : (
              <span className="text-gray-400">Resend OTP</span>
            )}
          </div>

          <Button
            onClick={handleVerifyOTP}
            className="w-full"
            size="lg"
            disabled={otp.join('').length !== 6 || isLoading}
            loading={isLoading}
          >
            Verify OTP
          </Button>
        </div>
      )}

      {/* Biometric Verification Step */}
      {step === 'biometric' && (
        <div className="space-y-6">
          <div className="text-center">
            <div className="flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mx-auto mb-4">
              <Fingerprint className="w-10 h-10 text-green-600" />
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Place your finger on the sensor or use face recognition to complete verification
            </p>
          </div>

          <div className="grid grid-cols-1 gap-3">
            <Button
              onClick={handleBiometricAuth}
              variant="outline"
              size="lg"
              className="flex items-center justify-center space-x-2"
              loading={isLoading}
            >
              <Fingerprint className="w-5 h-5" />
              <span>Use Fingerprint</span>
            </Button>

            <Button
              onClick={handleBiometricAuth}
              variant="outline"
              size="lg"
              className="flex items-center justify-center space-x-2"
            >
              <div className="w-5 h-5 rounded-full border-2 border-current flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-current"></div>
              </div>
              <span>Use Face Recognition</span>
            </Button>
          </div>

          <Button
            onClick={() => onSuccess({ 
              aadhaarNumber: aadhaarNumber.replace(/\s/g, ''), 
              otp: otp.join('') 
            })}
            variant="ghost"
            className="w-full"
          >
            Skip Biometric Verification
          </Button>
        </div>
      )}

      {/* Navigation */}
      <div className="flex justify-between pt-4">
        <Button variant="ghost" onClick={onBack}>
          Back
        </Button>
        
        {step === 'otp' && (
          <Button
            variant="ghost"
            onClick={() => setStep('aadhaar')}
            className="text-sm"
          >
            Change Aadhaar Number
          </Button>
        )}
      </div>

      {/* Help Text */}
      <div className="text-center text-xs text-gray-500 space-y-1">
        <p>Having trouble? Call the Election Commission helpline: 1950</p>
        <p>समस्या हो रही है? चुनाव आयोग हेल्पलाइन पर कॉल करें: 1950</p>
      </div>
    </div>
  );
}

export default AadhaarAuth;