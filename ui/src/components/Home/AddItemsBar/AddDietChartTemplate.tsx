import {
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { useEffect, useState } from "react"
import api from "@/utils/axiosConfig"
import toast from "react-hot-toast"
import { CuisineType } from "@/types"
import DietChartTable from "../DietChartTable"
import convertArrayToStructuredDietChart from "@/utils/convertArrayToStructuredDietChart"
import convertStructuredDietChartToArray from "@/utils/convertStructuredDietChartToArray"



function AddDietChartTemplate() {
    const [allCuisines, setAllCuisines] = useState<CuisineType[]>([]);
    const [cuisine, setCuisine] = useState<string>('');
    const [deficit, setDeficit] = useState<string>('L1');

    useEffect(() => {
        api.get('/api/v1/cuisine').then(res => {
            setAllCuisines(res.data.data)
        }).catch(err => {
            console.log(err)
            toast.error('Failed to fetch cuisines')
        })
    }, [])

    const handleSubmit = (data:any) => {

        if(!cuisine) {
            toast.error('Please select a cuisine')
            return;
        }
        if(!deficit) {
            toast.error('Please select a deficit')
            return;
        }

        const res = convertStructuredDietChartToArray(data);
        api.post('/api/v1/baseDietChart',{
            cuisine: cuisine,
            deficitCaloriesLevel: deficit,
            items: res
        })
        .then(_ => {
            toast.success('Diet chart template added successfully')
        }).catch(err => {
            console.log(err)
            toast.error('Failed to add diet chart template')
        })
    }

  return (
    <div className="flex flex-col">
        <DialogHeader>
            <DialogTitle>Add Diet Chart Template</DialogTitle>
            <DialogDescription>
                Make changes to your profile here. Click save when you're done.
            </DialogDescription>
        </DialogHeader>
        <form className="grid gap-4 py-4 h-full">
            <div className="flex gap-5">
                <div className="flex flex-col gap-2">
                    <Label htmlFor="cuisine" className="">Cuisine</Label>
                    <Select  onValueChange={(value) => setCuisine(value)}>
                        <SelectTrigger className="col-span-3" id="cuisine">
                            <SelectValue placeholder="Select a cuisine" />
                        </SelectTrigger>
                        <SelectContent className="border border-slate-400">  
                            <SelectGroup defaultValue={cuisine} className="">
                                <SelectLabel>Cuisines</SelectLabel>
                                {
                                    allCuisines.map((item) => (
                                        <SelectItem key={item._id} value={item._id}>{item.name}</SelectItem>
                                    ))
                                }
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>
                <div className="flex flex-col gap-2">
                    <Label htmlFor="deficit" className="">Deficit</Label>
                    <Select  onValueChange={(value) => setDeficit(value)}>
                        <SelectTrigger className="col-span-3" id="deficit">
                            <SelectValue placeholder="Select a deficit" defaultValue={deficit} />
                        </SelectTrigger>
                        <SelectContent className="border border-slate-400">  
                            <SelectGroup defaultValue={deficit} className="">
                                <SelectLabel>Deficit</SelectLabel>
                                <SelectItem value="L1">L1</SelectItem>
                                <SelectItem value="L2">L2</SelectItem>
                                <SelectItem value="L3">L3</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>
            </div>
            <DietChartTable 
                initialDietChartArray={convertArrayToStructuredDietChart(Array(49).fill(null))}
                submitHandler={handleSubmit}
                isBaseDietChart
                submitDisabled={cuisine === '' || deficit === ''}
            />
        </form>
    </div>
  )
}

export default AddDietChartTemplate