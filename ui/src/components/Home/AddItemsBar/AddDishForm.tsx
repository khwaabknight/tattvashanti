import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    DialogClose,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import api from "@/utils/axiosConfig"
import { CuisineType } from "@/types"
import toast from "react-hot-toast"
import { useDispatch } from "react-redux"
import { addDish } from "@/store/features/dishesSlice"

const timeOfDay = [
    {
        name: 'Early Morning',
        value: 'early morning'
    },
    {
        name: 'Breakfast',
        value: 'breakfast'
    },
    {
        name: 'Mid Morning',
        value: 'mid morning'
    },
    {
        name: 'Lunch',
        value: 'lunch'
    },
    {
        name: 'Evening',
        value: 'evening'
    },
    {
        name: 'Dinner',
        value: 'dinner'
    },
    {
        name: 'Post Dinner',
        value: 'post dinner'
    }
]


function AddDishForm() {
    const [time, setTime] = useState([true,false,false,false,false,false,false]);
    const [allCuisines, setAllCuisines] = useState<CuisineType[]>([]);

    const dispatch = useDispatch();

    const [dishForm, setDishForm] = useState({
        name: '',
        cuisine: '',
        calories: 0,
        unitOfMeasurement: '',
        grams: 0,
    });

    const changeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        setDishForm({
            ...dishForm,
            [e.target.name]: e.target.value
        })
    }

    const checkChangeHandler = (index: number) => {
        let temp = [...time];
        temp[index] = !temp[index];
        setTime(temp);
    }

    const cuisineHandler = (value: string) => {
        setDishForm({
            ...dishForm,
            cuisine: value
        })
    }


    useEffect(() => {
        api.get('/api/v1/cuisine').then(res => {
            setAllCuisines(res.data.data)
        }).catch(err => {
            console.log(err)
            toast.error('Failed to fetch cuisines')
        })
    }, [])

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const timeInput = timeOfDay.filter((_, index) => time[index] === true).map(item => item.value);

        api.post('/api/v1/dish', {...dishForm, time: timeInput})
        .then(res => {
            dispatch(addDish(res.data.data))
            toast.success('Dish added successfully')
        }).catch(err => {
            console.log("Failed to add dish",err)
            toast.error('Failed to add dish')
        })
    }

  return (
    <div>
        <DialogHeader>
            <DialogTitle>Add Dish</DialogTitle>
            <DialogDescription>
                Make changes to the form to add dish. Click save when you're done.
            </DialogDescription>
        </DialogHeader>
        <form className="grid gap-4 py-4" onSubmit={handleSubmit}>
            <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">Name</Label>
                <Input type="text" id="name" name="name" placeholder="Add Dish name" value={dishForm.name} className="col-span-3" onChange={changeHandler}/>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="cuisine" className="text-right">Cuisine</Label>
                <Select  onValueChange={cuisineHandler}>
                    <SelectTrigger className="col-span-3" id="cuisine">
                        <SelectValue placeholder="Select cuisine" />
                    </SelectTrigger>
                    <SelectContent className="border border-slate-400">  
                        <SelectGroup defaultValue={dishForm.cuisine} className="">
                            {
                                allCuisines.map((item) => (
                                    <SelectItem key={item._id} value={item._id}>{item.name}</SelectItem>
                                ))
                            }
                        </SelectGroup>
                    </SelectContent>
                </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="time" className="text-right">Time of the Day</Label>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <div className="flex flex-wrap items-center gap-2 w-full rounded-md border border-slate-400 bg-white px-3 py-1.5 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-transparent disabled:cursor-not-allowed disabled:opacity-50 col-span-2">
                            {
                                time.some((val) => val === true) ? timeOfDay.map((item, index) => (
                                    time[index] === true && <span key={index} className="bg-gray-300 px-3 py-1 rounded-md whitespace-nowrap">{item.name}</span> 
                                )) : <span className="text-gray-500">Select time of day</span>
                            }
                        </div>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-80 py-5">
                        <DropdownMenuLabel>Select multiple time of day</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        {
                            timeOfDay.map((item, index) => (
                                <DropdownMenuCheckboxItem 
                                    key={index} 
                                    checked={time[index]}
                                    onCheckedChange={() => checkChangeHandler(index)}
                                >
                                    <span className="">{item.name}</span>
                                </DropdownMenuCheckboxItem>
                            ))
                        }
                    </DropdownMenuContent>
                </DropdownMenu>
                <Button type="button" onClick={()=>setTime(Array(7).fill(false))}>
                    Clear
                </Button>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="calories" className="text-right">Calories</Label>
                <Input type="number" id="calories" name="calories" placeholder="Add calories" value={dishForm.calories} className="col-span-3" onChange={changeHandler}/>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="unitOfMeasurement" className="text-right">Unit of Measurement</Label>
                <Input type="text" id="unitOfMeasurement" name="unitOfMeasurement" placeholder="Add unit of measurement" value={dishForm.unitOfMeasurement} className="col-span-3" onChange={changeHandler}/>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="grams" className="text-right">Grams</Label>
                <Input type="number" id="grams" name="grams" placeholder="Add grams" value={dishForm.grams} className="col-span-3" onChange={changeHandler}/>
            </div>
            <DialogFooter>
                <DialogClose>
                    <Button type="submit">Save changes</Button>
                </DialogClose>
            </DialogFooter>
        </form>
    </div>
  )
}

export default AddDishForm