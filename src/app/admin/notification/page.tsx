
import { NotificationClient } from './notification-client';
import { getRecipients } from './actions';

export default async function NotificationPage() {
  const recipients = await getRecipients();
  
  return <NotificationClient recipients={recipients} />;
}
