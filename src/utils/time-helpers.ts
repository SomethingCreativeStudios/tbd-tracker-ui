import { formatDistance, isFuture } from 'date-fns';

export function getAiringTime(airingDate: Date, nextAiringDate: Date) {
  if (isFuture(new Date(airingDate))) {
    return formatDistance(new Date(airingDate), new Date());
  }

  return formatDistance(new Date(nextAiringDate), new Date());
}
