
'use client';

import { SendRenewalDialog } from "./send-renewal-dialog";

type ExpiringContract = {
  unit: string;
  tenant: string;
  endDate: string;
};

type SendRenewalDialogWrapperProps = {
  expiringContracts: ExpiringContract[];
};

export function SendRenewalDialogWrapper({ expiringContracts }: SendRenewalDialogWrapperProps) {
    return <SendRenewalDialog expiringContracts={expiringContracts} />;
}
