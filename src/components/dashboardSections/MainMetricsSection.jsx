
    import React from 'react';
    import MainDashboardWidgets from '@/components/widgets/MainDashboardWidgets';

    function MainMetricsSection({ metrics, loading }) {
       // MainDashboardWidgets already handles its own loading state/skeletons
      return <MainDashboardWidgets metrics={metrics} />;
    }

    export default MainMetricsSection;
  