import React from "react";
import { isBlank } from "../../../helpers/helpers";
import PreviewSection from "./PreviewSection";
import EmptySection from "./EmptySection";

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

      <ul className="list-unstyled p-0 m-0">
        {items.map((data) => {
          const item = data[itemDataKey];
          if (!item) return null;

          return (
            <li key={`${itemDataKey}-${item.id}`}>
              <ItemComponent
                {...data}
                current_user={current_user}
                itemsArray={items}
                setItemsArray={setItems}
              />
            </li>
          );
        })}
      </ul>
    </section>
  );
};

export default ResponseSection;
