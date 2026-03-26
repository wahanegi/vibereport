import React from "react";
import { isBlank } from "../../../helpers/helpers";
import PreviewSection from "./PreviewSection";
import EmptySection from "./EmptySection";
import AnimatedList from "./AnimatedList";

const ResponseSection = ({
  nextTimePeriod,
  isMinUsersResponses,
  items,
  current_user,
  setItems,
  headerComponent: HeaderComponent,
  itemComponent: ItemComponent,
  headerProps,
  itemDataKey,
  emptyConfig
}) => {
  if (!nextTimePeriod && isMinUsersResponses) {
    return <PreviewSection previewClass={emptyConfig.previewClass} />;
  }

  if (isBlank(items)) {
    return (
      <EmptySection {...emptyConfig}>
        <div className="results col-12 col-xxl-9 col-xl-9 col-lg-9 col-md-10 col-sm-12">
          <HeaderComponent {...headerProps} />
        </div>
      </EmptySection>
    );
  }

  return (
    <section className="results col-12 col-xxl-9 col-xl-9 col-lg-9 col-md-10 col-sm-12">
      <HeaderComponent {...headerProps} />

      <AnimatedList
        items={items}
        itemDataKey={itemDataKey}
        ItemComponent={ItemComponent}
        current_user={current_user}
        setItems={setItems}
      />
    </section>
  );
};

export default ResponseSection;
