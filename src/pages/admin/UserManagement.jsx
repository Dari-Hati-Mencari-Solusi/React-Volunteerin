import React, { useState, useEffect } from "react";
import { Icon } from '@iconify/react';
import ktp from "../../assets/images/ktp.jpg"; 

const UserManagement = () => {
  const documentAssets = {
    "NPWP.pdf": ktp,
    "KTP.pdf": ktp,
    "SuratIzin.pdf": ktp,
    "SIUP.pdf": ktp
  };

  const initialUsers = [
     {
      id: 1,
      namaPendaftar: "Hevin Jhon",
      email: "hevinjhon@gmail.com",
      nomorHandphone: "089083287462",
      role: "User",
      namaPenyelenggara: "Event Master Indonesia",
      statusLegalitas: "Menunggu Review",
      dokumen: ["NPWP.pdf", "KTP.pdf", "SuratIzin.pdf"],
      pesan: "",
    },
    {
      id: 2,
      namaPendaftar: "Rantau yaps",
      email: "Rantauyaps@gmail.com",
      nomorHandphone: "081234567890",
      role: "Partner",
      namaPenyelenggara: "Global Events Co.",
      statusLegalitas: "Lengkap",
      dokumen: ["NPWP.pdf", "KTP.pdf", "SuratIzin.pdf", "SIUP.pdf"],
      pesan: "",
    },
    {
      id: 3,
      namaPendaftar: "Giber",
      email: "Giber@gmail.com",
      nomorHandphone: "087654321098",
      role: "User",
      namaPenyelenggara: "Festival Budaya Nusantara",
      statusLegalitas: "Tidak Lengkap",
      dokumen: ["KTP.pdf"],
      pesan: "",
    },
     {
      id: 4,
      namaPendaftar: "Yoglex",
      email: "Yoglex@gmail.com",
      nomorHandphone: "087654321098",
      role: "User",
      namaPenyelenggara: "Festival Punk",
      statusLegalitas: "Tidak Lengkap",
      dokumen: ["KTP.pdf"],
      pesan: "",
    }
  ];

  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState(initialUsers);
  const [filteredUsers, setFilteredUsers] = useState(initialUsers);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [reviewMessage, setReviewMessage] = useState("");
  const [isMobile, setIsMobile] = useState(false);
  const [showDocPreview, setShowDocPreview] = useState(false);
  const [currentDocument, setCurrentDocument] = useState(null);

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

  useEffect(() => {
    const results = users.filter(user =>
      user.namaPendaftar.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.namaPenyelenggara.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredUsers(results);
  }, [searchTerm, users]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleRoleChange = (id, newRole) => {
    const updatedUsers = users.map(user => {
      if (user.id === id) {
        return { ...user, role: newRole };
      }
      return user;
    });
    setUsers(updatedUsers);
  };

  const handleViewDetail = (user) => {
    setSelectedUser(user);
    setReviewMessage(user.pesan || "");
    setShowDetailModal(true);
  };

  const handleCloseModal = () => {
    setShowDetailModal(false);
    setSelectedUser(null);
  };

  const handleApprove = () => {
    const updatedUsers = users.map(user => {
      if (user.id === selectedUser.id) {
        return { ...user, status: "approved", pesan: reviewMessage };
      }
      return user;
    });
    setUsers(updatedUsers);
    setShowDetailModal(false);
  };

  const handleReject = () => {
    const updatedUsers = users.map(user => {
      if (user.id === selectedUser.id) {
        return { ...user, status: "rejected", pesan: reviewMessage };
      }
      return user;
    });
    setUsers(updatedUsers);
    setShowDetailModal(false);
  };

  const handleOpenDocument = (docName) => {
    setCurrentDocument({
      name: docName,
      url: documentAssets[docName] || "/api/placeholder/600/800"
    });
    setShowDocPreview(true);
  };

  const handleCloseDocPreview = () => {
    setShowDocPreview(false);
    setCurrentDocument(null);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "approved":
        return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">Disetujui</span>;
      case "rejected":
        return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">Ditolak</span>;
      default:
        return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">Menunggu</span>;
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

  return (
    <section className="w-full mx-auto px-2 py-6">
      <div className="bg-gradient-to-r from-[#0A3E54] to-[#088FB2] rounded-lg p-6 mb-6 shadow-lg">
        <h1 className="text-2xl font-bold text-white">Review User</h1>
        <p className="text-cyan-100 mt-1">Kelola dan tinjau penyelenggara event</p>
      </div>

      <div className="mb-8">
        <div className="bg-white border border-gray-200 rounded-lg shadow-md overflow-hidden">
          <div className="bg-gradient-to-r from-[#0A3E54] to-[#088FB2]  px-6 py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center">
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
                {filteredUsers.map((user) => (
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
                        <select
                          value={user.role}
                          onChange={(e) => handleRoleChange(user.id, e.target.value)}
                          className="bg-cyan-100 text-cyan-800 text-xs sm:text-sm rounded-lg block w-full p-1 border-none focus:ring-2 focus:ring-cyan-500 appearance-none cursor-pointer"
                        >
                          <option value="User" className="bg-white text-black">User</option>
                          <option value="Partner" className="bg-white text-black">Partner</option>
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
                        className="text-[#0A3E54] hover:text-cyan-900 font-medium flex items-center transition-colors duration-150"
                      >
                        <Icon icon="heroicons-outline:eye" className="h-5 w-5" />
                        <span className={`${isMobile ? 'hidden' : 'ml-1'}`}>
                          {!isMobile && "Lihat Detail"}
                        </span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
            <div className="flex flex-col sm:flex-row justify-between items-center">
              <div className="text-sm text-gray-700 mb-2 sm:mb-0">
                Menampilkan <span className="font-medium">{filteredUsers.length}</span> dari <span className="font-medium">{users.length}</span> pendaftar
              </div>
              <div className="flex items-center space-x-2">
                <button className="p-2 rounded-md bg-white text-gray-500 border border-gray-300 hover:bg-gray-50 transition-colors duration-150">
                  <Icon icon="heroicons-solid:chevron-left" className="h-5 w-5" />
                </button>
                <button className="px-3 py-1 rounded-md bg-gradient-to-r from-cyan-600 to-teal-500 text-white font-medium hover:from-cyan-700 hover:to-teal-600 transition-colors duration-150">
                  1
                </button>
                <button className="p-2 rounded-md bg-white text-gray-500 border border-gray-300 hover:bg-gray-50 transition-colors duration-150">
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
                          {doc}
                        </button>
                      ))}
                    </div>
                  </div>
                  
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
                  <button 
                    className="text-white hover:text-cyan-200 transition-colors"
                    title="Download dokumen"
                  >
                    <Icon icon="heroicons-outline:download" className="h-5 w-5" />
                  </button>
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
                <button
                  type="button"
                  className="inline-flex justify-center rounded-md shadow-sm px-4 py-2 bg-gradient-to-r from-cyan-600 to-teal-500 text-base font-medium text-white hover:from-cyan-700 hover:to-teal-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 sm:text-sm transition-colors duration-150"
                >
                  Unduh Dokumen
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default UserManagement;