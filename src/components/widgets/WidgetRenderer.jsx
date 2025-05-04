
    import React from 'react';
    import { widgetConfig } from '@/config/widgetConfig';

    function WidgetRenderer({ metrics }) {
      return (
        <>
          {widgetConfig
            .filter(config => config.id !== 'warningMixedCurrencies') // Exclude warning widget here
            .map(config => {
              if (metrics && config.condition(metrics)) {
                const WidgetComponent = config.component;
                const widgetProps = config.props(metrics);
                return <WidgetComponent key={config.id} {...widgetProps} />;
              }
              return null;
          })}
        </>
      );
    }

    export default WidgetRenderer;
  