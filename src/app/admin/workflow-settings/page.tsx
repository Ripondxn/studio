
import { getWorkflowSettings } from './actions';
import { WorkflowSettingsClient } from './workflow-settings-client';

export default async function WorkflowSettingsPage() {
  const settings = await getWorkflowSettings();
  
  return <WorkflowSettingsClient initialSettings={settings} />;
}
