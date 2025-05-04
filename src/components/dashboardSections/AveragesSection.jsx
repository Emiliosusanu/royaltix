
    import React from 'react';
    import AdditionalWidgets from '@/components/AdditionalWidgets';

    function AveragesSection({ additionalWidgetsData, loading }) {
      // AdditionalWidgets already handles its own loading state/skeletons
      return <AdditionalWidgets additionalData={additionalWidgetsData} isLoading={loading} />;
    }

    export default AveragesSection;
  