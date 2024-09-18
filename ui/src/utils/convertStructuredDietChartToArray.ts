import { DietChartItemType, DietChartTemplateType, DishType } from "@/types";

function convertStructuredDietChartToArray(arr: DietChartTemplateType[]) {
    const itemsArray:(DietChartItemType | null)[] = [];
    arr.forEach(day => {
        day.meals.forEach(meal => {
            if(meal.dishes.length === 0) {
                itemsArray.push(null);
            }else{
                itemsArray.push({
                    dishes: meal.dishes.map((dish) => ({
                        dish: (dish.dish as DishType)._id,
                        quantity: dish.quantity,
                        unitOfMeasurement: dish.unitOfMeasurement,
                        grams: dish.grams,
                        remarks: dish.remarks,
                    })),
                    calories: meal.calories
                });
            }
        });
    });
    return itemsArray;
}

export default convertStructuredDietChartToArray