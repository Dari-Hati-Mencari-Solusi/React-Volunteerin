import React, { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import ListVolunteer from "./ListVolunteer";
import { partnerService } from "../../services/partnerService";

const VolunteerPage = () => {
  const { eventId } = useParams();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalRegistrants: 0,
    totalFee: 0,
    acceptedRegistrants: 0,
    rejectedRegistrants: 0,
    pendingRegistrants: 0
  });

  useEffect(() => {
    const fetchRegistrantsStats = async () => {
      if (!eventId) return;
      
      setLoading(true);
      try {
        // Fetch total registrants (all status)
        const totalResponse = await partnerService.getEventRegistrants(eventId, { limit: 1 });
        
        // Fetch accepted registrants
        const acceptedResponse = await partnerService.getEventRegistrants(eventId, { status: 'accepted', limit: 1 });
        
        // Fetch rejected registrants
        const rejectedResponse = await partnerService.getEventRegistrants(eventId, { status: 'rejected', limit: 1 });
        
        // Fetch event details to get registration fee
        const eventDetails = await partnerService.getEventDetails(eventId);
        
        setStats({
          totalRegistrants: totalResponse.registrants?.totalItems || 0,
          totalFee: (totalResponse.registrants?.totalItems || 0) * 
                    (eventDetails.data?.registrationFee || 0),
          acceptedRegistrants: acceptedResponse.registrants?.totalItems || 0,
          rejectedRegistrants: rejectedResponse.registrants?.totalItems || 0,
          pendingRegistrants: (totalResponse.registrants?.totalItems || 0) - 
                             (acceptedResponse.registrants?.totalItems || 0) - 
                             (rejectedResponse.registrants?.totalItems || 0)
        });
      } catch (error) {
        console.error("Error fetching registrants stats:", error);
        toast.error("Gagal memuat statistik pendaftar");
      } finally {
        setLoading(false);
      }
    };
    
    fetchRegistrantsStats();
  }, [eventId]);

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  return (
    <section className="flex flex-col gap-y-4">
      <h1 className="title">Rincian Pendaftar</h1>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3 xl:grid-cols-3">
        <div className="card">
          <div className="card-header">
            <div className="rounded-lg bg-blue-500/20 p-2 text-blue-500 transition-colors">
              <Icon icon="mdi:users" width="32" height="32" />
            </div>
            <p className="card-title">Total Pendaftar</p>
          </div>
          <div className="card-body">
            {loading ? (
              <div className="h-6 w-16 bg-gray-200 animate-pulse rounded"></div>
            ) : (
              <p className="md:text-2xl sm:text-3xl lg:text-4xl font-semibold text-[#0A3E54] transition-colors">
                {stats.totalRegistrants} Orang
              </p>
            )}
            <span className="md:text-[14px] lg:text-md text-md flex w-fit items-center gap-x-2 py-1 font-medium text-gray-500">
              Total registrasi saat ini
            </span>
          </div>
        </div>
        
        <div className="card">
          <div className="card-header">
            <div className="rounded-lg bg-blue-500/20 p-2 text-blue-500 transition-colors">
              <Icon icon="ph:money-wavy-bold" width="32" height="32" />
            </div>
            <p className="card-title">Dana yang Masuk</p>
          </div>
          <div className="card-body">
            {loading ? (
              <div className="h-6 w-24 bg-gray-200 animate-pulse rounded"></div>
            ) : (
              <p className="md:text-2xl sm:text-3xl lg:text-4xl font-semibold text-[#0A3E54] transition-colors">
                {formatCurrency(stats.totalFee)}
              </p>
            )}
            <span className="md:text-[14px] lg:text-md text-md flex w-fit items-center gap-x-2 py-1 font-medium text-gray-500">
              Dari registrasi pendaftar
            </span>
          </div>
        </div>
        
        <div className="card">
          <div className="card-header">
            <div className="rounded-lg bg-blue-500/20 p-2 text-blue-500 transition-colors">
              <Icon
                icon="fluent:notepad-edit-20-filled"
                width="32"
                height="32"
              />
            </div>
            <p className="card-title">Status Pendaftar</p>
          </div>
          <div className="card-body">
            {loading ? (
              <div className="space-y-2">
                <div className="h-6 w-16 bg-gray-200 animate-pulse rounded"></div>
                <div className="h-4 w-32 bg-gray-200 animate-pulse rounded"></div>
              </div>
            ) : (
              <>
                <div className="flex gap-2 items-end">
                  <p className="md:text-2xl sm:text-3xl lg:text-4xl font-semibold text-green-600">
                    {stats.acceptedRegistrants}
                  </p>
                  <p className="text-lg font-medium text-red-600">
                    / {stats.rejectedRegistrants} /
                  </p>
                  <p className="text-lg font-medium text-yellow-600">
                    {stats.pendingRegistrants}
                  </p>
                </div>
                <span className="md:text-[14px] lg:text-md text-md flex w-fit items-center gap-x-2 py-1 font-medium text-gray-500">
                  Diterima / Ditolak / Pending
                </span>
              </>
            )}
          </div>
        </div>
      </div>
      
      <ListVolunteer />
    </section>
  );
};

export default VolunteerPage;