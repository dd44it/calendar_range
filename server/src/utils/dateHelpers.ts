export interface DateRow {
  date_start: string;
  date_end: string;
}

export const isValidDateString = (dateString: string): boolean => {
  const timestamp = Date.parse(dateString);
  return !isNaN(timestamp);
}

export const extractIndividualDates = (dateRanges: DateRow[]): Date[] => {
  const step = 1;
  const individualDates: Date[] = [];
  dateRanges.forEach((dateRange) => {
    const startDate = new Date(dateRange.date_start);
    const endDate = new Date(dateRange.date_end);

    const currentDate = new Date(startDate);
    while (currentDate <= endDate) {
      individualDates.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + step);
    }
  });
  return individualDates;
}

export const formatDateToStringForDB = (date: Date): string => {
  return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
}

export const isCleanDates = (getDatesRangeDB: Date[], rangeUser: Date[]): boolean => {
  let flagValidation = false;
  const formatBookedDate = getDatesRangeDB.map(date => formatDateToStringForDB(date));
  const formatUserRange = rangeUser.map(date => formatDateToStringForDB(date));
  for(let date of formatUserRange){ 
    if(formatBookedDate.includes(date)){
      flagValidation = true;
      break;
    }
  }
  return flagValidation;
}