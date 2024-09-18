import React, { useEffect } from 'react'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
  DialogClose,
  DialogFooter,
} from "@/components/ui/dialog"
import { DietChartTemplateType } from '@/types';
import DishDisplay from './DishDisplay';
import { Button } from '../ui/button';
import api from '@/utils/axiosConfig';
import toast from 'react-hot-toast';
import { timeOfDay } from '@/assets/constants';

function DietChartTable({
  dietChartId,
  initialDietChartArray,
  submitHandler,
  isBaseDietChart=false,
  submitDisabled=false,
  isEditBaseDietChart=false
}: {
  dietChartId?:string;
  initialDietChartArray: DietChartTemplateType[];
  submitHandler:(data:DietChartTemplateType[]) => void;
  isBaseDietChart?:boolean;
  submitDisabled?:boolean;
  isEditBaseDietChart?: boolean;
}) {
    const [arr, setArr] = React.useState(initialDietChartArray);

    const [totalCaloriesPerDay, setTotalCaloriesPerDay] = React.useState([0,0,0,0,0,0,0]);
    const [totalCaloriesOfWeek, setTotalCaloriesOfWeek] = React.useState(0);
    

    useEffect(() => {
      let newTotalCaloriesPerDay = [0,0,0,0,0,0,0];
      let newTotalCaloriesOfWeek = 0;
      arr.forEach((item,index) => {
        let totalCaloriesPerDayItem = 0;
        item.meals.forEach((meal) => {
          totalCaloriesPerDayItem += meal.calories;
        })
        newTotalCaloriesPerDay[index] = totalCaloriesPerDayItem;
        newTotalCaloriesOfWeek += totalCaloriesPerDayItem;
      })
      setTotalCaloriesPerDay(newTotalCaloriesPerDay);
      setTotalCaloriesOfWeek(newTotalCaloriesOfWeek);
    },[arr])

    const editItem = (row:number,col:number,data:any) => {      
      const newArr = [...arr];
      if(isBaseDietChart) {
        newArr[row].meals[col] = data;
        setArr(newArr);
      }else{
        if(data._id) {
          api.put(`api/v1/dietChart/item/${data._id}`,data)
            .then((res) => {
              newArr[row].meals[col] = res.data.dietChartItem;
              setArr(newArr);
            }).catch((err) => {
              console.log(err)
              toast.error('Error updating diet chart item');
            })
        }else{
          api.post('api/v1/dietChart/item',data)
            .then((res) => res.data.dietChartItem)
            .then((result) => {

              if(isEditBaseDietChart){
                api.put(`api/v1/baseDietChart/addItem`,{
                  dietChartId,
                  itemId: result._id,
                  index: row*7 + col
                }).then(_ => {
                  newArr[row].meals[col] = result;
                  setArr(newArr);
                }).catch((err) => {
                  console.log(err)
                  toast.error('Error updating diet chart item');
                })
              }else{
                api.put(`api/v1/dietChart/addItem`,{
                  dietChartId,
                  itemId: result._id,
                  index: row*7 + col
                }).then(_ => {
                  newArr[row].meals[col] = result;
                  setArr(newArr);
                }).catch((err) => {
                  console.log(err)
                  toast.error('Error updating diet chart item');
                })
              }              
            })
            .catch((err) => {
              console.log(err)
              toast.error('Error creating diet chart item');
            })
        }
      }
    }
  return (
    <div>
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead className='p-0 bg-gray-950'></TableHead>
                    {
                        timeOfDay.map((item) => (
                            <TableHead key={item.title} className='p-0 bg-gray-950 border-l border-slate-400'>
                                <div className="flex flex-col items-center">
                                    <p className='whitespace-nowrap font-semibold text-lg text-gray-100'>{item.title}</p>
                                    <p className='whitespace-nowrap text-gray-50'>{item.time}</p>
                                </div>
                            </TableHead>
                        ))
                    }
                    <TableHead className='p-0 bg-gray-950 border-l border-slate-400'>
                      <div className='text-center w-full px-3'>
                        <p className='font-semibold text-lg text-gray-100'>Total</p>
                        <p className='text-gray-50'>{totalCaloriesOfWeek}</p>
                      </div>
                    </TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {arr.map((item,row) => (
                    <TableRow key={item.day}>
                        <TableHead className="font-semibold text-lg text-gray-100 bg-gray-950 p-0 text-center">{item.day}</TableHead>
                        {
                          item.meals.map((meal,col) => (
                            <TableCell key={col} className='border-l border-slate-200'>
                              <DishDisplay meal={meal} row={row} col={col} editItem={editItem}/>
                            </TableCell>
                          ))
                        }
                        <TableCell className='text-center border-l border-slate-200'>{totalCaloriesPerDay[row]}</TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
        {
          isBaseDietChart && (
            <DialogFooter>
              <DialogClose asChild>
                <Button 
                  type="button"
                  variant={'primary'}
                  onClick={() => submitHandler(arr)}
                  disabled={submitDisabled}
                  className=''
                >Create</Button>
              </DialogClose>
            </DialogFooter>
          )
        }
    </div>
  )
}

export default DietChartTable