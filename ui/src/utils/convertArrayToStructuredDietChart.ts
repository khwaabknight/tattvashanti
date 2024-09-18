import { DietChartItemType, DietChartTemplateType } from "@/types";

function convertArrayToStructuredDietChart(arr: (DietChartItemType | null)[]) {
    const structuredDietChart:DietChartTemplateType[] = [];
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    let index = 0;

    days.forEach(day => {
        let meals : DietChartItemType[] = [];
        for(let i = 0; i < 7; i++) {
            if(!arr[index]) {
                meals.push({dishes: [], calories: 0});
            }else{
                meals.push(arr[index] as DietChartItemType);
            }
            index++;
        }
        structuredDietChart.push({day, meals});
    });
    return structuredDietChart;
}

export default convertArrayToStructuredDietChart