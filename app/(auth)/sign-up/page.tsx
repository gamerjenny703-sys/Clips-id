import SignUpForm from "@/components/features/auth/SignUpForm";

export default function SignUpPage() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-black uppercase text-black mb-2">
            SIGN UP
          </h1>
          <p className="text-black font-bold">CREATE YOUR ACCOUNT TODAY</p>
        </div>

        {/* Sign Up Form */}
        <SignUpForm />
      </div>
    </div>
  );
}
