"use client";

import { useRouter } from "next/navigation";
import { ShieldX, ArrowLeft, Home, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";

export default function UnauthorizedPage() {
  const router = useRouter();
  const { user, logout, getRoleLabel } = useAuth();

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const handleGoBack = () => {
    router.back();
  };

  const handleGoHome = () => {
    router.push("/tenant-panel");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          {/* Icon */}
          <div className="mx-auto w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-6">
            <ShieldX className="w-10 h-10 text-red-500" />
          </div>

          {/* Title */}
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Access Denied
          </h1>

          {/* Description */}
          <p className="text-gray-600 mb-6">
            You don&apos;t have permission to access this page.
            {user && (
              <span className="block mt-2 text-sm">
                Your current role is{" "}
                <span className="font-semibold text-primary">
                  {getRoleLabel()}
                </span>
              </span>
            )}
          </p>

          {/* Actions */}
          <div className="space-y-3">
            <Button
              onClick={handleGoHome}
              className="w-full"
              size="lg"
            >
              <Home className="w-4 h-4 mr-2" />
              Go to Dashboard
            </Button>

            <Button
              onClick={handleGoBack}
              variant="outline"
              className="w-full"
              size="lg"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Go Back
            </Button>

            <Button
              onClick={handleLogout}
              variant="ghost"
              className="w-full text-red-600 hover:text-red-700 hover:bg-red-50"
              size="lg"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-sm text-gray-500 mt-6">
          If you believe this is an error, please contact your administrator.
        </p>
      </div>
    </div>
  );
}
