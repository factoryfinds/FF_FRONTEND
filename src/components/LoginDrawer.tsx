"use client";

import { useState, useRef, useEffect } from "react";
import { FiX } from "react-icons/fi";
import { toast } from 'react-hot-toast';
import { sendOTP, verifyOTP, APIError } from "../../utlis/api";

interface LoginDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess?: (userData: UserData) => void;
}

interface UserData {
  _id: string;
  phone: string;
  role: string;
  accessToken: string;
  refreshToken: string;
}

const LoginDrawer: React.FC<LoginDrawerProps> = ({ isOpen, onClose, onLoginSuccess }) => {
  const [phone, setPhone] = useState<string>("");
  const [otpSent, setOtpSent] = useState<boolean>(false);
  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
  const [maskedPhone, setMaskedPhone] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [resendCooldown, setResendCooldown] = useState<number>(0);

  // Refs for each OTP input
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Resend cooldown timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (resendCooldown > 0) {
      timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [resendCooldown]);

  // Reset form when drawer opens/closes
  useEffect(() => {
    if (!isOpen) {
      resetForm();
    }
  }, [isOpen]);

  const resetForm = (): void => {
    setPhone("");
    setOtpSent(false);
    setOtp(["", "", "", "", "", ""]);
    setMaskedPhone("");
    setIsLoading(false);
    setResendCooldown(0);
  };

  // Phone number validation for Indian format
  const validatePhoneNumber = (phoneNumber: string): boolean => {
    // Indian mobile number validation: 10 digits starting with 6-9
    const indianMobileRegex = /^[6-9]\d{9}$/;
    return indianMobileRegex.test(phoneNumber);
  };

  const handleSendOtp = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();

    // Validate phone number for Indian format
    if (!validatePhoneNumber(phone)) {
      toast.error("Please enter a valid Indian mobile number (10 digits starting with 6-9)");
      return;
    }

    setIsLoading(true);

    try {
      const response = await sendOTP(phone);

      console.log('OTP Response:', response);

      setOtpSent(true);
      setMaskedPhone(`${phone.slice(0, 2)}*****${phone.slice(-3)}`);
      setResendCooldown(30); // 30 second cooldown for resend
      toast.success(response.message || "OTP sent successfully!");

      // Focus first OTP input
      setTimeout(() => {
        otpRefs.current[0]?.focus();
      }, 100);
    } catch (error) {
      console.error('Send OTP error:', error);

      if (error instanceof APIError) {
        // Handle rate limiting specifically
        if (error.message.includes("Too many OTP requests")) {
          toast.error("Too many requests. Please wait before requesting another OTP.");
        } else {
          toast.error(error.message);
        }
      } else {
        toast.error("Failed to send OTP. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (): Promise<void> => {
    const fullOtp = otp.join("");

    if (fullOtp.length !== 6) {
      toast.error("Please enter complete 6-digit OTP");
      return;
    }

    // Validate OTP format (6 digits)
    if (!/^\d{6}$/.test(fullOtp)) {
      toast.error("OTP must be 6 digits");
      return;
    }

    setIsLoading(true);

    try {
      const userData = await verifyOTP(phone, fullOtp);

      console.log('Verification Response:', userData);

      // Store user data in localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem("user", JSON.stringify({
          _id: userData._id,
          phone: userData.phone,
          role: userData.role,
        }));
      }

      toast.success("Login successful!");

      // Call success callback
      if (onLoginSuccess) {
        onLoginSuccess(userData);
      }

      // Reset form and close drawer
      resetForm();
      onClose();
      // Refresh the page after successful login
      setTimeout(() => {
        window.location.reload();
      }, 500); // Small delay to show success message

    } catch (error) {
      console.error('Verify OTP error:', error);

      if (error instanceof APIError) {
        if (error.message.includes("Invalid or expired OTP")) {
          toast.error("Invalid or expired OTP. Please try again.");
        } else {
          toast.error(error.message);
        }
      } else {
        toast.error("Invalid OTP. Please try again.");
      }

      // Clear OTP on error
      setOtp(["", "", "", "", "", ""]);
      otpRefs.current[0]?.focus();
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async (): Promise<void> => {
    if (resendCooldown > 0 || isLoading) return;

    setIsLoading(true);
    try {
      const response = await sendOTP(phone);
      setResendCooldown(30);
      toast.success(response.message || "OTP resent successfully!");

      // Clear current OTP
      setOtp(["", "", "", "", "", ""]);
      otpRefs.current[0]?.focus();
    } catch (error) {
      console.error('Resend OTP error:', error);

      if (error instanceof APIError) {
        if (error.message.includes("Too many OTP requests")) {
          toast.error("Too many requests. Please wait before requesting another OTP.");
        } else {
          toast.error(error.message);
        }
      } else {
        toast.error("Failed to resend OTP. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpChange = (value: string, index: number): void => {
    if (!/^\d?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Move to next input if value entered
    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }

    // Auto verify when all 6 digits are entered
    if (value && index === 5) {
      const fullOtp = newOtp.join("");
      if (fullOtp.length === 6) {
        setTimeout(() => handleVerifyOtp(), 100);
      }
    }
  };

  const handleOtpKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number): void => {
    if (e.key === "Backspace") {
      if (!otp[index] && index > 0) {
        // Move to previous input if current is empty
        otpRefs.current[index - 1]?.focus();
      } else {
        // Clear current input
        const newOtp = [...otp];
        newOtp[index] = "";
        setOtp(newOtp);
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      otpRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent<HTMLInputElement>): void => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);

    if (pastedData.length > 0) {
      const newOtp = [...otp];
      for (let i = 0; i < Math.min(pastedData.length, 6); i++) {
        newOtp[i] = pastedData[i];
      }
      setOtp(newOtp);

      // Focus the next empty input or the last input
      const nextIndex = Math.min(pastedData.length, 5);
      otpRefs.current[nextIndex]?.focus();

      // Auto verify if 6 digits pasted
      if (pastedData.length === 6) {
        setTimeout(() => handleVerifyOtp(), 100);
      }
    }
  };

  const handleEditPhone = (): void => {
    setOtpSent(false);
    setOtp(["", "", "", "", "", ""]);
    setMaskedPhone("");
    setResendCooldown(0);
  };

  const handlePhoneChange = (value: string): void => {
    // Only allow digits and limit to 10 characters
    const cleanedValue = value.replace(/\D/g, '').slice(0, 10);
    setPhone(cleanedValue);
  };

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
          onClick={onClose}
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-full sm:w-4/5 md:w-3/5 lg:w-2/5 bg-white shadow-2xl z-50 transition-transform duration-300 ease-in-out ${isOpen ? "translate-x-0" : "translate-x-full"
          }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-8 lg:px-12 py-8 lg:py-16 border-b border-gray-200">
          <h2 className="text-xs sm:text-sm font-black text-black uppercase tracking-[0.15em]">My Account</h2>
          <button
            onClick={onClose}
            className="text-black cursor-pointer p-2 hover:bg-gray-50 transition-colors"
            disabled={isLoading}
          >
            <FiX size={20} />
          </button>
        </div>

        <div className="px-8 lg:px-12 pb-10 overflow-y-auto h-full">
          <form className="space-y-8 mt-8" onSubmit={handleSendOtp}>
            <div className="flex justify-between text-xs text-black font-medium uppercase tracking-[0.15em]">
              <label>Login</label>
              <span>Required Fields</span>
            </div>

            {/* Phone Input */}
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="flex-1">
                  <div className="flex items-center border border-gray-300 focus-within:border-black transition-colors duration-300">
                    <span className="px-4 py-4 text-gray-700 font-light text-sm tracking-wide border-r border-gray-300">+91</span>
                    <input
                      type="tel"
                      placeholder="Enter mobile number"
                      value={phone}
                      onChange={(e) => handlePhoneChange(e.target.value)}
                      className="flex-1 px-4 py-4 focus:outline-none text-black disabled:bg-gray-50 text-sm font-light tracking-wide"
                      disabled={otpSent || isLoading}
                      maxLength={10}
                    />
                  </div>
                </div>
                {otpSent && (
                  <button
                    type="button"
                    onClick={handleEditPhone}
                    className="px-4 py-2 text-xs text-black underline hover:no-underline font-light uppercase tracking-[0.1em] transition-all duration-300"
                    disabled={isLoading}
                  >
                    Edit
                  </button>
                )}
              </div>

              {phone && !validatePhoneNumber(phone) && (
                <p className="text-red-600 text-xs font-light tracking-wide">
                  Please enter a valid 10-digit mobile number starting with 6-9
                </p>
              )}
            </div>

            {/* OTP Section */}
            {otpSent && (
              <div className="space-y-6">
                <div className="text-center space-y-2">
                  <p className="text-sm text-black font-medium uppercase tracking-wide">
                    OTP sent to <span className="font-black">+91 {maskedPhone}</span>
                  </p>
                  <p className="text-xs text-gray-600 font-light tracking-wide">
                    Enter the 6-digit code sent to your WhatsApp
                  </p>
                </div>

                <div className="flex gap-3 justify-center max-w-sm mx-auto">
                  {otp.map((digit, idx) => (
                    <input
                      key={idx}
                      ref={(el) => {
                        otpRefs.current[idx] = el;
                      }}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(e.target.value, idx)}
                      onKeyDown={(e) => handleOtpKeyDown(e, idx)}
                      onPaste={idx === 0 ? handleOtpPaste : undefined}
                      className="w-12 h-14 border-b-2 border-gray-300 text-center text-lg text-black focus:outline-none focus:border-black transition-colors disabled:bg-gray-50 font-light"
                      disabled={isLoading}
                    />
                  ))}
                </div>

                {/* Resend OTP */}
                <div className="text-center">
                  {resendCooldown > 0 ? (
                    <p className="text-xs text-gray-600 font-light uppercase tracking-wide">
                      Resend OTP in {resendCooldown}s
                    </p>
                  ) : (
                    <button
                      type="button"
                      onClick={handleResendOtp}
                      className="text-xs text-black underline hover:no-underline font-light uppercase tracking-[0.1em] disabled:text-gray-400 transition-all duration-300"
                      disabled={isLoading}
                    >
                      Resend OTP
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type={otpSent ? "button" : "submit"}
              onClick={otpSent ? handleVerifyOtp : undefined}
              className="w-full bg-black text-white py-4 px-8 text-xs font-light uppercase tracking-[0.2em] hover:bg-gray-800 transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center"
              disabled={isLoading || (otpSent && otp.join("").length !== 6) || (!otpSent && !validatePhoneNumber(phone))}
            >
              {isLoading ? (
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 border border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>{otpSent ? "Verifying" : "Sending"}</span>
                </div>
              ) : (
                otpSent ? "Verify & Login" : "Send OTP"
              )}
            </button>
          </form>

          {/* Additional Info */}
          <div className="mt-8 text-center">
            <p className="text-xs text-gray-600 font-light uppercase tracking-[0.1em] leading-relaxed">
              By continuing, you agree to our Terms of Service and Privacy Policy, We’ll only use this number to send a secure one-time code. No marketing SMS. Verified for your safety.
            </p>
          </div>

          {/* Brand indication */}
          <div className="mt-12 text-center">
            <p className="text-xs font-black text-black uppercase tracking-[0.15em]">FactoryFinds</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginDrawer;