// "use client";

// import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";

// export default function DashboardPage() {
//   const router = useRouter();
//   const [isAuthenticated, setIsAuthenticated] = useState(false);
//   const [isLoading, setIsLoading] = useState(true);
//   const [userRole, setUserRole] = useState<string | null>(null);

//   useEffect(() => {
//     const token = localStorage.getItem('token');
//     const role = localStorage.getItem('role');

//     if (!token) {
//       router.push('/auth/login');
//       return;
//     }

//     setUserRole(role);
//     setIsAuthenticated(true);
//     setIsLoading(false);
//   }, [router]);

//   const handleLogout = () => {
//     localStorage.removeItem('token');
//     localStorage.removeItem('role');
//     router.push('/auth/login');
//   };

//   if (isLoading) {
//     return (
//       <div className="flex min-h-screen items-center justify-center">
//         <div className="h-8 w-8 animate-spin rounded-full border-4 border-red-600 border-t-transparent"></div>
//       </div>
//     );
//   }

//   if (!isAuthenticated) {
//     return null;
//   }

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Header */}
//       <header className="bg-white shadow-sm border-b">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex justify-between items-center py-4">
//             <div>
//               <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
//               <p className="text-sm text-gray-600">Redeemed Gospel Church - Busia</p>
//             </div>
//             <div className="flex items-center space-x-4">
//               <span className="text-sm text-gray-600">Welcome, {userRole}!</span>
//               <button
//                 onClick={handleLogout}
//                 className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
//               >
//                 Logout
//               </button>
//             </div>
//           </div>
//         </div>
//       </header>

//       {/* Main Content */}
//       <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
//         <div className="bg-white rounded-lg shadow p-6">
//           <h2 className="text-lg font-medium text-gray-900 mb-4">Welcome to your Dashboard</h2>
//           <p className="text-gray-600">
//             You are logged in as <span className="font-semibold">{userRole}</span>. 
//             This is your personalized dashboard where you can access your role-specific features.
//           </p>
          
//           <div className="mt-6">
//             <h3 className="text-md font-medium text-gray-900 mb-2">Available Features:</h3>
//             <ul className="list-disc list-inside text-gray-600 space-y-1">
//               <li>View your profile information</li>
//               <li>Access role-specific tools and reports</li>
//               <li>Manage your account settings</li>
//               <li>View church announcements and updates</li>
//             </ul>
//           </div>
//         </div>
//       </main>
//     </div>
//   );
// }
