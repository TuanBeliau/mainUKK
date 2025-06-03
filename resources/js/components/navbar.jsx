import { useState, useEffect, useMemo } from "react";
import { useLocation, Link } from "react-router-dom";

export default function Navbar({user, setProfile, profile, handleProfile}) {
    const url = useLocation().pathname;
    const role = sessionStorage.getItem('role');
    const [ modalProfile, setModalProfile ] = useState(false);
    const [ step, setStep ] = useState(0);
    const [ image, setImage ] = useState(null);
    const [ preview, setPreview ] = useState(null);
    const isDifference = user && Object.keys(profile).filter(key => {
        const userVal = user[key] ?? '';
        const profileVal = profile[key] ?? '';

        return userVal !== profileVal;
    })
    const isEmpty = useMemo(() => {
        return Object.values(profile)
            .some(value => !value || value.toString().trim() === '')
    }, [profile])
    const isValid = Object.entries(profile)
        .filter(([key]) => key !== 'foto')
        .every(([_, value]) => value !== null);

    const handleImage = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        
        setImage(file);
        setProfile(prev => ({
            ...prev,
            foto: file
        }));
        setPreview(URL.createObjectURL(file));
    }

    const prev = () => {
        if (step > 0) setStep(step - 1);
    }

    const next = () => {
        if (step < 2) setStep(step + 1);
    }

    useEffect(() => {
        if (user?.foto && !image) {
            setPreview(`http://127.0.0.1:8000/storage/${user.foto}`);

            if (role === 'siswa') {
                setProfile({
                    nama: user.nama,
                    nis: user.nis,
                    gender: user.gender,
                    alamat: user.alamat,
                    kontak: user.kontak,
                    email: user.email,
                    foto: user.foto
                });
            } else if (role === 'guru') {
                setProfile({
                    nama: user.nama,
                    nip: user.nip,
                    gender: user.gender,
                    alamat: user.alamat,
                    kontak: user.kontak,
                    email: user.email,
                    foto: user.foto
                });
            }
            
        } else {
            if (role === 'siswa') {
                setProfile({
                    nama: user.nama,
                    nis: user.nis,
                    gender: user.gender,
                    alamat: user.alamat,
                    kontak: user.kontak,
                    email: user.email,
                    foto: user.foto
                });
            } else if (role === 'guru') {
                setProfile({
                    nama: user.nama,
                    nip: user.nip,
                    gender: user.gender,
                    alamat: user.alamat,
                    kontak: user.kontak,
                    email: user.email,
                    foto: user.foto
                });
            }
        }
    }, [user]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProfile((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleClear = () => {
        setModalProfile(false);
        setStep(0);
        setPreview(`http://127.0.0.1:8000/storage/${user.foto}`)
        setImage(null)
    }

    const imageClear =  () => {
        setPreview(`http://127.0.0.1:8000/storage/${user.foto}`)
        setImage(null)
        setProfile(prev => ({
            ...prev,
            foto: user.foto
        }));
    }

    return (
        <div className="relative min-w-screen">
            <div className="flex min-w-screen space-x-10">
                {role === 'siswa' && (
                    <div className="flex bg-gradient-to-br from-blue-500 via-blue-300 to-blue-100 shadow-[5px_10px_20px_rgba(0,0,0,0.5)] rounded-br-[100px] w-2/3 md:w-8/3 h-[90px] ">
                        <Link to="/siswa/dashboard" className={`${url === "/siswa/dashboard" ? "bg-gradient-to-br from-blue-600 via-blue-500 to-blue-400" 
                                : "hover:bg-gradient-to-br hover:from-blue-600 hover:via-blue-400 hover:to-blue-200"} w-1/2 h-full md:justify-items-center`}>
                            <img className="w-15 h-15 mt-4 ml-7" src="http://127.0.0.1:8000/img/home.png" alt="" />
                        </Link>
                        <Link to="/siswa/industri" className={`${url === "/siswa/industri" ? "bg-gradient-to-br from-blue-600 via-blue-400 to-blue-200" 
                                : "hover:bg-gradient-to-br hover:from-blue-600 hover:via-blue-400 hover:to-blue-200"} pl-5 w-1/2 h-full md:justify-items-center`}>
                            <img className="w-15 h-15 mt-4 mb-2" src="http://127.0.0.1:8000/img/industri.png" alt="" />
                        </Link>
                        <Link to="/siswa/pkl" className={`${url === "/siswa/pkl" ? "bg-gradient-to-br from-blue-600 via-blue-400 to-blue-200 rounded-br-[100px]" 
                                : "hover:bg-gradient-to-br hover:from-blue-600 hover:via-blue-400 hover:to-blue-200 rounded-br-[100px]"} pl-5 w-1/2 h-full md:justify-items-center`}>
                            <img className="w-15 h-15 mt-4 mb-2" src="http://127.0.0.1:8000/img/data.png" alt="" />
                        </Link>
                    </div>
                )}

                {role === 'guru' && (
                    <div className="flex bg-gradient-to-br from-blue-500 via-blue-300 to-blue-100 shadow-[5px_10px_20px_rgba(0,0,0,0.5)] rounded-br-[100px] w-2/3 md:w-8/3 h-[90px] ">
                        <Link to="/guru/dashboard" className={`${url === "/guru/dashboard" ? "bg-gradient-to-br from-blue-600 via-blue-500 to-blue-400" 
                                : "hover:bg-gradient-to-br hover:from-blue-600 hover:via-blue-400 hover:to-blue-200"} w-full h-full md:justify-items-center rounded-br-[100px]`}>
                            <img className="w-15 h-15 mt-4 ml-7" src="http://127.0.0.1:8000/img/home.png" alt="" />
                        </Link>
                    </div>
                )}
                <div className="relative w-1/3 text-black">
                    <button className="relative mr-5 bg-gradient-to-br from-blue-500 via-blue-300 hover:via-blue-400 hover:to-blue-200 to-blue-100 w-20 h-20 rounded-full mt-2 pl-[10px] hover:bg-gray-400 shadow-[5px_5px_10px_rgba(0,0,0,0.5)]">
                        { user?.foto ? (
                            <img src={`http://127.0.0.1:8000/storage/${user?.foto}`} onClick={() => setModalProfile(true)} alt="" 
                                className="w-15 h-15 rounded-full"
                            />
                        ) : (
                            <img src="http://127.0.0.1:8000/img/profile.png" onClick={() => setModalProfile(true)} alt="" 
                                className="w-15 h-15"
                            />
                        )}
                    </button>
                </div>
            </div>

            {modalProfile && (
                <div className="fixed flex inset-0 bg-black/50 justify-center items-center z-10">
                    <form onSubmit={handleProfile}>
                        <div className={`bg-[#FEFEFE] rounded-lg w-[300px] md:w-[500px] h-full text-black p-6 space-y-4`}>
                            <div className="flex space-x-28 md:space-x-85">
                                <h1 className="font-bold">Data Siswa</h1>
                                <button className="w-5 h-5" onClick={() => {setModalProfile(false);handleClear()}}>
                                    <img src="http://127.0.0.1:8000/img/close.png" alt="" />
                                </button>
                            </div>
                            { step == 0 && (
                                <div className="space-y-3">
                                    <div className="w-full">
                                        <label>Nama Siswa</label>
                                        <input type="text" value={profile.nama ?? ""} placeholder={profile.nama ?? 'Belum di isi'}
                                            onChange={handleChange} name="nama"
                                            className="bg-gray-500 rounded-full w-full py-2 px-4"
                                        />
                                    </div>
                                    {role === 'siswa' && (
                                        <div className="w-full">
                                            <label>Data Nomor Induk Nasional</label>
                                            <input type="number" value={profile.nis ?? ""} placeholder={profile.nis ?? 'Belum di isi'}
                                                onChange={handleChange} name="nis"
                                                className="bg-gray-500 rounded-full w-full py-2 px-4 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" 
                                                readOnly
                                            />
                                        </div>
                                    )}
                                    {role === 'guru' && (
                                        <div className="w-full">
                                            <label>Data Nomor Induk Pegawai</label>
                                            <input type="number" value={profile.nip ?? ""} placeholder={profile.nip ?? 'Belum di isi'}
                                                onChange={handleChange} name="nip"
                                                className="bg-gray-500 rounded-full w-full py-2 px-4 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" 
                                            />
                                        </div>
                                    )}
                                    <div className="w-full">
                                        <label>Jenis Kelamin</label>
                                        <select name="gender" className="bg-gray-500 appearance-none rounded-full w-full p-2 md:pl-4"
                                            value={profile.gender ?? ""} onChange={handleChange} required
                                        >
                                            <option value={profile?.gender ?? ''} defaultValue={profile?.gender} hidden disabled>
                                                {profile?.gender ?? 'Pilih Gender'}
                                            </option>
                                            <option value="Laki-laki">Laki-laki</option>
                                            <option value="Perempuan">Perempuan</option>
                                        </select>
                                    </div>
                                    <div className="w-full">
                                        <label>Alamat</label>
                                        <input type="text" value={profile.alamat ?? ""} placeholder={profile.alamat ?? 'Belum di isi'}
                                            onChange={handleChange} name="alamat"
                                            className="bg-gray-500 rounded-full w-full py-2 px-4"
                                            required
                                        />
                                    </div>
                                    <div className="w-full">
                                        <label>Email</label>
                                        <input type="email" value={profile.email ?? ""} placeholder={profile.email ?? 'Belum di isi'}
                                            onChange={handleChange} name="email"
                                            className="bg-gray-500 rounded-full w-full py-2 px-4"
                                            required readOnly={role === 'siswa'}
                                        />
                                    </div>
                                    <div className="w-full">
                                        <label>Kontak</label>
                                        <input type="number" value={profile.kontak ?? ""} placeholder={profile.kontak ?? 'Belum di isi'}
                                            onChange={handleChange} name="kontak"
                                            className="bg-gray-500 rounded-full w-full py-2 px-4 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                            required
                                        />
                                    </div>
                                </div>
                            )}
                            { step == 1 && (
                                <div>
                                    <div className="relative w-full max-w-xs md:max-w-xl">
                                        <label>Ganti Foto Profile :</label>
                                        <input type="file" accept="image/" onChange={handleImage} 
                                            className="bg-gray-500 rounded-full w-full py-5 px-4"
                                        />
                                        {preview !== null && (
                                            <div className="relative">
                                                <img src={preview} alt="preview" className="w-full h-40 md:h-53 mt-3 rounded-lg object-cover"/>
                                                {image && (
                                                    <button type="button" onClick={imageClear} className="absolute top-20 md:top-27 transition-all duration-300 transfrom hover:shadow-lg hover:shadow-red-500/50 -translate-y-[1px] 
                                                        bg-gradient-to-t from-red-400 to-transparent w-full h-1/2 rounded-md pl-25 md:pl-0 md:justify-items-center pt-1">
                                                        <img src="http://127.0.0.1:8000/img/trash.png" className="w-10 h-10 transition-transform duration-300 transform hover:scale-140" alt="trash" />
                                                    </button>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ) }

                            <div className="flex mt-2 w-full space-x-14 md:space-x-63">
                                { step > 0 &&  (
                                    <div className="bg-green-500 rounded-full justify-end">
                                        <button className="rounded-full w-[100px] h-8" type="button" onClick={prev}>Prev</button>
                                    </div> 
                                )}
                                { step < 1 && (
                                    <div className="bg-green-500 rounded-full justify-end">
                                        <button className="rounded-full w-[100px] h-8" type="button" onClick={next} disabled={!isValid}>{isValid ? 'Next' : 'Tolong Isi Semua'}</button>
                                    </div>
                                )}
                                { step == 1 && (
                                    <div className={`bg-green-500 rounded-full w-full justify-end ${isDifference && !isEmpty == '' ? 'hidden' : ''} `}>
                                        <button className="rounded-full w-[100px] h-8" type="submit" disabled={isDifference == ''}>Save</button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </form>
                </div>
            )}

        </div>
    )
}