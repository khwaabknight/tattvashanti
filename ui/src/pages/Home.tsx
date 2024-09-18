import AddItems from "@/components/Home/AddItemsBar/AddItems"
import UserInfo from "@/components/Home/UserInfo"
import AllClients from "@/components/Home/AllClients"

function Home() {

  return (
    <div className='min-h-screen bg-gray-500 flex flex-col items-center py-10'>
      <div className="w-11/12 max-w-screen-xl flex flex-col gap-8">
        <UserInfo />
        <AddItems />
        <AllClients />
      </div>
    </div>
  )
}

export default Home