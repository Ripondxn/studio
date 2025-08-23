
import { getBackupSettings } from './actions';
import { BackupClient } from './backup-client';

export default async function BackupPage() {
  const settings = await getBackupSettings();
  
  return <BackupClient initialSettings={settings} />;
}
