import mergePDFs from "../../mergePdf";
import classes from "./DataArea.module.css";
import { useState, useRef, useEffect } from "react";
import ErrorPage from "./Error";
export default function DataArea({ urls }) {
  const [selectedPdfs, setSelectedPdfs] = useState([]);
  const [isLoading,setIsLoading] = useState(false);
  const [error,setError] = useState(false);
  const [errorMessage,setErrorMessage] = useState("");
  const errorRef = useRef();

  const handleCheckboxChange = (ele) => {
    setSelectedPdfs((prevSelected) =>
      prevSelected.some((obj) => obj.id === ele.id)
        ? prevSelected.filter((item) => item.id !== ele.id)
        : [...prevSelected, ele]
    );
  };

  const resetSelection = () => {
    setSelectedPdfs([]);
    setError(false);
    setErrorMessage("");
  };

  async function downloadFile(url, filename) {
    const response = await fetch(url);
    const blob = await response.blob();
    const blobUrl = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = blobUrl;
    link.download = filename; // 👈 works reliably
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(blobUrl); // cleanup
  }

  useEffect(() => {
      if (error) {
        errorRef.current?.scrollIntoView({ behavior: "smooth" });
      }
    }, [error]);

  //   onClick={() => {
  //   const link = document.createElement("a");
  //   link.href = ele.url;
  //   link.download = "MyCustomName.pdf"; // force filename
  //   link.click();
  // }}

  return (
    <>
      <div className={classes["main-container"]}>
        <div className={classes.header}>
          <h1>PDF DOCUMENTS</h1>
          <p className={classes.subtitle}>Previous Year Question Papers</p>
        </div>

        <div className={classes["pdf-container"]}>
          <div className={classes["table-header"]}>
            <div>S.No.</div>
            <div>Document Name</div>
            <div>Download</div>
            <div>Select</div>
          </div>

          <div className={classes["pdf-list"]}>
            {urls.map((ele) => (
              <div className={classes["pdf-item"]} key={ele.id}>
                <div className={classes["serial-no"]}>{ele.id}</div>
                <div className={classes["pdf-name"]}>
                  <div className={classes["pdf-icon"]}>PDF</div>
                  <span>{ele.name}</span>
                </div>
                <button
                  className={classes["download-btn"]}
                  onClick={() => downloadFile(ele.url, "loda.pdf")}
                >
                  ⬇ Download
                </button>
                <div className={classes["checkbox-wrapper"]}>
                  <input
                    type="checkbox"
                    className={classes["custom-checkbox"]}
                    checked={selectedPdfs.some((obj) => obj.id === ele.id)}
                    onChange={() => handleCheckboxChange(ele)}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Action Buttons */}
          <div className={classes["action-buttons"]}>
            <button
              className={classes["bulk-download-btn"]}
              disabled = {isLoading}
              onClick={async () => {
               try{ setIsLoading(true);
                await mergePDFs(selectedPdfs);
                setIsLoading(false);
                resetSelection();}
                catch(err){
                  setError(true);
                  setErrorMessage(`Problem while merging the selected files. ${err.message || err}`);
                  setIsLoading(false);
                }
              }}
            >
              {isLoading ? "Processing..." : "⬇ Download Selected"}
            </button>
            <button className={classes["reset-btn"]} onClick={resetSelection} disabled = {isLoading}>
              ↺ Reset Selection
            </button>
          </div>
        </div>
      </div>
      {error && <div ref={errorRef}><ErrorPage msg = {errorMessage}></ErrorPage></div>}
    </>
  );
}
