import React, { useEffect, useState } from "react";
import { Input, Button } from "antd";
import { SnippetsOutlined } from "@ant-design/icons";

const { Search } = Input;

const SearchComponent = ({ loading, onSearch,searchParams }) => {
  const [searchValue, setSearchValue] = useState("");

  useEffect(() => {
    if (
      searchParams != null &&
      searchParams !== undefined &&
      searchParams.get("url") !== undefined &&
      searchParams.get("url") !== ""
    ) {
      setSearchValue(searchParams.get("url"));
      onSearch(searchParams.get("url"));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const handlePaste = async (event) => {
    try {
      const text = await navigator.clipboard.readText();
      setSearchValue(text);
    } catch (error) {
      console.log("Failed to read clipboard. Using execCommand instead.");
    }
  };

  return (
    <div>
      <Search
        className="search-component"
        placeholder="Paste product link from Amazon and Flipkart only"
        allowClear
        loading={loading}
        size="large"
        enterButton="Search"
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
        onSearch={onSearch}
      />
      <Button
        icon={<SnippetsOutlined />}
        type="button"
        className="btn paste-wrap"
        onClick={handlePaste}
      >
        Paste
      </Button>
    </div>
  );
};

export default SearchComponent;
