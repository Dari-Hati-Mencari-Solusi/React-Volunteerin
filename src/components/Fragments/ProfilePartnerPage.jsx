import React, { useState, useEffect } from "react";
import AvatarProfilePartner from "../Elements/forms/AvatarProfilePartner";
import { toast } from "react-toastify";
import { authService } from "../../services/authService";
import { partnerService } from "../../services/partnerService";

const ProfilePartnerPage = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [userData, setUserData] = useState(null);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState(null);
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    jenisPenyelenggara: "",
    usernameInstagram: "",
    organizationAddress: "",
  });

  // Map backend organization types to frontend dropdown values
  const organizationTypeMap = {
    'COMMUNITY': 'komunitas',
    'GOVERNMENT': 'pemerintah',
    'CORPORATE': 'perusahaan',
    'INDIVIDUAL': 'individu'
  };

  // Map frontend dropdown values to backend organization types
  const reverseOrganizationTypeMap = {
    'komunitas': 'COMMUNITY',
    'pemerintah': 'GOVERNMENT', 
    'perusahaan': 'CORPORATE',
    'individu': 'INDIVIDUAL'
  };

  // Provide current form data to child components
  useEffect(() => {
    window.getCurrentProfileFormData = () => formData;
    return () => {
      delete window.getCurrentProfileFormData;
    };
  }, [formData]);

  useEffect(() => {
    const fetchPartnerProfile = async () => {
      try {
        setLoading(true);
        setUpdateSuccess(false);
        
        // 1. Check if user is authenticated
        if (!authService.isAuthenticated()) {
          toast.error("Please login first");
          window.location.href = "/login";
          return;
        }
        
        // 2. Try to get user data
        let user = null;
        
        // First attempt: from localStorage (fastest)
        user = authService.getStoredUser();
        if (user && user.name) {
          setUserData(user);
          setFormData(prevData => ({
            ...prevData,
            name: user.name || "",
            email: user.email || "",
            phoneNumber: user.phoneNumber || "",
          }));
          
          // Set avatar from user data if available
          if (user.avatarUrl) {
            setAvatarUrl(user.avatarUrl);
          }
        }
        
        // Second attempt: from auth service API
        if (!user || !user.name) {
          try {
            const profile = await authService.getUserProfile();
            
            if (profile && profile.data && profile.data.user) {
              user = profile.data.user;
              
              setUserData(user);
              setFormData(prevData => ({
                ...prevData,
                name: user.name || "",
                email: user.email || "",
                phoneNumber: user.phoneNumber || "",
              }));
              
              // Set avatar from user data if available
              if (user.avatarUrl) {
                setAvatarUrl(user.avatarUrl);
              }
            }
          } catch (profileError) {
            // Continue despite profile fetch error
          }
        }
        
        // 3. Get partner profile data using partnerService
        try {
          const partnerProfile = await partnerService.getPartnerProfile();
          
          if (partnerProfile && partnerProfile.data) {
            const partnerData = partnerProfile.data;
            
            // Update formData with partner data
            setFormData(prevData => ({
              ...prevData,
              jenisPenyelenggara: organizationTypeMap[partnerData.organizationType] || "",
              usernameInstagram: partnerData.instagram || "",
              organizationAddress: partnerData.organizationAddress || "",
            }));
          }
        } catch (partnerError) {
          toast.error("Failed to load partner profile data");
          
          // If we're in development, provide fallback data
          if (process.env.NODE_ENV === 'development' && (!user || !userData)) {
            const hardcodedUser = {
              id: "30d083b8-ed2f-4e90-9838-76e2fb6414fe",
              name: "PD Kusmawati",
              email: "Ghaliyati.Uwais73@gmail.com",
              phoneNumber: "6281234561001",
              role: "PARTNER"
            };
            
            setUserData(hardcodedUser);
            setFormData(prevData => ({
              ...prevData,
              name: hardcodedUser.name,
              email: hardcodedUser.email,
              phoneNumber: hardcodedUser.phoneNumber,
              jenisPenyelenggara: "komunitas",
              usernameInstagram: "pdkusmawati_official",
              organizationAddress: "Gg. Nashiruddin no 32, Gianyar, Jawa Barat",
            }));
          }
        }
        
      } catch (error) {
        toast.error("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    fetchPartnerProfile();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async () => {
    try {
      setSaving(true);
      setUpdateSuccess(false);
      
      // Form validation
      if (!formData.jenisPenyelenggara) {
        toast.error("Please select Organization Type");
        setSaving(false);
        return;
      }
      
      if (!formData.usernameInstagram) {
        toast.error("Instagram username cannot be empty");
        setSaving(false);
        return;
      }
      
      if (!formData.organizationAddress) {
        toast.error("Organization Address cannot be empty");
        setSaving(false);
        return;
      }
      
      // Check authentication
      if (!authService.isAuthenticated()) {
        toast.error("Session has expired. Please login again.");
        window.location.href = "/login";
        return;
      }

      // NEW APPROACH: Use FormData for all cases
      // This is more consistent with backend expectations
      const formDataToSend = new FormData();
      formDataToSend.append('organizationType', reverseOrganizationTypeMap[formData.jenisPenyelenggara]);
      formDataToSend.append('organizationAddress', formData.organizationAddress);
      formDataToSend.append('instagram', formData.usernameInstagram);
      
      // Add minimal logo (1x1 pixel transparent PNG)
      const pngData = new Uint8Array([
        0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A, 0x00, 0x00, 0x00, 0x0D,
        0x49, 0x48, 0x44, 0x52, 0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01,
        0x08, 0x04, 0x00, 0x00, 0x00, 0xB5, 0x1C, 0x0C, 0x02, 0x00, 0x00, 0x00,
        0x0B, 0x49, 0x44, 0x41, 0x54, 0x08, 0x99, 0x63, 0xF8, 0x0F, 0x00, 0x01,
        0x01, 0x01, 0x00, 0x1B, 0xBF, 0x17, 0x84, 0x00, 0x00, 0x00, 0x00, 0x49,
        0x45, 0x4E, 0x44, 0xAE, 0x42, 0x60, 0x82
      ]);
      const pngBlob = new Blob([pngData], {type: 'image/png'});
      const emptyLogoFile = new File([pngBlob], 'empty-logo.png', {
        type: 'image/png',
        lastModified: new Date().getTime()
      });
      
      // Add to FormData
      formDataToSend.append('logo', emptyLogoFile);
      
      // NEW APPROACH: Try POST first, then PUT if it fails
      try {
        const postResponse = await fetch(`${import.meta.env.VITE_BE_BASE_URL}/partners/me/profile`, {
          method: 'POST',
          body: formDataToSend,
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
            // Don't set Content-Type, let browser set it for FormData
          }
        });
        
        const postData = await postResponse.json();
        
        if (postResponse.ok) {
          toast.success("Profile created successfully!");
          setUpdateSuccess(true);
        }
      } catch (postError) {
        // Continue with PUT method
      }
      
      // Always try PUT after POST (regardless of POST result)
      try {
        const putResponse = await fetch(`${import.meta.env.VITE_BE_BASE_URL}/partners/me/profile`, {
          method: 'PUT',
          body: formDataToSend,
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
            // Don't set Content-Type, let browser set it for FormData
          }
        });
        
        const putData = await putResponse.json();
        
        if (putResponse.ok) {
          toast.success("Profile updated successfully!");
          setUpdateSuccess(true);
        } else {
          throw new Error(putData.message || "Failed to update profile with PUT");
        }
      } catch (putError) {
        throw new Error(putError.message || "Failed to save profile");
      }
      
      // Refresh partner profile data to reflect changes
      try {
        const refreshedProfile = await partnerService.getPartnerProfile();
        if (refreshedProfile && refreshedProfile.data) {
          // Update formData with the latest data
          setFormData(prevData => ({
            ...prevData,
            jenisPenyelenggara: organizationTypeMap[refreshedProfile.data.organizationType] || "",
            usernameInstagram: refreshedProfile.data.instagram || "",
            organizationAddress: refreshedProfile.data.organizationAddress || "",
          }));
        }
      } catch (refreshError) {
        // Continue even if refresh fails
      }
      
    } catch (error) {
      toast.error(error.message || "Failed to save changes. Please try again.");
      setUpdateSuccess(false);
    } finally {
      setSaving(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };
  
  // Handle avatar upload/update callback
  const handleAvatarUpload = (file, url) => {
    if (file && url) {
      toast.success("Logo uploaded successfully!");
      
      // Update avatar URL state
      setAvatarUrl(url);
      
      // Update user data if needed
      if (userData) {
        setUserData(prevUserData => ({
          ...prevUserData,
          avatarUrl: url
        }));
      }
      
      // Update locally stored user data if using localStorage
      try {
        const storedUser = authService.getStoredUser();
        if (storedUser) {
          storedUser.avatarUrl = url;
          localStorage.setItem('user', JSON.stringify(storedUser));
        }
      } catch (error) {
        // Continue despite error updating stored user
      }
      
      // Refresh profile from server to ensure latest data
      setTimeout(() => {
        partnerService.getPartnerProfile()
          .catch(() => {
            // Ignore errors refreshing profile
          });
      }, 1000);
    } else if (url) {
      // If only URL is available (without file)
      setAvatarUrl(url);
    } else {
      setAvatarUrl(null);
      
      // Update user data if needed
      if (userData) {
        setUserData(prevUserData => ({
          ...prevUserData,
          avatarUrl: null
        }));
      }
      
      // Update locally stored user data
      try {
        const storedUser = authService.getStoredUser();
        if (storedUser) {
          storedUser.avatarUrl = null;
          localStorage.setItem('user', JSON.stringify(storedUser));
        }
      } catch (error) {
        // Continue despite error updating stored user
      }
    }
  };

  if (loading) {
    return (
      <div className="w-full max-w-full mx-auto space-y-6 flex justify-center items-center py-10">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#0A3E54]"></div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-full mx-auto space-y-6">
      {/* Success notification */}
      {updateSuccess && (
        <div className="bg-green-50 p-4 border border-green-200 rounded-lg mb-4">
          <div className="flex items-center">
            <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
            </svg>
            <span className="font-medium text-green-800">Organization data updated successfully!</span>
          </div>
        </div>
      )}

      <h1 className="title">Profile Penyelenggara</h1>
      <div className="w-full">
        <div className="bg-[#0A3E54] text-white p-3 rounded-t-xl">
          <h2 className="text-lg font-semibold">Data Penyelenggara</h2>
        </div>
        <div className="bg-[#F7F7F7] p-6 rounded-b">
          {/* Logo/Avatar Upload Section */}
          <div className="mb-8">
            <AvatarProfilePartner 
              onAvatarUpload={handleAvatarUpload}
              initialAvatarUrl={avatarUrl}
              currentFormData={formData}
            />
          </div>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">
                Nama Penyelenggara <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                disabled
                className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#0a3e54]/20 focus:border-[#0a3e54] bg-gray-100"
              />
              <p className="text-xs text-gray-500 mt-1">Nama penyelenggara tidak dapat diubah</p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Email Penyelenggara <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                disabled
                className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#0a3e54]/20 focus:border-[#0a3e54] bg-gray-100"
              />
              <p className="text-xs text-gray-500 mt-1">Email penyelenggara tidak dapat diubah</p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                No. Telephone <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                disabled
                className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#0a3e54]/20 focus:border-[#0a3e54] bg-gray-100"
              />
              <p className="text-xs text-gray-500 mt-1">Nomor telepon tidak dapat diubah</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Jenis Penyelenggara <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select
                    name="jenisPenyelenggara"
                    value={formData.jenisPenyelenggara}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#0a3e54]/20 focus:border-[#0a3e54] bg-white appearance-none"
                  >
                    <option value="" disabled>
                      Pilih salah satu jenis penyelenggara
                    </option>
                    <option value="komunitas">Komunitas</option>
                    <option value="pemerintah">Pemerintah / Instansi</option>
                    <option value="perusahaan">Perusahaan</option>
                    <option value="individu">Individu / Perseorangan</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <svg
                      className="fill-current h-4 w-4"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                    </svg>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Username Instagram <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="usernameInstagram"
                  value={formData.usernameInstagram}
                  onChange={handleInputChange}
                  placeholder="Masukkan username Instagram (tanpa @)"
                  className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#0a3e54]/20 focus:border-[#0a3e54] bg-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Alamat Penyelenggara <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="organizationAddress"
                value={formData.organizationAddress}
                onChange={handleInputChange}
                placeholder="Masukan alamat anda disini"
                className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#0a3e54]/20 focus:border-[#0a3e54] bg-white"
              />
            </div>

            <div>
              <button
                onClick={handleSubmit}
                disabled={saving}
                className={`px-8 py-3 bg-[#0A3E54] text-white rounded-lg font-medium hover:bg-[#0a2e3e] transition-colors ${
                  saving ? "opacity-70 cursor-not-allowed" : ""
                }`}
              >
                {saving ? (
                  <div className="flex items-center justify-center">
                    <div className="w-5 h-5 border-t-2 border-b-2 border-white rounded-full animate-spin mr-2"></div>
                    <span>Menyimpan...</span>
                  </div>
                ) : (
                  "Simpan"
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePartnerPage;