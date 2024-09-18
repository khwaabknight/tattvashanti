import { BaseDietChartType, CuisineType } from "@/types"
import api from "@/utils/axiosConfig";
import { useEffect, useState } from "react"
import { DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import DietChartTable from "../Home/DietChartTable";
import convertArrayToStructuredDietChart from "@/utils/convertArrayToStructuredDietChart";


function EditDietChartTemplate({dietChartId}:{dietChartId:string}) {

    const [baseDietChart, setBaseDietChart] = useState<BaseDietChartType | null>(null) 

    useEffect(() => {
        api.get(`/api/v1/baseDietChart/${dietChartId}`)
            .then(res => {
                setBaseDietChart(res.data.dietChart)
            }).catch(err => {
                console.log(err)
            });
    }, [dietChartId])
  return (
    <div>
        {
            baseDietChart && (
                <div>
                    <DialogHeader>
                        <DialogTitle>Edit Diet Chart Template</DialogTitle>
                        <DialogDescription>
                            Make changes to Diet Chart Template here. Click save when you're done.
                        </DialogDescription>
                        <div className="flex gap-5">
                            <p>Cuisine : {(baseDietChart.cuisine as CuisineType).name}</p>
                            <p>Deficit : {baseDietChart.deficitCaloriesLevel}</p>
                        </div>
                    </DialogHeader>
                    <div>
                        {
                            baseDietChart.items && 
                            <DietChartTable
                                dietChartId={baseDietChart._id}
                                initialDietChartArray={convertArrayToStructuredDietChart(baseDietChart.items)}
                                submitHandler={(_) => {}}
                                isEditBaseDietChart
                            />
                        }
                    </div>
                </div>
            )
        }
    </div>
  )
}

export default EditDietChartTemplate