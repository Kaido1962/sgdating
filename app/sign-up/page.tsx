"use client"

import Navbar from "@/components/navbar"
import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  ConfirmationResult
} from "firebase/auth"
import { auth, db } from "@/lib/firebase"
import { doc, setDoc, serverTimestamp, getDoc, Timestamp } from "firebase/firestore"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { E164Number } from "libphonenumber-js/core"
import { ChevronLeft } from "lucide-react"

// Import our new components
import { PhoneNumberInput } from "@/components/PhoneNumberInput"
import { OTPVerification } from "@/components/OTPVerification"
import { AgeVerification } from "@/components/AgeVerification"
import { ConsentForm } from "@/components/ConsentForm"
import { ProgressIndicator } from "@/components/ProgressIndicator"

export default function SignUpPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  // Step 1: Basic Info
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [phoneNumber, setPhoneNumber] = useState<E164Number | undefined>()
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  // Step 2: Age Verification
  const [dateOfBirth, setDateOfBirth] = useState<Date | null>(null)
  const [ageValid, setAgeValid] = useState(false)

  // Step 3: Consents
  const [consents, setConsents] = useState({
    popia: false,
    gdpr: false,
    terms: false,
    privacy: false,
    marketing: false
  })
  const [consentErrors, setConsentErrors] = useState<Record<string, string>>({})

  // Step 4: OTP
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null)
  const [recaptchaVerifier, setRecaptchaVerifier] = useState<RecaptchaVerifier | null>(null)

  const steps = ["Basic Info", "Age Check", "Consent", "Verify Phone"]

  const validateStep1 = () => {
    if (!fullName.trim()) {
      setError("Please enter your full name")
      return false
    }
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) {
      setError("Please enter a valid email address")
      return false
    }
    if (!phoneNumber) {
      setError("Please enter your phone number")
      return false
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters")
      return false
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match")
      return false
    }
    setError("")
    return true
  }

  const validateStep2 = () => {
    if (!dateOfBirth) {
      setError("Please select your date of birth")
      return false
    }
    if (!ageValid) {
      setError("You must be at least 18 years old to create an account")
      return false
    }
    setError("")
    return true
  }

  const validateStep3 = () => {
    const errors: Record<string, string> = {}
    if (!consents.popia) errors.popia = "POPIA consent is required"
    if (!consents.terms) errors.terms = "You must accept the Terms of Service"
    if (!consents.privacy) errors.privacy = "You must accept the Privacy Policy"

    setConsentErrors(errors)
    if (Object.keys(errors).length > 0) {
      setError("Please accept all required consents to continue")
      return false
    }
    setError("")
    return true
  }

  const handleNext = async () => {
    if (currentStep === 1 && !validateStep1()) return
    if (currentStep === 2 && !validateStep2()) return
    if (currentStep === 3 && !validateStep3()) return

    if (currentStep === 3) {
      // Before moving to OTP step, send OTP
      await sendOTP()
    } else {
      setCurrentStep(currentStep + 1)
    }
  }

  const handleBack = () => {
    setError("")
    setCurrentStep(currentStep - 1)
  }

  const sendOTP = async () => {
    if (!phoneNumber) return

    setLoading(true)
    setError("")

    try {
      // Initialize reCAPTCHA
      if (!recaptchaVerifier) {
        const verifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
          size: 'invisible',
          callback: () => {
            // reCAPTCHA solved
          }
        })
        setRecaptchaVerifier(verifier)

        const confirmation = await signInWithPhoneNumber(auth, phoneNumber, verifier)
        setConfirmationResult(confirmation)
        setCurrentStep(4)
        toast.success("OTP sent!", {
          description: `Verification code sent to ${phoneNumber}`
        })
      } else {
        const confirmation = await signInWithPhoneNumber(auth, phoneNumber, recaptchaVerifier)
        setConfirmationResult(confirmation)
        setCurrentStep(4)
        toast.success("OTP sent!", {
          description: `Verification code sent to ${phoneNumber}`
        })
      }
    } catch (err: any) {
      console.error("OTP send error:", err)
      setError("Failed to send verification code. Please try again.")
      toast.error("Failed to send OTP", {
        description: err.message
      })
    } finally {
      setLoading(false)
    }
  }

  const handleOTPVerify = async (code: string): Promise<boolean> => {
    if (!confirmationResult) return false

    try {
      // Verify OTP
      const result = await confirmationResult.confirm(code)
      const user = result.user

      // Calculate age
      const today = new Date()
      const birthDate = dateOfBirth!
      let age = today.getFullYear() - birthDate.getFullYear()
      const monthDiff = today.getMonth() - birthDate.getMonth()
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--
      }

      // Determine role based on email
      const emailLower = email.toLowerCase()
      let role = "user"
      if (emailLower === "datingappadmin@guardian-angelstudios.co.za" || emailLower === "itumeleng.mahwa@gmail.com") {
        role = "admin"
      } else if (emailLower === "datingappsuperadmin@guardian-angelstudios.co.za" || emailLower === "guardianangelstudios731@gmail.com") {
        role = "super_admin"
      }

      // Create user document with all data
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        email: email,
        displayName: fullName,
        phoneNumber: phoneNumber,
        phoneVerified: true,
        dateOfBirth: Timestamp.fromDate(dateOfBirth!),
        age: age,
        ageVerified: true,
        role: role,
        consents: {
          popia: { accepted: consents.popia, timestamp: serverTimestamp() },
          gdpr: { accepted: consents.gdpr, timestamp: serverTimestamp() },
          terms: { accepted: consents.terms, timestamp: serverTimestamp() },
          privacy: { accepted: consents.privacy, timestamp: serverTimestamp() },
          marketing: { accepted: consents.marketing, timestamp: serverTimestamp() }
        },
        createdAt: serverTimestamp(),
        hasPaidSubscription: false,
        isVerified: true
      })

      toast.success("Account created!", {
        description: "Welcome to SG Dating App!"
      })

      // Redirect based on role
      if (role === "super_admin") {
        router.push("/super-admin")
      } else if (role === "admin") {
        router.push("/admin")
      } else {
        router.push("/dashboard")
      }

      return true
    } catch (err: any) {
      console.error("OTP verification error:", err)
      return false
    }
  }

  const handleResendOTP = async () => {
    await sendOTP()
  }

  const handleGoogleSignUp = async () => {
    setLoading(true)
    setError("")

    try {
      const provider = new GoogleAuthProvider()
      const result = await signInWithPopup(auth, provider)
      const user = result.user

      const userDocRef = doc(db, "users", user.uid)
      const userDocSnap = await getDoc(userDocRef)

      if (!userDocSnap.exists()) {
        const emailLower = user.email?.toLowerCase() || ""
        let role = "user"

        if (emailLower === "datingappadmin@guardian-angelstudios.co.za" || emailLower === "itumeleng.mahwa@gmail.com") {
          role = "admin"
        } else if (emailLower === "datingappsuperadmin@guardian-angelstudios.co.za" || emailLower === "guardianangelstudios731@gmail.com") {
          role = "super_admin"
        }

        await setDoc(userDocRef, {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName || "User",
          photoURL: user.photoURL || "",
          role: role,
          createdAt: serverTimestamp(),
          hasPaidSubscription: false,
          isVerified: true
        })
      }

      const userData = userDocSnap.exists() ? userDocSnap.data() : await getDoc(userDocRef).then(d => d.data())
      const userRole = userData?.role || "user"

      if (userRole === "super_admin") {
        router.push("/super-admin")
      } else if (userRole === "admin") {
        router.push("/admin")
      } else {
        router.push("/dashboard")
      }

      toast.success("Welcome!", {
        description: "Successfully signed in with Google",
      })
    } catch (err: any) {
      console.error(err)
      if (err.code === "auth/popup-closed-by-user") {
        setError("Sign-in cancelled")
      } else if (err.code === "auth/account-exists-with-different-credential") {
        setError("An account already exists with this email using a different sign-in method")
      } else {
        setError("Failed to sign in with Google. Please try again.")
      }
      toast.error("Sign up failed", {
        description: err.message,
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-[#c5c4c4]/40 to-white relative flex flex-col">
      <Navbar />
      <div id="recaptcha-container"></div>

      <div className="max-w-6xl mx-auto px-4 py-16 lg:py-24 relative mt-16 flex-grow">
        <div className="grid lg:grid-cols-2 gap-12 items-start">

          {/* Form Side */}
          <div className="bg-white rounded-3xl shadow-2xl border border-[#c5c4c4]/60 p-10 space-y-8">
            <div className="space-y-2">
              <p className="text-sm font-semibold text-[#ae645c]">Create your account</p>
              <h2 className="text-3xl font-bold text-[#242228]">Join SG Dating App</h2>
              <p className="text-[#242228]/70">
                Find your person with our tailored matchmaking and curated community.
              </p>
            </div>

            <ProgressIndicator currentStep={currentStep} totalSteps={4} steps={steps} />

            {/* Step 1: Basic Information */}
            {currentStep === 1 && (
              <div className="space-y-5">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-[#242228]">Full name</label>
                  <input
                    type="text"
                    placeholder="Alex Khumalo"
                    className="w-full rounded-xl border border-[#c5c4c4] bg-white px-4 py-3 text-[#242228] focus:ring-2 focus:ring-[#ae645c] focus:outline-none shadow-sm"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-[#242228]">Email</label>
                  <input
                    type="email"
                    placeholder="you@example.com"
                    className="w-full rounded-xl border border-[#c5c4c4] bg-white px-4 py-3 text-[#242228] focus:ring-2 focus:ring-[#ae645c] focus:outline-none shadow-sm"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                <PhoneNumberInput
                  value={phoneNumber}
                  onChange={setPhoneNumber}
                  error={error && !phoneNumber ? error : ""}
                />

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-[#242228]">Password</label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      className="w-full rounded-xl border border-[#c5c4c4] bg-white px-4 py-3 text-[#242228] focus:ring-2 focus:ring-[#ae645c] focus:outline-none shadow-sm"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-[#242228]">Confirm password</label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      className="w-full rounded-xl border border-[#c5c4c4] bg-white px-4 py-3 text-[#242228] focus:ring-2 focus:ring-[#ae645c] focus:outline-none shadow-sm"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                  </div>
                </div>

                {error && <p className="text-sm text-red-600 font-medium">{error}</p>}

                <Button
                  onClick={handleNext}
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-[#ae645c] to-[#a22929] text-white py-3.5 text-base font-semibold shadow-lg shadow-[#a22929]/30"
                >
                  Continue
                </Button>

                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-white text-gray-500">Or continue with</span>
                  </div>
                </div>

                <Button
                  type="button"
                  variant="outline"
                  disabled={loading}
                  onClick={handleGoogleSignUp}
                  className="w-full border-2 border-gray-300 hover:border-[#a22929] hover:bg-gray-50 py-3.5 text-base font-semibold flex items-center justify-center gap-3"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                  Sign up with Google
                </Button>
              </div>
            )}

            {/* Step 2: Age Verification */}
            {currentStep === 2 && (
              <div className="space-y-5">
                <AgeVerification
                  onDateChange={(date, valid) => {
                    setDateOfBirth(date)
                    setAgeValid(valid)
                  }}
                  error={error}
                />

                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={handleBack}
                    className="flex-1"
                  >
                    <ChevronLeft className="w-4 h-4 mr-2" />
                    Back
                  </Button>
                  <Button
                    onClick={handleNext}
                    disabled={!ageValid || loading}
                    className="flex-1 bg-gradient-to-r from-[#ae645c] to-[#a22929] text-white"
                  >
                    Continue
                  </Button>
                </div>
              </div>
            )}

            {/* Step 3: Consent */}
            {currentStep === 3 && (
              <div className="space-y-5">
                <ConsentForm
                  consents={consents}
                  onConsentChange={(key, value) => {
                    setConsents({ ...consents, [key]: value })
                    if (consentErrors[key]) {
                      const newErrors = { ...consentErrors }
                      delete newErrors[key]
                      setConsentErrors(newErrors)
                    }
                  }}
                  errors={consentErrors}
                />

                {error && <p className="text-sm text-red-600 font-medium">{error}</p>}

                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={handleBack}
                    className="flex-1"
                  >
                    <ChevronLeft className="w-4 h-4 mr-2" />
                    Back
                  </Button>
                  <Button
                    onClick={handleNext}
                    disabled={loading}
                    className="flex-1 bg-gradient-to-r from-[#ae645c] to-[#a22929] text-white"
                  >
                    {loading ? "Sending OTP..." : "Continue"}
                  </Button>
                </div>
              </div>
            )}

            {/* Step 4: OTP Verification */}
            {currentStep === 4 && (
              <div className="space-y-5">
                <OTPVerification
                  phoneNumber={phoneNumber || ""}
                  onVerify={handleOTPVerify}
                  onResend={handleResendOTP}
                  loading={loading}
                />

                <Button
                  variant="outline"
                  onClick={handleBack}
                  className="w-full"
                >
                  <ChevronLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
              </div>
            )}

            <div className="text-sm text-center text-[#242228]/80">
              Already have an account?{" "}
              <Link href="/sign-in" className="text-[#a22929] font-semibold hover:underline">
                Sign in
              </Link>
            </div>
          </div>

          {/* Info Side */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#a22929] via-[#ae645c] to-[#242228] text-white p-10 shadow-2xl">
            <div className="absolute inset-0 opacity-15 bg-[radial-gradient(circle_at_20%_20%,#fff,transparent_35%),radial-gradient(circle_at_80%_30%,#fff,transparent_40%)]" />
            <div className="relative space-y-6">
              <div className="flex items-center gap-3">
                <img
                  src="/datinglogo.jpeg"
                  alt="SG Dating App logo"
                  className="w-16 h-16 rounded-full object-cover border border-white/30 shadow-lg"
                />
                <div>
                  <p className="text-sm uppercase tracking-[0.2em] text-white/70">Premium matchmaking</p>
                  <h3 className="text-3xl font-bold">Designed for South Africa</h3>
                </div>
              </div>
              <p className="text-lg text-white/85 leading-relaxed">
                Unlock curated matches, verified profiles, and a community that values genuine connections. Start free
                and upgrade anytime in Rands.
              </p>
              <div className="grid sm:grid-cols-2 gap-3">
                {[
                  "Strict profile verification (Safety First)",
                  "Curated community of genuine singles",
                  "Manual approval process",
                  "Direct support for peace of mind"
                ].map((perk) => (
                  <div
                    key={perk}
                    className="flex items-start gap-3 rounded-2xl bg-white/10 border border-white/15 p-4 backdrop-blur"
                  >
                    <span className="mt-0.5 text-xl">✅</span>
                    <p className="text-sm leading-relaxed">{perk}</p>
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-4 pt-2">
                <div className="h-12 w-12 rounded-full bg-white/20 border border-white/30 flex items-center justify-center text-xl">
                  💬
                </div>
                <div>
                  <p className="font-semibold">Concierge support</p>
                  <p className="text-sm text-white/80">Get guidance on crafting your best profile.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
