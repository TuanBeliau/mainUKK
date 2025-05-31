import { router, useForm } from "@inertiajs/react";
import axios from 'axios';
import { useEffect, useState } from "react";
import Notification from "../../components/notification";
import Navbar from "../../components/navbar";
import Logout from "../../components/logout";

export default function PKL() {
    const [notif, setNotif] = useState({
        open:false,
        message: '',
        severity: 'success'
    });
    const [siswa, setSiswa] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = (6);
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState([]);
    const [modal, setModal] = useState(false);
    const [filterModal, setFilterModal] = useState(false);
    const [pkl, setPKL] = useState([]);
    const totalPages = Math.ceil(pkl.length / itemsPerPage);
    const lastItem = itemsPerPage * currentPage;
    const firstItem = lastItem - itemsPerPage;
    const [selected, setSelected] = useState([]);
    const [profile, setProfile] = useState({
        alamat:'',
        kontak:'',
        email:'',
        foto:''
    });

    const goToPrevPage = () => {
        setCurrentPage(prev => Math.max(prev - 1, 1) )
    }

    const goToNextPage = () => {
        setCurrentPage(prev => Math.min(prev + 1, totalPages))
    }

    const handleProfile = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        const formData = new FormData();
        
        formData.append('_method', 'PUT')
        formData.append('nama', profile.nama)
        formData.append('nis', profile.nis)
        formData.append('gender', profile.gender)
        formData.append('alamat', profile.alamat)
        formData.append('kontak', profile.kontak)
        formData.append('email', profile.email)

        if (profile.gender === 'Laki-laki') {
            formData.append('gender', 'L')
        } else if (profile.gender === 'Perempuan') {
            formData.append('gender', 'P')
        }

        if (profile.foto !== siswa.foto) {
            formData.append('foto', profile.foto)
        }

        try {
            await axios.post(`/api/siswa/update/${siswa.id}`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            
            setNotif({
                open:true,
                message:'Profile Siswa berhasil di Ubah',
                severity:'success',
            });
        } catch (error) {
            const errors = error.response?.data?.errors;
            const message = error.response?.data?.message || 'Something went wrong';

            let errorMsg = message;

            if (errors && typeof errors === 'object') {
                errorMsg = Object.values(errors).flat().join('\n');
            }

            setNotif({
                open:true,
                message:errorMsg,
                severity:'error'
            });
        }
    }

    const handleFilter = (status) => {
        if (filter.includes(status)) {
            setFilter(filter.filter(s => s !== status));
        } else {
            setFilter([...filter, status]);
        }
    };

    const filteredData = pkl.filter((item) => {
        const matchSearch = item.siswa.nama.toLowerCase().includes(search.toLowerCase()) || item.industri.nama.toLowerCase().includes(search.toLowerCase());
        const matchFilter = filter.length === 0 || filter.includes(item.siswa.status_lapor_pkl);
        return matchSearch && matchFilter
    });

    const currentItems = filteredData.slice(firstItem, lastItem);

    // Fetch data
    useEffect(() => {
            const token = localStorage.getItem('token');

            const fetchData = () => {
                axios.get('/api/siswa', {
                    headers: {
                        Authorization:`Bearer ${token}`,
                    }
                })
                .then(res => {
                    setSiswa(res.data.siswa?.siswa);
                })
            }

            const fetchPKL = () => {
                axios.get('/api/data_pkl', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })
                .then(res => {
                    setPKL(res.data.pkl);
                })
            }
    
            fetchData();
            fetchPKL();
    
            const interval = setInterval({fetchData, fetchPKL}, 60000);
    
            return () => clearInterval(interval);
    }, [])

    return (
        <div className="relative bg-[#FEFEFE] w-screen h-screen overflow-hidden md:justify-items-center">

            {/* Navbar */}
            <Navbar siswa={siswa} setProfile={setProfile} profile={profile} handleProfile={handleProfile}/>

            <Notification 
                open={notif.open}
                message={notif.message}
                severity={notif.severity}
                onClose={() => setNotif({ ...notif, open: false })}
            />

            {/* Display Data */}
            <div className="bg-gradient-to-br from-blue-500 via-blue-300 to-blue-100 w-[300px] h-[450px] md:h-[500px] md:w-[1000px] rounded-md ml-11 mt-12 mb-7 text-black shadow-[10px_15px_30px_rgba(0,0,0,0.5)]">
                <div className="flex relative w-full px-5 pt-5 space-x-3">
                    <div className="relative w-full h-full">
                        <input className="bg-white w-full h-[35px] px-4 text-black rounded-full focus:outline focus:outline-green-500" type="text" 
                            value={search} onChange={(e) => setSearch(e.target.value)}
                        />
                        <img src="http://127.0.0.1:8000/img/search.png" alt="search" 
                            className="absolute top-1 right-3 pointer-events-none  w-7 h-7"
                        />
                    </div>
                    <img src="http://127.0.0.1:8000/img/filter.png" alt="filter" 
                        className="w-7 h-7 mt-1" onClick={() => setFilterModal(true)}
                    />
                </div>
                
                <h1 className="font-bold ml-5 pt-5">Laporan PKL Semua Siswa</h1>

                {currentItems.length > 0 ? (
                    <div className="text-black w-full h-full pr-4 pt-2 space-y-4">
                        <div className="h-2/3">
                            {currentItems.map((pkl, index) => (
                                <div key={index} className="flex w-full bg-white/30 rounded-md items-center justify-between px-4 py-2 m-2 shadow-sm hover:bg-white/40 transition space-x-8">
                                    <h1>{index + 1 + (currentPage - 1) * itemsPerPage}. </h1>
                                    <h1 className="w-full">{pkl.siswa.nama}</h1>
                                    {pkl.siswa.status_lapor_pkl === 'Belum Lapor' ? (
                                        <img src="http://127.0.0.1:8000/img/rejected.png" alt="" 
                                            className="w-6 h-6"
                                        />
                                    ) : pkl.siswa.status_lapor_pkl === 'Request Guru' ? (
                                        <img src="http://127.0.0.1:8000/img/info.png" alt="" 
                                            className="w-6 h-6"
                                        />
                                    ) : (
                                        <img src="http://127.0.0.1:8000/img/check.png" alt="" 
                                            className="w-6 h-6"
                                        />
                                    )}
                                    <button type="button" onClick={() => {setModal(true); setSelected(pkl)}} className="w-18 h-8" >
                                        <img src="http://127.0.0.1:8000/img/show.png" alt="" 
                                            className="w-6 h-6" 
                                        />
                                    </button>
                                </div>
                            ))}
                        </div>

                        <div className={`flex ml-2 ${currentPage === 1 ? 'justify-end pl-10' : 'justify-between'}`}>
                           <button onClick={goToPrevPage} className={`border border-white text-white bg-transparent hover:bg-white hover:text-blue-500 rounded-md px-2 ${currentPage === 1 ? 'hidden' : '' }`}>Prev</button>
                           <button onClick={goToNextPage} className={`border border-white text-white bg-blue-300 hover:bg-white hover:text-blue-500 rounded-md px-2 ${pkl.length <= 6  ? 'hidden' : ''}`}>Next</button>
                        </div>
                    </div>
                ) : (
                    <div className="relative justify-items-center pl-4">
                        <h1 className="font-bold text-[15px] mr-5 mt-10">Data Masih Kosong</h1>
                        <img src="http://127.0.0.1:8000/img/confused.png" alt="" 
                            className="h-50 w-50 mr-5 mt-5"
                        />
                    </div>
                )}

                {modal && (
                    <div className="fixed flex inset-0 bg-black/50 justify-center items-center z-10">
                        <div className={`bg-[#FEFEFE] rounded-lg w-[300px] h-[340px] p-6 space-y-4`}>
                            <div className="flex space-x-30">
                                <h1 className="font-bold text-[20px]">Data Siswa</h1>
                                <button className="w-5 h-5 mt-1" onClick={() => {setModal(false);}}>
                                    <img src="http://127.0.0.1:8000/img/close.png" alt="" />
                                </button>
                            </div>

                            <div className="p-1 space-y-2">
                                <div>
                                    <h1 className="font-bold">Nama Siswa : </h1>
                                    <h2>{selected.siswa.nama}</h2>
                                </div>
                                <div>
                                    <h1 className="font-bold">Nama Perusahaan : </h1>
                                    <h2>{selected.industri.nama}</h2>
                                </div>
                                <div>
                                    <h1 className="font-bold">Guru Pembimbing : </h1>
                                    <h2>{selected.guru?.nama ? selected.guru.nama : 'Belum Ada'}</h2>
                                </div>
                                <div>
                                    <h1 className="font-bold">Status Laporan : </h1>
                                    <h2>{selected.siswa.status_lapor_pkl}</h2>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {filterModal && (
                    <div className="fixed flex inset-0 bg-black/50 justify-center items-center z-10">
                        <div className={`bg-[#FEFEFE] rounded-lg w-[300px] h-[300px] md:h-[280px] p-6 space-y-4`}>
                            <div className="flex space-x-30">
                                <h1 className="font-bold text-[20px]">Status PKL</h1>
                                <button className="w-5 h-5 mt-1" onClick={() => {setFilterModal(false);}}>
                                    <img src="http://127.0.0.1:8000/img/close.png" alt="" />
                                </button>
                            </div>

                            <div className="space-y-5 mt-10">
                                <div className="flex space-x-3">
                                    <input
                                        type="checkbox"
                                        className="appearance-none rounded-full w-5 h-5 border border-black checked:bg-blue-500 checked:border-green-500 transition duration-200"
                                        value="Belum Lapor"
                                        checked={filter.includes("Belum Lapor")}
                                        onChange={() => handleFilter("Belum Lapor")}
                                    />
                                    <label className="pb-1">Belum Lapor</label>
                                </div>
                                <div className="flex space-x-3">
                                    <input
                                        type="checkbox"
                                        className="appearance-none rounded-full w-5 h-5 border border-black checked:bg-blue-500 checked:border-green-500 transition duration-200"
                                        value="Request Guru"
                                        checked={filter.includes("Request Guru")}
                                        onChange={() => handleFilter("Request Guru")}
                                    />
                                    <label className="pb-1">Request Guru</label>
                                </div>
                                <div className="flex space-x-3">
                                    <input
                                        type="checkbox"
                                        className="appearance-none rounded-full w-5 h-5 border border-black checked:bg-blue-500 checked:border-green-500 transition duration-200"
                                        value="Sudah Lapor"
                                        checked={filter.includes("Sudah Lapor")}
                                        onChange={() => handleFilter("Sudah Lapor")}
                                    />
                                    <label className="pb-1">Sudah Lapor</label>
                                </div>
                            </div>

                        </div>
                    </div>
                )}
            </div>

            {/* Button Logout */}
            <Logout />
        </div>
    )
}