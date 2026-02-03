export const geTimeFromMealType = (mealT : string): string => {
    let retTime = '';

    const currentDate = new Date(); // Create a new date based on stTime
    const currentYear = currentDate.getFullYear();
    const currentMonth = String(currentDate.getMonth() + 1).padStart(2, '0'); // Months are 0-based
    const currentDay = String(currentDate.getDate()).padStart(2, '0');
    
    switch (mealT) {
        case "B":
            retTime = '09:00';
            break;
        case "MS":
            retTime = '11:30';
            break;
        case "L":
            retTime = '14:00';
            break;
        case "AS":
            retTime = '16:30';
            break;
        case "PW":
            retTime = '19:00';
            break;
        case "D":
            retTime = '21:30';
            break;
        default:
            retTime = '23:00';
    }

    return `${currentYear}-${currentMonth}-${currentDay}T${retTime}`;
}