import { RootState } from '@/store/store';
import { DietChartItemType, DishItemPopulatedType, DishType } from '@/types'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { timeOfDay } from '@/assets/constants';
import { Textarea } from '../ui/textarea';
import { TbXboxXFilled } from "react-icons/tb";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { BiSolidDish } from "react-icons/bi";
import AddDishForm from './AddItemsBar/AddDishForm';

type DishDisplayProps = {
  meal: DietChartItemType;
  row: number;
  col: number;
  editItem: (row:number,col:number,data:any) => void;
}

const days = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'];

function DishDisplay({meal,row,col,editItem}: DishDisplayProps) {
  const [mealDishes, setMealDishes] = useState<DishItemPopulatedType[]>(meal?.dishes as DishItemPopulatedType[] ?? []);
  const [calories, setCalories] = useState<number>(0);

  const addDishToMeal = (dish:DishItemPopulatedType) => {
    const newMealDishes = [...mealDishes,dish];
    const newCalories = calories + (dish.dish.calories*dish.quantity);
    const _id = meal._id ? meal._id : undefined;
    setMealDishes(newMealDishes);
    setCalories(newCalories);

    editItem(row,col,{dishes:newMealDishes,calories:newCalories,_id});
  }

  const removedish = (index:number) => {
    const dish = mealDishes[index];
    const updatedCalories = calories - (dish.dish.calories*dish.quantity);
    setCalories(updatedCalories);

    const newDishes = mealDishes.filter((_,i) => i !== index);
    setMealDishes(newDishes);
    editItem(row,col,{dishes:newDishes,calories:updatedCalories,_id:meal._id});
  }

  useEffect(() => {
    let totalCalories = 0;
    mealDishes.forEach((dish) => {
      totalCalories += dish.dish.calories;
    })
    setCalories(totalCalories);
  },[])

  return (
    <div className='w-full'>
      <div className='flex flex-col items-start gap-2 w-full rounded-md border border-slate-400 bg-white px-3 py-1.5 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-transparent disabled:cursor-not-allowed disabled:opacity-50 h-fit'>
        {
          mealDishes.length > 0 ?
          mealDishes.map((item,index) => {

            if(item.dish === null) return null;

            return <div key={item.dish._id + index} className='bg-gray-600 text-white rounded-full flex items-center gap-2 pl-5 py-1'>
              <div className='text-center'>
                <p>{item.dish.name}({item.dish.calories} kcal)</p>
                <p>{item.quantity} {item.unitOfMeasurement} - {item.grams}g</p>
              </div>
              <Button 
                type='button' 
                onClick={() => removedish(index)}
                className='text-lg rounded-full bg-transparent h-10 aspect-square p-2 hover:bg-transparent hover:text-red-500'
              >
                <TbXboxXFilled/>
              </Button>
            </div>
        }) : <span className="text-gray-500">Select dishes</span>
        }
      </div>
      {mealDishes.length > 0 && <p className='text-right mt-2'>{calories} calories</p>}
      <div className='flex justify-end gap-2 mt-2'>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant={'primary'}>Add Dish</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add dish to {days[row]} - {timeOfDay[col].title}({timeOfDay[col].time})</DialogTitle>
              <DialogDescription>
                Make changes to the form below. Click save when you're done.
              </DialogDescription>
            </DialogHeader>
            <AddDishInDietChartForm addDishToMeal={addDishToMeal}/>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}

function AddDishInDietChartForm({
  addDishToMeal
} : {
  addDishToMeal:(dish:DishItemPopulatedType) => void
}) {
  const allDishes = useSelector((state:RootState) => state.dishes.dishes);
  const [open, setOpen] = useState(false);
  const [dishData, setDishData] = useState<DishItemPopulatedType>({
    dish: allDishes[0],
    quantity: 1,
    unitOfMeasurement: allDishes[0].unitOfMeasurement,
    grams: allDishes[0].grams,
    remarks: ''
  })

  const dishChangeHandler = (value:string) => {
    const dish : DishType = JSON.parse(value);
    setDishData({
      ...dishData,
      dish:dish,
      unitOfMeasurement: dish.unitOfMeasurement,
      grams:dish.grams
    });
    setOpen(false);
  }

  const changeHandler = (e:React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const {name,value} = e.target;
    if(name === 'quantity'){
      let quantity = parseInt(value);
      if(isNaN(quantity)) {
        setDishData({...dishData,quantity:0});
        return;
      }
      setDishData({
        ...dishData,
        quantity,
        grams: quantity * dishData.dish.grams
      });
    }else{
      setDishData({...dishData,[name]:value})
    }
  }

  const submitHandler = (e:React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    addDishToMeal(dishData);
  }

  return (
    <form onSubmit={submitHandler}>
      <div className="grid gap-4 py-4">
        <div>
          <Label htmlFor="dish" className="">Dish</Label>
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={open}
                className="w-full justify-between border border-slate-400"
              >
                {dishData.dish ? dishData.dish.name : "Select dish..."}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="p-0 w-96">
              <Command>
                <CommandInput placeholder="Search framework..." className="h-10" />
                <CommandList>
                  <CommandEmpty>No framework found.</CommandEmpty>
                  <CommandGroup>
                    {allDishes.map((dish,index) => (
                      <CommandItem
                        key={dish._id + index}
                        value={dish.name}
                        onSelect={() => dishChangeHandler(JSON.stringify(dish))}
                      >
                        {dish.name}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>

        <div className='grid grid-cols-2 gap-2'>

          <div>
            <Label htmlFor="quantity">Quantity</Label>
            <Input type="number" id="quantity" name="quantity" placeholder="Enter quantity" value={dishData.quantity} onChange={changeHandler}/>
          </div>
          <div>
            <Label htmlFor="unitOfMeasurement">Unit of Measurement</Label>
            <Input type="text" id="unitOfMeasurement" name="unitOfMeasurement" placeholder="Enter unit of measurement" value={dishData.unitOfMeasurement} onChange={changeHandler}/>
          </div>

        </div>
        

        <div>
          <Label htmlFor="grams">Grams</Label>
          <Input type="number" id="grams" name="grams" placeholder="Enter quantity in grams" value={dishData.grams} onChange={changeHandler}/>
        </div>

        <div>
          <Label htmlFor="remarks">Remarks</Label>
          <Textarea id="remarks" name="remarks" placeholder="Enter any note or remarks" value={dishData.remarks} onChange={changeHandler} className=' min-h-16'/>
        </div>
      </div>

      <DialogFooter className='grid grid-cols-2 gap-3'>
        <DialogClose asChild>
          <Button type="button">Cancel</Button>
        </DialogClose>
        <DialogClose asChild>
          <Button type="submit">Save</Button>
        </DialogClose>
      </DialogFooter>
      <div className='relative py-6'>
        <div className='h-[1px] bg-slate-300' />
        <p className=' bg-white p-2 absolute left-1/2 -translate-y-1/2 -translate-x-1/2 text-center'>OR</p>
      </div>

      {/* Add Dish dialog */}
      <p className='text-center text-gray-400 mb-2'>Want to create a new dish to choose ?</p>
      <Dialog>
          <DialogTrigger asChild>
              <Button className='gap-3 w-full'>
                  <BiSolidDish />
                  <p>Create Dish</p>
              </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
              <AddDishForm />                
          </DialogContent>
      </Dialog>
    </form>
  )
}

export default DishDisplay