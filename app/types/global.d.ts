import type { HubConfig } from '@nuxthub/core';
declare interface Window {
  onSuccess: (response: string, type: string) => Promise<void>;
  _tcq: any[];
  _tcopentime: number;
}
