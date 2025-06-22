import React, { useState, useEffect, useCallback, useRef } from "react";
import { Icon } from "@iconify/react";
import ktp from "../../assets/images/ktp.jpg";
import { adminService } from "../../services/adminService";
import Swal from "sweetalert2";

const UserManagement = () => {
  // Constants & State
  const documentAssets = { "NPWP.pdf": ktp, "KTP.pdf": ktp, "SuratIzin.pdf": ktp, "SIUP.pdf": ktp };
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const searchTimeout = useRef(null);
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [reviewMessage, setReviewMessage] = useState("");
  const [isMobile, setIsMobile] = useState(false);
  const [showDocPreview, setShowDocPreview] = useState(false);
  const [currentDocument, setCurrentDocument] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    currentPage: 1, totalPages: 1, totalItems: 0
  });
  const [queryParams, setQueryParams] = useState({
    role: "PARTNER", page: 1, limit: 10, sort: "desc"
  });

  // Screen Size Detection
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Debounced Search
  const debouncedSearch = useCallback((value) => {
    if (searchTimeout.current) clearTimeout(searchTimeout.current);
    setIsSearching(true);
    searchTimeout.current = setTimeout(() => {
      setQueryParams(prev => ({ ...prev, s: value || undefined, page: 1 }));
    }, 500);
  }, []);

  // Fetch Users Data
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await adminService.getUsers(queryParams);
        
        if (response?.users) {
          const { currentPage, totalPages, totalItems, data } = response.users;
          setPagination({ currentPage, totalPages, totalItems });
          
          const formattedUsers = data.map((user) => ({
            id: user.id,
            namaPendaftar: user.name || 'No Name',
            email: user.email || 'No Email',
            nomorHandphone: formatPhoneNumber(user.phoneNumber) || 'No Phone',
            role: mapRole(user.role),
            namaPenyelenggara: user.name || 'Tidak tersedia',
            statusLegalitas: mapPartnerStatus(user.partner?.status),
            dokumen: [],
            pesan: user.partner?.information || "",
            jenisPenyelenggara: user.partner?.organizationType ? 
              mapOrganizationType(user.partner.organizationType) : 'Tidak Tersedia',
            alamat: user.partner?.organizationAddress || "Alamat tidak tersedia",
            usernameInstagram: user.partner?.instagram || "-",
            rawUserData: user
          }));
          
          setUsers(formattedUsers);
          setFilteredUsers(formattedUsers);
        } else {
          console.warn('API returned unexpected data format');
        }
      } catch (error) {
        console.error('Error fetching users:', error);
        Swal.fire({
          icon: 'error',
          title: 'Gagal Memuat Data',
          text: error.message || 'Terjadi kesalahan saat memuat data pengguna.',
        });
      } finally {
        setLoading(false);
        setIsSearching(false);
      }
    };
    
    fetchUsers();
    return () => { if (searchTimeout.current) clearTimeout(searchTimeout.current); };
  }, [queryParams]);

  // Helper Functions
  const formatPhoneNumber = phone => !phone ? "" : (phone.startsWith('62') ? '0' + phone.substring(2) : phone);
  
  const mapRole = role => ({
    'PARTNER': 'Partner',
    'ADMIN': 'Admin',
    'VOLUNTEER': 'User'
  }[role] || role);
  
  const mapPartnerStatus = status => ({
    'ACCEPTED_PROFILE': 'Profil Lengkap',
    'ACCEPTED_LEGALITY': 'Lengkap',
    'REJECTED_PROFILE': 'Profil Ditolak',
    'REJECTED_LEGALITY': 'Tidak Lengkap',
    'PENDING_PROFILE': 'Menunggu Review Profil',
    'PENDING_LEGALITY': 'Menunggu Review',
  }[status] || 'Belum Diunggah');
  
  const mapOrganizationType = type => ({
    'COMMUNITY': 'Komunitas',
    'FOUNDATION': 'Yayasan',
    'CORPORATE': 'Perusahaan',
    'EDUCATION': 'Institusi Pendidikan',
    'INDIVIDUAL': 'Individu',
    'OTHER': 'Lainnya'
  }[type] || type);

  // Event Handlers
  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    
    if (!value.trim()) {
      if (searchTimeout.current) clearTimeout(searchTimeout.current);
      setQueryParams(prev => ({ ...prev, s: undefined, page: 1 }));
      return;
    }
    
    debouncedSearch(value);
  };

  const handleSearchKeyDown = (e) => {
    if (e.key === 'Enter') {
      if (searchTimeout.current) clearTimeout(searchTimeout.current);
      setQueryParams(prev => ({ ...prev, s: searchTerm.trim() || undefined, page: 1 }));
    }
  };

  const handleClearSearch = () => {
    setSearchTerm('');
    if (searchTimeout.current) clearTimeout(searchTimeout.current);
    setQueryParams(prev => ({ ...prev, s: undefined, page: 1 }));
  };

  const handleRoleChange = async (id, newRole) => {
    try {
      // TODO: Implement API call for role update when available
      const updatedUsers = users.map(user => user.id === id ? { ...user, role: newRole } : user);
      setUsers(updatedUsers);
      
      Swal.fire({
        icon: 'success',
        title: 'Peran Diperbarui',
        text: 'Peran pengguna berhasil diperbarui',
        timer: 2000,
        showConfirmButton: false
      });
    } catch (error) {
      console.error("Error updating role:", error);
    }
  };

  const handleViewDetail = async (user) => {
    try {
      setLoading(true);
      const detailResponse = await adminService.getUserDetail(user.id);
      
      if (detailResponse?.data) {
        const detailData = detailResponse.data;
        
        // Process legal documents
        let legalDocuments = [];
        let partnerLegality = detailData.partner?.legality;
        
        if (!partnerLegality?.legalDocuments && detailData.partner?.status?.includes("ACCEPTED_PROFILE")) {
          try {
            const legalDocsResponse = await adminService.getPartnerLegalDocs(user.id);
            if (legalDocsResponse?.data) partnerLegality = legalDocsResponse.data;
          } catch (err) {
            console.warn("Failed to fetch legal documents separately:", err);
          }
        }
        
        if (partnerLegality?.legalDocuments) {
          legalDocuments = partnerLegality.legalDocuments.map(doc => ({
            documentName: doc.documentName || doc.name || "Document.pdf",
            documentUrl: doc.documentUrl || doc.url || null,
            documentType: doc.documentType || "unknown"
          }));
        }
        
        const updatedSelectedUser = {
          ...user,
          namaPenyelenggara: detailData.partner?.organizationName || detailData.name,
          jenisPenyelenggara: detailData.partner?.organizationType ? 
            mapOrganizationType(detailData.partner.organizationType) : 'Tidak Tersedia',
          alamat: detailData.partner?.organizationAddress || "Alamat tidak tersedia",
          usernameInstagram: detailData.partner?.instagram || "-",
          pesan: detailData.partner?.information || "",
          dokumen: legalDocuments.map(doc => doc.documentName),
          rawPartnerData: detailData.partner,
          responsiblePerson: detailData.partner?.responsiblePersons || null,
          legalDocuments
        };
        
        setSelectedUser(updatedSelectedUser);
        setReviewMessage(updatedSelectedUser.pesan || "");
        setShowDetailModal(true);
      }
    } catch (error) {
      console.error("Error fetching user detail:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseModal = () => {
    setShowDetailModal(false);
    setSelectedUser(null);
    setReviewMessage("");
  };

  const handleApprove = async () => {
    if (!selectedUser) return;
    
    try {
      const reviewResult = selectedUser.rawPartnerData?.status === "ACCEPTED_PROFILE" ? 
        "ACCEPTED_LEGALITY" : "ACCEPTED_PROFILE";
      
      await adminService.reviewPartner(selectedUser.id, reviewResult, reviewMessage);
      
      const updatedUsers = users.map(user => 
        user.id === selectedUser.id ? 
          { ...user, statusLegalitas: reviewResult === "ACCEPTED_LEGALITY" ? "Lengkap" : "Profil Lengkap", pesan: reviewMessage || user.pesan } : 
          user
      );
      
      setUsers(updatedUsers);
      setFilteredUsers(updatedUsers);
      setShowDetailModal(false);
      
      Swal.fire({
        icon: 'success',
        title: reviewResult === "ACCEPTED_LEGALITY" ? 'Dokumen Disetujui' : 'Profil Disetujui',
        timer: 2000,
        showConfirmButton: false
      });
    } catch (error) {
      console.error("Error approving:", error);
    }
  };

  const handleReject = async () => {
    if (!selectedUser) return;
    
    if (!reviewMessage.trim()) {
      Swal.fire({
        icon: 'warning',
        title: 'Pesan Diperlukan',
        text: 'Silakan berikan alasan penolakan untuk partner'
      });
      return;
    }
    
    try {
      const reviewResult = selectedUser.rawPartnerData?.status === "ACCEPTED_PROFILE" ? 
        "REJECTED_LEGALITY" : "REJECTED_PROFILE";
      
      await adminService.reviewPartner(selectedUser.id, reviewResult, reviewMessage);
      
      const updatedUsers = users.map(user => 
        user.id === selectedUser.id ? 
          { ...user, statusLegalitas: reviewResult === "REJECTED_LEGALITY" ? "Tidak Lengkap" : "Profil Ditolak", pesan: reviewMessage } : 
          user
      );
      
      setUsers(updatedUsers);
      setFilteredUsers(updatedUsers);
      setShowDetailModal(false);
      
      Swal.fire({
        icon: 'success',
        title: reviewResult === "REJECTED_LEGALITY" ? 'Dokumen Ditolak' : 'Profil Ditolak',
        timer: 2000,
        showConfirmButton: false
      });
    } catch (error) {
      console.error("Error rejecting:", error);
    }
  };

  const handleOpenDocument = (docName, docUrl = null) => {
    setCurrentDocument({
      name: docName,
      url: docUrl || documentAssets[docName] || ktp
    });
    setShowDocPreview(true);
  };

  const handleCloseDocPreview = () => {
    setShowDocPreview(false);
    setCurrentDocument(null);
  };
  
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      setQueryParams(prev => ({ ...prev, page: newPage }));
    }
  };

  const getLegalityBadge = (status) => {
    const badgeClasses = {
      "Lengkap": "bg-green-100 text-green-800",
      "Profil Lengkap": "bg-blue-100 text-blue-800",
      "Tidak Lengkap": "bg-red-100 text-red-800",
      "Profil Ditolak": "bg-red-100 text-red-800",
      "Menunggu Review": "bg-yellow-100 text-yellow-800",
      "Menunggu Review Profil": "bg-yellow-100 text-yellow-800",
      "default": "bg-gray-100 text-gray-800"
    };
    
    return (
      <span className={`px-3 inline-flex text-xs leading-5 p-1 font-semibold rounded-full ${badgeClasses[status] || badgeClasses.default}`}>
        {status}
      </span>
    );
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#0A3E54] mx-auto"></div>
          <p className="mt-4 text-gray-600">Memuat data pengguna...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="bg-gradient-to-r from-[#0A3E54] to-[#088FB2] rounded-lg p-6 mb-6 shadow-lg">
        <h1 className="text-2xl font-bold text-white">Review User</h1>
        <p className="text-cyan-100 mt-1">Kelola dan tinjau penyelenggara event</p>
      </div>

      {/* Main Content */}
      <div className="mb-8">
        <div className="bg-white border border-gray-200 rounded-lg shadow-md overflow-hidden">
          {/* Search Bar */}
          <div className="bg-gradient-to-r from-[#0A3E54] to-[#088FB2] px-6 py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center">
            <div className="mb-4 sm:mb-0">
              <h2 className="text-lg text-white font-medium">Daftar Penyelenggara Event</h2>
            </div>
            <div className="w-full sm:w-64">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  {isSearching ? 
                    <div className="animate-spin h-5 w-5 border-2 border-cyan-500 rounded-full border-t-transparent"></div> :
                    <Icon icon="heroicons-outline:search" className="h-5 w-5 text-gray-400" />
                  }
                </div>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={handleSearch}
                  onKeyDown={handleSearchKeyDown}
                  className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg block w-full pl-10 pr-10 p-2.5 focus:ring-cyan-500 focus:border-cyan-500"
                  placeholder={isMobile ? "Cari..." : "Cari nama/email..."}
                />
                {searchTerm && (
                  <button 
                    onClick={handleClearSearch}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
                  >
                    <Icon icon="heroicons-solid:x-circle" className="h-5 w-5" />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama Pendaftar</th>
                  <th className={`${isMobile ? 'hidden' : 'px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'}`}>Kontak</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Penyelenggara</th>
                  <th className="px-12 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Legalitas</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-8 w-8 bg-gradient-to-r from-cyan-500 to-teal-400 rounded-full flex items-center justify-center text-white font-semibold">
                            {user.namaPendaftar.charAt(0)}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{user.namaPendaftar}</div>
                          </div>
                        </div>
                      </td>
                      <td className={`${isMobile ? 'hidden' : 'px-6 py-4 whitespace-nowrap'}`}>
                        <div className="text-sm text-gray-500">{user.email}</div>
                        <div className="text-sm text-gray-500">{user.nomorHandphone}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{user.namaPenyelenggara}</div>
                        {user.jenisPenyelenggara && user.jenisPenyelenggara !== "Tidak Tersedia" && (
                          <div className="text-xs text-gray-500">{user.jenisPenyelenggara}</div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-black relative">
                          <select
                            value={user.role}
                            onChange={(e) => handleRoleChange(user.id, e.target.value)}
                            className="bg-cyan-100 text-cyan-800 text-xs sm:text-sm rounded-lg block w-full p-1 border-none focus:ring-2 focus:ring-cyan-500 appearance-none cursor-pointer"
                          >
                            <option value="User" className="bg-white text-black">User</option>
                            <option value="Partner" className="bg-white text-black">Partner</option>
                            <option value="Admin" className="bg-white text-black">Admin</option>
                          </select>
                          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                            <Icon icon="heroicons-solid:chevron-down" className="h-4 w-4" />
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getLegalityBadge(user.statusLegalitas)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => handleViewDetail(user)}
                          className="text-cyan-600 hover:text-cyan-900 flex items-center gap-1"
                        >
                          <Icon icon="heroicons-solid:eye" className="h-5 w-5" />
                          <span>Detail</span>
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                      Tidak ada data pengguna yang ditemukan
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          {/* Pagination */}
          <div className="px-5 py-5 bg-white border-t flex flex-col sm:flex-row items-center justify-between">
            <div className="text-sm text-gray-700 mb-4 sm:mb-0">
              Menampilkan <span className="font-medium">{filteredUsers.length}</span> dari <span className="font-medium">{pagination.totalItems}</span> pendaftar
            </div>
            <div className="flex items-center space-x-2">
              <button 
                onClick={() => handlePageChange(pagination.currentPage - 1)}
                disabled={pagination.currentPage <= 1}
                className={`p-2 rounded-md ${pagination.currentPage <= 1 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-500 border border-gray-300 hover:bg-gray-50'}`}
              >
                <Icon icon="heroicons-solid:chevron-left" className="h-5 w-5" />
              </button>
              
              {/* Page Numbers */}
              {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                const pageNumber = pagination.currentPage <= 3 ? i + 1 : pagination.currentPage + i - 2;
                if (pageNumber > pagination.totalPages) return null;
                
                return (
                  <button 
                    key={pageNumber}
                    onClick={() => handlePageChange(pageNumber)}
                    className={`px-3 py-1 rounded-md ${pageNumber === pagination.currentPage ? 'bg-gradient-to-r from-cyan-600 to-teal-500 text-white font-medium' : 'bg-white text-gray-500 border border-gray-300 hover:bg-gray-50'}`}
                  >
                    {pageNumber}
                  </button>
                );
              })}
              
              <button 
                onClick={() => handlePageChange(pagination.currentPage + 1)}
                disabled={pagination.currentPage >= pagination.totalPages}
                className={`p-2 rounded-md ${pagination.currentPage >= pagination.totalPages ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-500 border border-gray-300 hover:bg-gray-50'}`}
              >
                <Icon icon="heroicons-solid:chevron-right" className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* User Detail Modal */}
      {showDetailModal && selectedUser && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="border-b px-6 py-4 flex justify-between items-center bg-gradient-to-r from-cyan-600 to-teal-500">
              <h3 className="text-lg font-medium text-white">Detail Pendaftar - {selectedUser.namaPendaftar}</h3>
              <button onClick={handleCloseModal} className="text-white hover:text-cyan-200">
                <Icon icon="heroicons-outline:x" className="h-6 w-6" />
              </button>
            </div>
            
            <div className="bg-white px-6 py-5">
              {/* User Information Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="text-sm uppercase font-semibold text-gray-500 mb-3">Informasi Umum</h4>
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs font-medium text-gray-500">Nama Pendaftar</p>
                      <p className="text-sm font-medium">{selectedUser.namaPendaftar}</p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-500">Email</p>
                      <p className="text-sm">{selectedUser.email}</p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-500">Nomor Handphone</p>
                      <p className="text-sm">{selectedUser.nomorHandphone}</p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-500">Role</p>
                      <p className="text-sm">{selectedUser.role}</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="text-sm uppercase font-semibold text-gray-500 mb-3">Informasi Penyelenggara</h4>
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs font-medium text-gray-500">Nama Penyelenggara</p>
                      <p className="text-sm">{selectedUser.namaPenyelenggara}</p>
                    </div>
                    {selectedUser.jenisPenyelenggara && selectedUser.jenisPenyelenggara !== "Tidak Tersedia" && (
                      <div>
                        <p className="text-xs font-medium text-gray-500">Jenis Penyelenggara</p>
                        <p className="text-sm">{selectedUser.jenisPenyelenggara}</p>
                      </div>
                    )}
                    {selectedUser.usernameInstagram && selectedUser.usernameInstagram !== "-" && (
                      <div>
                        <p className="text-xs font-medium text-gray-500">Instagram</p>
                        <p className="text-sm">{selectedUser.usernameInstagram}</p>
                      </div>
                    )}
                    {selectedUser.alamat && selectedUser.alamat !== "Alamat tidak tersedia" && (
                      <div>
                        <p className="text-xs font-medium text-gray-500">Alamat</p>
                        <p className="text-sm">{selectedUser.alamat}</p>
                      </div>
                    )}
                    <div>
                      <p className="text-xs font-medium text-gray-500">Status Legalitas</p>
                      <div className="mt-1">{getLegalityBadge(selectedUser.statusLegalitas)}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Responsible Person Section */}
              {selectedUser.responsiblePerson && (
                <div className="bg-gray-50 p-4 rounded-lg mb-6">
                  <h4 className="text-sm uppercase font-semibold text-gray-500 mb-3">Penanggung Jawab</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs font-medium text-gray-500">Nama Lengkap</p>
                      <p className="text-sm">{selectedUser.responsiblePerson.fullName}</p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-500">NIK</p>
                      <p className="text-sm">{selectedUser.responsiblePerson.nik}</p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-500">Nomor Telepon</p>
                      <p className="text-sm">{selectedUser.responsiblePerson.phoneNumber}</p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-500">Jabatan</p>
                      <p className="text-sm">{selectedUser.responsiblePerson.position}</p>
                    </div>
                    {selectedUser.responsiblePerson.ktpUrl && (
                      <div className="col-span-2">
                        <p className="text-xs font-medium text-gray-500 mb-2">KTP</p>
                        <div className="relative bg-white border rounded-lg p-2 inline-block">
                          <img src={selectedUser.responsiblePerson.ktpUrl} alt="KTP" className="h-32 object-contain" />
                          <button
                            onClick={() => handleOpenDocument("KTP", selectedUser.responsiblePerson.ktpUrl)}
                            className="absolute top-2 right-2 bg-white bg-opacity-75 rounded-full p-1 shadow hover:bg-opacity-100 transition-all"
                          >
                            <Icon icon="heroicons-solid:eye" className="h-4 w-4 text-cyan-600" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Legal Documents Section */}
              <div className="bg-gray-50 p-4 rounded-lg mb-6">
                <h4 className="text-sm uppercase font-semibold text-gray-500 mb-3">Dokumen Legalitas</h4>
                {selectedUser.legalDocuments && selectedUser.legalDocuments.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {selectedUser.legalDocuments.map((doc, index) => (
                      <div key={index} className="bg-white border rounded-lg p-3 flex flex-col items-center">
                        <div className="text-cyan-500 mb-2">
                          <Icon icon="heroicons-solid:document-text" className="h-8 w-8" />
                        </div>
                        <p className="text-xs text-gray-700 mb-2 text-center">{doc.documentName}</p>
                        <button 
                          onClick={() => handleOpenDocument(doc.documentName, doc.documentUrl)}
                          className="text-xs text-cyan-600 hover:text-cyan-900 flex items-center gap-1"
                        >
                          <Icon icon="heroicons-solid:eye" className="h-4 w-4" />
                          <span>Lihat</span>
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">Belum ada dokumen</p>
                )}
              </div>

              {/* Review Section */}
              {selectedUser.role === "Partner" && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="text-sm uppercase font-semibold text-gray-500 mb-3">Review Partner</h4>
                  <div className="mb-4">
                    <label className="text-xs font-medium text-gray-500 block mb-2">
                      Pesan (Opsional untuk Disetujui, Wajib jika Ditolak)
                    </label>
                    <textarea 
                      value={reviewMessage} 
                      onChange={(e) => setReviewMessage(e.target.value)}
                      rows="4"
                      className="w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
                      placeholder="Masukkan alasan atau komentar..."
                    ></textarea>
                  </div>
                  
                  <div className="flex justify-end space-x-4">
                    <button 
                      onClick={handleReject}
                      className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors text-sm"
                    >
                      Tolak
                    </button>
                    <button 
                      onClick={handleApprove}
                      className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors text-sm"
                    >
                      Setujui
                    </button>
                  </div>
                </div>
              )}
              
              {/* Previous Review Message */}
              {selectedUser.pesan && (
                <div className="bg-gray-50 p-4 rounded-lg mt-4">
                  <h4 className="text-sm uppercase font-semibold text-gray-500 mb-3">Pesan Review</h4>
                  <p className="text-sm bg-white p-3 rounded border">{selectedUser.pesan}</p>
                </div>
              )}
              
              {/* Modal Footer */}
              <div className="flex justify-end pt-4 border-t mt-4">
                <button
                  onClick={handleCloseModal}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors text-sm"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Document Preview Modal */}
      {showDocPreview && currentDocument && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-75 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl">
            <div className="border-b px-6 py-4 flex justify-between items-center">
              <h3 className="text-lg font-medium">Pratinjau Dokumen - {currentDocument.name}</h3>
              <button onClick={handleCloseDocPreview} className="text-gray-400 hover:text-gray-600">
                <Icon icon="heroicons-solid:x" className="h-5 w-5" />
              </button>
            </div>
            <div className="p-6">
              <div className="bg-gray-100 p-4 rounded-lg">
                {currentDocument.url && currentDocument.url.toLowerCase().endsWith('.pdf') ? (
                  <iframe src={currentDocument.url} title="PDF Viewer" className="w-full h-96 border-none" />
                ) : (
                  <img src={currentDocument.url} alt="Document Preview" className="w-full object-contain max-h-96" />
                )}
              </div>
              <div className="flex justify-between mt-4">
                {currentDocument.url && (
                  <a
                    href={currentDocument.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-cyan-500 text-white rounded-md hover:bg-cyan-600 transition-colors text-sm inline-flex items-center"
                  >
                    <Icon icon="heroicons-solid:download" className="h-4 w-4 mr-1" />
                    Unduh Dokumen
                  </a>
                )}
                <button
                  onClick={handleCloseDocPreview}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors text-sm"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;