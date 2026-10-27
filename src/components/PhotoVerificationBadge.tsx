import React from 'react';
import { PhotoVerificationResult } from '../types/complaint';
import {
  ShieldCheck,
  AlertTriangle,
  FileQuestion,
  Sparkles,
  HelpCircle,
  CheckCircle2,
  Eye,
  Info,
} from 'lucide-react';

interface PhotoVerificationBadgeProps {
  result: PhotoVerificationResult;
  compact?: boolean;
}

export const PhotoVerificationBadge: React.FC<PhotoVerificationBadgeProps> = ({
  result,
  compact = false,
}) => {
  const getStatusConfig = () => {
    switch (result.status) {
      case 'Likely relevant':
        return {
          icon: ShieldCheck,
          label: 'Likely relevant',
          textColor: 'text-emerald-800',
          bgColor: 'bg-emerald-50',
          borderColor: 'border-emerald-200',
          badgeColor: 'bg-emerald-100 text-emerald-800',
          summary: 'Authentic civic defect verified with high semantic alignment.',
        };
      case 'Possible duplicate':
        return {
          icon: AlertTriangle,
          label: 'Possible duplicate',
          textColor: 'text-amber-800',
          bgColor: 'bg-amber-50',
          borderColor: 'border-amber-200',
          badgeColor: 'bg-amber-100 text-amber-800',
          summary: result.duplicateMatchedId
            ? `Identical visual evidence found in active record ${result.duplicateMatchedId}.`
            : 'Potential duplicate image detected.',
        };
      case 'Possible manipulation or AI-generated image':
        return {
          icon: Sparkles,
          label: 'Possible manipulation / AI-generated image',
          textColor: 'text-rose-800',
          bgColor: 'bg-rose-50',
          borderColor: 'border-rose-200',
          badgeColor: 'bg-rose-100 text-rose-800',
          summary: 'Probabilistic flags for synthetic diffusion artifacts or edge tampering. Flagged for officer review.',
        };
      case 'Irrelevant or unclear image':
        return {
          icon: FileQuestion,
          label: 'Irrelevant or unclear image',
          textColor: 'text-orange-800',
          bgColor: 'bg-orange-50',
          borderColor: 'border-orange-200',
          badgeColor: 'bg-orange-100 text-orange-800',
          summary: 'Image clarity is degraded or does not visually match municipal civic patterns.',
        };
      case 'Manual review required':
      default:
        return {
          icon: HelpCircle,
          label: 'Manual review required',
          textColor: 'text-slate-800',
          bgColor: 'bg-slate-100',
          borderColor: 'border-slate-300',
          badgeColor: 'bg-slate-200 text-slate-800',
          summary: 'Uncalibrated signal requires administrative inspection.',
        };
    }
  };

  const config = getStatusConfig();
  const Icon = config.icon;

  if (compact) {
    return (
      <span
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-semibold border ${config.bgColor} ${config.textColor} ${config.borderColor}`}
      >
        <Icon className="w-3.5 h-3.5" />
        <span>{config.label}</span>
        <span className="font-mono text-[11px] opacity-80">({result.confidence}%)</span>
      </span>
    );
  }

  return (
    <div className={`p-4 rounded-xl border ${config.bgColor} ${config.borderColor} space-y-3 text-xs`}>
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-black/5 pb-2.5">
        <div className="flex items-center gap-2">
          <div className={`p-1.5 rounded-lg bg-white shadow-2xs ${config.textColor}`}>
            <Icon className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[10px] uppercase font-bold tracking-wider text-slate-500">
              AI Photo Authenticity Verification
            </div>
            <h4 className={`text-sm font-bold ${config.textColor}`}>
              {config.label}
            </h4>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <span className="text-[11px] text-slate-500 font-medium">Confidence:</span>
          <span className="font-mono font-bold text-slate-900 bg-white px-2 py-0.5 rounded border border-slate-200 shadow-2xs">
            {result.confidence}%
          </span>
        </div>
      </div>

      <div className="space-y-1.5 text-slate-700">
        <p className="leading-relaxed">
          {config.summary}
        </p>

        {result.flagReason && (
          <div className="p-2.5 bg-white/80 rounded-lg border border-black/5 text-[11px] text-slate-600 leading-normal">
            <strong>Advisory Note:</strong> {result.flagReason}
          </div>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-1 text-[11px] font-mono">
          <div className="p-2 bg-white rounded border border-black/5">
            <span className="text-slate-400 block text-[10px]">AI-GEN PROBABILITY</span>
            <span className="font-bold text-slate-800">{result.aiGeneratedProbability ?? 5}%</span>
          </div>
          <div className="p-2 bg-white rounded border border-black/5">
            <span className="text-slate-400 block text-[10px]">MANIPULATION RISK</span>
            <span className="font-bold text-slate-800">{result.manipulationScore ?? 8}%</span>
          </div>
          <div className="p-2 bg-white rounded border border-black/5 col-span-2 sm:col-span-1">
            <span className="text-slate-400 block text-[10px]">OFFICER STATUS</span>
            <span className="font-bold text-[#174A78]">{result.adminReviewStatus || 'Pending'}</span>
          </div>
        </div>
      </div>

      {/* Probabilistic Disclaimer Notice */}
      <div className="pt-2 border-t border-black/5 flex items-start gap-1.5 text-[10px] text-slate-500">
        <Info className="w-3.5 h-3.5 shrink-0 text-slate-400 mt-0.5" />
        <span>
          <strong>Probabilistic Verification Notice:</strong> AI detection models evaluate statistical image markers and semantic relevance; they do not claim 100% certainty. Genuine complaints are never rejected solely based on automated probabilistic flags.
        </span>
      </div>
    </div>
  );
};
