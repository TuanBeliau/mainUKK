import axios from 'axios';
import { useEffect, useMemo, useState } from "react";
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";
import Notification from "../../components/notification";
import Navbar from "../../components/navbar";
import Logout from "../../components/logout";

export default function DashboardSiswa() {
    const [notif, setNotif] = useState({
        open:false,
        message: '',
        severity: 'success'
    });
    const [action, setAction] = useState(false);
    const [siswa, setSiswa] = useState([]);
    const [industri, setIndustri] = useState([]);
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
    const [modal, setModal] = useState(false);
    const [step, setStep] = useState(0);
    const [showList, setShowList] = useState(false);
    const [industriId, setIndustriId] = useState({
        id: null,
        nama:"",
        bidang_usaha:"",
        alamat:"",
        email:"",
        kontak:"",
    });
    const [profile, setProfile] = useState({
        nama:'',
        nis:'',
        gender:'',
        alamat:'',
        kontak:'',
        email:'',
        foto:''
    })
    const [laporPKL, setLaporPKL] = useState({
        nama:'',
        website:'',
        bidang_usaha:'',
        alamat:'',
        email:'',
        kontak:'',
        mulai:'',
        selesai:'',
    });

    const isValid = useMemo(() => {
        return !Object.entries(laporPKL)
            .filter(([key]) => key !== 'mulai' && key !== 'selesai')
            .some(([_, value]) => !value || value.toString().trim() === '');
    }, [laporPKL]);

    const isEmpty = useMemo(() => {
        return Object.values(laporPKL)
            .some(value => !value || value.toString().trim() === '')
    }, [laporPKL]);

    const isDifferent = () => {
        if (!siswa?.pkl || !siswa?.pkl?.industri) return true;

        return (
            laporPKL.nama !== siswa.pkl.industri.nama ||
            laporPKL.bidang_usaha !== siswa.pkl.industri.bidang_usaha ||
            laporPKL.website !== siswa.pkl.industri.website ||
            laporPKL.alamat !== siswa.pkl.industri.alamat ||
            laporPKL.kontak !== siswa.pkl.industri.kontak ||
            laporPKL.email !== siswa.pkl.industri.email ||
            laporPKL.mulai !== siswa.pkl.mulai ||
            laporPKL.selesai !== siswa.pkl.selesai
        );
    };

    const isProfile = Object.entries(siswa)
        .filter(([key, _]) => key !== 'pkl')
        .every(([_, value])=> value !== '' && value !== null && value.toString().trim() !== '');

    const filterIndustri = industri.filter((item) => 
        item.nama.toLowerCase().includes(laporPKL.nama.toLowerCase())
    );

    const pilihIndustri = (item) => {
        setIndustriId({ ...industriId, 
            id: item.id,
            name: item.name,
            website: item.website,
            bidang_usaha: item.bidang_usaha,
            alamat: item.alamat,
            email: item.email,
            kontak: item.kontak,
        });
        setLaporPKL({ ...laporPKL,
            nama: item.nama,
            website: item.website,
            bidang_usaha: item.bidang_usaha,
            alamat: item.alamat,
            email: item.email,
            kontak: item.kontak,
         });
        setShowList(false);
    };

    const prev = () => {
        if (step - 0) setStep(step - 1);
    }

    const next = () => {
        if (step < 2) setStep(step + 1);
    }

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

            handleClear()

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
    };

    const handleChangeLaporPKL = (e) => {
        const { name, value } = e.target;
        setLaporPKL((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const hapusLaporPKL = async (e, parameter) => {
        e.preventDefault();
        const token = sessionStorage.getItem('token');

        try {
            if (parameter == 1) {
                await axios.delete(`/api/data_pkl/${siswa.id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })
            } else {
                await axios.delete(`/api/siswa/${siswa.id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })
            }

            handleClear()

            setNotif({
                open:true,
                message:'Laporan PKL Berhasil di Hapus',
                severity: 'success'
            })
        } catch (error) {
            const errors = error.response?.data?.errors;
            const message = error.response?.data?.message || 'Something Went Error';

            let errorMsg = message;
            if (error && typeof errors === 'object') {
                errorMsg = Object.values(errors).flat().join('\n')
            }

            handleClear()

            setNotif({
                open:true,
                message:errorMsg,
                severity:'error'
            });
        }
    };

    // Create and Edit Laporan PKL
    const handleSubmit = async (e) => {     
        e.preventDefault(); 
        const token = sessionStorage.getItem('token');

        if (siswa.pkl) {
            try {
                await axios.put(`/api/siswa/${siswa.id}`, laporPKL, {
                    headers: {
                        Authorization:`Bearer ${token}`,
                    }
                })

                handleClear()
                setNotif({
                    open:true,
                    message:'Laporan PKL Berhasil di Ubah',
                    severity: 'success',
                })
            } catch (error) {
                const errors = error.response?.data?.errors;
                const message = error.response?.data?.message || 'Something went wrong';

                let errorMsg = message;

                if (errors && typeof errors === 'object') {
                    errorMsg = Object.values(errors).flat().join('\n');
                }

                handleClear()
                setNotif({
                    open: true,
                    message: errorMsg,
                    severity: 'error',
                });
            }
        } else {
            try {
                await axios.post('/api/siswa', laporPKL, {
                    headers: {
                        Authorization:`Bearer ${token}`,
                    }
                })
                
                handleClear()
                setNotif({
                    open:true,
                    message: 'Laporan PKL Berhasil di Tambahkan',
                    severity: 'success',
                })
            } catch (error) {
                const errors = error.response?.data?.errors;
                const message = error.response?.data?.message || 'Something went wrong';

                let errorMsg = message;

                if (errors && typeof errors === 'object') {
                    errorMsg = Object.values(errors).flat().join('\n');
                }
                
                handleClear()
                setNotif({
                    open: true,
                    message: errorMsg,
                    severity: 'error',
                });
            }
        }

        fetchData()
    };

    // Fetch Data
    useEffect(() => {
        fetchData();

        const interval = setInterval(fetchData, 60000);

        return () => clearInterval(interval);
    }, []);

    const [tanggalMulai, setTanggalMulai] = useState('');
    const [tanggalSelesai, setTanggalSelesai] = useState('');

    useEffect(() => {
        if (siswa?.pkl?.industri) {
            setLaporPKL(prev => ({
                ...prev,
                nama: siswa.pkl.industri?.nama || '',
                bidang_usaha: siswa.pkl.industri?.bidang_usaha || '',
                website: siswa.pkl.industri?.website || '',
                alamat: siswa.pkl.industri?.alamat || '',
                email: siswa.pkl.industri?.email || '',
                kontak: siswa.pkl.industri?.kontak || '',
                mulai: tanggalMulai
                    ? tanggalMulai.toISOString().split('T')[0]
                    : siswa.pkl?.mulai || '',
                selesai: tanggalSelesai
                    ? tanggalSelesai.toISOString().split('T')[0]
                    : siswa.pkl?.selesai || '',
            }));
        }
    }, [siswa, tanggalMulai, tanggalSelesai]);

    useEffect(() => {
        setLaporPKL(prev => ({
            ...prev,
            mulai: tanggalMulai ? tanggalMulai.toISOString().split('T')[0] : siswa.pkl?.mulai,
        }));
    }, [siswa, tanggalMulai])

    useEffect(() => {
        setLaporPKL(prev => ({
            ...prev,
            selesai: tanggalSelesai ? tanggalSelesai.toISOString().split('T')[0] : siswa.pkl?.selesai,
        }));
    }, [siswa, tanggalSelesai])


    const notifProfile = () => {
        setNotif({
            open:true,
            message:'tolong isi semua data profile',
            severity:'info'
        })
    }

    // Clear stuff
    const handleClear = () => {
        setLaporPKL({
            nama: '',
            bidang_usaha: '',
            alamat: '',
            email: '',
            kontak: '',
            mulai: '',
            selesai: '',
        });
        setAction(false);
        fetchData();
        setStep(0);
        setTanggalMulai();
        setTanggalSelesai();
        setModal(false)
    }

    return (
        <div className="relative bg-[#FEFEFE] w-full min-h-screen md:justify-items-center">
            {/* Navbar */}
            <Navbar user={siswa} setProfile={setProfile} profile={profile} handleProfile={handleProfile}/>

            <Notification 
                open={notif.open}
                message={notif.message}
                severity={notif.severity}
                onClose={() => setNotif({ ...notif, open: false })}
            /> 

            {/* Content */}
            <div className="bg-gradient-to-br from-blue-500 via-blue-300 to-blue-100 w-[300px] h-[450px] md:min-w-[1000px] md:min-h-[500px] rounded-md ml-11 mt-12 mb-7 shadow-[10px_15px_30px_rgba(0,0,0,0.5)]">

                {/* Searchbar and create/edit button */}
                <div className="relative flex w-full text-black md:justify-between">
                    <h1 className="ml-5 mt-6 text-[20px] font-bold">Data Siswa PKL</h1>
                    <div className="relative w-12 h-12 rounded-full mt-5 md:pr-10 justify-end hover:bg-gray-400 justify-items-end md:mr-8">
                        {siswa && siswa.pkl ? (
                            <button disabled={siswa.status_lapor_pkl == 'Sudah Lapor'}>
                                <img src="/img/edit.png" alt="" 
                                    className="absolute top-1 left-1 w-10 h-10" onClick={() => setModal(true)}
                                />
                            </button>
                        ) : (
                            <div className='cursor-pointer' onClick={() => {isProfile ? setModal(true) : notifProfile()}} >
                                <img src="/img/create.png" alt="" 
                                    className="absolute top-1 left-1 w-10 h-10"
                                />
                                <Notification 
                                    open={notif.open}
                                    message={notif.message}
                                    severity={notif.severity}
                                    onClose={() => setNotif({ ...notif, open: false })}
                                />
                            </div>
                            
                        )}

                        {modal && (
                            <div className="fixed flex inset-0 bg-black/50 justify-center items-center z-10">
                                <form onSubmit={handleSubmit}>
                                    <div className={`bg-[#FEFEFE] rounded-lg w-[300px] md:w-[500px] h-full p-6 space-y-4`}>
                                        <div className="flex space-x-28 md:space-x-85">
                                            <h1 className="font-bold">{siswa.pkl? 'Edit Data PKL' : 'Buat Data PKL'}</h1>
                                            <button className="w-5 h-5" onClick={() => {setModal(false);handleClear()}}>
                                                <img src="/img/close.png" alt="" />
                                            </button>
                                        </div>
                                        { step == 0 && (
                                            <div className="space-y-3">
                                                <div className="w-full">
                                                    <label className='block'>{`Nama Industri`}</label>
                                                    <label className='text-gray-700 text-sm'>{`(Tolong Masukan Nama dan Email yang berbeda Untuk Industri Baru)`}</label>
                                                    <input type="text" onChange={(e) => {handleChangeLaporPKL(e); setShowList(true)}} value={laporPKL.nama ?? ''}
                                                        placeholder={`${siswa.pkl?.industri.nama ?? "Masukkan Nama Industri"}`} name='nama'
                                                        className="bg-gray-500 rounded-full w-full py-2 px-4"
                                                        required
                                                    />
                                                    {showList && filterIndustri.length > 0 && (
                                                        <ul className="absolute bg-white w-[250px] mt-1 rounded-lg max-h-40 overflow-y-auto shadow z-10">
                                                            {filterIndustri.slice(0, 3).map((item) => (
                                                                <li
                                                                    key={item.id}
                                                                    onClick={() => pilihIndustri(item)}
                                                                    className="px-4 py-2 hover:bg-blue-100 cursor-pointer"
                                                                >
                                                                    {item.nama}
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    )}
                                                </div>
                                                <div className="w-full">
                                                    <label>Bidang Usaha</label>
                                                    <input type="text" onChange={handleChangeLaporPKL} name='bidang_usaha' value={laporPKL.bidang_usaha ?? ''}
                                                        placeholder={`${siswa.pkl?.industri.bidang_usaha ?? "Masukkan Bidang Usaha Industri"}`}
                                                        className="bg-gray-500 rounded-full w-full py-2 px-4"
                                                        required
                                                    />
                                                </div>
                                                <div className="w-full">
                                                    <label>Link Website Industri</label>
                                                    <input type="text" onChange={handleChangeLaporPKL} name='website' value={laporPKL.website ?? ''}
                                                        placeholder={`${siswa.pkl?.industri.website ?? "Masukkan Link Website Industri"}`}
                                                        className="bg-gray-500 rounded-full w-full py-2 px-4"
                                                        required
                                                    />
                                                </div>
                                                <div className="w-full">
                                                    <label>Alamat</label>
                                                    <input type="text" onChange={handleChangeLaporPKL} name='alamat' value={laporPKL.alamat ?? ''}
                                                        placeholder={`${siswa.pkl?.industri.alamat ?? "Masukkan Alamat Industri"}`}
                                                        className="bg-gray-500 rounded-full w-full py-2 px-4"
                                                        required
                                                    />
                                                </div>
                                                <div className="w-full">
                                                    <label>Email</label>
                                                    <input type="email" onChange={handleChangeLaporPKL} name='email' value={laporPKL.email ?? ''}
                                                        placeholder={`${siswa.pkl?.industri.email ?? "Masukkan Email Industri"}`}
                                                        className="bg-gray-500 rounded-full w-full py-2 px-4"
                                                        required
                                                    />
                                                </div>
                                                <div className="w-full">
                                                    <label>Kontak</label>
                                                    <input type="number" onChange={handleChangeLaporPKL} name='kontak' value={laporPKL.kontak ?? ''}
                                                    placeholder={`${siswa.pkl?.industri.kontak ?? "Masukkan Kontak Industri"}`}
                                                        className="bg-gray-500 rounded-full w-full py-2 px-4 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                                        minLength='10' maxLength='15'
                                                        required
                                                    />
                                                </div>
                                            </div>
                                        )}
                                        { step == 1 && (
                                            <div className='max-w-xs md:max-w-xl md:space-y-4'>
                                                <div className="relative w-full">
                                                    <label className='md:block'>Tanggal Mulai :</label>
                                                    <DatePicker
                                                        selected={tanggalMulai ? tanggalMulai : siswa.pkl?.mulai}
                                                        onChange={(e) => {setTanggalMulai(e)}} name='mulai' placeholderText='Masukkan Tanggal Mulai PKL'
                                                        className="w-full md:w-113 text-white bg-gray-500 rounded-full py-2 pl-4 pr-12 focus:outline-none"
                                                        dateFormat="yyyy-MM-dd"
                                                        minDate={new Date()}
                                                        required
                                                    />
                                                    <img src="/img/date.png" alt="" 
                                                        className="absolute right-4 top-1/2 transform -translate-y-1/12 w-6 h-6 pointer-events-none"
                                                    />
                                                </div>
                                                <div className="relative w-full">
                                                    <label className='md:block'>Tanggal Selesai :</label>
                                                    <DatePicker
                                                        selected={tanggalSelesai ? tanggalSelesai : siswa.pkl?.selesai}
                                                        onChange={(e) => {setTanggalSelesai(e)}} name='selesai' placeholderText='Masukan Tanggal Selesai PKL'
                                                        className="w-full md:w-113 text-white bg-gray-500 rounded-full py-2 pl-4 pr-12 focus:outline-none"
                                                        dateFormat="yyyy-MM-dd"
                                                        required
                                                        minDate={tanggalMulai ? tanggalMulai : siswa.pkl?.mulai}
                                                    />
                                                    <img src="/img/date.png" alt="" 
                                                        className="absolute right-4 top-1/2 transform -translate-y-1/12 w-6 Fh-6 pointer-events-none"
                                                    />
                                                </div> 
                                            </div>
                                        ) }

                                        <div className="flex mt-2 w-full space-x-20 md:space-x-71">
                                            { step > 0 &&  (
                                                <div className="bg-green-500 rounded-full justify-end p-1 px-5">
                                                    <button type="button" onClick={prev}>Prev</button>
                                                </div> 
                                            )}
                                            { step < 1 && (
                                                <div className="bg-green-500 rounded-full justify-end p-1 px-5">
                                                    <button type="button" onClick={next} disabled={!isValid}>{!isValid ? 'Isi Semua Data' : 'Next'}</button>
                                                </div>
                                            )}
                                            { step == 1 && (
                                                <div className={`bg-green-500 rounded-full ${!isEmpty && isDifferent() ? '' : 'hidden'} justify-end p-1 px-5`}>
                                                    <button type="submit">Submit</button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </form>
                            </div>
                        )}

                        {action && (
                            <div className="fixed flex inset-0 bg-black/50 justify-center items-center z-10">
                                <div className={`bg-[#FEFEFE] rounded-lg w-[300px] md:w-[500px] p-6 space-y-5`}>
                                    <div className=''>
                                        <button className="w-5 h-5" onClick={() => {setAction(false);handleClear()}}>
                                            <img src="/img/close.png" alt="" />
                                        </button>
                                        <h1 className='text-center text-bold text-lg'>Pilih Yang Benar</h1>
                                    </div>
                                    <div className='flex justify-between'>
                                        <button className='bg-blue-500 rounded-md p-2' onClick={(e) => siswa.status_lapor_pkl !== 'Sudah Lapor' && hapusLaporPKL(e, 1)}>Hapus Laporan PKL Saja</button>
                                        <button className='bg-red-500 rounded-md p-2' onClick={(e) => siswa.status_lapor_pkl !== 'Sudah Lapor' && hapusLaporPKL(e, 2)}>Hapus Dengan Data Industri</button>
                                    </div>
                                </div>
                            </div>
                        )}

                        <Notification 
                            open={notif.open}
                            message={notif.message}
                            severity={notif.severity}
                            onClose={() => setNotif({ ...notif, open: false })}
                        />
                    </div>
                </div>

                {/* Data Display */}
                <div className="text-black ml-5 pr-3">
                    {siswa && siswa.pkl ? (
                        <div className="w-full space-y-3 md:space-y-5 ">
                            <div className="w-full">
                                <h2 className="font-bold">Nama Siswa :</h2>
                                <h3 className="bg-white p-1 pl-3 rounded-full mr-4">{siswa.nama}</h3>
                            </div>
                            <div className="w-full">
                                <h2 className="font-bold">Guru Pembimbing :</h2>
                                <h3 className="bg-white p-1 pl-3 rounded-full mr-4">{siswa.pkl.guru?.nama ?? "Belum di beri Guru Pembimbing"}</h3>
                            </div>
                            <div className="w-full">
                                <h2 className="font-bold">Nama Industri :</h2>
                                <h3 className="bg-white p-1 pl-3 rounded-full mr-4">{siswa.pkl.industri.nama}</h3>
                            </div>
                            <div className="flex w-full space-x-2 pr-5">
                                <div className="w-full">
                                    <h2 className="font-bold">Mulai:</h2>
                                    <h3 className="bg-white w-full p-1 pl-3 rounded-full mr-4">{siswa.pkl.mulai}</h3>
                                </div>
                                <div className="w-full">
                                    <h2 className="font-bold">Mulai:</h2>
                                    <h3 className="bg-white w-full p-1 pl-3 rounded-full mr-4">{siswa.pkl.selesai}</h3>
                                </div>
                            </div>
                            <div className="pt-2 w-[120px]">
                                {siswa.status_lapor_pkl === 'Belum Lapor' && (
                                    <h3 className="bg-green-500 rounded-full p-1 px-2 shadow-[0_0_15px_rgba(139,0,0,0.7)] text-white">Belum Lapor</h3>
                                )}
                                {siswa.status_lapor_pkl === 'Request Guru' && (
                                    <h3 className="bg-blue-500 rounded-full p-1 px-2 shadow-[0_0_15px_rgba(0,255,255,0.6)] text-white">Request Guru</h3>
                                )}
                                {siswa.status_lapor_pkl === 'Sudah Lapor' && (
                                    <h3 className="bg-red-500 rounded-full p-1 px-2 shadow-[0_0_15px_rgba(0,255,0,0.7)] text-white">Sudah Lapor</h3>
                                )}
                            </div>
                            <div className="items-center text-center justify-center">
                                <button className="bg-red-500 hover:bg-red-700 p-2 px-3 w-full rounded-full" onClick={(e) => setAction(true)}>
                                    {`Hapus Laporan PKL (Hanya Bisa Sebelum Di ACC)`}
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="relative justify-items-center pl-4">
                            <h1 className="font-bold text-[15px] mr-5 mt-10">Data Masih Kosong</h1>
                            <img src="/img/confused.png" alt="" 
                                className="h-50 w-50 mr-5 mt-5"
                            />
                        </div>
                    )}
                </div>
            </div>

            {/* Logout Button */}
            <Logout />
        </div>
    )
}