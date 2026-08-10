import React from "react";

function LifecycleHeader({ environment }) {
  return (
    <>
      {environment === "staging" && (
        <div
          style={{
            backgroundColor: "darkorange",
            color: "white",
            padding: "1rem",
            textAlign: "center",
          }}
        >
          <strong className="select-none" style={{ fontSize: "1rem" }}>
            STAGING ENVIRONMENT
          </strong>
          <p className="select-none" style={{ fontSize: "1rem" }}>
            — Not for production use
          </p>
        </div>
      )}
      {environment === "development" && (
        <div
          style={{
            backgroundColor: "darkred",
            color: "white",
            padding: "1rem",
            textAlign: "center",
          }}
        >
          <strong className="select-none" style={{ fontSize: "1rem" }}>
            DEVELOPMENT ENVIRONMENT
          </strong>{" "}
          <p className="select-none" style={{ fontSize: "1rem" }}>
            — Not for production use
          </p>
        </div>
      )}
    </>
  );
}
export default LifecycleHeader;
