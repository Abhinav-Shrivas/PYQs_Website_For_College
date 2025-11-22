import { useState, useRef, useEffect } from "react";
import FormPYQ from "./Form";
import NavBar from "./NavBar";
import DataArea from "./DataArea";
import { fetchUrls } from "../../http";
import ErrorPage from "./Error";
import LoadingPage from "./LoadingPage";
export default function DownloadPage() {
  const [fetchedData, setFetchedData] = useState([]);
  const [error, setError] = useState();
  const [isLoading, setIsLoading] = useState(false);

  // Refs for auto-scroll
  const loadingRef = useRef(null);

  const fetchFn = (queryString) => {
    setIsLoading(true);
    async function fetchData() {
      try {
        const data = await fetchUrls(queryString);
        setFetchedData(data);
        setError(null);
      } catch (err) {
        setError({ message: err.message } || "failed to fetch data");
        setFetchedData([]);
      }
      setIsLoading(false);
    }
    fetchData();
  };

  // Auto scroll when error happens
  useEffect(() => {
    if (isLoading && !error) {
      loadingRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [error, isLoading]);
  return (
    <div className="download-page">
      <NavBar />
      <FormPYQ fetchFn={fetchFn} />
      {isLoading && !error && (
        <div ref={loadingRef}>
          <LoadingPage />
        </div>
      )}

      {!isLoading && error && <ErrorPage />}

      {!isLoading && !error && fetchedData.length !== 0 && (
        <DataArea urls={fetchedData} />
      )}
    </div>
  );
}
