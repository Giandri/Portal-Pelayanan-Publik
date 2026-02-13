
export interface Agency {
    id: string;
    name: string;
    category: "akademik" | "instansi-pemerintah" | "badan-usaha" | "individu";
    logo?: string;
    description?: string;
}

export const agencies: Agency[] = [
    // Akademik
    {
        id: "ubb",
        name: "Universitas Bangka Belitung (UBB)",
        category: "akademik",
        logo: "https://upload.wikimedia.org/wikipedia/id/2/2f/Logo_Universitas_Bangka_Belitung.png",
        description: "Perguruan Tinggi Negeri di Bangka Belitung"
    },
    {
        id: "ui",
        name: "Universitas Indonesia (UI)",
        category: "akademik",
        logo: "https://upload.wikimedia.org/wikipedia/id/0/0e/Logo_Universitas_Indonesia.png",
        description: "Jakarta / Depok"
    },
    {
        id: "itb",
        name: "Institut Teknologi Bandung (ITB)",
        category: "akademik",
        logo: "https://upload.wikimedia.org/wikipedia/id/3/36/Logo_ITB.png",
        description: "Bandung"
    },
    {
        id: "ugm",
        name: "Universitas Gadjah Mada (UGM)",
        category: "akademik",
        logo: "https://upload.wikimedia.org/wikipedia/id/d/dc/Logo_UGM.png",
        description: "Yogyakarta"
    },
    {
        id: "ipb",
        name: "IPB University",
        category: "akademik",
        logo: "https://upload.wikimedia.org/wikipedia/id/c/c5/Logo_IPB.png",
        description: "Bogor"
    },
    {
        id: "unpad",
        name: "Universitas Padjadjaran (UNPAD)",
        category: "akademik",
        logo: "https://upload.wikimedia.org/wikipedia/id/b/bd/Logo_Unpad.svg",
        description: "Bandung"
    },
    {
        id: "its",
        name: "Institut Teknologi Sepuluh Nopember (ITS)",
        category: "akademik",
        logo: "https://upload.wikimedia.org/wikipedia/id/8/87/Logo_ITS.png",
        description: "Surabaya"
    },

    // Instansi Pemerintah
    {
        id: "kemenpupr",
        name: "Kementerian PUPR",
        category: "instansi-pemerintah",
        logo: "/images/logo PU.png",
        description: "Kementerian Pekerjaan Umum dan Perumahan Rakyat"
    },
    {
        id: "bws-babel",
        name: "BWS Bangka Belitung",
        category: "instansi-pemerintah",
        logo: "https://sda.pu.go.id/balai/bwssumatera5/assets/images/logo_pupr.png",
        description: "Balai Wilayah Sungai Bangka Belitung"
    },
    {
        id: "kemenlhk",
        name: "Kementerian LHK",
        category: "instansi-pemerintah",
        logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/06/Logo_of_the_Ministry_of_Environmental_and_Forestry_of_the_Republic_of_Indonesia.svg/512px-Logo_of_the_Ministry_of_Environmental_and_Forestry_of_the_Republic_of_Indonesia.svg.png",
        description: "Kementerian Lingkungan Hidup dan Kehutanan"
    },
    {
        id: "pemprov-babel",
        name: "Pemprov Bangka Belitung",
        category: "instansi-pemerintah",
        logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Coat_of_arms_of_Bangka_Belitung_Islands.svg/512px-Coat_of_arms_of_Bangka_Belitung_Islands.svg.png",
        description: "Pemerintah Provinsi Kepulauan Bangka Belitung"
    },
    {
        id: "bmkg",
        name: "BMKG",
        category: "instansi-pemerintah",
        logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/90/Logo_BMKG_%282010%29.svg/512px-Logo_BMKG_%282010%29.svg.png",
        description: "Badan Meteorologi, Klimatologi, dan Geofisika"
    },

    // Badan Usaha
    {
        id: "pt-timah",
        name: "PT Timah Tbk",
        category: "badan-usaha",
        logo: "https://upload.wikimedia.org/wikipedia/en/thumb/4/4c/PT_Timah_logo.svg/1200px-PT_Timah_logo.svg.png",
        description: "Badan Usaha Milik Negara"
    },
    {
        id: "pdam",
        name: "PDAM (Perusahaan Daerah Air Minum)",
        category: "badan-usaha",
        logo: "https://upload.wikimedia.org/wikipedia/id/f/fa/Logo_PDAM.png",
        description: "Penyedia Layanan Air Bersih"
    },
    {
        id: "pt-pln",
        name: "PT PLN (Persero)",
        category: "badan-usaha",
        logo: "https://upload.wikimedia.org/wikipedia/commons/2/20/Logo_PLN.svg",
        description: "Perusahaan Listrik Negara"
    }
];
