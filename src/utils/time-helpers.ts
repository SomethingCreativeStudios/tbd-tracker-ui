import { addDays, addWeeks, eachWeekOfInterval, formatDistance, isFuture, isSameDay } from 'date-fns';

export function toDate(dateString: string) {
  return addDays(new Date(dateString), 1);
}
export function getClosestAiringDate(airingDate: Date, currentDate = new Date()) {
  const range = eachWeekOfInterval({ start: airingDate, end: addWeeks(currentDate, 1) }, { weekStartsOn: airingDate.getDay() as any });

  return range.find(date => isSameDay(date, currentDate) || isFuture(date));
}

export function getAiringTime(airingDate: Date, currentDate = new Date()) {
  if (isFuture(airingDate)) {
    return formatDistance(airingDate, currentDate);
  }

  const nextDate = getClosestAiringDate(airingDate, currentDate);

  return formatDistance(nextDate, currentDate);
}
