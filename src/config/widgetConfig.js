
    import ProfitWidget from '@/components/widgets/ProfitWidget';
    import UnpaidRoyaltiesWidget from '@/components/widgets/UnpaidRoyaltiesWidget';
    import ExpensesWidget from '@/components/widgets/ExpensesWidget';
    import ROASWidget from '@/components/widgets/ROASWidget';
    import ROIWidget from '@/components/widgets/ROIWidget';
    import ProjectionWidget from '@/components/widgets/ProjectionWidget';
    import WarningWidget from '@/components/widgets/WarningWidget';
    import { CalendarDays, TrendingUp, AlertTriangle } from 'lucide-react';

    // Configuration for dashboard widgets
    export const widgetConfig = [
      {
        id: 'unpaidRoyalties',
        component: UnpaidRoyaltiesWidget,
        props: (metrics) => ({ unpaidRoyaltiesValue: metrics.unpaidRoyaltiesEUR, currency: 'EUR', useMotion: true }),
        condition: (metrics) => metrics.hasOwnProperty('unpaidRoyaltiesEUR'),
      },
      {
        id: 'netProfit',
        component: ProfitWidget,
        props: (metrics) => ({ totalProfitValue: metrics.totalNetProfitEUR, currency: 'EUR', useMotion: true }),
        condition: (metrics) => metrics.hasOwnProperty('totalNetProfitEUR'),
      },
      {
        id: 'otherExpenses',
        component: ExpensesWidget,
        props: (metrics) => ({ totalOtherExpensesValue: metrics.totalOtherExpensesEUR, currency: 'EUR', useMotion: true }),
        condition: (metrics) => metrics.hasOwnProperty('totalOtherExpensesEUR'),
      },
      {
        id: 'roas',
        component: ROASWidget,
        props: (metrics) => ({ roasEUR: metrics.roasEUR, totalIncomeEUR: metrics.totalIncomeEUR, totalSpendEUR: metrics.totalSpendEUR, useMotion: true }),
        condition: (metrics) => metrics.hasOwnProperty('roasEUR') && metrics.hasOwnProperty('totalIncomeEUR') && metrics.hasOwnProperty('totalSpendEUR'),
      },
      {
        id: 'roi',
        component: ROIWidget,
        props: (metrics) => ({ roi: metrics.roiEUR, currency: 'EUR', useMotion: true }),
        condition: (metrics) => metrics.hasOwnProperty('roiEUR'),
      },
      {
        id: 'monthlyProjection',
        component: ProjectionWidget,
        props: (metrics) => ({
          monthlyEstimateValue: metrics.monthlyEstimateGrossEUR,
          yearlyEstimateValue: 0,
          currency: 'EUR',
          periodLabel: 'Est. Monthly Profit (EUR)',
          icon: CalendarDays,
          daysUsedForProjection: metrics.daysUsedForProjection, // Pass days used
          projectionType: 'Gross', // Specify type
          useMotion: true,
        }),
        condition: (metrics) => metrics.hasOwnProperty('monthlyEstimateGrossEUR') && metrics.hasOwnProperty('daysUsedForProjection'),
      },
      {
        id: 'yearlyProjectionGross',
        component: ProjectionWidget,
        props: (metrics) => ({
          monthlyEstimateValue: 0,
          yearlyEstimateValue: metrics.yearlyEstimateGrossEUR,
          currency: 'EUR',
          periodLabel: 'Est. Yearly Profit (EUR)',
          icon: TrendingUp,
          daysUsedForProjection: metrics.daysUsedForProjection, // Pass days used
          projectionType: 'Gross', // Specify type
          useMotion: true,
        }),
        condition: (metrics) => metrics.hasOwnProperty('yearlyEstimateGrossEUR') && metrics.hasOwnProperty('daysUsedForProjection'),
      },
      {
        id: 'yearlyProjectionNet',
        component: ProjectionWidget,
        props: (metrics) => ({
          monthlyEstimateValue: 0,
          yearlyEstimateValue: metrics.yearlyEstimateNetEUR,
          currency: 'EUR',
          periodLabel: 'Est. Yearly Net Profit (EUR)',
          icon: TrendingUp,
          daysUsedForProjection: metrics.daysUsedForProjection, // Pass days used
          projectionType: 'Net', // Specify type
          useMotion: true,
        }),
        condition: (metrics) => metrics.hasOwnProperty('yearlyEstimateNetEUR') && metrics.hasOwnProperty('daysUsedForProjection'),
      },
      // Warning widget config (conditionally rendered first if needed, handled separately in DashboardWidgets)
       {
         id: 'warningMixedCurrencies',
         component: WarningWidget,
         props: () => ({
           title: "Mixed Currencies Detected",
           message: "Calculations involving entries with unsupported currencies might be inaccurate. Ensure all entries use EUR or USD.",
           icon: AlertTriangle,
           useMotion: true
         }),
         condition: (metrics) => metrics.hasMixedCurrenciesInCalc,
       },
    ];
  