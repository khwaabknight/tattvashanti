import api from "@/utils/axiosConfig"
import { useEffect, useState } from "react"
import AssignDietChartButton from "./AssignDietChartModal/AssignDietChartButton";
import { ClientType } from "@/types";
import { Input } from "../ui/input";
import { ImSearch } from "react-icons/im";

function AllClients() {
  const [allClients, setAllClients] = useState<ClientType[]>([]);
  const [clients, setClients] = useState<ClientType[]>([]);
  const [clientQuery, setClientQuery] = useState<string>('');
  useEffect(() => {
    api.get('api/v1/user')
      .then((res) => {
        setClients(res.data.users)
        setAllClients(res.data.users)
      })
      .catch((err) => {
        console.log(err)
      })
  }, [])

  const searchClients = (e: React.ChangeEvent<HTMLInputElement>) => {
    setClientQuery(e.target.value);
    const newClients = allClients.filter((client) => {
      return client.name.toLowerCase().includes(e.target.value.toLowerCase()) || client.email.toLowerCase().includes(e.target.value.toLowerCase())
    })
    setClients(newClients)
  }
  return (
    <div className="border rounded-lg border-gray-300 bg-white flex flex-col py-5 px-8 gap-3">
      <div className="relative">
        <ImSearch className="absolute top-[50%] text-slate-500 translate-x-1/2 -translate-y-1/2 h-7 w-7"/>
        <Input type="text" placeholder="Search Clients by Name or Email" value={clientQuery} onChange={searchClients} className="bg-sky-100 py-3 h-fit text-lg pl-14"/>
      </div>
      <hr className="border border-gray-300 my-2"/>
      {
        clients.map((client: ClientType) => {
          return (
            <div key={client._id} className="flex justify-between items-center gap-3 w-full border border-gray-400 p-3">
              <div>
                <h1 className="text-lg font-semibold">{client.name}</h1>
                <p className="text-gray-500">{client.email}</p>
              </div>
              <AssignDietChartButton client={client} />
            </div>
          )
        })
      }
    </div>
  )
}

export default AllClients