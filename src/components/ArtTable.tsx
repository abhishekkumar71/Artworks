import { useRef, useState, useEffect } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { OverlayPanel } from "primereact/overlaypanel";
import axios from "axios";

const API_URL = "https://api.artic.edu/api/v1/artworks";

export default function ArtworkTable() {
  const [artworks, setArtworks] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [totalRecords, setTotalRecords] = useState(0);

  const [selectedArtworks, setSelectedArtworks] = useState<any[]>([]);
  const [pageInput, setPageInput] = useState<{ [page: number]: number }>({});

  const op = useRef<OverlayPanel>(null);

  useEffect(() => {
    fetchData(page);
  }, [page]);

  const fetchData = async (pageNumber: number) => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}?page=${pageNumber + 1}`);
      setArtworks(res.data.data);
      setTotalRecords(res.data.pagination.total);
    } catch (err) {
      console.error("Failed fetching data", err);
    } finally {
      setLoading(false);
    }
  };

  const onPageChange = (e: any) => setPage(e.page);

  const handleSubmit = () => {
    const count = pageInput[page] || 0;
    const newSelection = artworks.slice(0, count);

    const otherSelections = selectedArtworks.filter(
      (art) => !artworks.some((a) => a.id === art.id)
    );

    setSelectedArtworks([...otherSelections, ...newSelection]);
    op.current?.hide();
  };

  return (
    <div style={{ padding: "1rem" }}>
      <DataTable
        value={artworks}
        paginator
        rows={10}
        totalRecords={totalRecords}
        lazy
        first={page * 10}
        onPage={onPageChange}
        loading={loading}
        selection={selectedArtworks}
        onSelectionChange={(e) => setSelectedArtworks(e.value)}
        dataKey="id"
      >
        <Column selectionMode="multiple" style={{ width: "3rem" }} />
        <Column
          field="title"
          header={
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              Title
              <Button
                icon="pi pi-angle-down"
                onClick={(e) => op.current?.toggle(e)}
                size="small"
                className="p-button-text p-button-plain"
              />
            </div>
          }
        />
        <Column field="place_of_origin" header="Origin" />
        <Column field="artist_display" header="Artist" />
        <Column field="date_start" header="Start Date" />
        <Column field="date_end" header="End Date" />
      </DataTable>

      <OverlayPanel ref={op} style={{ width: "300px" }}>
        <input
          type="number"
          placeholder="Number of rows to select"
          style={{ width: "100%", padding: "0.5rem", marginBottom: "1rem",color:"black",backgroundColor:"white" }}
          value={pageInput[page] || ""}
          onChange={(e) =>
            setPageInput({ ...pageInput, [page]: Number(e.target.value) })
          }
        />
        <Button label="Submit" onClick={handleSubmit} className="mt-2" />
      </OverlayPanel>
    </div>
  );
}
