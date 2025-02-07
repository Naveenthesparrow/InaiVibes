import React, { useState, useEffect } from 'react';
import roomDetails from '../datas/roomDetails';
import userDatas from '../datas/userDetails';

function UserDetails() {
    const [userDetails, setUserDetails] = useState([]);
    const [roomDatas, setRoomDatas] = useState({});

    useEffect(() => {
        setUserDetails(userDatas);
        setRoomDatas(roomDetails);
    }, []);

    const getUserById = (userId) => userDetails.find(user => user.user_id === userId);

    const host = getUserById(roomDatas?.host?.user_id);
    const coHosts = roomDatas?.co_hosts?.map(coHost => getUserById(coHost.user_id)).filter(Boolean) || [];
    const members = roomDatas?.members?.map(member => getUserById(member.user_id)).filter(Boolean) || [];

    const usersCount = () => {
        return (host ? 1 : 0) + coHosts.length + members.length;
    };

    const truncateName = (name, maxLength = 13) => {
        return name.length > maxLength ? name.slice(0, maxLength) + "..." : name;
    };

    const participants = [
        host && { id: host.user_id, name: truncateName(host.name), avatar: host.profile, role: 'Host', isHost: true },
        ...coHosts.map(cohost => ({ id: cohost.user_id, name: truncateName(cohost.name), avatar: cohost.profile, role: 'Co-host', isHost: false })),
        ...members.map(member => ({ id: member.user_id, name: truncateName(member.name), avatar: member.profile, role: 'Member', isHost: false }))
    ].filter(Boolean);

    return (
        <div>
            <div className=''>
                <div className='flex items-center ml-20'>
                    {host && (
                        <div className='relative left-[30px]'>
                            <img className='h-[80px] w-[80px] rounded-full' src={host.profile || "default-image.jpg"} alt={host.name} />
                        </div>
                    )}
                    {coHosts.length > 0 && (
                        <div>
                            <img className='h-[80px] w-[80px] rounded-full' src={coHosts[0]?.profile || "default-image.jpg"} alt={coHosts[0]?.name} />
                        </div>
                    )}
                </div>
                <div className='flex flex-col w-[350px] items-center mt-2'>
                    <h1 className='font-bold self-center text-[1.5rem]'>{host?.name} 's Room</h1>
                    <p className='text-[#98A1B8] text-[1rem]'>{usersCount()} Members</p>
                </div>
            </div>
            <div className="mt-1 ml-4">
                <div className="w-[320px] max-w-md p-4">
                <div className="space-y-3">
    {participants.map((participant) => (
        <div 
            key={participant.id} 
            className="flex items-center justify-between rounded-2xl p-1 group hover:bg-gray-800 transition"
        >
            <div className="flex items-center gap-3">
                <div className="relative w-10 h-10">
                    <img 
                        src={participant.avatar || "/placeholder.svg"} 
                        alt={participant.name} 
                        className="rounded-full object-cover w-full h-full" 
                    />
                </div>
                <div>
                    <h3 className="text-black group-hover:text-white font-semibold transition">
                        {participant.name}
                    </h3>
                    <p className="text-gray-400 text-sm group-hover:text-gray-300 transition">
                        {participant.role}
                    </p>
                </div>
            </div>
            <button
                className={`px-2  rounded-full text-sm font-medium transition
                    ${participant.isHost 
                        ? 'bg-black text-white border border-white/20 group-hover:bg-white group-hover:text-black' 
                        : 'bg-black text-white border border-white/20 group-hover:bg-white group-hover:text-black'
                    }`}
            >
                {participant.isHost ? 'Exit' : 'Remove'}
            </button>
        </div>
    ))}
</div>

                </div>
            </div>
        </div>
    );
}

export default UserDetails;