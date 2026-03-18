import React from "react";

const PreviewSection = ({ previewClass }) => {
  return (
    <section className="results col-12 col-xxl-9 col-xl-9 col-lg-9 col-md-10 col-sm-12 blur-effect">
      <div className={`row wrap ${previewClass} preview mw-100`} />
    </section>
  );
};

export default PreviewSection;
