/**
 * Transnational repression data — threat levels, operation types,
 * and country-level CCP overseas operation records.
 *
 * @module transnationalRepressionData
 */
import { MapPin, Eye, Scale, AlertTriangle, type LucideIcon } from 'lucide-react';

export interface ThreatLevel {
  id: string;
  label: string;
  color: string;
  bg: string;
  border: string;
  dot: string;
}

export interface OperationType {
  id: string;
  label: string;
  icon: LucideIcon;
}

export interface ResponseStatus {
  id: string;
  label: string;
  color: string;
}

export const THREAT_LEVELS: ThreatLevel[] = [
  { id: 'critical', label: 'Critical', color: 'text-red-400', bg: 'bg-red-400/10', border: 'border-red-400/30', dot: 'bg-red-400' },
  { id: 'high', label: 'High', color: 'text-orange-400', bg: 'bg-orange-400/10', border: 'border-orange-400/30', dot: 'bg-orange-400' },
  { id: 'moderate', label: 'Moderate', color: 'text-yellow-400', bg: 'bg-yellow-400/10', border: 'border-yellow-400/30', dot: 'bg-yellow-400' },
  { id: 'low', label: 'Low', color: 'text-[#4afa82]', bg: 'bg-[#4afa82]/10', border: 'border-[#4afa82]/30', dot: 'bg-[#4afa82]' },
];

export const OPERATION_TYPES: OperationType[] = [
  { id: 'police-station', label: 'Overseas Police Stations', icon: MapPin },
  { id: 'fox-hunt', label: 'Fox Hunt / Sky Net', icon: Eye },
  { id: 'legal-prosecution', label: 'Extraterritorial Prosecution', icon: Scale },
  { id: 'harassment', label: 'Harassment & Intimidation', icon: AlertTriangle },
];

export const RESPONSE_STATUSES: ResponseStatus[] = [
  { id: 'enforcement', label: 'Enforcement Action', color: 'text-[#4afa82]' },
  { id: 'investigation', label: 'Under Investigation', color: 'text-yellow-400' },
  { id: 'acknowledged', label: 'Acknowledged', color: 'text-orange-400' },
  { id: 'no-action', label: 'No Known Action', color: 'text-red-400' },
];
