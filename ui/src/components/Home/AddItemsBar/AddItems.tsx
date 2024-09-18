import { Button } from '@/components/ui/button';
import { BiSolidDish } from "react-icons/bi";
import { MdAddBusiness } from "react-icons/md";
import { GrTemplate } from "react-icons/gr";
import { TfiReload } from "react-icons/tfi";
import {
    Dialog,
    DialogContent,
    DialogTrigger,
} from "@/components/ui/dialog"
import AddDishForm from './AddDishForm';
import AddCuisineForm from './AddCuisineForm';
import AddDietChartTemplate from './AddDietChartTemplate';
import api from '@/utils/axiosConfig';
import { Link } from 'react-router-dom';

function AddItems() {

    const updateUsers = () => {
        api.get('api/v1/user/sheets')
          .then(_ => {
            window.location.reload()
          })
          .catch((err) => {
            console.log(err)
          })
    }

  return (
    <div className='border rounded-lg border-gray-300 bg-white py-5 px-8 flex justify-between items-center'>
        <div className='flex items-center gap-3'>
            {/* Add Dish dialog */}
            <Dialog>
                <DialogTrigger asChild>
                    <Button className='gap-3'>
                        <BiSolidDish />
                        <p>Create Dishes</p>
                    </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                    <AddDishForm />                
                </DialogContent>
            </Dialog>

            {/* Add Cuisine dialog */}
            <Dialog>
                <DialogTrigger asChild>
                    <Button className='gap-3'>
                        <MdAddBusiness />
                        <p>Create Cuisine</p>
                    </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                    <AddCuisineForm />
                </DialogContent>
            </Dialog>

            {/* Add Diet Chart Template dialog */}
            <Dialog>
                <DialogTrigger asChild>
                    <Button className='gap-3'>
                        <GrTemplate />
                        <p>Create Diet Chart Template</p>
                    </Button>
                </DialogTrigger>
                <DialogContent className="w-[90vw] max-h-[100vh] max-w-screen-2xl overflow-y-auto">
                    <AddDietChartTemplate />
                </DialogContent>
            </Dialog>
        </div>

        <Link to='/diet-chart-templates' className='text-blue-500 font-bold'>View Diet Chart Templates</Link>

        <div>
            <Button size={'icon'} onClick={updateUsers}>
                <TfiReload className='font-bold'/>
            </Button>

        </div>
    </div>
  )
}

export default AddItems