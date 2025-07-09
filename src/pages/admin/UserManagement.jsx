import React, { useState, useEffect, useCallback, useRef } from "react";
import { Icon } from "@iconify/react";
import ktp from "../../assets/images/ktp.jpg";
import { adminService } from "../../services/adminService";
import { authService } from "../../services/authService";
import Swal from "sweetalert2";
import { partnerService } from "../../services/partnerService";

const UserManagement = () => {
  // Constants & State
  const documentAssets = {
    "NPWP.pdf": ktp,
    "KTP.pdf": ktp,
    "SuratIzin.pdf": ktp,
    "SIUP.pdf": ktp,
  };
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
  const [statusLoading, setStatusLoading] = useState(false);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
  });
  const [queryParams, setQueryParams] = useState({
    role: "PARTNER",
    page: 1,
    limit: 10,
    sort: "desc",
  });


  // State tambahan untuk membedakan jenis review
  const [reviewType, setReviewType] = useState('partner'); // 'partner' atau 'registrant'
  const [eventId, setEventId] = useState(null);
  const [registrantId, setRegistrantId] = useState(null);

  // Screen Size Detection
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Helper Functions
  const formatPhoneNumber = (phone) =>
    !phone ? "" : phone.startsWith("62") ? "0" + phone.substring(2) : phone;

  const mapRole = (role) =>
    ({
      PARTNER: "Partner",
      ADMIN: "Admin",
      VOLUNTEER: "User",
    }[role] || role);

  // PERBAIKAN: Function untuk menentukan status legalitas yang lebih sederhana dan akurat
  const determineStatusLegalitas = (partnerData) => {
    if (!partnerData) return "Belum Diunggah";

    const status = partnerData.status;

    // Mapping langsung berdasarkan status partner
    switch (status) {
      case "ACCEPTED_LEGALITY":
        return "Lengkap";
      case "REJECTED_LEGALITY":
        return "Tidak Lengkap";
      case "PENDING_LEGALITY":
        return "Menunggu Review";
      case "ACCEPTED_PROFILE":
        // Jika profil sudah diterima, cek apakah ada dokumen
        if (partnerData.legality || partnerData.legalDocuments) {
          return "Sudah Diunggah";
        }
        return "Profil Lengkap";
      case "REJECTED_PROFILE":
        return "Profil Ditolak";
      case "PENDING_PROFILE":
        return "Menunggu Review Profil";
      default:
        return "Belum Diunggah";
    }
  };

  const mapOrganizationType = (type) =>
    ({
      COMMUNITY: "Komunitas",
      FOUNDATION: "Yayasan",
      CORPORATE: "Perusahaan",
      EDUCATION: "Institusi Pendidikan",
      INDIVIDUAL: "Individu",
      OTHER: "Lainnya",
    }[type] || type);

  const getLegalityBadge = (status) => {
    const getStatusConfig = (status) => {
      switch (status) {
        case "Lengkap":
          return {
            className: "bg-green-100 text-green-800",
            icon: "heroicons-solid:check-circle",
          };
        case "Profil Lengkap":
          return {
            className: "bg-blue-100 text-blue-800",
            icon: "heroicons-solid:user-circle",
          };
        case "Tidak Lengkap":
          return {
            className: "bg-red-100 text-red-800",
            icon: "heroicons-solid:x-circle",
          };
        case "Profil Ditolak":
          return {
            className: "bg-red-100 text-red-800",
            icon: "heroicons-solid:x-circle",
          };
        case "Menunggu Review":
          return {
            className: "bg-yellow-100 text-yellow-800",
            icon: "heroicons-solid:clock",
          };
        case "Menunggu Review Profil":
          return {
            className: "bg-yellow-100 text-yellow-800",
            icon: "heroicons-solid:clock",
          };
        case "Sudah Diunggah":
          return {
            className: "bg-purple-100 text-purple-800",
            icon: "heroicons-solid:document-check",
          };
        case "Belum Diunggah":
          return {
            className: "bg-gray-100 text-gray-800",
            icon: "heroicons-solid:document",
          };
        default:
          return {
            className: "bg-gray-100 text-gray-800",
            icon: "heroicons-solid:document",
          };
      }
    };

    const config = getStatusConfig(status);

    return (
      <span
        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium gap-1 ${config.className}`}
      >
        <Icon icon={config.icon} className="w-3 h-3" />
        {status || "Belum Diunggah"}
      </span>
    );
  };

  // Debounced Search
  const debouncedSearch = useCallback((value) => {
    if (searchTimeout.current) clearTimeout(searchTimeout.current);
    setIsSearching(true);
    searchTimeout.current = setTimeout(() => {
      setQueryParams((prev) => ({ ...prev, s: value || undefined, page: 1 }));
    }, 500);
  }, []);

  // PERBAIKAN UTAMA: Fetch Users Data dengan status yang akurat
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        console.log("Fetching users with params:", queryParams);

        const response = await adminService.getUsers(queryParams);

        if (response?.users) {
          const { currentPage, totalPages, totalItems, data } = response.users;
          setPagination({ currentPage, totalPages, totalItems });

          console.log("Raw API data:", data);

          // PERBAIKAN: Format data users dengan status yang akurat dari response pertama
          const formattedUsers = data.map((user) => {
            let statusLegalitas = "Belum Diunggah";

            // Jika user adalah partner, tentukan status berdasarkan data yang ada
            if (user.role === "PARTNER" && user.partner) {
              statusLegalitas = determineStatusLegalitas(user.partner);
              console.log(
                `User: ${
                  user.partner?.organizationName || user.name
                }, Status: ${
                  user.partner?.status
                }, Determined Status: ${statusLegalitas}`
              );
            }

            return {
              id: user.id,
              namaPendaftar: user.name || "No Name",
              email: user.email || "No Email",
              nomorHandphone: formatPhoneNumber(user.phoneNumber) || "No Phone",
              role: mapRole(user.role),
              namaPenyelenggara:
                user.partner?.organizationName || user.name || "Tidak tersedia",
              statusLegalitas: statusLegalitas,
              dokumen: [],
              pesan: user.partner?.information || "",
              jenisPenyelenggara: user.partner?.organizationType
                ? mapOrganizationType(user.partner.organizationType)
                : "Tidak Tersedia",
              alamat:
                user.partner?.organizationAddress || "Alamat tidak tersedia",
              usernameInstagram: user.partner?.instagram || "-",
              rawUserData: user,
              hasDocuments: !!(
                user.partner?.legality || user.partner?.legalDocuments
              ),
            };
          });

          console.log("Formatted users with status:", formattedUsers);

          setUsers(formattedUsers);
          setFilteredUsers(formattedUsers);

          // PERBAIKAN: Setelah load pertama, update status untuk user yang perlu detail check
          updateDetailedStatus(formattedUsers);
        } else {
          console.warn("API returned unexpected data format");
        }
      } catch (error) {
        console.error("Error fetching users:", error);
        Swal.fire({
          icon: "error",
          title: "Gagal Memuat Data",
          text: error.message || "Terjadi kesalahan saat memuat data pengguna.",
        });
      } finally {
        setLoading(false);
        setIsSearching(false);
      }
    };

    fetchUsers();
    return () => {
      if (searchTimeout.current) clearTimeout(searchTimeout.current);
    };
  }, [queryParams]);

  // PERBAIKAN: Function untuk update status yang lebih detail secara background
  const updateDetailedStatus = async (currentUsers) => {
    try {
      setStatusLoading(true);

      // Filter user yang perlu detailed check (status masih basic atau Profil Lengkap)
      const usersNeedingDetailCheck = currentUsers.filter(
        (user) =>
          user.role === "Partner" &&
          (user.statusLegalitas === "Profil Lengkap" ||
            user.statusLegalitas === "Belum Diunggah")
      );

      if (usersNeedingDetailCheck.length === 0) {
        setStatusLoading(false);
        return;
      }

      console.log(
        `Updating detailed status for ${usersNeedingDetailCheck.length} users...`
      );

      // Fetch detail untuk users yang perlu
      const detailPromises = usersNeedingDetailCheck.map(async (user) => {
        try {
          const detailResponse = await adminService.getUserDetail(user.id);
          if (detailResponse?.data?.partner) {
            const detailedStatus = determineStatusLegalitas(
              detailResponse.data.partner
            );
            console.log(
              `Updated status for ${user.namaPendaftar}: ${user.statusLegalitas} -> ${detailedStatus}`
            );
            return { userId: user.id, newStatus: detailedStatus };
          }
        } catch (error) {
          console.error(`Error fetching detail for user ${user.id}:`, error);
        }
        return null;
      });

      const detailResults = await Promise.all(detailPromises);
      const validResults = detailResults.filter((result) => result !== null);

      // Update status jika ada perubahan
      if (validResults.length > 0) {
        setUsers((prevUsers) =>
          prevUsers.map((user) => {
            const update = validResults.find(
              (result) => result.userId === user.id
            );
            if (update && update.newStatus !== user.statusLegalitas) {
              return { ...user, statusLegalitas: update.newStatus };
            }
            return user;
          })
        );

        setFilteredUsers((prevUsers) =>
          prevUsers.map((user) => {
            const update = validResults.find(
              (result) => result.userId === user.id
            );
            if (update && update.newStatus !== user.statusLegalitas) {
              return { ...user, statusLegalitas: update.newStatus };
            }
            return user;
          })
        );

        console.log(`Updated ${validResults.length} user statuses`);
      }
    } catch (error) {
      console.error("Error updating detailed status:", error);
    } finally {
      setStatusLoading(false);
    }
  };

  // Event Handlers
  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (!value.trim()) {
      if (searchTimeout.current) clearTimeout(searchTimeout.current);
      setQueryParams((prev) => ({ ...prev, s: undefined, page: 1 }));
      return;
    }

    debouncedSearch(value);
  };

  const handleSearchKeyDown = (e) => {
    if (e.key === "Enter") {
      if (searchTimeout.current) clearTimeout(searchTimeout.current);
      setQueryParams((prev) => ({
        ...prev,
        s: searchTerm.trim() || undefined,
        page: 1,
      }));
    }
  };

  const handleClearSearch = () => {
    setSearchTerm("");
    if (searchTimeout.current) clearTimeout(searchTimeout.current);
    setQueryParams((prev) => ({ ...prev, s: undefined, page: 1 }));
  };

  const handleRoleChange = async (id, newRole) => {
    try {
      const updatedUsers = users.map((user) =>
        user.id === id ? { ...user, role: newRole } : user
      );
      setUsers(updatedUsers);
      setFilteredUsers(updatedUsers);

      Swal.fire({
        icon: "success",
        title: "Peran Diperbarui",
        text: "Peran pengguna berhasil diperbarui",
        timer: 2000,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error("Error updating role:", error);
    }
  };


  const handleViewDetail = async (user) => {
    try {
      setLoading(true);
      
      // Tentukan jenis review berdasarkan data user
      // Untuk sekarang, fokus pada partner review karena registrant review perlu data tambahan
      setReviewType('partner');
      setEventId(null);
      setRegistrantId(null);
      
      const detailResponse = await adminService.getUserDetail(user.id);

      if (detailResponse?.data) {
        const detailData = detailResponse.data;
        const partnerData = detailData.partner;

        // Process legal documents (kode existing tidak berubah)
        let legalDocuments = [];

        if (partnerData?.legality) {
          const legalityData = partnerData.legality;

          if (
            legalityData.legalDocuments &&
            Array.isArray(legalityData.legalDocuments)
          ) {
            legalDocuments = legalityData.legalDocuments.map((doc) => ({
              id: doc.id || Math.random().toString(36),
              documentName: doc.documentName || doc.name || "Document.pdf",
              documentUrl: doc.documentUrl || doc.url || null,
              documentType: doc.documentType || doc.type || "unknown",
              information: doc.information || doc.keterangan || null,
              createdAt: doc.createdAt || doc.uploadedAt || null,
            }));
          } else if (legalityData.documentName || legalityData.documentUrl) {
            legalDocuments = [
              {
                id: legalityData.id || Math.random().toString(36),
                documentName: legalityData.documentName || "Document.pdf",
                documentUrl: legalityData.documentUrl || null,
                documentType: legalityData.documentType || "unknown",
                information: legalityData.information || null,
                createdAt: legalityData.createdAt || null,
              },
            ];
          } else if (Array.isArray(legalityData)) {
            legalDocuments = legalityData.map((doc) => ({
              id: doc.id || Math.random().toString(36),
              documentName: doc.documentName || doc.name || "Document.pdf",
              documentUrl: doc.documentUrl || doc.url || null,
              documentType: doc.documentType || "unknown",
              information: doc.information || null,
              createdAt: doc.createdAt || null,
            }));
          }
        }

        if (legalDocuments.length === 0 && partnerData?.legalDocuments) {
          if (Array.isArray(partnerData.legalDocuments)) {
            legalDocuments = partnerData.legalDocuments.map((doc) => ({
              id: doc.id || Math.random().toString(36),
              documentName: doc.documentName || doc.name || "Document.pdf",
              documentUrl: doc.documentUrl || doc.url || null,
              documentType: doc.documentType || "unknown",
              information: doc.information || null,
              createdAt: doc.createdAt || null,
            }));
          }
        }

        // Determine updated status
        const updatedStatus = determineStatusLegalitas(partnerData);

        // Process responsible person data (kode existing tidak berubah)
        let responsiblePerson = null;
        const possibleResponsiblePersonSources = [
          partnerData?.responsiblePersons?.[0],
          partnerData?.responsiblePerson,
          detailData?.responsiblePersons?.[0],
          detailData?.responsiblePerson,
        ];

        for (const source of possibleResponsiblePersonSources) {
          if (source && typeof source === "object") {
            if (Array.isArray(source) && source.length > 0) {
              const person = source[0];
              responsiblePerson = {
                fullName:
                  person.fullName || person.name || person.fullname || "",
                nik: person.nik || person.NIK || "",
                phoneNumber:
                  person.phoneNumber ||
                  person.phone ||
                  person.nomorTelepon ||
                  "",
                position:
                  person.position || person.jabatan || person.posisi || "",
                ktpUrl:
                  person.ktpUrl || person.ktp || person.ktpImageUrl || null,
              };
              break;
            } else if (source.fullName || source.name || source.nik) {
              responsiblePerson = {
                fullName:
                  source.fullName || source.name || source.fullname || "",
                nik: source.nik || source.NIK || "",
                phoneNumber:
                  source.phoneNumber ||
                  source.phone ||
                  source.nomorTelepon ||
                  "",
                position:
                  source.position || source.jabatan || source.posisi || "",
                ktpUrl:
                  source.ktpUrl || source.ktp || source.ktpImageUrl || null,
              };
              break;
            }
          }
        }

        const updatedSelectedUser = {
          ...user,
          namaPenyelenggara: partnerData?.organizationName || detailData.name,
          jenisPenyelenggara: partnerData?.organizationType
            ? mapOrganizationType(partnerData.organizationType)
            : "Tidak Tersedia",
          alamat: partnerData?.organizationAddress || "Alamat tidak tersedia",
          usernameInstagram: partnerData?.instagram || "-",
          pesan: partnerData?.information || "",
          dokumen: legalDocuments.map((doc) => doc.documentName),
          rawPartnerData: partnerData,
          responsiblePerson: responsiblePerson,
          legalDocuments: legalDocuments,
          statusLegalitas: updatedStatus,
        };

        // Update status di tabel juga
        const updatedUsers = users.map((u) =>
          u.id === user.id
            ? {
                ...u,
                statusLegalitas: updatedStatus,
                hasDocuments: legalDocuments.length > 0,
              }
            : u
        );
        const updatedFilteredUsers = filteredUsers.map((u) =>
          u.id === user.id
            ? {
                ...u,
                statusLegalitas: updatedStatus,
                hasDocuments: legalDocuments.length > 0,
              }
            : u
        );

        setUsers(updatedUsers);
        setFilteredUsers(updatedFilteredUsers);
        setSelectedUser(updatedSelectedUser);
        setReviewMessage(updatedSelectedUser.pesan || "");
        setShowDetailModal(true);
      }
    } catch (error) {
      console.error("Error fetching user detail:", error);
      Swal.fire({
        icon: "error",
        title: "Gagal Memuat Detail",
        text: error.message || "Terjadi kesalahan saat memuat detail pengguna.",
      });
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
      // PERBAIKAN: Gunakan endpoint yang benar
      const currentStatus = selectedUser.rawPartnerData?.status;
      let reviewResult, newStatus, successMessage;

      // Tentukan review result berdasarkan status saat ini
      if (currentStatus === "ACCEPTED_PROFILE" || currentStatus === "PENDING_LEGALITY") {
        // Jika profil sudah diterima, approve legalitas
        reviewResult = "ACCEPTED_LEGALITY";
        newStatus = "Lengkap";
        successMessage = "Dokumen Legalitas Disetujui";
      } else {
        // Jika profil belum diterima, approve profil
        reviewResult = "ACCEPTED_PROFILE";
        newStatus = "Profil Lengkap";
        successMessage = "Profil Disetujui";
      }

      console.log('Approving partner:', {
        userId: selectedUser.id,
        currentStatus,
        reviewResult,
        message: reviewMessage
      });

      // Gunakan method yang benar dengan USER ID (bukan partner ID)
      await adminService.reviewPartnerUser(
        selectedUser.id, // USER ID, bukan partner ID
        reviewResult,
        reviewMessage || ""
      );

      // Update local state
      const updatedUsers = users.map((user) =>
        user.id === selectedUser.id
          ? {
              ...user,
              statusLegalitas: newStatus,
              pesan: reviewMessage || user.pesan,
            }
          : user
      );

      const updatedFilteredUsers = filteredUsers.map((user) =>
        user.id === selectedUser.id
          ? {
              ...user,
              statusLegalitas: newStatus,
              pesan: reviewMessage || user.pesan,
            }
          : user
      );

      setUsers(updatedUsers);
      setFilteredUsers(updatedFilteredUsers);
      setShowDetailModal(false);

      Swal.fire({
        icon: "success",
        title: successMessage,
        text: "Email notifikasi telah dikirim ke partner",
        timer: 4000,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error("Error approving partner:", error);
      Swal.fire({
        icon: "error",
        title: "Gagal Menyetujui",
        text: error.message || "Terjadi kesalahan saat menyetujui partner.",
      });
    }
  };

   const handleReject = async () => {
    if (!selectedUser) return;

    if (!reviewMessage.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Pesan Diperlukan",
        text: "Silakan berikan alasan penolakan untuk partner (wajib untuk penolakan)",
      });
      return;
    }

    try {
      // PERBAIKAN: Tentukan review result berdasarkan status saat ini
      const currentStatus = selectedUser.rawPartnerData?.status;
      let reviewResult, newStatus, successTitle;

      if (currentStatus === "ACCEPTED_PROFILE" || currentStatus === "PENDING_LEGALITY") {
        // Jika profil sudah diterima, tolak legalitas
        reviewResult = "REJECTED_LEGALITY";
        newStatus = "Tidak Lengkap";
        successTitle = "Dokumen Legalitas Ditolak";
      } else {
        // Jika profil belum diterima, tolak profil
        reviewResult = "REJECTED_PROFILE";
        newStatus = "Profil Ditolak";
        successTitle = "Profil Ditolak";
      }

      console.log('Rejecting partner:', {
        userId: selectedUser.id,
        currentStatus,
        reviewResult,
        message: reviewMessage
      });

      // Gunakan method yang benar dengan USER ID (bukan partner ID)
      await adminService.reviewPartnerUser(
        selectedUser.id, // USER ID, bukan partner ID
        reviewResult,
        reviewMessage
      );

      // Update local state
      const updatedUsers = users.map((user) =>
        user.id === selectedUser.id
          ? { ...user, statusLegalitas: newStatus, pesan: reviewMessage }
          : user
      );

      const updatedFilteredUsers = filteredUsers.map((user) =>
        user.id === selectedUser.id
          ? { ...user, statusLegalitas: newStatus, pesan: reviewMessage }
          : user
      );

      setUsers(updatedUsers);
      setFilteredUsers(updatedFilteredUsers);
      setShowDetailModal(false);

      Swal.fire({
        icon: "success",
        title: successTitle,
        text: `${selectedUser.namaPendaftar} telah ditolak. Email notifikasi dengan alasan penolakan telah dikirim.`,
        timer: 4000,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error("Error rejecting partner:", error);
      Swal.fire({
        icon: "error",
        title: "Gagal Menolak",
        text: error.message || "Terjadi kesalahan saat menolak partner.",
      });
    }
  };

  const handleOpenDocument = (docName, docUrl = null) => {
    setCurrentDocument({
      name: docName,
      url: docUrl || documentAssets[docName] || ktp,
    });
    setShowDocPreview(true);
  };

  const handleCloseDocPreview = () => {
    setShowDocPreview(false);
    setCurrentDocument(null);
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      setQueryParams((prev) => ({ ...prev, page: newPage }));
    }
  };

  // Loading state
  if (loading && !showDetailModal) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#0A3E54] mx-auto"></div>
          <p className="mt-4 text-gray-600">Memuat data pengguna...</p>
          {statusLoading && (
            <p className="mt-2 text-sm text-gray-500">
              Mengambil status legalitas terbaru...
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="bg-gradient-to-r from-[#0A3E54] to-[#088FB2] rounded-lg p-6 mb-6 shadow-lg">
        <h1 className="text-2xl font-bold text-white">Review User</h1>
        <p className="text-cyan-100 mt-1">
          Kelola dan tinjau penyelenggara event
        </p>
      </div>

      {/* Main Content */}
      <div className="mb-8">
        <div className="bg-white border border-gray-200 rounded-lg shadow-md overflow-hidden">
          {/* Search Bar */}
          <div className="bg-gradient-to-r from-[#0A3E54] to-[#088FB2] px-6 py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center">
            <div className="mb-4 sm:mb-0">
              <h2 className="text-lg text-white font-medium">
                Daftar Penyelenggara Event
              </h2>
              {statusLoading && (
                <p className="text-xs text-cyan-100 mt-1 flex items-center gap-1">
                  <div className="animate-spin h-3 w-3 border border-cyan-200 rounded-full border-t-transparent"></div>
                  Memperbarui status...
                </p>
              )}
            </div>
            <div className="w-full sm:w-64">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  {isSearching ? (
                    <div className="animate-spin h-5 w-5 border-2 border-cyan-500 rounded-full border-t-transparent"></div>
                  ) : (
                    <Icon
                      icon="heroicons-outline:search"
                      className="h-5 w-5 text-gray-400"
                    />
                  )}
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
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nama Pendaftar
                  </th>
                  <th
                    className={`${
                      isMobile
                        ? "hidden"
                        : "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    }`}
                  >
                    Kontak
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Penyelenggara
                  </th>
                  <th className="px-12 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Legalitas
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Aksi
                  </th>
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
                            <div className="text-sm font-medium text-gray-900">
                              {user.namaPendaftar}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td
                        className={`${
                          isMobile ? "hidden" : "px-6 py-4 whitespace-nowrap"
                        }`}
                      >
                        <div className="text-sm text-gray-500">
                          {user.email}
                        </div>
                        <div className="text-sm text-gray-500">
                          {user.nomorHandphone}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {user.namaPenyelenggara}
                        </div>
                        {user.jenisPenyelenggara &&
                          user.jenisPenyelenggara !== "Tidak Tersedia" && (
                            <div className="text-xs text-gray-500">
                              {user.jenisPenyelenggara}
                            </div>
                          )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-black relative">
                          <select
                            value={user.role}
                            onChange={(e) =>
                              handleRoleChange(user.id, e.target.value)
                            }
                            className="bg-cyan-100 text-cyan-800 text-xs sm:text-sm rounded-lg block w-full p-1 border-none focus:ring-2 focus:ring-cyan-500 appearance-none cursor-pointer"
                          >
                            <option
                              value="User"
                              className="bg-white text-black"
                            >
                              User
                            </option>
                            <option
                              value="Partner"
                              className="bg-white text-black"
                            >
                              Partner
                            </option>
                            <option
                              value="Admin"
                              className="bg-white text-black"
                            >
                              Admin
                            </option>
                          </select>
                          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                            <Icon
                              icon="heroicons-solid:chevron-down"
                              className="h-4 w-4"
                            />
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-col gap-1">
                          {getLegalityBadge(user.statusLegalitas)}
                          {user.statusLegalitas === "Sudah Diunggah" && (
                            <span className="text-xs text-gray-500 flex items-center gap-1">
                              <Icon
                                icon="heroicons-solid:clock"
                                className="h-3 w-3"
                              />
                              Menunggu Review
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => handleViewDetail(user)}
                          className="text-cyan-600 hover:text-cyan-900 flex items-center gap-1"
                        >
                          <Icon
                            icon="heroicons-solid:eye"
                            className="h-5 w-5"
                          />
                          <span>Detail</span>
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="6"
                      className="px-6 py-4 text-center text-gray-500"
                    >
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
              Menampilkan{" "}
              <span className="font-medium">{filteredUsers.length}</span> dari{" "}
              <span className="font-medium">{pagination.totalItems}</span>{" "}
              pendaftar
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handlePageChange(pagination.currentPage - 1)}
                disabled={pagination.currentPage <= 1}
                className={`p-2 rounded-md ${
                  pagination.currentPage <= 1
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-white text-gray-500 border border-gray-300 hover:bg-gray-50"
                }`}
              >
                <Icon icon="heroicons-solid:chevron-left" className="h-5 w-5" />
              </button>

              {Array.from(
                { length: Math.min(5, pagination.totalPages) },
                (_, i) => {
                  const pageNumber =
                    pagination.currentPage <= 3
                      ? i + 1
                      : pagination.currentPage + i - 2;
                  if (pageNumber > pagination.totalPages) return null;

                  return (
                    <button
                      key={pageNumber}
                      onClick={() => handlePageChange(pageNumber)}
                      className={`px-3 py-1 rounded-md ${
                        pageNumber === pagination.currentPage
                          ? "bg-gradient-to-r from-cyan-600 to-teal-500 text-white font-medium"
                          : "bg-white text-gray-500 border border-gray-300 hover:bg-gray-50"
                      }`}
                    >
                      {pageNumber}
                    </button>
                  );
                }
              )}

              <button
                onClick={() => handlePageChange(pagination.currentPage + 1)}
                disabled={pagination.currentPage >= pagination.totalPages}
                className={`p-2 rounded-md ${
                  pagination.currentPage >= pagination.totalPages
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-white text-gray-500 border border-gray-300 hover:bg-gray-50"
                }`}
              >
                <Icon
                  icon="heroicons-solid:chevron-right"
                  className="h-5 w-5"
                />
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
              <h3 className="text-lg font-medium text-white">
                Detail Pendaftar - {selectedUser.namaPendaftar}
              </h3>
              <button
                onClick={handleCloseModal}
                className="text-white hover:text-cyan-200"
              >
                <Icon icon="heroicons-outline:x" className="h-6 w-6" />
              </button>
            </div>

            <div className="bg-white px-6 py-5">
              {/* User Information Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="text-sm uppercase font-semibold text-gray-500 mb-3">
                    Informasi Umum
                  </h4>
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs font-medium text-gray-500">
                        Nama Pendaftar
                      </p>
                      <p className="text-sm font-medium">
                        {selectedUser.namaPendaftar}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-500">Email</p>
                      <p className="text-sm">{selectedUser.email}</p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-500">
                        Nomor Handphone
                      </p>
                      <p className="text-sm">{selectedUser.nomorHandphone}</p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-500">Role</p>
                      <p className="text-sm">{selectedUser.role}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="text-sm uppercase font-semibold text-gray-500 mb-3">
                    Informasi Penyelenggara
                  </h4>
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs font-medium text-gray-500">
                        Nama Penyelenggara
                      </p>
                      <p className="text-sm">
                        {selectedUser.namaPenyelenggara}
                      </p>
                    </div>
                    {selectedUser.jenisPenyelenggara &&
                      selectedUser.jenisPenyelenggara !== "Tidak Tersedia" && (
                        <div>
                          <p className="text-xs font-medium text-gray-500">
                            Jenis Penyelenggara
                          </p>
                          <p className="text-sm">
                            {selectedUser.jenisPenyelenggara}
                          </p>
                        </div>
                      )}
                    {selectedUser.usernameInstagram &&
                      selectedUser.usernameInstagram !== "-" && (
                        <div>
                          <p className="text-xs font-medium text-gray-500">
                            Instagram
                          </p>
                          <p className="text-sm">
                            {selectedUser.usernameInstagram}
                          </p>
                        </div>
                      )}
                    {selectedUser.alamat &&
                      selectedUser.alamat !== "Alamat tidak tersedia" && (
                        <div>
                          <p className="text-xs font-medium text-gray-500">
                            Alamat
                          </p>
                          <p className="text-sm">{selectedUser.alamat}</p>
                        </div>
                      )}
                    <div>
                      <p className="text-xs font-medium text-gray-500">
                        Status Legalitas
                      </p>
                      <div className="mt-1">
                        {getLegalityBadge(selectedUser.statusLegalitas)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Responsible Person Section */}
              {selectedUser.responsiblePerson &&
                Object.keys(selectedUser.responsiblePerson).length > 0 && (
                  <div className="bg-gray-50 p-4 rounded-lg mb-6">
                    <h4 className="text-sm uppercase font-semibold text-gray-500 mb-3">
                      Penanggung Jawab
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {selectedUser.responsiblePerson.fullName && (
                        <div>
                          <p className="text-xs font-medium text-gray-500">
                            Nama Lengkap
                          </p>
                          <p className="text-sm">
                            {selectedUser.responsiblePerson.fullName}
                          </p>
                        </div>
                      )}
                      {selectedUser.responsiblePerson.nik && (
                        <div>
                          <p className="text-xs font-medium text-gray-500">
                            NIK
                          </p>
                          <p className="text-sm">
                            {selectedUser.responsiblePerson.nik}
                          </p>
                        </div>
                      )}
                      {selectedUser.responsiblePerson.phoneNumber && (
                        <div>
                          <p className="text-xs font-medium text-gray-500">
                            Nomor Telepon
                          </p>
                          <p className="text-sm">
                            {selectedUser.responsiblePerson.phoneNumber}
                          </p>
                        </div>
                      )}
                      {selectedUser.responsiblePerson.position && (
                        <div>
                          <p className="text-xs font-medium text-gray-500">
                            Jabatan
                          </p>
                          <p className="text-sm">
                            {selectedUser.responsiblePerson.position}
                          </p>
                        </div>
                      )}
                      {selectedUser.responsiblePerson.ktpUrl && (
                        <div className="col-span-2">
                          <p className="text-xs font-medium text-gray-500 mb-2">
                            KTP
                          </p>
                          <div className="relative bg-white border rounded-lg p-2 inline-block">
                            <img
                              src={selectedUser.responsiblePerson.ktpUrl}
                              alt="KTP"
                              className="h-32 object-contain"
                              onError={(e) => {
                                e.target.style.display = "none";
                                e.target.nextSibling.style.display = "block";
                              }}
                            />
                            <div className="text-gray-500 text-sm p-4 hidden">
                              Gambar tidak dapat dimuat
                            </div>
                            <button
                              onClick={() =>
                                handleOpenDocument(
                                  "KTP",
                                  selectedUser.responsiblePerson.ktpUrl
                                )
                              }
                              className="absolute top-2 right-2 bg-white bg-opacity-75 rounded-full p-1 shadow hover:bg-opacity-100 transition-all"
                            >
                              <Icon
                                icon="heroicons-solid:eye"
                                className="h-4 w-4 text-cyan-600"
                              />
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

              {/* Legal Documents Section */}
              <div className="bg-gray-50 p-4 rounded-lg mb-6">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="text-sm uppercase font-semibold text-gray-500">
                    Dokumen Legalitas
                  </h4>
                  <div className="flex items-center gap-2">
                    {getLegalityBadge(selectedUser.statusLegalitas)}
                  </div>
                </div>
                {selectedUser.legalDocuments &&
                selectedUser.legalDocuments.length > 0 ? (
                  <div className="space-y-3">
                    {selectedUser.legalDocuments.map((doc, index) => (
                      <div
                        key={doc.id || index}
                        className="bg-white border rounded-lg p-4"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="text-cyan-500">
                              <Icon
                                icon="heroicons-solid:document-text"
                                className="h-8 w-8"
                              />
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">
                                {doc.documentName}
                              </p>
                              {doc.information && (
                                <p className="text-sm text-gray-600 mt-1">
                                  {doc.information}
                                </p>
                              )}
                              {doc.createdAt && (
                                <p className="text-xs text-gray-400 mt-1">
                                  Diunggah:{" "}
                                  {new Date(doc.createdAt).toLocaleDateString(
                                    "id-ID",
                                    {
                                      year: "numeric",
                                      month: "long",
                                      day: "numeric",
                                      hour: "2-digit",
                                      minute: "2-digit",
                                    }
                                  )}
                                </p>
                              )}
                              <div className="flex items-center gap-2 mt-2">
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                  <Icon
                                    icon="heroicons-solid:check-circle"
                                    className="h-3 w-3 mr-1"
                                  />
                                  Sudah Diunggah
                                </span>
                                {selectedUser.statusLegalitas ===
                                  "Sudah Diunggah" && (
                                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                    <Icon
                                      icon="heroicons-solid:clock"
                                      className="h-3 w-3 mr-1"
                                    />
                                    Menunggu Review
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            {doc.documentUrl ? (
                              <>
                                <button
                                  onClick={() =>
                                    handleOpenDocument(
                                      doc.documentName,
                                      doc.documentUrl
                                    )
                                  }
                                  className="px-3 py-1 bg-cyan-500 text-white text-sm rounded hover:bg-cyan-600 transition-colors flex items-center gap-1"
                                >
                                  <Icon
                                    icon="heroicons-solid:eye"
                                    className="h-4 w-4"
                                  />
                                  <span>Lihat</span>
                                </button>
                                <a
                                  href={doc.documentUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="px-3 py-1 bg-green-500 text-white text-sm rounded hover:bg-green-600 transition-colors flex items-center gap-1"
                                >
                                  <Icon
                                    icon="heroicons-solid:download"
                                    className="h-4 w-4"
                                  />
                                  <span>Unduh</span>
                                </a>
                              </>
                            ) : (
                              <span className="px-3 py-1 bg-gray-200 text-gray-500 text-sm rounded">
                                URL tidak tersedia
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}

                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mt-4">
                      <div className="flex items-center gap-2">
                        <Icon
                          icon="heroicons-solid:information-circle"
                          className="h-5 w-5 text-blue-600"
                        />
                        <div>
                          <p className="text-sm font-medium text-blue-900">
                            Total {selectedUser.legalDocuments.length} dokumen
                            telah diunggah
                          </p>
                          <p className="text-xs text-blue-700">
                            {selectedUser.statusLegalitas === "Sudah Diunggah"
                              ? "Partner telah mengunggah dokumen legalitas dan menunggu review dari admin"
                              : selectedUser.statusLegalitas === "Lengkap"
                              ? "Dokumen legalitas telah disetujui admin"
                              : selectedUser.statusLegalitas === "Tidak Lengkap"
                              ? "Dokumen legalitas ditolak, partner perlu mengunggah ulang"
                              : "Status dokumen dalam proses review"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Icon
                      icon="heroicons-outline:document-text"
                      className="h-12 w-12 mx-auto mb-3 text-gray-300"
                    />
                    <p className="text-sm">
                      Belum ada dokumen legalitas yang diunggah
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      Partner belum mengunggah dokumen legalitas
                    </p>
                  </div>
                )}
              </div>

              {/* Review Section */}
              {selectedUser.role === "Partner" && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="text-sm uppercase font-semibold text-gray-500 mb-3">
                    Review Partner
                  </h4>
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
                  <h4 className="text-sm uppercase font-semibold text-gray-500 mb-3">
                    Pesan Review
                  </h4>
                  <p className="text-sm bg-white p-3 rounded border">
                    {selectedUser.pesan}
                  </p>
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
              <h3 className="text-lg font-medium">
                Pratinjau Dokumen - {currentDocument.name}
              </h3>
              <button
                onClick={handleCloseDocPreview}
                className="text-gray-400 hover:text-gray-600"
              >
                <Icon icon="heroicons-solid:x" className="h-5 w-5" />
              </button>
            </div>
            <div className="p-6">
              <div className="bg-gray-100 p-4 rounded-lg">
                {currentDocument.url &&
                currentDocument.url.toLowerCase().endsWith(".pdf") ? (
                  <iframe
                    src={currentDocument.url}
                    title="PDF Viewer"
                    className="w-full h-96 border-none"
                  />
                ) : (
                  <img
                    src={currentDocument.url}
                    alt="Document Preview"
                    className="w-full object-contain max-h-96"
                  />
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
                    <Icon
                      icon="heroicons-solid:download"
                      className="h-4 w-4 mr-1"
                    />
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
