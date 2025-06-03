import axios from 'axios';
import { useEffect, useMemo, useState } from "react";
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";
import Notification from "../../components/notification";
import Navbar from "../../components/navbar";
import Logout from "../../components/logout";

export default function Industri() {
    const [notif, setNotif] = useState({
        open:false,
        message: '',
        severity: 'success'
    });
    const [industri, setIndustri] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;
    const totalPages = (Math.ceil(industri.length / itemsPerPage));
    const lastItem = itemsPerPage * currentPage;
    const firstItem = lastItem - itemsPerPage;
    const [actionIndustri, setActionIndustri] = useState({
        nama:'',
        bidang_usaha:'',
        website:'',
        email:'',
        alamat:'',
        kontak:'',
    });
    const [search, setSearch] = useState('');
    const [selected, setSelected] = useState([]);
    const [modalAction, setModalAction] = useState(false);
    const [modalShow, setModalShow] = useState(false);
    const [siswa, setSiswa] = useState([]);
    const [profile, setProfile] = useState({
        nama:'',
        nis:'',
        alamat:'',
        kontak:'',
        email:'',
        foto:''
    })

    const isEmpty = useMemo(() => {
        return Object.values(actionIndustri)
            .some(value => !value || value.toString().trim() === '');
    }, [actionIndustri]);

    const fetchData = () => {
        const token = sessionStorage.getItem('token');

        axios.get('/api/siswa', {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        })
        .then(res => {
            setSiswa(res.data.siswa.siswa);
            setIndustri(res.data.industri);
        })
        .catch(err => {
            if (err.response && err.response.status === 401) {
                console.warn('Unauthorized, redirecting to login...');
            }
        });
    };
    
    const goToPrevPage = () => {
        setCurrentPage(prev => Math.max(prev - 1, 1))
    }

    const goToNextPage = () => {
        setCurrentPage(prev => Math.min(prev + 1, totalPages))
    } 

    const filteredData = industri.filter((item) => {
        const matchSearch = item.nama.toLowerCase().includes(search.toLowerCase());
        return matchSearch
    });

    const currentItems = filteredData.slice(firstItem, lastItem)

    const handleIndustri = (e) => {
        const { name, value } = e.target;
        setActionIndustri((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, 60000);

        return () => clearInterval(interval);
    }, []);

    // Update Profile Siswa
    const handleProfile = async (e) => {
        e.preventDefault();
        const token = sessionStorage.getItem('token');
        const formData = new FormData();
        
        formData.append('_method', 'PUT')
        formData.append('nama', profile.nama)
        formData.append('nis', profile.nis)
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

            handleClear()
            setNotif({
                open:true,
                message:errorMsg,
                severity:'error'
            });
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = sessionStorage.getItem('token');

        try {
            await axios.post(`/api/data_pkl`, actionIndustri, {
                headers : {
                    Authorization: `Bearer ${token}`
                },
            })

            setModalAction(false);
            fetchData()
            setNotif({
                open:true,
                message:'Data Industri Berhasil di Ubah',
                severity:'success'
            });
        } catch (error) {
            const errors = error.response?.data?.errors;
            const message = error.response?.data?.message || 'Something went wrong';

            let errorMsg = message;

            if (errors && typeof errors === 'object') {
                errorMsg = Object.values(errors).flat().join('\n');
            }
            
            setModalAction(false)
            setNotif({
                open: true,
                message: errorMsg,
                severity: 'error',
            });
        }
    }

    // Clear stuff
    const handleClear = () => {
        setModalAction(false)
    }

    return (
        <div className="relative bg-[#FEFEFE] w-full min-h-screen md:justify-items-center overflow-hidden">
            {/* Navbar */}
            <Navbar siswa={siswa} setProfile={setProfile} profile={profile} handleProfile={handleProfile}/>

            <Notification 
                open={notif.open}
                message={notif.message}
                severity={notif.severity}
                onClose={() => setNotif({ ...notif, open: false })}
            />

            {/* Content */}
            <div className="bg-gradient-to-br from-blue-500 via-blue-300 to-blue-100 w-[300px] h-[450px] md:min-w-[1000px] md:min-h-[500px] rounded-md ml-11 mt-12 mb-7 text-black shadow-[10px_15px_30px_rgba(0,0,0,0.5)]">

                {/* Searchbar and create/edit button */}
                <div className="relative flex flex-col w-full text-black md:justify-between">
                    <div className="flex relative w-full px-5 pt-5 space-x-3">
                        <div className="relative w-full h-full">
                            <input className="bg-white w-full h-[35px] px-4 text-black rounded-full focus:outline focus:outline-green-500" type="text" 
                                value={search} onChange={(e) => setSearch(e.target.value)}
                            />
                            <img src="http://127.0.0.1:8000/img/search.png" alt="search" 
                                className="absolute top-1 right-3 pointer-events-none  w-7 h-7"
                            />
                        </div>
                        <button onClick={() => setModalAction(true)}>
                            <img src="http://127.0.0.1:8000/img/create.png" alt="" 
                                className={`w-10 h-10  ${siswa.pkl ? 'hidden' : ''}`}
                            />
                        </button>
                    </div>

                    {modalAction && (
                        <div className="fixed flex inset-0 bg-black/50 justify-center items-center z-10">
                            <form onSubmit={handleSubmit}>
                                <div className={`bg-[#FEFEFE] rounded-lg w-[300px] md:w-[500px] p-6 space-y-4`}>
                                    <div className="flex space-x-28 md:justify-between">
                                        <h1 className="font-bold">{siswa.pkl? 'Edit Data PKL' : 'Buat Data PKL'}</h1>
                                        <button className="w-5 h-5" onClick={() => setModalAction(false)}>
                                            <img src="http://127.0.0.1:8000/img/close.png"/>
                                        </button>
                                    </div>
                                    <div className="space-y-3">
                                        <div className="w-full">
                                            <label>Nama Industri</label>
                                            <input type="text"
                                                placeholder={`Masukkan Nama Industri`} value={actionIndustri.nama ?? ''} onChange={handleIndustri}
                                                className="bg-gray-500 rounded-full w-full py-2 px-4" name="nama"
                                                required
                                            />
                                        </div>
                                        <div className="w-full">
                                            <label>Bidang Usaha</label>
                                            <input type="text"
                                                placeholder={`Masukkan Bidang Usaha Industri`} value={actionIndustri.bidang_usaha ?? ''} onChange={handleIndustri}
                                                className="bg-gray-500 rounded-full w-full py-2 px-4" name="bidang_usaha"
                                                required
                                            />
                                        </div>
                                        <div className="w-full">
                                            <label>Alamat</label>
                                            <input type="text"
                                                placeholder={`Masukkan Alamat Industri`} value={actionIndustri.alamat ?? ''} onChange={handleIndustri}
                                                className="bg-gray-500 rounded-full w-full py-2 px-4" name="alamat"
                                                required
                                            />
                                        </div>
                                        <div className="w-full">
                                            <label>Email</label>
                                            <input type="email"
                                                placeholder={`Masukkan Email Industri`} value={actionIndustri.email ?? ''} onChange={handleIndustri}
                                                className="bg-gray-500 rounded-full w-full py-2 px-4" name="email"
                                                required
                                            />
                                        </div>
                                        <div className="w-full">
                                            <label>Website</label>
                                            <input type='text'
                                                placeholder={`Masukkan Email Industri`} value={actionIndustri.website ?? ''} onChange={handleIndustri}
                                                className="bg-gray-500 rounded-full w-full py-2 px-4" name="website"
                                                required
                                            />
                                        </div>
                                        <div className="w-full">
                                            <label>Kontak</label>
                                            <input type="number"
                                            placeholder={`Masukkan Kontak Industri`}  value={actionIndustri.kontak ?? ''} onChange={handleIndustri} name='kontak'
                                                className="bg-gray-500 rounded-full w-full py-2 px-4 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                                minLength='10' maxLength='15'
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="flex mt-2 w-full space-x-20">
                                        <div className={`bg-green-500 rounded-full justify-end p-1 px-5 ${isEmpty ? 'hidden' : ''}`}>
                                            <button type="submit">Submit</button>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>
                    )}
                </div>

                <Notification 
                    open={notif.open}
                    message={notif.message}
                    severity={notif.severity}
                    onClose={() => setNotif({ ...notif, open: false })}
                />

                <h1 className="ml-5 mt-6 text-[20px] font-bold">Data Industri PKL</h1>

                {/* Data Display */}
                <div className="text-black h-full ml-5 pr-3 md:pr-2">
                    {currentItems.length > 0 ? (
                        <div className="text-black w-full h-full pr-4 pt-2 space-y-4 md:space-y-3">
                            <div className='h-full'>
                                <div className='h-2/3'>
                                    {currentItems.map((industri, index) => (
                                        <div key={index} className="flex w-full bg-white/30 rounded-md items-center justify-between px-4 py-2 m-2 shadow-sm hover:bg-white/40 transition space-x-8">
                                            <h1>{index + 1 + (currentPage - 1) * itemsPerPage}</h1>
                                            <h1 className='w-full'>{industri.nama}</h1>
                                            <button type="button" onClick={() => {setModalShow(true); setSelected(industri)}} className="w-18 h-8" >
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
                                    <button onClick={goToNextPage} className={`border border-white text-white bg-blue-300 hover:bg-white hover:text-blue-500 rounded-md px-2 ${industri.length <= 6  ? 'hidden' : ''}`}>Next</button>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="relative justify-items-center pl-4">
                            <h1 className="font-bold text-[15px] mr-5 mt-10">Data Masih Kosong</h1>
                            <img src="http://127.0.0.1:8000/img/confused.png"
                                className="h-50 w-50 mr-5 mt-5"
                            />
                        </div>
                    )}

                    {modalShow && (
                        <div className="fixed flex inset-0 bg-black/50 justify-center items-center z-10">
                            <div className={`bg-[#FEFEFE] rounded-lg w-[300px] md:w-[450px] h-[400px] p-6 space-y-4`}>
                                <div className="flex space-x-30 md:justify-between">
                                    <h1 className="font-bold text-[20px]">Data Industri</h1>
                                    <button className="w-5 h-5 mt-1" onClick={() => {setModalShow(false);}}>
                                        <img src="http://127.0.0.1:8000/img/close.png" alt="" />
                                    </button>
                                </div>

                                <div className="p-1 space-y-3 text-">
                                    <div>
                                        <h1 className="font-bold">Nama Perusahaan : </h1>
                                        <h2>{selected.nama}</h2>
                                    </div>
                                    <div>
                                        <h1 className="font-bold">Bidang Usaha : </h1>
                                        <h2>{selected.bidang_usaha}</h2>
                                    </div>
                                    <div>
                                        <h1 className="font-bold">Email Perusahaan : </h1>
                                        <h2>{selected.email}</h2>
                                    </div>
                                    <div>
                                        <h1 className="font-bold">Alamat Perusahaan : </h1>
                                        <h2>{selected.alamat}</h2>
                                    </div>
                                    <div>
                                        <h1 className="font-bold">Website Perusahaan : </h1>
                                        <h2>{selected.website}</h2>
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