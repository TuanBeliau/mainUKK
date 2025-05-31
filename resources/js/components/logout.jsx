import axios from 'axios';

export default function Logout() {
    // Logout
    const handleLogout = async (e) => {
        const token = localStorage.getItem('token');

        try {
            await axios.post('/api/logout', {}, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });

            localStorage.removeItem('token');

            window.location.href = '/';
        } catch (error) {
            console.error("gagal", error);
        }
    }

    return (
        <div className="bg-red-500 hover:bg-red-700 rounded-md w-[100px] p-1 ml-[270px] shadow-[3px_3px_10px_rgba(0,0,0,0.5)] md:ml-[950px]">
            <button className="ml-5" onClick={handleLogout}>Logout</button>
        </div>
    )
}