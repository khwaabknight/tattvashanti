import {
    Dialog,
    DialogContent,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from '@/components/ui/button';
import { GrTemplate } from "react-icons/gr";
import AddDietChartTemplate from '@/components/Home/AddItemsBar/AddDietChartTemplate';
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "@/utils/axiosConfig";
import { BaseDietChartType, CuisineType } from "@/types";
import EditDietChartTemplate from "@/components/DietChartTemplates/EditDietChartTemplate";

function DietChartTemplates() {
    const [dietCharts, setDietCharts] = useState<BaseDietChartType[]>([]);
    useEffect(() => {
        api.get('/api/v1/baseDietChart')
            .then(res => {
                setDietCharts(res.data.dietCharts)
            }).catch(err => {
                console.log(err)
            });
    }, []);
  return (
    <section className='min-h-screen bg-gray-500 flex flex-col items-center py-10'>
        <div className="w-11/12 max-w-screen-xl flex flex-col gap-8">
            <div className='border rounded-lg border-gray-300 bg-white flex justify-between items-center py-5 px-8 gap-3'>
                <div>
                    <Button>
                        <Link to='/'>Back</Link>
                    </Button>
                </div>
                
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

            <div className='border rounded-lg border-gray-300 bg-white flex flex-col justify-between items-center py-5 px-8 gap-3'>
                {
                    dietCharts && dietCharts.map((dietChart:BaseDietChartType) => (
                        <div key={dietChart._id} className="flex justify-between items-center gap-3 w-full border border-gray-400 p-3">
                            <div>
                                <div>{(dietChart.cuisine as CuisineType).name}</div>
                                <div>{dietChart.deficitCaloriesLevel}</div>
                            </div>

                            <div className="flex gap-2">
                                <Button>
                                    <Link to={`/diet-chart-templates/${dietChart._id}`}>View</Link>
                                </Button>

                                <Dialog>
                                    <DialogTrigger asChild>
                                        <Button variant="outline">Edit</Button>
                                    </DialogTrigger>
                                    <DialogContent className="w-[90vw] max-h-[100vh] max-w-screen-2xl overflow-y-auto">
                                        <EditDietChartTemplate dietChartId={dietChart._id} />
                                    </DialogContent>
                                </Dialog>
                            </div>
                            
                        </div>
                    ))
                }                
            </div>
        </div>
    </section>
  )
}

export default DietChartTemplates