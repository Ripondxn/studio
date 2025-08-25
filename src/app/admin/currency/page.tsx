
import { getCurrencySettings } from './actions';
import { CurrencyClient } from './currency-client';

export default async function CurrencySettingsPage() {
  const settings = await getCurrencySettings();
  
  return <CurrencyClient initialSettings={settings} />;
}
