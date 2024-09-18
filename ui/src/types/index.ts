export type CuisineType = {
    _id: string;
    name: string;
    description: string;
    tags: string[];
}

export type DishType = {
    _id: string;
    name: string;
    time: 'early morning' |'breakfast' | 'mid morning' | 'lunch' | 'evening' | 'dinner' | 'post dinner';
    cuisine: string | CuisineType;
    calories: number;
    unitOfMeasurement: string;
    grams: number;
}

export type DietChartItemType = {
    _id?: string;
    dishes: DishItemType[] | DishItemPopulatedType[];
    calories: number;
    dayDate?:Date;
}

export type DishItemType = {
    dish: string;
    quantity: number;
    unitOfMeasurement: string;
    grams: number;
    remarks?: string;
}

export type DishItemPopulatedType = {
    dish: DishType;
    quantity: number;
    unitOfMeasurement: string;
    grams: number;
    remarks?: string;
}

export type DietChartType = {
    _id: string;
    cuisine: string | CuisineType;
    deficit: string;
    items: DietChartItemType[];
}

export type DietChartTemplateType = {
    day: string;
    meals: DietChartItemType[];
}

export type BaseDietChartType = {
    _id: string;
    cuisine: string | CuisineType;
    deficitCaloriesLevel: string;
    items: (DietChartItemType | null)[];
}

export type ClientDietChartType = {
    _id: string;
    user: string;
    startDate: Date;
    endDate: Date;
    items: (DietChartItemType | null)[];
}

export type ClientType = {
    _id: string;
    name: string;
    email: string;
    age: number;
    weight: number;
    height: number;
    goal: string;
    gender: "MALE"|"FEMALE"|"PREFER NOT TO SAY";
    mobile: string;
    medicalCondition: string;
    createdAt: string;
    updatedAt: string;
}