import axios from 'axios';
import { useEffect, useMemo, useState } from "react";
import Notification from "../../components/notification";
import Navbar from "../../components/navbar";
import Logout from "../../components/logout";

export default function DashboardGuru() {
    const [notif, setNotif] = useState([]);
    const [guru, setGuru] = useState([]);
    const [laporPKL, setLaporPKL] = useState([]);
    const [search, setSearch] = useState('');
    const itemsPerPage = 6;
    const totalPages = Math.ceil(laporPKL.length / itemsPerPage);
    const [currentPage, setCurrentPage] = useState(1);
    const lastItem = itemsPerPage * currentPage;
    const firstItem = lastItem - itemsPerPage;
    const [profile, setProfile] = useState([]);
    const [modalShow, setModalShow] = useState(false);
    const [selected, setSelected] = useState([]);

    const fetchData = async () => {
        const token = sessionStorage.getItem('token');

        await axios.get('/api/guru', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        .then(res => {
            setGuru(res.data.guru.guru);
            setLaporPKL(res.data.guru.guru.pkl);
            // console.log(res.data.guru.guru.pkl)
        })
        .catch(err => {
            if (err.response && err.response.status === 401) {
                console.warn('Unauthorized, redirecting to login...');
            }
        })
    }

    const filteredData = laporPKL.filter((item) => {
        const matchSearch = item.siswa?.nama?.toLowerCase().includes(search.toLocaleLowerCase()) ||
                            item.industri?.nama?.toLowerCase().includes(search.toLocaleLowerCase());
        return matchSearch
    });

    const currentItems = filteredData.slice(firstItem, lastItem)

    const goToPrevPage = () => {
        setCurrentPage((prev) => Math.max(prev - 1, 1))
    }

    const goToNextPage = () => {
        setCurrentPage((prev) => Math.min(prev + 1, totalPages))
    }

    console.log(currentItems.length);

    const handleProfile = async (e) => {
        e.preventDefault();
        const token = sessionStorage.getItem('token');
        const formData = new FormData();
        
        formData.append('_method', 'PUT')
        formData.append('nama', profile.nama)
        formData.append('nip', profile.nip)
        formData.append('alamat', profile.alamat)
        formData.append('kontak', profile.kontak)
        formData.append('email', profile.email)

        if (profile.gender === 'Laki-laki') {
            formData.append('gender', 'L')
        } else if (profile.gender === 'Perempuan') {
            formData.append('gender', 'P')
        }

        if (profile.foto !== guru.foto) {
            formData.append('foto', profile.foto)
        }

        try {
            await axios.post(`/api/guru/update/${guru.id}`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })

            handleClear()

            setNotif({
                open:true,
                message:'Profile Guru berhasil di Ubah',
                severity:'success',
            });
        } catch (error) {
            const errors = error.response?.data?.errors;
            const message = error.response?.data?.message || 'Something went wrong';

            let errorMsg = message;
            if (errors && typeof errors === 'object') {
                errorMsg = Object.values(errors).flat().join('\n');
            }

            handleClear()

            setNotif({
                open:true,
                message:errorMsg,
                severity:'error'
            });
        }
    };

    const handleClear = () => {
        fetchData()
    }

    useEffect(() => {
        fetchData();

        const interval = setInterval(fetchData, 60000)

        return () => clearInterval(interval);
    }, [])

    return (
        <div className="relative bg-[#FEFEFE] w-full min-h-screen md:justify-items-center overflow-hidden">
            {/* Navbar */}
            <Navbar user={guru} setProfile={setProfile} profile={profile} 
                handleProfile={handleProfile}
            />

            <Notification 
                open={notif.open}
                message={notif.message}
                severity={notif.severity}
                onClose={() => setNotif({ ...notif, open: false })}
            />

            {/* Content */}
            <div className="bg-gradient-to-br from-blue-500 via-blue-300 to-blue-100 w-[300px] h-[450px] text-black md:min-w-[1000px] md:min-h-[500px] rounded-md ml-11 mt-12 mb-7 shadow-[10px_15px_30px_rgba(0,0,0,0.5)]">
                <div className="flex relative w-full px-5 pt-5 space-x-3">
                    <div className="relative w-full h-full">
                        <input className="bg-white w-full h-[35px] px-4 text-black rounded-full focus:outline focus:outline-green-500" type="text" 
                            value={search} onChange={(e) => setSearch(e.target.value)} placeholder='Masukkan Nama Siswa'
                        />
                        <img src="http://127.0.0.1:8000/img/search.png" alt="search" 
                            className="absolute top-1 right-3 pointer-events-none  w-7 h-7"
                        />
                    </div>
                </div>

                <h1 className="ml-5 mt-6 text-[20px] font-bold">Data Siswa Bimbingan PKL</h1>

                <div className="text-black ml-5 pr-3 h-full">
                    {currentItems.length > 0 ? (
                        <div className="text-black w-full h-full pr-4 pt-2 space-y-4 md:space-y-3">
                            <div className='h-full'>
                                <div className='h-2/3'>
                                    {currentItems.map((laporPKL, index) => (
                                        <div key={index} className="flex w-full bg-white/30 rounded-md items-center justify-between px-4 py-2 m-2 shadow-sm hover:bg-white/40 transition space-x-8">
                                            <h1>{index + 1 + (currentPage - 1) * itemsPerPage}</h1>
                                            <h1 className='w-full'>{laporPKL.industri.nama}</h1>
                                            <button type="button" onClick={() => {setModalShow(true); setSelected(laporPKL)}} className="w-18 h-8" >
                                                <img src="http://127.0.0.1:8000/img/show.png" alt="" 
                                                    className="w-6 h-6" 
                                                />
                                            </button>
                                        </div>
                                    ))}
                                </div>

                                {/* Pagination */}
                                <div className={`flex ml-2 ${currentPage === 1 ? 'justify-end p' : 'justify-between'}`}>
                                    <button onClick={goToPrevPage} className={`border border-white text-white bg-transparent hover:bg-white hover:text-blue-500 rounded-md px-2 ${currentPage === 1 ? 'hidden' : '' }`}>Prev</button>
                                    <button onClick={goToNextPage} className={`border border-white text-white bg-blue-300 hover:bg-white hover:text-blue-500 rounded-md px-2 ${laporPKL.length <= 6  ? 'hidden' : ''}`}>Next</button>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="relative justify-items-center pl-4 pt-3">
                            <h1 className="font-bold text-[15px] mr-5 mt-10">Data Masih Kosong</h1>
                            <img src="http://127.0.0.1:8000/img/confused.png" alt="" 
                                className="h-50 w-50 mr-5 mt-5"
                            />
                        </div>
                    )}

                    {modalShow && (
                        <div className="fixed flex inset-0 bg-black/50 justify-center items-center z-10">
                            <div className={`bg-[#FEFEFE] rounded-lg w-[300px] md:w-[450px] h-[400px] p-6 space-y-4`}>
                                <div className="flex space-x-30 md:justify-between">
                                    <h1 className="font-bold text-[20px]">Data Siswa Terbimbing</h1>
                                    <button className="w-5 h-5 mt-1" onClick={() => {setModalShow(false);}}>
                                        <img src="http://127.0.0.1:8000/img/close.png" alt="" />
                                    </button>
                                </div>

                                <div className="p-1 space-y-3 text-">
                                    <div>
                                        <h1 className="font-bold">Nama Siswa : </h1>
                                        <h2>{selected.siswa.nama}</h2>
                                    </div>
                                    <div>
                                        <h1 className="font-bold">Nama Industri : </h1>
                                        <h2>{selected.industri.nama}</h2>
                                    </div>
                                    <div>
                                        <h1 className="font-bold">Email Perusahaan : </h1>
                                        <h2>{selected.industri.email}</h2>
                                    </div>
                                    <div>
                                        <h1 className="font-bold">Alamat Perusahaan : </h1>
                                        <h2>{selected.industri.alamat}</h2>
                                    </div>
                                    <div>
                                        <h1 className="font-bold">Website Perusahaan : </h1>
                                        <h2>{selected.siswa.status_lapor_pkl}</h2>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Logout Button */}
            <Logout />
        </div>
    )
}