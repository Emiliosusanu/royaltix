
    import React from 'react';
    import ProjectionWidgets from '@/components/widgets/ProjectionWidgets';

    function ProjectionsSection({ metrics, loading }) {
      // ProjectionWidgets already handles its own loading state/skeletons
      return <ProjectionWidgets metrics={metrics} />;
    }

    export default ProjectionsSection;
  