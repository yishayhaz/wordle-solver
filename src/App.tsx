import { useEffect, useState } from "react";
import { Button } from "shoppa-ui/widgets/button";
import { IconButton } from "shoppa-ui/widgets/icon-button";
import { Input } from "shoppa-ui/widgets/input";
import { Select } from "shoppa-ui/widgets/select";
import { BiMinus, BiPlus } from "react-icons/bi";
import { Tooltip } from "shoppa-ui/floating/tooltip";
import { Filter, defaultFilter } from "./types";
import { Alert } from "shoppa-ui/widgets/alert";
import { filtersToCondition } from "./scripts";

export function App() {
  const [data, setData] = useState<string[]>([]);
  const [renderData, setRenderData] = useState<string[]>([]);
  const [filteredData, setFilteredData] = useState<string[]>([]);
  const [smartGuess, setSmartGuess] = useState<string>();
  const [filters, setFilters] = useState<Filter[]>([{ ...defaultFilter }]);

  const [condition, setCondition] = useState<string>("");

  const fetchData = async () => {
    try {
      const res = await fetch("/data.json");
      const json = await res.json();
      setData(json.data);
      setFilteredData(json.data);
      setRenderData(json.data.slice(0, 100));
    } catch {
      //
    }
  };

  const paging = () => {
    setRenderData([...filteredData].slice(0, renderData.length + 100));
  };

  const onFilterChange = <T extends keyof Filter>(
    idx: number,
    key: T,
    value: Filter[T]
  ) => {
    const newFilters = [...filters];

    value = value.toLowerCase() as Filter[T];

    newFilters[idx][key] = value;

    if (key === "pos") {
      if (value === "all" && ["is", "not"].includes(newFilters[idx].type)) {
        newFilters[idx].type = "exclude";
      }
    }

    if (["is", "not"].includes(newFilters[idx].type)) {
      if (key === "value") {
        newFilters[idx].value = value.at(-1) as Filter[T];
      } else {
        newFilters[idx].value = newFilters[idx].value.at(-1) as Filter[T];
      }
    }

    setFilters(newFilters);
  };

  const handleFilters = (condition: string, data: string[]) => {
    const newData: string[] = [];

    setCondition(condition);

    if (condition.trim().length === 0) {
      setFilteredData(data);
      setRenderData(data.slice(0, 100));
      return;
    }

    for (const word of data) {
      if (eval(condition)) {
        newData.push(word);
      }
    }

    setFilteredData(newData);
    setRenderData(newData.slice(0, 100));
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const condition = filtersToCondition(filters);

    const time = setTimeout(() => {
      handleFilters(condition, data);
    }, 0);

    return () => {
      clearTimeout(time);
    };
  }, [filters, data]);

  return (
    <>
      <div className="content-max-width-lg mx-auto py-50 px-50">
        <div>
          <h2>Filters</h2>
          <p>
            <br />
            <code>{condition || "Start filtering..."}</code>
          </p>
          <br />
          <div className="d-flex flex-column gap-10 align-items-stretch">
            {filters.map((filter, idx) => {
              return (
                <div key={idx} className="d-flex gap-10">
                  <Select
                    value={filter.pos}
                    label="Position"
                    onChange={(e) =>
                      onFilterChange(
                        idx,
                        "pos",
                        e.target.value as Filter["pos"]
                      )
                    }
                  >
                    <option value="all">all</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                  </Select>
                  <Input
                    label="Value"
                    placeholder={`Value [${
                      ["include", "exclude"].includes(filter.type) ? `ABC` : `A`
                    }]`}
                    value={filter.value}
                    onChange={(e) =>
                      onFilterChange(idx, "value", e.target.value)
                    }
                    type="search"
                  />
                  <Select
                    value={filter.type}
                    label="Filter"
                    onChange={(e) =>
                      onFilterChange(
                        idx,
                        "type",
                        e.target.value as Filter["type"]
                      )
                    }
                  >
                    <option value="exclude">exclude</option>
                    <option value="include">include</option>
                    {filter.pos !== "all" && (
                      <>
                        <option value="is">is</option>
                        <option value="not">not</option>
                      </>
                    )}
                  </Select>
                  <Tooltip label="Remove Filter">
                    <IconButton
                      label="Remove filter"
                      size="sm"
                      variant="danger"
                      onClick={() =>
                        setFilters(filters.filter((_, i) => i !== idx))
                      }
                    >
                      <BiMinus />
                    </IconButton>
                  </Tooltip>
                </div>
              );
            })}
            <div className="d-flex">
              <Tooltip label="Add Filter">
                <IconButton
                  label="Add filter"
                  onClick={() => setFilters([...filters, { ...defaultFilter }])}
                  variant="neutral"
                >
                  <BiPlus />
                </IconButton>
              </Tooltip>
            </div>
          </div>
        </div>
        <div>
          {smartGuess && (
            <>
              <br />
              <Alert title="Smart Guess" description="Aora" variant="primary" />
              <br />
            </>
          )}
          <h2>Results ({filteredData.length})</h2>
          <br />
          <div className="d-flex flex-wrap gap-10 justify-content-start">
            {renderData.map((word, idx) => {
              return <div key={idx}>{word}</div>;
            })}
            {renderData.length === 0 && <div>No results</div>}
          </div>
        </div>
        <br />
        {renderData.length < filteredData.length && (
          <Button onClick={paging} autoWidth variant="neutral">
            Load More
          </Button>
        )}
      </div>
      <footer className="text-center">Made by Yishay with ♥</footer>
    </>
  );
}
