import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { format } from "date-fns"
import { RootState } from '@/store/store'
import { useState } from 'react'
import { useSelector } from 'react-redux'
import { LuCalendarSearch } from "react-icons/lu";

type DietChartParameterType = {
    cuisine: string,
    deficit: string,
    startDate: Date,
    endDate: Date
}

type Step1FormProps = {
    createDietChart: (dietChartParameters:DietChartParameterType) => void
}

function Step1Form({createDietChart}: Step1FormProps) {
    const {cuisines} = useSelector((state:RootState) => state.cuisines);

    const [dietChartParameters, setDietChartParameters] = useState({
        cuisine: '',
        deficit: '',
        startDate: new Date(),
        endDate: new Date(Date.now() + 6*24*60*60*1000)
    });

    const changeCuisine = (value:string) => {
        setDietChartParameters({
            ...dietChartParameters,
            cuisine: value
        })
    }

    const changeDeficit = (value:string) => {
        setDietChartParameters({
            ...dietChartParameters,
            deficit: value
        })
    }

    const setStartDate = (date:Date) => {
        if(!date) return;
        setDietChartParameters({
            ...dietChartParameters,
            startDate: date,
            endDate: new Date(date.getTime() + 6*24*60*60*1000)
        })
    }

    const handleCreateDietChart = () => {
        createDietChart(dietChartParameters)
    }

  return (
    <div className="mt-5">
        <h2 className="text-xl font-semibold">Step 1: Choose Diet Chart parameters : </h2>
        <form>
            <Label htmlFor="cuisine">Cuisine</Label>
            <Select onValueChange={changeCuisine}>
                <SelectTrigger>
                    <SelectValue placeholder="Select a cuisine" />
                </SelectTrigger>
                <SelectContent >
                    {
                        cuisines.map((cuisine) => (
                            <SelectItem key={cuisine._id} value={cuisine._id}>{cuisine.name}</SelectItem>
                        ))
                    }
                </SelectContent>
            </Select>

            <Label htmlFor="deficit">Deficit Calories</Label>
            <Select onValueChange={changeDeficit}>
                <SelectTrigger>
                    <SelectValue placeholder="Select a deficit" />
                </SelectTrigger>
                <SelectContent >
                    <SelectItem value="L1">L1</SelectItem>
                    <SelectItem value="L2">L2</SelectItem>
                    <SelectItem value="L3">L3</SelectItem>
                </SelectContent>
            </Select>

            <Popover>
                <PopoverTrigger asChild>
                    <Button
                        variant={"primary"}
                        className={cn(
                            "w-[240px] justify-center text-left font-normal my-5",
                            !dietChartParameters.startDate && "text-muted-foreground"
                        )}
                    >
                    <LuCalendarSearch className="mr-2 h-7 w-7" />
                    {dietChartParameters.startDate ? format(dietChartParameters.startDate, "PPP") : <span>Pick a date</span>}

                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                    mode="single"
                    selected={dietChartParameters.startDate}
                    onSelect={(x) => setStartDate(x as Date)}
                    initialFocus
                    />
                </PopoverContent>
            </Popover>
            
        </form>
        <Button type='button' onClick={handleCreateDietChart} className="bg-blue-500 text-white px-3 py-1 rounded-lg">Next</Button>
    </div>
  )
}

export default Step1Form