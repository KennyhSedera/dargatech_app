import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

export function formatRelativeDate(date) {
    return formatDistanceToNow(new Date(date), { addSuffix: true, locale: fr });
}
