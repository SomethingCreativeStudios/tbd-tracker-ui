import { formatDistance, isBefore, isFuture, isToday } from 'date-fns';

export function getAiringTime(airingDate: Date, nextAiringDate: Date) {
  if (isFuture(new Date(airingDate))) {
    return formatDistance(new Date(airingDate), new Date());
  }

  if (isToday(new Date(nextAiringDate)) && isBefore(new Date(nextAiringDate), new Date())) {
    return 'Sometime Today...';
  }

  return formatDistance(new Date(nextAiringDate), new Date());
}
