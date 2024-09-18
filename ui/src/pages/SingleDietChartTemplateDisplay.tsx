import { DietChartTemplateType, CuisineType, DishItemPopulatedType } from '@/types';
import api from '@/utils/axiosConfig'
import convertArrayToStructuredDietChart from '@/utils/convertArrayToStructuredDietChart';
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

function SingleDietChartTemplateDisplay() {
    const {baseDietChartId} = useParams<{baseDietChartId:string}>();
    const [dietChartCuisine, setDietChartCuisine] = useState<CuisineType | null>(null);
    const [deficitCaloriesLevel, setDeficitCaloriesLevel] = useState<number | null>(null);
    const [baseDietChart, setBaseDietChart] = useState<DietChartTemplateType[] | null>(null)
    useEffect(() => {
        api.get(`/api/v1/baseDietChart/${baseDietChartId}`)
            .then(res => {
                const responseChart = res.data.dietChart;
                const structuredDietChart = convertArrayToStructuredDietChart(responseChart.items);

                setDietChartCuisine(responseChart.cuisine as CuisineType);
                setDeficitCaloriesLevel(responseChart.deficitCaloriesLevel);
                setBaseDietChart(structuredDietChart)
            }).catch(err => {
                console.log(err)
            });
    }, [baseDietChartId]);
  return (
    <section className='p-5 bg-gray-600'>
        {
            !baseDietChart && <p>Loading...</p>
        }
        {
            baseDietChart && baseDietChart.length === 0 && <p>No data found</p>
        }
        {
            dietChartCuisine && deficitCaloriesLevel && (
                <div className='border border-gray-300 bg-white rounded-lg p-5 my-5'>
                    <h1 className='text-2xl font-bold'>Diet Chart Template</h1>
                    <div className='grid grid-cols-2 gap-5 mt-5'>
                        <div>
                            <h1 className='text-lg font-bold'>Cuisine</h1>
                            <p>{dietChartCuisine.name}</p>
                        </div>
                        <div>
                            <h1 className='text-lg font-bold'>Deficit Calories Level</h1>
                            <p>{deficitCaloriesLevel}</p>
                        </div>
                    </div>
                </div>
            )
        }
        {
            baseDietChart && baseDietChart.map((day, index) => (
                <div key={index} className='border border-gray-300 bg-white rounded-lg p-5 my-5'>
                    <h1 className='text-2xl font-bold'>{day.day}</h1>
                    <div className='grid grid-cols-7 gap-5 mt-5'>
                        {
                            day.meals.map((meal, index) => (
                                <div key={index} className='border border-gray-300 rounded-lg p-5'>
                                    <h1 className='text-lg font-bold'>Meal {index+1}</h1>
                                    <div className='mt-3'>
                                        <h1 className='text-lg font-bold'>Dishes</h1>
                                        <ul className='flex flex-col gap-2'>
                                            {
                                                (meal.dishes as DishItemPopulatedType[]).map((dish , index) => (
                                                    <li key={index}>
                                                        <p>{dish.dish.name}</p>
                                                        <p>{dish.quantity} {dish.unitOfMeasurement}({dish.grams} grams)</p>
                                                    </li>
                                                ))
                                            }
                                        </ul>
                                    </div>
                                    <div className='mt-3'>
                                        <h1 className='text-lg font-bold'>Calories</h1>
                                        <p>{meal.calories}</p>
                                    </div>
                                </div>
                            ))
                        }
                    </div>
                </div>
            ))
        }
        
        
    </section>
  )
}

export default SingleDietChartTemplateDisplay