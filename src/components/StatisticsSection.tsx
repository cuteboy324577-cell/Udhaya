import React from 'react';
import { FileCheck2, Clock, CheckCircle, TrendingUp, Users } from 'lucide-react';

interface StatisticsSectionProps {
  language: 'en' | 'ta';
}

export const StatisticsSection: React.FC<StatisticsSectionProps> = ({ language }) => {
  const stats = [
    {
      label: language === 'en' ? 'Total Complaints Filed' : 'மொத்த புகார்கள்',
      value: '1,48,290',
      change: '+12% this month',
      icon: FileCheck2,
      color: 'text-[#174A78]',
      bg: 'bg-blue-50',
    },
    {
      label: language === 'en' ? 'Grievances Resolved' : 'தீர்க்கப்பட்ட புகார்கள்',
      value: '1,39,412',
      change: '94.0% resolution rate',
      icon: CheckCircle,
      color: 'text-emerald-700',
      bg: 'bg-emerald-50',
    },
    {
      label: language === 'en' ? 'Under Active Action' : 'நடவடிக்கையில் உள்ளவை',
      value: '6,240',
      change: 'Assigned to field officers',
      icon: Clock,
      color: 'text-amber-700',
      bg: 'bg-amber-50',
    },
    {
      label: language === 'en' ? 'Avg. Resolution Time' : 'சராசரி தீர்வு நேரம்',
      value: '42.8 Hrs',
      change: 'Down from 72h SLA',
      icon: TrendingUp,
      color: 'text-[#267C78]',
      bg: 'bg-teal-50',
    },
    {
      label: language === 'en' ? 'Citizen Satisfaction' : 'மக்கள் மனநிறைவு',
      value: '95.2%',
      change: 'Based on 45,000+ ratings',
      icon: Users,
      color: 'text-[#174A78]',
      bg: 'bg-slate-100',
    },
  ];

  return (
    <section className="bg-[#F5F7FA] border-b border-slate-200 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
              {language === 'en' ? 'Statewide Redressal Performance' : 'மாநில அளவிலான குறைதீர்வு நிலவரம்'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              {language === 'en' ? 'Live aggregated metrics across 38 administrative districts and municipal bodies' : '38 மாவட்டங்கள் மற்றும் நகராட்சிகளின் நேரடி புள்ளிவிவரங்கள்'}
            </p>
          </div>
          <span className="text-xs text-slate-500 font-mono">
            Updated: Today at 09:00 AM
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {stats.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={index}
                className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between hover:border-slate-300 transition-colors"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold text-slate-500">{item.label}</span>
                  <div className={`p-2 rounded-lg ${item.bg} ${item.color}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-bold text-slate-900 tabular-nums">
                    {item.value}
                  </div>
                  <div className="text-[11px] text-slate-500 mt-1 font-medium">
                    {item.change}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
