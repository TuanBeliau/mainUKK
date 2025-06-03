import { useEffect, useState } from "react";
import axios from 'axios';
import Notification from "../../components/notification";

export default function Login() {
    const [data, setData] = useState({
        nama:'',
        nis:'',
        email:'',
        password:''
    });
    const [notif, setNotif] = useState({
        open:false,
        message:'',
        severity:'success'
    });
    const [siswa, setSiswa] = useState([]);
    const [showList, setShowList] = useState(false);
    const [visible, setVisible] = useState(false);
    const getDataSiswa = async () => {
        const response = await axios.get('/api/data/siswa/register')

        if (response.data.success) {
            setSiswa(response.data.siswa);
        }
    } 

    const submit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('/api/register', {
                nama : data.nama,
                email : data.email,
                nis : data.nis,
                password : data.password,
            });

            if (response.data.success) {
                sessionStorage.setItem('token', response.data.token);
                
                sessionStorage.setItem('role', response.data.role);
                window.location.href = '/siswa/dashboard';
            }
        } catch (error) {
            const errors = error.response?.data?.errors;
            const message = error.response?.data?.message || 'Something went wrong';

            let errorMsg = message;

            if (errors && typeof errors === 'object') {
                errorMsg = Object.values(errors).flat().join('\n');
            }
            
            setNotif({
                open:true,
                message: errorMsg,
                severity: 'error'
            });
        }
    }

    const filteredData = siswa.filter((item) =>
        item.email.toLowerCase().includes((data.email || '').toLowerCase())
    );

    const handleChangeInput = (e) => {
        const {name, value} = e.target;
        setData((prev) => ({
            ...prev,
            [name] : value
        }))
    }

    const handleSelectedItem = (item) => {
        setData((prev) => ({
            ...prev,
            email: item.email,
            nis: item.nis
        }));

        setShowList(false);
    }

    useEffect(() => {
        getDataSiswa();

        const interval = setInterval(getDataSiswa, 60000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="relative bg-gradient-to-br from-blue-500 via-blue-300 to-blue-100  w-screen h-screen justify-items-center">
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-[#FEFEFE] text-black min-w-[250px] min-h-[350px] md:min-w-[400px] md:min-h-[430px] rounded-lg">
                <h1 className="text-center text-[30px] mt-10 font-bold">Register</h1>
                <form onSubmit={submit} className="ml-3 md:mr-3 mt-5 md:mt-3 space-y-3 md:space-y-4" autoComplete="off">
                    <div className="relative md:flex md:flex-col">
                        <label>Email Siswa</label>
                        <label className="text-sm text-gray-500">{`(Ketik Lalu Email dengan Format nis@sija.com)`}</label>
                        <input type="text" name="email"
                            value={data.email} 
                            onChange={(e) => {handleChangeInput(e); setShowList(true)}}
                            className="bg-[#DFF1FF] rounded-md min-w-[220px] md:max-w-[376px] py-1 pl-3 focus:outline-none"
                            required
                            readOnly
                            onFocus={(e) => e.target.removeAttribute('readOnly')}
                        />
                        {showList && filteredData.length > 0 && (
                            <ul className="absolute bg-white w-[250px] mt-20 rounded-lg max-h-40 overflow-y-auto shadow z-10">
                                {filteredData.slice(0, 3).map((item) => (
                                    <li
                                        key={item.id}
                                        onClick={() => handleSelectedItem(item)}
                                        className="px-4 py-2 hover:bg-blue-100 cursor-pointer"
                                    >
                                        {item.email}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    <div className="relative md:flex md:flex-col">
                        <label>Nama Siswa</label>
                        <input 
                            type="text" name="nama"
                            value={data.nama}
                            onChange={handleChangeInput}
                            required
                            className="bg-[#DFF1FF] rounded-md min-w-[220px] md:max-w-[376px] py-1 pl-3 focus:outline-none"
                        />
                    </div>

                    <div className="relative md:flex md:flex-col">
                        <label>Password</label>
                        <input
                            type={visible ? 'text' : 'password' } name="password"
                            value={data.password}
                            onChange={handleChangeInput}
                            required
                            className="bg-[#DFF1FF] rounded-md min-w-[220px] md:max-w-[376px] py-1 pl-3 focus:outline-none"
                        />
                        <button 
                            type="button"
                            className="absolute right-6 top-1/2"
                            onClick={() => setVisible(!visible)}
                        >
                            {visible ? 'see' : 'dont'}    
                        </button>
                    </div>
                    <button onClick={() => {
                        window.location.href = '/'
                    }} type="button" className="text-[15px] text-right w-1/1 pr-5 text-blue-500 mb-0">Already Have Account?</button>
                    <button 
                        type="submit"
                        className="  w-[220px] md:w-full md:mr-2 py-2 mt-3 bg-gradient-to-br from-blue-500 via-blue-300 to-blue-100 hover:bg-black rounded-lg"
                    >
                        Register
                    </button>
                </form>
            </div>

            <Notification
                open={notif.open}
                message={notif.message}
                severity={notif.severity}
                onClose={() => setNotif({...notif, open:false})}
            />
        </div>
    );
}