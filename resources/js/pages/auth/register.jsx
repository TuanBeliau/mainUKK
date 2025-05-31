import { useState } from "react";
import { router, useForm } from "@inertiajs/react";
import axios from 'axios';
import Notification from "../../components/notification";

export default function Login() {
    const {data, setData, post, processing, errors} = useForm({
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
    const [visible, setVisible] = useState(false);

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
                localStorage.setItem('token', response.data.token);
                console.log(response.data.token)
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

    return (
        <div className="relative bg-gradient-to-br from-blue-500 via-blue-300 to-blue-100  w-screen h-screen justify-items-center">
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-[#FEFEFE] text-black min-w-[250px] min-h-[350px] md:min-w-[400px] md:min-h-[490px] rounded-lg">
                <h1 className="text-center text-[30px] mt-10 font-bold">Register</h1>
                <form onSubmit={submit} className="ml-3 md:mr-3 mt-5 md:mt-3 space-y-3 md:space-y-4">
                    <div className="relative md:flex md:flex-col">
                        <label>Nama Siswa</label>
                        <input 
                            type="text" 
                            value={data.nama}
                            onChange={(e) => setData('nama', e.target.value)}
                            required
                            className="bg-[#DFF1FF] rounded-md min-w-[220px] md:max-w-[376px] py-1 pl-3 focus:outline-none"
                        />
                    </div>

                    <div className="relative md:flex md:flex-col">
                        <label>Nomor Induk Nasional</label>
                        <input 
                            type="number" 
                            maxLength='5'
                            value={data.nis}
                            onChange={(e) => setData('nis', e.target.value)}
                            required
                            className="bg-[#DFF1FF] rounded-md min-w-[220px] md:max-w-[376px] py-1 pl-3 focus:outline-none"
                        />
                    </div>

                    <div className="relative md:flex md:flex-col">
                        <label>Email</label>
                        <input 
                            type="text" 
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            required
                            className="bg-[#DFF1FF] rounded-md min-w-[220px] md:max-w-[376px] py-1 pl-3 focus:outline-none"
                        />
                    </div>

                    <div className="relative md:flex md:flex-col">
                        <label>Password</label>
                        <input
                            type={visible ? 'text' : 'password' }
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
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
                        {processing? 'Logging in...' : 'Register'}
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