// import { useEffect, useState } from 'react';
// import { useAuth } from '../../contexts/AuthContext';
// import { authService } from '../../services/authService';

// function ProfilePage() {
//   const { user, loading, refreshUser } = useAuth();
//   const [isEditing, setIsEditing] = useState(false);
//   const [isSaving, setIsSaving] = useState(false);
//   const [error, setError] = useState('');
//   const [formData, setFormData] = useState({
//     full_name: '',
//     bio: '',
//     experience_level: '',
//     phone: '',
//     dob: ''
//   });

//   const formatDate = (value) => {
//     if (!value) return 'Not provided';
//     const dateValue = new Date(value);
//     return Number.isNaN(dateValue.getTime()) ? value : dateValue.toLocaleDateString();
//   };

//   const formatDateForInput = (value) => {
//     if (!value) return '';
//     if (value instanceof Date) {
//       return value.toISOString().split('T')[0];
//     }
//     if (typeof value === 'string') {
//       return value.split('T')[0];
//     }
//     return '';
//   };

//   const resetForm = (currentUser = user) => {
//     setFormData({
//       full_name: currentUser?.full_name || '',
//       bio: currentUser?.profile?.bio || '',
//       experience_level: currentUser?.profile?.experience_level || '',
//       phone: currentUser?.profile?.phone || '',
//       dob: formatDateForInput(currentUser?.profile?.dob)
//     });
//   };

//   useEffect(() => {
//     if (user) {
//       resetForm(user);
//     }
//   }, [user]);

//   const handleChange = (event) => {
//     const { name, value } = event.target;
//     setFormData((current) => ({ ...current, [name]: value }));
//   };

//   const handleSubmit = async (event) => {
//     event.preventDefault();
//     setError('');
//     setIsSaving(true);

//     try {
//       await authService.updateProfile(formData);
//       await refreshUser();
//       setIsEditing(false);
//     } catch (submitError) {
//       setError(submitError.message || 'Unable to save profile changes.');
//     } finally {
//       setIsSaving(false);
//     }
//   };

//   if (loading) {
//     return (
//       <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
//         <p className="text-sm text-gray-600">Loading your profile...</p>
//       </div>
//     );
//   }

//   if (!user) {
//     return (
//       <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
//         <h1 className="text-2xl font-semibold text-gray-900">Profile</h1>
//         <p className="mt-2 text-sm text-gray-600">Please log in to view your profile.</p>
//       </div>
//     );
//   }

//   const profile = user.profile;

//   return (
//     <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
//       <div className="flex items-center justify-between">
//         <div>
//           <h1 className="text-2xl font-semibold text-gray-900">Profile</h1>
//           <p className="mt-2 text-sm text-gray-600">Manage your account and profile details.</p>
//         </div>
//         <div className="flex items-center gap-3">
//           <span className="rounded-full bg-indigo-50 px-3 py-1 text-sm font-medium text-indigo-700">
//             {user.role || 'student'}
//           </span>
//           {!isEditing ? (
//             <button
//               type="button"
//               onClick={() => {
//                 resetForm(user);
//                 setError('');
//                 setIsEditing(true);
//               }}
//               className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-700"
//             >
//               Edit profile
//             </button>
//           ) : null}
//         </div>
//       </div>

//       {error ? <p className="mt-4 text-sm text-red-600">{error}</p> : null}

//       <div className="mt-8 grid gap-6 md:grid-cols-2">
//         <div className="rounded-xl border border-gray-200 p-4">
//           <h2 className="text-lg font-semibold text-gray-900">Account information</h2>
//           {isEditing ? (
//             <form className="mt-4 space-y-4" onSubmit={handleSubmit}>
//               <div>
//                 <label className="mb-1 block text-sm font-medium text-gray-700">Full name</label>
//                 <input
//                   type="text"
//                   name="full_name"
//                   value={formData.full_name}
//                   onChange={handleChange}
//                   className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
//                   required
//                 />
//               </div>
//               <div>
//                 <label className="mb-1 block text-sm font-medium text-gray-700">Phone</label>
//                 <input
//                   type="tel"
//                   name="phone"
//                   value={formData.phone}
//                   onChange={handleChange}
//                   className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
//                 />
//               </div>
//               <div>
//                 <label className="mb-1 block text-sm font-medium text-gray-700">Date of birth</label>
//                 <input
//                   type="date"
//                   name="dob"
//                   value={formData.dob}
//                   onChange={handleChange}
//                   className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
//                 />
//               </div>
//               <div className="flex gap-3">
//                 <button
//                   type="submit"
//                   disabled={isSaving}
//                   className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-indigo-400"
//                 >
//                   {isSaving ? 'Saving...' : 'Save changes'}
//                 </button>
//                 <button
//                   type="button"
//                   onClick={() => {
//                     resetForm(user);
//                     setError('');
//                     setIsEditing(false);
//                   }}
//                   className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
//                 >
//                   Cancel
//                 </button>
//               </div>
//             </form>
//           ) : (
//             <dl className="mt-4 space-y-3 text-sm text-gray-700">
//               <div>
//                 <dt className="font-medium text-gray-500">Full name</dt>
//                 <dd className="mt-1">{user.full_name || 'Not provided'}</dd>
//               </div>
//               <div>
//                 <dt className="font-medium text-gray-500">Email</dt>
//                 <dd className="mt-1">{user.email}</dd>
//               </div>
//               <div>
//                 <dt className="font-medium text-gray-500">Account status</dt>
//                 <dd className="mt-1">{user.is_active ? 'Active' : 'Inactive'}</dd>
//               </div>
//             </dl>
//           )}
//         </div>

//         <div className="rounded-xl border border-gray-200 p-4">
//           <h2 className="text-lg font-semibold text-gray-900">Profile details</h2>
//           {isEditing ? (
//             <div className="mt-4 space-y-4">
//               <div>
//                 <label className="mb-1 block text-sm font-medium text-gray-700">Bio</label>
//                 <textarea
//                   name="bio"
//                   value={formData.bio}
//                   onChange={handleChange}
//                   rows="4"
//                   className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
//                 />
//               </div>
//               <div>
//                 <label className="mb-1 block text-sm font-medium text-gray-700">Experience level</label>
//                 <select
//                   name="experience_level"
//                   value={formData.experience_level}
//                   onChange={handleChange}
//                   className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
//                 >
//                   <option value="">Select level</option>
//                   <option value="beginner">Beginner</option>
//                   <option value="intermediate">Intermediate</option>
//                   <option value="expert">Expert</option>
//                 </select>
//               </div>
//             </div>
//           ) : (
//             <dl className="mt-4 space-y-3 text-sm text-gray-700">
//               <div>
//                 <dt className="font-medium text-gray-500">Bio</dt>
//                 <dd className="mt-1">{profile?.bio || 'No bio added yet.'}</dd>
//               </div>
//               <div>
//                 <dt className="font-medium text-gray-500">Experience level</dt>
//                 <dd className="mt-1">{profile?.experience_level || 'Not provided'}</dd>
//               </div>
//               <div>
//                 <dt className="font-medium text-gray-500">Phone</dt>
//                 <dd className="mt-1">{profile?.phone || 'Not provided'}</dd>
//               </div>
//               <div>
//                 <dt className="font-medium text-gray-500">Date of birth</dt>
//                 <dd className="mt-1">{formatDate(profile?.dob)}</dd>
//               </div>
//             </dl>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

// export default ProfilePage;
