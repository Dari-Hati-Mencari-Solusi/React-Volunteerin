import React, { useState, useEffect } from "react";
import { Icon } from '@iconify/react';
import ktp from "../../assets/images/ktp.jpg";
import { adminService } from "../../services/adminService";
import Swal from "sweetalert2";

const UserManagement = () => {
  // State untuk menyimpan data
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showDocPreview, setShowDocPreview] = useState(false);
  const [currentDocument, setCurrentDocument] = useState(null);
  const [reviewMessage, setReviewMessage] = useState("");
  const [isMobile, setIsMobile] = useState(false);
  
  // State untuk pagination dan filtering
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    limit: 10
  });
  const [filters, setFilters] = useState({
    role: '',
    sort: 'desc',
    page: 1,
    limit: 25, // Meningkatkan limit dari 10 ke 25
    s: ''
  });
  
  // State untuk loading
  const [isLoading, setIsLoading] = useState(true);

  // Check screen size
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize(); // Check on initial load
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Fetch users on mount and when filters change
  useEffect(() => {
    fetchUsers();
  }, [filters]);

  // Update filtered users when search term changes
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredUsers(users);
    } else {
      const results = users.filter(user =>
        user.namaPendaftar.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (user.namaPenyelenggara && 
          user.namaPenyelenggara.toLowerCase().includes(searchTerm.toLowerCase()))
      );
      setFilteredUsers(results);
    }
  }, [searchTerm, users]);

  // Fungsi untuk mengambil daftar user dari API
  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      
      // Tampilkan notifikasi loading
      const toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 30000 // 30 detik maksimum
      });
      
      const loadingToast = toast.fire({
        icon: 'info',
        title: 'Sedang memuat data pengguna...'
      });
      
      // Construct query parameters
      const queryParams = new URLSearchParams();
      if (filters.role) queryParams.append('role', filters.role);
      if (filters.limit) queryParams.append('limit', filters.limit);
      if (filters.page) queryParams.append('page', filters.page);
      if (filters.sort) queryParams.append('sort', filters.sort);
      if (filters.s) queryParams.append('s', filters.s);
      
      // Fetch users with filters
      const response = await adminService.getAllUsers(queryParams);
      
      // Tutup notifikasi loading
      loadingToast.close();
      
      if (response && response.users) {
        // Format data for UI
        const formattedUsers = response.users.data.map(user => formatUserData(user));
        
        setUsers(formattedUsers);
        setFilteredUsers(formattedUsers);
        
        // Update pagination
        setPagination({
          currentPage: response.users.currentPage,
          totalPages: response.users.totalPages,
          totalItems: response.users.totalItems,
          limit: filters.limit
        });
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      Swal.fire({
        icon: 'error',
        title: 'Gagal Memuat Data',
        text: error.message || 'Terjadi kesalahan saat memuat data pengguna',
        confirmButtonText: 'Coba Lagi'
      }).then(() => {
        fetchUsers();
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Format data pengguna untuk tampilan UI
  const formatUserData = (user) => {
    return {
      id: user.id,
      namaPendaftar: user.name,
      email: user.email,
      nomorHandphone: user.phoneNumber,
      role: user.role === 'PARTNER' ? 'Partner' : 
            user.role === 'ADMIN' ? 'Admin' : 'User',
      namaPenyelenggara: user.partner?.organizationType || user.name,
      statusLegalitas: user.partner?.status === 'ACCEPTED_PROFILE' ? 'Lengkap' : 
                        user.partner?.status === 'PENDING_PROFILE' ? 'Menunggu Review' : 'Tidak Lengkap',
      dokumen: user.partner?.legality ? 
               [user.partner.legality].flat().map(doc => doc.documentUrl).filter(Boolean) : 
               [],
      pesan: user.partner?.information || "",
      rawData: user // Store the raw data for detail view
    };
  };

  // Function to fetch user detail
  const fetchUserDetail = async (userId) => {
    try {
      setIsLoading(true);
      const response = await adminService.getUserDetail(userId);
      
      if (response && response.data) {
        const detailedUser = formatUserData(response.data);
        setSelectedUser(detailedUser);
        setReviewMessage(detailedUser.pesan || "");
      }
    } catch (error) {
      console.error("Error fetching user detail:", error);
      Swal.fire({
        icon: 'error',
        title: 'Gagal Memuat Detail',
        text: error.message || 'Terjadi kesalahan saat memuat detail pengguna',
        confirmButtonText: 'Tutup'
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle search input
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    
    // If using API search, update filters after a short delay
    if (e.target.value.length > 2 || e.target.value.length === 0) {
      const timeoutId = setTimeout(() => {
        setFilters({
          ...filters,
          s: e.target.value,
          page: 1 // Reset to first page when searching
        });
      }, 500);
      
      return () => clearTimeout(timeoutId);
    }
  };

  // Handle role change
  const handleRoleChange = async (id, newRole) => {
    try {
      // Only allow User and Partner roles
      if (newRole !== 'User' && newRole !== 'Partner') {
        throw { message: 'Hanya peran User dan Partner yang dapat diubah' };
      }
      
      // Update role on backend
      await adminService.updateUserRole(id, newRole);
      
      // Update local state
      const updatedUsers = users.map(user => {
        if (user.id === id) {
          return { ...user, role: newRole };
        }
        return user;
      });
      
      setUsers(updatedUsers);
      setFilteredUsers(updatedUsers);
      
      Swal.fire({
        icon: 'success',
        title: 'Peran Diperbarui',
        text: 'Peran pengguna berhasil diperbarui',
        timer: 1500,
        showConfirmButton: false
      });
    } catch (error) {
      console.error("Error updating user role:", error);
      Swal.fire({
        icon: 'error',
        title: 'Gagal Memperbarui Peran',
        text: error.message || 'Terjadi kesalahan saat memperbarui peran pengguna',
        confirmButtonText: 'Tutup'
      });
    }
  };

  // Handle view detail
  const handleViewDetail = (user) => {
    fetchUserDetail(user.id);
    setShowDetailModal(true);
  };

  // Handle close modal
  const handleCloseModal = () => {
    setShowDetailModal(false);
    setSelectedUser(null);
  };

  // Handle approve partner
  const handleApprove = async () => {
    try {
      if (!selectedUser) return;
      
      await adminService.approvePartner(selectedUser.id, reviewMessage);
      
      // Update local state
      const updatedUsers = users.map(user => {
        if (user.id === selectedUser.id) {
          return { 
            ...user, 
            statusLegalitas: 'Lengkap',
            pesan: reviewMessage 
          };
        }
        return user;
      });
      
      setUsers(updatedUsers);
      setFilteredUsers(updatedUsers);
      setShowDetailModal(false);
      
      Swal.fire({
        icon: 'success',
        title: 'Partner Disetujui',
        text: 'Permintaan partner berhasil disetujui',
        timer: 1500,
        showConfirmButton: false
      });
    } catch (error) {
      console.error("Error approving partner:", error);
      Swal.fire({
        icon: 'error',
        title: 'Gagal Menyetujui Partner',
        text: error.message || 'Terjadi kesalahan saat menyetujui partner',
        confirmButtonText: 'Tutup'
      });
    }
  };

  // Handle reject partner
  const handleReject = async () => {
    try {
      if (!selectedUser) return;
      
      await adminService.rejectPartner(selectedUser.id, reviewMessage);
      
      // Update local state
      const updatedUsers = users.map(user => {
        if (user.id === selectedUser.id) {
          return { 
            ...user, 
            statusLegalitas: 'Tidak Lengkap',
            pesan: reviewMessage 
          };
        }
        return user;
      });
      
      setUsers(updatedUsers);
      setFilteredUsers(updatedUsers);
      setShowDetailModal(false);
      
      Swal.fire({
        icon: 'success',
        title: 'Partner Ditolak',
        text: 'Permintaan partner berhasil ditolak',
        timer: 1500,
        showConfirmButton: false
      });
    } catch (error) {
      console.error("Error rejecting partner:", error);
      Swal.fire({
        icon: 'error',
        title: 'Gagal Menolak Partner',
        text: error.message || 'Terjadi kesalahan saat menolak partner',
        confirmButtonText: 'Tutup'
      });
    }
  };

  // Handle pagination
  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= pagination.totalPages) {
      setFilters({
        ...filters,
        page: newPage
      });
    }
  };

  // Handle document preview
  const handleOpenDocument = (docUrl) => {
    setCurrentDocument({
      name: docUrl.split('/').pop() || 'Document',
      url: docUrl
    });
    setShowDocPreview(true);
  };

  // Handle close document preview
  const handleCloseDocPreview = () => {
    setShowDocPreview(false);
    setCurrentDocument(null);
  };

  // Handle limit change
  const handleLimitChange = (newLimit) => {
    setFilters({
      ...filters,
      limit: Number(newLimit),
      page: 1 // Reset to first page when changing limit
    });
  };

  // Handle role filter
  const handleRoleFilter = (role) => {
    setFilters({
      ...filters,
      role: role,
      page: 1 // Reset to first page when changing filter
    });
  };

  // Status badge components
  const getStatusBadge = (status) => {
    switch (status) {
      case "ACCEPTED_PROFILE":
      case "approved":
      case "Lengkap":
        return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">Disetujui</span>;
      case "REJECTED_PROFILE":
      case "rejected":
      case "Tidak Lengkap":
        return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">Ditolak</span>;
      default:
        return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">Menunggu Review</span>;
    }
  };

  const getLegalityBadge = (status) => {
    switch (status) {
      case "Lengkap":
        return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">Lengkap</span>;
      case "Tidak Lengkap":
        return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">Tidak Lengkap</span>;
      default:
        return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">Menunggu Review</span>;
    }
  };

  // Loading indicator
  if (isLoading && users.length === 0) {
    return (
      <section className="w-full mx-auto px-2 py-6">
        <div className="bg-gradient-to-r from-[#0A3E54] to-[#088FB2] rounded-lg p-6 mb-6 shadow-lg">
          <h1 className="text-2xl font-bold text-white">Review User</h1>
          <p className="text-cyan-100 mt-1">Kelola dan tinjau penyelenggara event</p>
        </div>
        
        <div className="flex justify-center items-center h-64">
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 border-t-4 border-b-4 border-[#0A3E54] rounded-full animate-spin"></div>
            <p className="mt-4 text-gray-600">Memuat data pengguna...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full mx-auto px-2 py-6">
      <div className="bg-gradient-to-r from-[#0A3E54] to-[#088FB2] rounded-lg p-6 mb-6 shadow-lg">
        <h1 className="text-2xl font-bold text-white">Review User</h1>
        <p className="text-cyan-100 mt-1">Kelola dan tinjau penyelenggara event</p>
      </div>

      <div className="mb-8">
        <div className="bg-white border border-gray-200 rounded-lg shadow-md overflow-hidden">
          <div className="bg-gradient-to-r from-[#0A3E54] to-[#088FB2] px-6 py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center">
            <div className="mb-4 sm:mb-0">
              <h2 className="text-lg text-white font-medium">
                Daftar Penyelenggara Event
              </h2>
            </div>
            <div className="w-full sm:w-64">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Icon icon="heroicons-outline:search" className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={handleSearch}
                  className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg block w-full pl-10 p-2.5 focus:ring-cyan-500 focus:border-cyan-500"
                  placeholder={isMobile ? "Cari..." : "Cari nama/penyelenggara..."}
                />
              </div>
            </div>
          </div>

          {/* Filter dan Limit Controls */}
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-200 flex flex-wrap gap-4 justify-between items-center">
            {/* Filter Role */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm text-gray-500">Filter Peran:</span>
              <button
                onClick={() => handleRoleFilter('')}
                className={`px-3 py-1 text-sm rounded-md ${
                  filters.role === '' ? 'bg-gradient-to-r from-cyan-600 to-teal-500 text-white' : 'bg-white text-gray-500 border'
                }`}
              >
                Semua
              </button>
              <button
                onClick={() => handleRoleFilter('volunteer')}
                className={`px-3 py-1 text-sm rounded-md ${
                  filters.role === 'volunteer' ? 'bg-gradient-to-r from-cyan-600 to-teal-500 text-white' : 'bg-white text-gray-500 border'
                }`}
              >
                User
              </button>
              <button
                onClick={() => handleRoleFilter('partner')}
                className={`px-3 py-1 text-sm rounded-md ${
                  filters.role === 'partner' ? 'bg-gradient-to-r from-cyan-600 to-teal-500 text-white' : 'bg-white text-gray-500 border'
                }`}
              >
                Partner
              </button>
              <button
                onClick={() => handleRoleFilter('admin')}
                className={`px-3 py-1 text-sm rounded-md ${
                  filters.role === 'admin' ? 'bg-gradient-to-r from-cyan-600 to-teal-500 text-white' : 'bg-white text-gray-500 border'
                }`}
              >
                Admin
              </button>
            </div>
            
            {/* Limit Control */}
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500">Tampilkan:</span>
              <select
                value={filters.limit}
                onChange={(e) => handleLimitChange(e.target.value)}
                className="bg-white border border-gray-300 text-gray-700 text-sm rounded-md px-2 py-1"
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
              <span className="text-sm text-gray-500">per halaman</span>
            </div>
          </div>

          {isLoading && (
            <div className="flex justify-center items-center py-8">
              <div className="w-8 h-8 border-t-4 border-b-4 border-[#0A3E54] rounded-full animate-spin"></div>
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nama Pendaftar
                  </th>
                  <th scope="col" className={`${isMobile ? 'hidden' : 'px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'}`}>
                    Kontak
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Penyelenggara
                  </th>
                  <th scope="col" className="px-12 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Legalitas
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50 transition-colors duration-150">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-8 w-8 bg-gradient-to-r from-cyan-500 to-teal-400 rounded-full flex items-center justify-center text-white font-semibold">
                            {user.namaPendaftar.charAt(0)}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {user.namaPendaftar}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className={`${isMobile ? 'hidden' : 'px-6 py-4 whitespace-nowrap'}`}>
                        <div className="text-sm text-gray-500">
                          {user.email}
                        </div>
                        <div className="text-sm text-gray-500">
                          {user.nomorHandphone}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{user.namaPenyelenggara}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-black relative">
                          {user.role === 'Admin' ? (
                            <div className="px-2 py-1 bg-purple-100 text-purple-800 text-xs sm:text-sm rounded-lg">
                              Admin
                            </div>
                          ) : (
                            <select
                              value={user.role}
                              onChange={(e) => handleRoleChange(user.id, e.target.value)}
                              className="bg-cyan-100 text-cyan-800 text-xs sm:text-sm rounded-lg block w-full p-1 border-none focus:ring-2 focus:ring-cyan-500 appearance-none cursor-pointer"
                            >
                              <option value="User" className="bg-white text-black">User</option>
                              <option value="Partner" className="bg-white text-black">Partner</option>
                            </select>
                          )}
                          {user.role !== 'Admin' && (
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                              <Icon icon="heroicons-solid:chevron-down" className="h-4 w-4" />
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getLegalityBadge(user.statusLegalitas)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => handleViewDetail(user)}
                          className="text-[#0A3E54] hover:text-cyan-900 font-medium flex items-center transition-colors duration-150"
                        >
                          <Icon icon="heroicons-outline:eye" className="h-5 w-5" />
                          <span className={`${isMobile ? 'hidden' : 'ml-1'}`}>
                            {!isMobile && "Lihat Detail"}
                          </span>
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                      <div className="flex flex-col items-center">
                        <Icon icon="heroicons-outline:user-group" className="h-10 w-10 text-gray-400 mb-2" />
                        <p>Tidak ada data pengguna yang ditemukan</p>
                        {filters.role || filters.s ? (
                          <button 
                            onClick={() => setFilters({...filters, role: '', s: '', page: 1})}
                            className="mt-2 text-cyan-600 hover:text-cyan-800 text-sm font-medium"
                          >
                            Hapus filter
                          </button>
                        ) : null}
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
            <div className="flex flex-col sm:flex-row justify-between items-center">
              <div className="text-sm text-gray-700 mb-2 sm:mb-0">
                Menampilkan <span className="font-medium">{filteredUsers.length}</span> dari <span className="font-medium">{pagination.totalItems}</span> pendaftar
              </div>
              <div className="flex items-center space-x-2">
                <button 
                  className="p-2 rounded-md bg-white text-gray-500 border border-gray-300 hover:bg-gray-50 transition-colors duration-150"
                  onClick={() => handlePageChange(pagination.currentPage - 1)}
                  disabled={pagination.currentPage <= 1}
                >
                  <Icon icon="heroicons-solid:chevron-left" className="h-5 w-5" />
                </button>
                {Array.from({ length: pagination.totalPages }, (_, i) => (
                  <button 
                    key={i}
                    onClick={() => handlePageChange(i + 1)}
                    className={`px-3 py-1 rounded-md ${
                      pagination.currentPage === i + 1
                        ? 'bg-gradient-to-r from-cyan-600 to-teal-500 text-white font-medium'
                        : 'bg-white text-gray-500 border border-gray-300 hover:bg-gray-50'
                    } transition-colors duration-150`}
                  >
                    {i + 1}
                  </button>
                ))}
                <button 
                  className="p-2 rounded-md bg-white text-gray-500 border border-gray-300 hover:bg-gray-50 transition-colors duration-150"
                  onClick={() => handlePageChange(pagination.currentPage + 1)}
                  disabled={pagination.currentPage >= pagination.totalPages}
                >
                  <Icon icon="heroicons-solid:chevron-right" className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Detail Modal */}
      {showDetailModal && selectedUser && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
              <div className="bg-gradient-to-r from-[#0A3E54] to-[#088FB2]  px-6 py-4">
                <h3 className="text-lg leading-6 font-medium text-white">
                  Detail Pendaftar - {selectedUser.namaPendaftar}
                </h3>
              </div>
              
              <div className="bg-white px-6 py-5">
                <div className="mb-6">
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
                        <div>
                          <p className="text-xs font-medium text-gray-500">Status Legalitas</p>
                          <div className="mt-1">{getLegalityBadge(selectedUser.statusLegalitas)}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {selectedUser.dokumen && selectedUser.dokumen.length > 0 && (
                    <div className="bg-gray-50 p-4 rounded-lg mb-6">
                      <h4 className="text-sm uppercase font-semibold text-gray-500 mb-3">Dokumen Pendukung</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedUser.dokumen.map((doc, index) => (
                          <button
                            key={index}
                            onClick={() => handleOpenDocument(doc)}
                            className="bg-white border border-gray-200 rounded-md px-3 py-2 text-sm flex items-center shadow-sm hover:shadow-md transition-shadow duration-150 hover:bg-cyan-50"
                          >
                            <Icon icon="heroicons-outline:document" className="h-4 w-4 mr-1" />
                            {`Dokumen ${index + 1}`}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Additional section for responsible person if available */}
                  {selectedUser.rawData?.partner?.responsiblePersons && (
                    <div className="bg-gray-50 p-4 rounded-lg mb-6">
                      <h4 className="text-sm uppercase font-semibold text-gray-500 mb-3">Data Penanggung Jawab</h4>
                      <div className="space-y-3">
                        <div>
                          <p className="text-xs font-medium text-gray-500">Nama Lengkap</p>
                          <p className="text-sm">{selectedUser.rawData.partner.responsiblePersons.fullName}</p>
                        </div>
                        <div>
                          <p className="text-xs font-medium text-gray-500">NIK</p>
                          <p className="text-sm">{selectedUser.rawData.partner.responsiblePersons.nik}</p>
                        </div>
                        <div>
                          <p className="text-xs font-medium text-gray-500">Nomor Telepon</p>
                          <p className="text-sm">{selectedUser.rawData.partner.responsiblePersons.phoneNumber}</p>
                        </div>
                        <div>
                          <p className="text-xs font-medium text-gray-500">Jabatan</p>
                          <p className="text-sm">{selectedUser.rawData.partner.responsiblePersons.position}</p>
                        </div>
                        {selectedUser.rawData.partner.responsiblePersons.ktpUrl && (
                          <div>
                            <p className="text-xs font-medium text-gray-500">KTP</p>
                            <button
                              onClick={() => handleOpenDocument(selectedUser.rawData.partner.responsiblePersons.ktpUrl)}
                              className="mt-1 bg-white border border-gray-200 rounded-md px-3 py-2 text-sm flex items-center shadow-sm hover:shadow-md transition-shadow duration-150 hover:bg-cyan-50"
                            >
                              <Icon icon="heroicons-outline:identification" className="h-4 w-4 mr-1" />
                              Lihat KTP
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                  
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="text-sm uppercase font-semibold text-gray-500 mb-3">Review</h4>
                    <textarea
                      value={reviewMessage}
                      onChange={(e) => setReviewMessage(e.target.value)}
                      className="shadow-sm focus:ring-cyan-500 focus:border-cyan-500 block w-full sm:text-sm border-gray-300 rounded-md p-4"
                      placeholder="Masukkan alasan diterima atau ditolak..."
                      rows="3"
                    ></textarea>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 px-6 py-4 flex flex-col sm:flex-row-reverse sm:justify-between gap-2">
                <div className="flex flex-col sm:flex-row gap-2">
                  <button
                    type="button"
                    onClick={handleApprove}
                    className="w-full inline-flex justify-center rounded-md shadow-sm px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-base font-medium text-white hover:from-green-600 hover:to-emerald-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:w-auto sm:text-sm transition-colors duration-150"
                  >
                    Setujui
                  </button>
                  <button
                    type="button"
                    onClick={handleReject}
                    className="w-full inline-flex justify-center rounded-md shadow-sm px-4 py-2 bg-gradient-to-r from-red-500 to-rose-500 text-base font-medium text-white hover:from-red-600 hover:to-rose-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:w-auto sm:text-sm transition-colors duration-150"
                  >
                    Tolak
                  </button>
                </div>
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 sm:w-auto sm:text-sm transition-colors duration-150"
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
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-800 opacity-80"></div>
            </div>
            
            <div className="relative inline-block bg-white rounded-lg overflow-hidden shadow-xl transform transition-all max-w-4xl w-full">
              <div className="bg-gradient-to-r from-[#0A3E54] to-[#088FB2]  px-6 py-4 flex justify-between items-center">
                <h3 className="text-lg leading-6 font-medium text-white">
                  {currentDocument.name}
                </h3>
                <div className="flex space-x-2">
                  <a 
                    href={currentDocument.url} 
                    download
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white hover:text-cyan-200 transition-colors"
                    title="Download dokumen"
                  >
                    <Icon icon="heroicons-outline:download" className="h-5 w-5" />
                  </a>
                  <button 
                    onClick={handleCloseDocPreview}
                    className="text-white hover:text-cyan-200 transition-colors"
                    title="Tutup preview"
                  >
                    <Icon icon="heroicons-outline:x" className="h-6 w-6" />
                  </button>
                </div>
              </div>
              
              <div className="bg-gray-100 p-4">
                <div className="bg-white rounded-lg shadow-inner p-1 flex justify-center min-h-96">
                  <img 
                    src={currentDocument.url} 
                    alt={`Preview ${currentDocument.name}`} 
                    className="max-w-full h-auto max-h-96 object-contain"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = ktp; // Fallback image if loading fails
                    }}
                  />
                </div>
              </div>
              
              <div className="bg-gray-50 px-6 py-4 flex justify-between">
                <button
                  type="button"
                  onClick={handleCloseDocPreview}
                  className="inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 sm:text-sm transition-colors duration-150"
                >
                  Tutup
                </button>
                <a
                  href={currentDocument.url}
                  download
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex justify-center rounded-md shadow-sm px-4 py-2 bg-gradient-to-r from-cyan-600 to-teal-500 text-base font-medium text-white hover:from-cyan-700 hover:to-teal-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 sm:text-sm transition-colors duration-150"
                >
                  Unduh Dokumen
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default UserManagement;