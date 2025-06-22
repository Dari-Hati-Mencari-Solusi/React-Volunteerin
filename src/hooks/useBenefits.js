import { useState, useEffect } from "react";
import axios from "axios";

// Fungsi helper untuk mendapatkan icon berdasarkan nama benefit
export function getBenefitIcon(benefitName) {
  // Define mapping of keyword patterns to icon names
  const BENEFIT_ICON_MAP = {
    akomodasi: "mdi:hotel",
    hotel: "mdi:hotel",
    penghargaan: "mdi:trophy-award",
    award: "mdi:trophy-award",
    sertifikat: "tabler:certificate",
    uang: "tabler:wallet",
    saku: "tabler:wallet",
    makan: "fluent-mdl2:eat-drink",
    snack: "fluent-mdl2:eat-drink",
    koneksi: "ic:round-connect-without-contact",
    network: "ic:round-connect-without-contact",
    kaos: "mdi:tshirt-crew",
    baju: "mdi:tshirt-crew",
    pengalaman: "tabler:medal",
  };

  // Default icon if no match found
  const DEFAULT_ICON = "mdi:gift-outline";

  if (!benefitName) return DEFAULT_ICON;

  const name = benefitName.toLowerCase();

  // Find the first keyword that matches in the benefit name
  const matchedKeyword = Object.keys(BENEFIT_ICON_MAP).find((keyword) =>
    name.includes(keyword)
  );

  // Return matched icon or default
  return matchedKeyword ? BENEFIT_ICON_MAP[matchedKeyword] : DEFAULT_ICON;
}

// Static benefit IDs yang pasti valid
const STATIC_BENEFIT_IDS = {
  sertifikat: "1f92b274-39b5-4104-af5a-831982496a9c",
  uangSaku: "d9e7c6e0-3d73-4d1c-9930-35c0855cb752",
  pengalaman: "550e8400-e29b-41d4-a716-446655440000",
  networking: "6ba7b810-9dad-11d1-80b4-00c04fd430c8",
  makanan: "6ba7b812-9dad-11d1-80b4-00c04fd430c8",
  kaos: "6ba7b814-9dad-11d1-80b4-00c04fd430c8",
};

// Fallback benefits dengan UUID static yang valid
const hardcodedBenefits = [
  {
    id: STATIC_BENEFIT_IDS.sertifikat,
    name: "Sertifikat",
    icon: "tabler:certificate",
  },
  {
    id: STATIC_BENEFIT_IDS.uangSaku,
    name: "Uang Saku",
    icon: "tabler:wallet",
  },
  {
    id: STATIC_BENEFIT_IDS.pengalaman,
    name: "Pengalaman",
    icon: "tabler:medal",
  },
  {
    id: STATIC_BENEFIT_IDS.networking,
    name: "Networking",
    icon: "ic:round-connect-without-contact",
  },
  {
    id: STATIC_BENEFIT_IDS.makanan,
    name: "Makanan",
    icon: "fluent-mdl2:eat-drink",
  },
  {
    id: STATIC_BENEFIT_IDS.kaos,
    name: "Kaos/Baju",
    icon: "mdi:tshirt-crew",
  },
];

export function useBenefits() {
  const [benefits, setBenefits] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBenefits = async () => {
      try {
        setLoading(true);

        try {
          const API_URL = import.meta.env.VITE_BE_BASE_URL;
          const token = localStorage.getItem("token"); // dapatkan token dari localStorage atau state management

          const response = await axios.get(`${API_URL}/benefits`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (
            response.data &&
            response.data.data &&
            response.data.data.length > 0
          ) {
            // Gunakan sistem icon yang sama dengan EventPage
            const formattedBenefits = response.data.data.map((benefit) => ({
              id: benefit.id,
              name: benefit.name || "Manfaat Tanpa Nama",
              icon: benefit.icon || getBenefitIcon(benefit.name),
            }));

            setBenefits(formattedBenefits);
          } else {
            setBenefits(hardcodedBenefits);
          }
        } catch (apiError) {
          console.error("API benefits gagal:", apiError.message);
          setError(apiError);
          setBenefits(hardcodedBenefits);
        }
      } catch (error) {
        console.error("Error fetching benefits:", error);
        setError(error);
        setBenefits(hardcodedBenefits);
      } finally {
        setLoading(false);
      }
    };

    fetchBenefits();
  }, []); // Dependency array kosong - hanya dijalankan sekali

  return { benefits, loading, error, STATIC_BENEFIT_IDS };
}
