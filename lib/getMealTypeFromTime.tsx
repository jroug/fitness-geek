export const getMealTypeFromTime = (pDate:string): string => {

        const passedDate = new Date(pDate); // Create a new date based on stTime
 
        const passedHours = passedDate.getHours();
        const passedMinutes = passedDate.getMinutes();

        // Check the range and set the target time accordingly
        if ((passedHours >= 7 && passedHours < 11) || (passedHours === 11 && passedMinutes < 30)) {
            // Between 7:00 AM and 11:30 AM
            return "B"; // "Breakfast"
        } else if ((passedHours === 11 && passedMinutes >= 30) || (passedHours >= 12 && passedHours < 14)) {
            // Between 11:30 AM and 2:00 PM
            return "MS"; // "Morning Snack"
        } else if ((passedHours >= 14 && passedHours < 16) || (passedHours === 16 && passedMinutes < 30)) {
            // Between 2:00 PM and 4:30 PM
            return "L"; // "Lunch"
        } else if ((passedHours === 16 && passedMinutes >= 30) || (passedHours >= 17 && passedHours < 19)) {
            // Between 4:30 PM and 7:00 PM
            return "AS"; // "Afternoon Snack"
        } else if ((passedHours >= 19 && passedHours < 21) || (passedHours === 21 && passedMinutes < 30)) {
            // Between 7:00 PM and 9:30 PM
            return "PW"; // "Post Workout"
        } else if ((passedHours === 21 && passedMinutes >= 30) || (passedHours >= 21 && passedHours < 23)) {
            // Between 7:00 PM and 9:30 PM
            return "D"; // "Dinner"
        } else {
            // Any other time
            return "OTH"; // "OTHER"
        }

};