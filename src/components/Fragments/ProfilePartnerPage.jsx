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
    'FOUNDATION': 'pemerintah',
    'COMPANY': 'perusahaan',
    'EDUCATION': 'pemerintah',
    'INDIVIDUAL': 'individu',
    'OTHER': 'individu'
  };

  // Map frontend dropdown values to backend organization types
  const reverseOrganizationTypeMap = {
    'komunitas': 'COMMUNITY',
    'pemerintah': 'FOUNDATION', 
    'perusahaan': 'COMPANY',
    'individu': 'INDIVIDUAL'
  };

  useEffect(() => {
    const fetchPartnerProfile = async () => {
      try {
        setLoading(true);
        setUpdateSuccess(false);
        
        // 1. Check if user is authenticated
        if (!authService.isAuthenticated()) {
          toast.error("Silakan login terlebih dahulu");
          window.location.href = "/login";
          return;
        }
        
        // 2. Try to get user data
        let user = null;
        
        // First attempt: from localStorage (fastest)
        user = authService.getStoredUser();
        if (user && user.name) {
          console.log("Using stored user data:", user);
          setUserData(user);
          setFormData(prevData => ({
            ...prevData,
            name: user.name || "",
            email: user.email || "",
            phoneNumber: user.phoneNumber || "",
          }));
        }
        
        // Second attempt: from auth service API
        if (!user || !user.name) {
          try {
            console.log("Fetching user profile from authService...");
            const profile = await authService.getUserProfile();
            
            if (profile && profile.data && profile.data.user) {
              user = profile.data.user;
              console.log("Got user profile data:", user);
              
              setUserData(user);
              setFormData(prevData => ({
                ...prevData,
                name: user.name || "",
                email: user.email || "",
                phoneNumber: user.phoneNumber || "",
              }));
            }
          } catch (profileError) {
            console.log("Could not get user profile, continuing:", profileError.message);
          }
        }
        
        // 3. Get partner profile data using partnerService
        try {
          console.log("Fetching partner profile...");
          const partnerProfile = await partnerService.getPartnerProfile();
          
          console.log("Partner profile response:", partnerProfile);
          
          if (partnerProfile && partnerProfile.data) {
            const partnerData = partnerProfile.data;
            
            // Set avatarUrl jika ada
            if (partnerData.avatarUrl) {
              setAvatarUrl(partnerData.avatarUrl);
            }
            
            // Update formData with partner data
            setFormData(prevData => ({
              ...prevData,
              jenisPenyelenggara: organizationTypeMap[partnerData.organizationType] || "",
              usernameInstagram: partnerData.instagram || "",
              organizationAddress: partnerData.organizationAddress || "",
            }));
          }
        } catch (partnerError) {
          console.error("Error fetching partner profile:", partnerError);
          toast.error("Gagal memuat data profil partner");
          
          // If we're in development, provide fallback data
          if (process.env.NODE_ENV === 'development' && (!user || !userData)) {
            console.log("Using fallback hardcoded data for development");
            
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
            
            console.log("Set hardcoded data for development", hardcodedUser);
          }
        }
        
      } catch (error) {
        console.error("Failed to fetch partner profile:", error);
        toast.error("Gagal memuat profil");
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
      
      // Validate form data
      if (!formData.jenisPenyelenggara) {
        toast.error("Silakan pilih Jenis Penyelenggara");
        setSaving(false);
        return;
      }
      
      if (!formData.usernameInstagram) {
        toast.error("Username Instagram tidak boleh kosong");
        setSaving(false);
        return;
      }
      
      if (!formData.organizationAddress) {
        toast.error("Alamat Penyelenggara tidak boleh kosong");
        setSaving(false);
        return;
      }
      
      // Check authentication
      if (!authService.isAuthenticated()) {
        toast.error("Sesi login telah berakhir. Silakan login kembali.");
        window.location.href = "/login";
        return;
      }
      
      // Prepare data for API
      const updateData = {
        organizationType: reverseOrganizationTypeMap[formData.jenisPenyelenggara],
        organizationAddress: formData.organizationAddress,
        instagram: formData.usernameInstagram,
      };
      
      console.log("Updating partner profile with data:", updateData);
      
      // Use partnerService to update profile
      const response = await partnerService.updatePartnerProfile(updateData);
      
      console.log("Update response:", response);
      
      // Show success message and set success state
      toast.success("Profil berhasil diperbarui!");
      setUpdateSuccess(true);
      
      // Refresh partner profile data to reflect changes
      try {
        const refreshedProfile = await partnerService.getPartnerProfile();
        if (refreshedProfile && refreshedProfile.data) {
          console.log("Refreshed profile data:", refreshedProfile.data);
          
          // Update formData with the latest data
          setFormData(prevData => ({
            ...prevData,
            jenisPenyelenggara: organizationTypeMap[refreshedProfile.data.organizationType] || "",
            usernameInstagram: refreshedProfile.data.instagram || "",
            organizationAddress: refreshedProfile.data.organizationAddress || "",
          }));
          
          // Update avatar URL if available
          if (refreshedProfile.data.avatarUrl) {
            setAvatarUrl(refreshedProfile.data.avatarUrl);
          }
        }
      } catch (refreshError) {
        console.log("Could not refresh profile data:", refreshError);
        // No need to show error toast since the update was successful
      }
      
    } catch (error) {
      console.error("Error updating partner profile:", error);
      toast.error(error.message || "Gagal menyimpan perubahan. Silakan coba lagi.");
      setUpdateSuccess(false);
    } finally {
      setSaving(false);
      
      // Auto-scroll to top to show success message
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };
  
// Update fungsi handleAvatarUpload untuk menyesuaikan dengan struktur response
const handleAvatarUpload = (file, url) => {
  if (file && url) {
    console.log("Avatar uploaded successfully:", url);
    
    // Update state avatarUrl
    setAvatarUrl(url);
    
    // Update user data jika perlu
    if (userData) {
      setUserData(prevUserData => ({
        ...prevUserData,
        avatarUrl: url
      }));
    }
    
    // Update locally stored user data jika menggunakan localStorage
    try {
      const storedUser = authService.getStoredUser();
      if (storedUser) {
        storedUser.avatarUrl = url;
        localStorage.setItem('user', JSON.stringify(storedUser));
      }
    } catch (error) {
      console.error("Error updating stored user:", error);
    }
  } else {
    console.log("Avatar removed");
    setAvatarUrl(null);
    
    // Update user data jika perlu
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
      console.error("Error updating stored user:", error);
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
            <span className="font-medium text-green-800">Data penyelenggara berhasil diperbarui!</span>
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
                      Pilih salah satu jenis event
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