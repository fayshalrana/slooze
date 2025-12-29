import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useTheme } from "../contexts/ThemeContext";
import darkLoginImage from "../assets/images/dark-login.jpg";
import lightLoginImage from "../assets/images/light-login.jpg";

const MANAGER_CREDENTIAL_TEXT = "manager@example.com / manager123";
const STOREKEEPER_CREDENTIAL_TEXT = "storekeeper@example.com / keeper123";

export const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [copiedCredential, setCopiedCredential] = useState<string | null>(null);
  const [typedManagerCredential, setTypedManagerCredential] = useState("");
  const [typedStorekeeperCredential, setTypedStorekeeperCredential] =
    useState("");
  const { login } = useAuth();
  const { theme } = useTheme();
  const navigate = useNavigate();

  useEffect(() => {
    let currentIndex = 0;
    const typingInterval = setInterval(() => {
      if (currentIndex < MANAGER_CREDENTIAL_TEXT.length) {
        setTypedManagerCredential(
          MANAGER_CREDENTIAL_TEXT.slice(0, currentIndex + 1)
        );
        currentIndex++;
      } else {
        clearInterval(typingInterval);
      }
    }, 50);

    return () => clearInterval(typingInterval);
  }, []);

  useEffect(() => {
    if (typedManagerCredential.length === MANAGER_CREDENTIAL_TEXT.length) {
      const delay = setTimeout(() => {
        let currentIndex = 0;
        const typingInterval = setInterval(() => {
          if (currentIndex < STOREKEEPER_CREDENTIAL_TEXT.length) {
            setTypedStorekeeperCredential(
              STOREKEEPER_CREDENTIAL_TEXT.slice(0, currentIndex + 1)
            );
            currentIndex++;
          } else {
            clearInterval(typingInterval);
          }
        }, 50);

        return () => clearInterval(typingInterval);
      }, 300);

      return () => clearTimeout(delay);
    }
  }, [typedManagerCredential]);

  const copyToClipboard = async (text: string, credentialType: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedCredential(credentialType);
      setTimeout(() => setCopiedCredential(null), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const handleCredentialClick = (
    email: string,
    password: string,
    credentialType: string
  ) => {
    setEmail(email);
    setPassword(password);
    copyToClipboard(`${email} / ${password}`, credentialType);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login({ email, password });
      navigate("/products");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Login failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Section - Login Form */}
      <div className="w-full lg:w-2/3 bg-white dark:bg-black flex items-center justify-center p-8 xl:py-0">
        <div className="w-full max-w-md">
          <h1 className="text-4xl font-bold text-black dark:text-white mb-2 text-center">
            Welcome Back
          </h1>
          <h2 className="text-lg text-black dark:text-gray-300 mb-8 text-center">
            Login to your account
          </h2>

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label
                htmlFor="email"
                className="block mb-2 text-black dark:text-white font-medium"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Email"
                autoComplete="email"
                className="w-full px-4 py-3 bg-gray-100 dark:bg-[#151515] border border-gray-200 dark:border-gray-700 rounded-lg text-base text-black dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              />
            </div>

            <div className="mb-4">
              <label
                htmlFor="password"
                className="block mb-2 text-black dark:text-white font-medium"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Password"
                autoComplete="current-password"
                className="w-full px-4 py-3 bg-gray-100 dark:bg-[#151515] border border-gray-200 dark:border-gray-700 rounded-lg text-base text-black dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              />
            </div>

            <div className="mb-6 flex items-center">
              <input
                id="agree"
                type="checkbox"
                checked={agreeToTerms}
                onChange={(e) => setAgreeToTerms(e.target.checked)}
                className="w-4 h-4 text-purple-600 bg-gray-100 border-gray-300 rounded focus:ring-purple-500 focus:ring-2 cursor-pointer"
              />
              <label
                htmlFor="agree"
                className="ml-2 text-sm text-black dark:text-gray-300"
              >
                I agree to all Term, Privacy Policy and fees.
              </label>
            </div>

            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 px-4 py-3 rounded-lg mb-4 text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3.5 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white rounded-lg text-base font-semibold transition-all shadow-lg hover:shadow-xl disabled:opacity-60 disabled:cursor-not-allowed mb-6"
              disabled={loading || !agreeToTerms}
            >
              {loading ? "Logging in..." : "Get Started"}
            </button>
          </form>

          <div className="relative mb-6">
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white dark:bg-gray-900 text-gray-500 dark:text-gray-400 font-bold">
                OR
              </span>
            </div>
          </div>

          <div className="space-y-3 mb-6">
            <button
              type="button"
              className="w-full py-3 bg-white dark:bg-[#151515] border border-gray-300 dark:border-gray-700 rounded-lg text-black dark:text-white font-medium flex items-center justify-center gap-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all shadow-sm"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Sign in with Google
            </button>
            <button
              type="button"
              className="w-full py-3 bg-white dark:bg-[#151515] border border-gray-300 dark:border-gray-700 rounded-lg text-black dark:text-white font-medium flex items-center justify-center gap-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all shadow-sm"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
              Sign in with Facebook
            </button>
          </div>

          <div className="text-center text-sm text-black dark:text-gray-300">
            Already have an account?{" "}
            <a
              href="#"
              className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
            >
              Login
            </a>
          </div>

          <div className="pt-2 text-xs text-gray-500 dark:text-gray-400 text-center">
            <p className="mb-2">
              <strong className="text-black dark:text-white">
                Demo Credentials:
              </strong>
            </p>
            <p
              className="mb-2 cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition-colors relative group"
              onClick={() =>
                handleCredentialClick(
                  "manager@example.com",
                  "manager123",
                  "manager"
                )
              }
            >
              <span className="font-medium">Manager:</span>{" "}
              <span className="inline-block">
                {typedManagerCredential}
                {typedManagerCredential.length <
                  MANAGER_CREDENTIAL_TEXT.length && (
                  <span className="animate-pulse">|</span>
                )}
              </span>
              {copiedCredential === "manager" && (
                <span className="ml-2 text-green-600 dark:text-green-400 font-semibold">
                  ✓ Copied!
                </span>
              )}
              <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1.5 bg-gray-900 dark:bg-gray-700 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200 whitespace-nowrap z-10">
                Click to copy and fill credentials
                <span className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1 border-4 border-transparent border-t-gray-900 dark:border-t-gray-700"></span>
              </span>
            </p>
            <p
              className="cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition-colors relative group"
              onClick={() =>
                handleCredentialClick(
                  "storekeeper@example.com",
                  "keeper123",
                  "storekeeper"
                )
              }
            >
              <span className="font-medium">Store Keeper:</span>{" "}
              <span className="inline-block">
                {typedStorekeeperCredential}
                {typedStorekeeperCredential.length <
                  STOREKEEPER_CREDENTIAL_TEXT.length && (
                  <span className="animate-pulse">|</span>
                )}
              </span>
              {copiedCredential === "storekeeper" && (
                <span className="ml-2 text-green-600 dark:text-green-400 font-semibold">
                  ✓ Copied!
                </span>
              )}
              <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1.5 bg-gray-900 dark:bg-gray-700 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200 whitespace-nowrap z-10">
                Click to copy and fill credentials
                <span className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1 border-4 border-transparent border-t-gray-900 dark:border-t-gray-700"></span>
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* Right Section - Background Image */}
      <div className="hidden lg:flex lg:w-1/3 relative overflow-hidden">
        <img
          src={theme === "dark" ? darkLoginImage : lightLoginImage}
          alt="Login background"
          className="absolute inset-0 w-full h-full object-cover"
        />
      </div>
    </div>
  );
};
