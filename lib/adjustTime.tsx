export const adjustTime = (stTime: Date) => {
    
 
    
    const targetTime = new Date(stTime); // Create a new date based on stTime
    const hours = targetTime.getHours();
    const minutes = targetTime.getMinutes();
    
    // Check the range and set the target time accordingly
    if ((hours >= 7 && hours < 11) || (hours === 11 && minutes < 30)) {
        // Between 7:00 AM and 11:30 AM
        targetTime.setHours(9, 0, 0, 0); // Set to 9:00 AM
    } else if ((hours === 11 && minutes >= 30) || (hours >= 12 && hours < 14)) {
        // Between 11:30 AM and 2:00 PM
        targetTime.setHours(11, 30, 0, 0); // Set to 11:30 AM
    } else if ((hours >= 14 && hours < 16) || (hours === 16 && minutes < 30)) {
        // Between 2:00 PM and 4:30 PM
        targetTime.setHours(14, 0, 0, 0); // Set to 2:00 PM
    } else if ((hours === 16 && minutes >= 30) || (hours >= 17 && hours < 19)) {
        // Between 4:30 PM and 7:00 PM
        targetTime.setHours(16, 30, 0, 0); // Set to 4:30 PM
    } else if ((hours >= 19 && hours < 21) || (hours === 21 && minutes < 30)) {
        // Between 7:00 PM and 9:30 PM
        targetTime.setHours(19, 0, 0, 0); // Set to 7:00 PM
    } else {
        // Any other time
        targetTime.setHours(21, 30, 0, 0); // Set to 9:30 PM
    }
    
    return targetTime;
}

 