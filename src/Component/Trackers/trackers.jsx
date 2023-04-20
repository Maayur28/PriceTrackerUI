import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  message,
  Card,
  Typography,
  Tag,
  InputNumber,
  Space,
  Button,
  Form,
  Image,
  Spin,
  Popover,
  Select,
  Pagination,
} from "antd";
import {
  CloseOutlined,
  CheckOutlined,
  EditOutlined,
  LineChartOutlined,
  ArrowDownOutlined,
} from "@ant-design/icons";
import fmt from "indian-number-format";
import { addTracker, clearLogout, getTracker } from "../../Cache";
import "./trackers.css";

const { Meta } = Card;
const { Title, Text } = Typography;

const Trackers = () => {
  const trackerKey = "priceTracker_trackers";
  const trackerPriceHistoryKey = "priceTracker_trackersPriceHistory";
  const containerWidth = window.innerWidth;
  const [sortByValue, setSortByValue] = useState("Relevance");
  const [messageApi, contextHolder] = message.useMessage();

  const [currentPage, setCurrentPage] = useState(
    getTracker(trackerKey) == null
      ? 1
      : getTracker(trackerKey).currentPage == null
      ? 1
      : getTracker(trackerKey).currentPage
  );
  const [totalPage, setTotalPage] = useState(
    getTracker(trackerKey) == null
      ? 0
      : getTracker(trackerKey).total == null
      ? 0
      : getTracker(trackerKey).total
  );
  const [limit, setLimit] = useState(
    getTracker(trackerKey) == null
      ? 100
      : getTracker(trackerKey).limit == null
      ? 100
      : getTracker(trackerKey).limit
  );

  const [priceHistoryCalled, setPriceHistoryCalled] = useState(
    getTracker(trackerPriceHistoryKey) == null ? false : true
  );

  const navigate = useNavigate();
  const [loading, setloading] = useState(false);
  const [buttonLoading, setbuttonLoading] = useState(false);
  const [edit, setEdit] = useState("");
  const [data, setData] = useState(
    getTracker(trackerKey) == null
      ? []
      : getTracker(trackerKey).products == null
      ? []
      : getTracker(trackerKey).products
  );
  const [cloneData, setcloneData] = useState(
    getTracker(trackerKey) == null
      ? []
      : getTracker(trackerKey).products == null
      ? []
      : getTracker(trackerKey).products
  );
  const [priceHistoryData, setPriceHistoryData] = useState(
    getTracker(trackerPriceHistoryKey) == null
      ? []
      : getTracker(trackerPriceHistoryKey)
  );
  const [deleteLoading, setDeleteLoading] = useState("");
  const [alertPrice, setalertPrice] = useState(0);

  const fetchTracker = async (page = 0, limit = 100) => {
    if (
      Cookies.get("accessToken") === undefined ||
      Cookies.get("refreshToken") === undefined
    ) {
      clearLogout();
      messageApi.open({
        type: "error",
        content: "Login to view trackers",
      });
      navigate("/login");
    } else {
      setloading(true);
      try {
        setPriceHistoryCalled(false);
        const response = await axios.post(
          `https://price-tracker-auth.vercel.app/gettracker?page=${
            page === 0 ? currentPage : page
          }&limit=${limit}`,
          JSON.stringify({
            accessToken: Cookies.get("accessToken"),
            refreshToken: Cookies.get("refreshToken"),
          }),
          {
            headers: {
              "Content-type": "application/json; charset=UTF-8",
            },
          }
        );
        if (
          response.status === 200 &&
          response.data != null &&
          response.data !== undefined &&
          response.data !== "" &&
          response.data.data.products != null &&
          response.data.data.products !== undefined &&
          response.data.data.products.length > 0
        ) {
          if (response.data) {
            setData(response.data.data.products);
            setSortByValue("Relevance");
            setTotalPage(response.data.data.total);
            setCurrentPage(response.data.data.currentPage);
            setLimit(response.data.data.limit);
            addTracker(trackerKey, response.data.data);
          }
        }
        setloading(false);
      } catch (error) {
        setloading(false);
        messageApi.open({
          type: "error",
          content: error.response.data,
        });
      }
    }
  };

  const onPageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    fetchTracker(pageNumber);
  };

  const getUrlsList = () => {
    let urlList = [];
    data.forEach((element) => {
      urlList.push(element.url);
    });
    let urls = {
      urls: urlList,
    };
    return urls;
  };

  const fetchPriceHistory = async () => {
    if (
      Cookies.get("accessToken") === undefined ||
      Cookies.get("refreshToken") === undefined
    ) {
      clearLogout();
      messageApi.open({
        type: "error",
        content: "Login to view trackers",
      });
      navigate("/login");
    } else {
      let urlList = getUrlsList();
      try {
        const response = await axios.post(
          "https://stingray-app-omwgg.ondigitalocean.app/getPriceHistoryUrls",
          //"http://localhost:9000/getPriceHistoryUrls",
          urlList,
          {
            headers: {
              "Content-type": "application/json; charset=UTF-8",
            },
          }
        );
        if (
          response.status === 200 &&
          response.data != null &&
          response.data !== undefined &&
          response.data !== ""
        ) {
          if (response.data) {
            setPriceHistoryData(response.data.data);
            addTracker(trackerPriceHistoryKey, response.data.data);
          }
        }
      } catch (error) {
        messageApi.open({
          type: "error",
          content: error.response.data,
        });
      }
    }
  };

  useEffect(() => {
    if (data == null || data === undefined || data.length === 0) fetchTracker();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (
      !loading &&
      !priceHistoryCalled &&
      data != null &&
      data !== undefined &&
      data.length > 0
    ) {
      setcloneData([]);
      setPriceHistoryCalled(true);
      fetchPriceHistory();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  const handleAlertPrice = async () => {
    if (
      Cookies.get("accessToken") === undefined ||
      Cookies.get("refreshToken") === undefined
    ) {
      clearLogout();
      messageApi.open({
        type: "error",
        content: "Please login!!!",
      });
    } else {
      if (alertPrice > 0) {
        setPriceHistoryCalled(false);
        setbuttonLoading(true);
        try {
          let obj = {};
          obj.alertPrice = alertPrice;
          obj.productId = edit;
          obj.accessToken = Cookies.get("accessToken");
          obj.refreshToken = Cookies.get("refreshToken");
          const response = await axios.put(
            `https://price-tracker-auth.vercel.app/updatetracker?page=${currentPage}&limit=${limit}`,
            obj,
            {
              headers: {
                "Content-type": "application/json; charset=UTF-8",
              },
            }
          );
          if (
            response.status === 200 &&
            response.data != null &&
            response.data !== undefined &&
            response.data !== "" &&
            response.data.data.products != null &&
            response.data.data.products !== undefined &&
            response.data.data.products.length > 0
          ) {
            if (response.data) {
              setData(response.data.data.products);
              setSortByValue("Relevance");
              setTotalPage(response.data.data.total);
              setCurrentPage(response.data.data.currentPage);
              setLimit(response.data.data.limit);
              addTracker(trackerKey, response.data.data);
              messageApi.open({
                type: "success",
                content: "Updated",
              });
            }
          }
          setbuttonLoading(false);
          setEdit("");
          setalertPrice(0);
        } catch (error) {
          setbuttonLoading(false);
          messageApi.open({
            type: "error",
            content: error.response.data,
          });
        }
      }
    }
  };

  const handleEdit = (productId) => {
    setalertPrice(0);
    setEdit(productId);
  };

  const handleDelete = async (productId) => {
    if (
      Cookies.get("accessToken") === undefined ||
      Cookies.get("refreshToken") === undefined
    ) {
      clearLogout();
      messageApi.open({
        type: "error",
        content: "Please login!!!",
      });
    } else {
      try {
        setDeleteLoading(productId);
        setPriceHistoryCalled(false);
        let obj = {};
        obj.productId = productId;
        obj.accessToken = Cookies.get("accessToken");
        obj.refreshToken = Cookies.get("refreshToken");
        const response = await axios.put(
          `https://price-tracker-auth.vercel.app/deletetracker?page=${currentPage}&limit=${limit}`,
          obj,
          {
            headers: {
              "Content-type": "application/json; charset=UTF-8",
            },
          }
        );
        if (
          response.status === 200 &&
          response.data != null &&
          response.data !== undefined &&
          response.data !== "" &&
          response.data.data.products != null &&
          response.data.data.products !== undefined &&
          response.data.data.products.length > 0
        ) {
          if (response.data) {
            setData(response.data.data.products);
            setSortByValue("Relevance");
            setTotalPage(response.data.data.total);
            setCurrentPage(response.data.data.currentPage);
            setLimit(response.data.data.limit);
            addTracker(trackerKey, response.data.data);
            setDeleteLoading("");
            messageApi.open({
              type: "success",
              content: "Deleted",
            });
          }
        }
      } catch (error) {
        setDeleteLoading("");
        messageApi.open({
          type: "error",
          content: error.response.data,
        });
      }
    }
  };

  useEffect(() => {
    if (data) {
      sortData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sortByValue, data, priceHistoryData]);

  const handleChange = (val) => {
    let value =
      val == null || val === undefined || val === "" ? sortByValue : val;
    setSortByValue(value);
  };

  const sortData = () => {
    let value = sortByValue;
    if (value === "Relevance") {
      setcloneData(data);
    } else if (
      priceHistoryData != null &&
      priceHistoryData !== undefined &&
      priceHistoryData.length > 1 &&
      data != null &&
      data !== undefined &&
      data.length > 1
    ) {
      if (value === "CurPrice : Low to High") {
        priceHistoryData.sort((a, b) => a.currentPrice - b.currentPrice);
        let newData = [];
        priceHistoryData.forEach((element) => {
          data.every((x) => {
            if (x.url.includes(element.url)) {
              newData.push(x);
              return false;
            } else return true;
          });
        });
        setcloneData(newData);
      }
      if (value === "CurPrice : High to Low") {
        priceHistoryData.sort((a, b) => b.currentPrice - a.currentPrice);
        let newData = [];
        priceHistoryData.forEach((element) => {
          data.every((x) => {
            if (x.url.includes(element.url)) {
              newData.push(x);
              return false;
            } else return true;
          });
        });
        setcloneData(newData);
      }
      if (value === "Maximum Price Drop") {
        let newPriceHistoryData = [];
        data.forEach((element) => {
          priceHistoryData.every((x) => {
            if (x.url.includes(element.url)) {
              let obj = {};
              obj.currentPrice = element.price.discountPrice - x.currentPrice;
              obj.url = x.url;
              newPriceHistoryData.push(obj);
              return false;
            } else return true;
          });
        });
        newPriceHistoryData.sort((a, b) => b.currentPrice - a.currentPrice);
        let newData = [];
        newPriceHistoryData.forEach((element) => {
          data.every((x) => {
            if (x.url.includes(element.url)) {
              newData.push(x);
              return false;
            } else return true;
          });
        });
        setcloneData(newData);
      }
    } else {
      setcloneData(data);
    }
  };

  const openInNewTab = (url) => {
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const content = (val) => (
    <Space.Compact style={{ width: "220px" }}>
      <Form.Item>
        <InputNumber
          name="alertPrice"
          addonBefore="₹"
          min={1}
          max={val.price.discountPrice - 1}
          value={val.alertPrice}
          readOnly={val.productId !== edit}
          onChange={(value) => setalertPrice(value)}
        />
      </Form.Item>
      <Form.Item>
        {edit === val.productId ? (
          <Button
            icon={<CheckOutlined />}
            size="smmall"
            style={{
              color: "white",
              backgroundColor: "#7F4574",
            }}
            type="primary"
            onClick={handleAlertPrice}
            disabled={alertPrice === 0 || alertPrice === val.alertPrice}
            loading={buttonLoading}
          >
            Update
          </Button>
        ) : (
          <Button
            icon={<EditOutlined />}
            size="smmall"
            onClick={() => handleEdit(val.productId)}
          >
            Edit
          </Button>
        )}
      </Form.Item>
    </Space.Compact>
  );
  return (
    <div>
      <Spin tip="Loading..." spinning={loading}>
        {cloneData != null &&
          cloneData !== undefined &&
          cloneData.length > 0 && (
            <div className="sort_by_container">
              <Text strong className="sort_by_label">
                Sort By:
              </Text>
              <Select
                value={sortByValue}
                style={{
                  width: 225,
                }}
                onChange={handleChange}
                options={[
                  {
                    value: "Relevance",
                    label: "Relevance",
                  },
                  {
                    value: "CurPrice : Low to High",
                    label: "CurPrice : Low to High",
                  },
                  {
                    value: "CurPrice : High to Low",
                    label: "CurPrice : High to Low",
                  },
                  {
                    value: "Maximum Price Drop",
                    label: "Maximum Price Drop",
                  },
                ]}
              />
            </div>
          )}
        {contextHolder}
        <div className="trackers-container">
          {!loading && (
            <>
              {cloneData != null &&
              cloneData !== undefined &&
              cloneData.length > 0 ? (
                cloneData.map((val, index) => (
                  <>
                    <Spin spinning={deleteLoading === val.productId}>
                      <Card
                        key={`tracker${index}`}
                        style={{
                          width:
                            containerWidth <= 650
                              ? "90vw"
                              : containerWidth > 650 && containerWidth <= 900
                              ? "44vw"
                              : containerWidth > 900 && containerWidth <= 1200
                              ? "400px"
                              : "30vw",
                          height:
                            priceHistoryData != null &&
                            priceHistoryData !== undefined &&
                            priceHistoryData.length > 0 &&
                            priceHistoryData.find((x) =>
                              val.url.includes(x.url)
                            ) !== undefined
                              ? priceHistoryData.find((x) =>
                                  val.url.includes(x.url)
                                ).currentPrice < val.price.discountPrice
                                ? 510
                                : 490
                              : 455,
                          margin: "15px",
                        }}
                        actions={[
                          <Button
                            onClick={() => navigate(`/?url=${val.url}`)}
                            type="text"
                            icon={<LineChartOutlined />}
                          >
                            History
                          </Button>,
                          <>
                            <Popover
                              trigger="click"
                              content={content(val)}
                              title="Update Alert Price"
                            >
                              <Button type="text" icon={<EditOutlined />}>
                                Alert Price
                              </Button>
                            </Popover>
                          </>,
                          <Button
                            type="text"
                            style={{
                              width: "90%",
                              maxWidth: "120px",
                            }}
                            onClick={() => openInNewTab(val.url)}
                          >
                            <Text strong>{val.domain}</Text>
                          </Button>,
                        ]}
                        cover={
                          <img
                            alt="product_image"
                            src={val.image}
                            style={{
                              textAlign: "center",
                              padding: "10px",
                              width: "280px",
                              height: "220px",
                            }}
                          />
                        }
                      >
                        <CloseOutlined
                          className="tracker-close-button"
                          onClick={() => handleDelete(val.productId)}
                        />
                        <Meta
                          style={{ textAlign: "left" }}
                          title={val.title}
                          description={
                            <div>
                              {val.rating != null &&
                              val.rating !== undefined &&
                              val.rating.totalRated != null &&
                              val.rating.totalRated !== undefined &&
                              val.rating.totalRated !== "" ? (
                                <Tag color="#2F903B">
                                  {val.rating.ratingCount} |{" "}
                                  {val.rating.totalRated}
                                </Tag>
                              ) : (
                                <Tag color="#C6C6C6">Not Rated</Tag>
                              )}
                              {Object.keys(val.price).length > 0 && (
                                <div className="pdp-price-container">
                                  <Title
                                    level={2}
                                    style={{ margin: "0", marginRight: "5px" }}
                                  >
                                    ₹{fmt.format(val.price.discountPrice)}
                                  </Title>
                                  {val.price.discountPrice !==
                                    val.price.originalPrice && (
                                    <>
                                      <Text
                                        type="secondary"
                                        style={{
                                          fontSize: "18px",
                                          marginRight: "5px",
                                        }}
                                        delete
                                        strong
                                      >
                                        ₹{fmt.format(val.price.originalPrice)}
                                      </Text>
                                      <Title
                                        level={5}
                                        style={{
                                          color: "#07976A",
                                          fontWeight: "bolder",
                                          margin: "0",
                                        }}
                                      >
                                        {Math.floor(
                                          ((val.price.originalPrice -
                                            val.price.discountPrice) /
                                            val.price.originalPrice) *
                                            100
                                        )}
                                        % off
                                      </Title>
                                    </>
                                  )}
                                </div>
                              )}

                              {priceHistoryData != null &&
                                priceHistoryData !== undefined &&
                                priceHistoryData.length > 0 &&
                                priceHistoryData.find((x) =>
                                  val.url.includes(x.url)
                                ) !== undefined && (
                                  <>
                                    {priceHistoryData.find((x) =>
                                      val.url.includes(x.url)
                                    ).currentPrice <
                                      val.price.discountPrice && (
                                      <Title
                                        level={5}
                                        style={{
                                          margin: "0",
                                          color: "#7F4574",
                                          fontWeight: "bolder",
                                        }}
                                      >
                                        <ArrowDownOutlined className="price_dropped" />
                                        Price dropped by&nbsp; ₹
                                        {fmt.format(
                                          val.price.discountPrice -
                                            priceHistoryData.find((x) =>
                                              val.url.includes(x.url)
                                            ).currentPrice
                                        )}
                                      </Title>
                                    )}
                                    <div style={{ marginTop: "10px" }}>
                                      <Space size={[0, "small"]}>
                                        <Tag bordered={false} color="#87D068">
                                          MinPrice:&nbsp;
                                          {
                                            priceHistoryData.find((x) =>
                                              val.url.includes(x.url)
                                            ).minimumPrice
                                          }
                                        </Tag>

                                        <Tag
                                          bordered={false}
                                          color={
                                            priceHistoryData.find((x) =>
                                              val.url.includes(x.url)
                                            ).currentPrice <
                                            val.price.discountPrice
                                              ? "#108EE9"
                                              : "blue"
                                          }
                                        >
                                          CurPrice:&nbsp;
                                          {
                                            priceHistoryData.find((x) =>
                                              val.url.includes(x.url)
                                            ).currentPrice
                                          }
                                        </Tag>
                                        <Tag bordered={false} color="#CD201F">
                                          MaxPrice:&nbsp;
                                          {
                                            priceHistoryData.find((x) =>
                                              val.url.includes(x.url)
                                            ).maximumPrice
                                          }
                                        </Tag>
                                      </Space>
                                    </div>
                                  </>
                                )}
                            </div>
                          }
                        />
                      </Card>
                    </Spin>
                  </>
                ))
              ) : (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    width: "100%",
                    height: "70vh",
                  }}
                >
                  <Image
                    preview={false}
                    src="/empty-cart.gif"
                    width="60vw"
                    height="40vh"
                  />
                  <Text style={{ fontSize: "40px", fontWeight: "bolder" }}>
                    Your tracking list is empty
                  </Text>
                  <Text style={{ fontSize: "24px", fontWeight: "400" }}>
                    Looks like you have not added anything to your tracking
                    list.
                  </Text>
                </div>
              )}
            </>
          )}
        </div>
      </Spin>
      {cloneData != null && cloneData !== undefined && cloneData.length > 0 && (
        <Pagination
          style={{ margin: "10px 0" }}
          defaultCurrent={currentPage}
          total={totalPage}
          onChange={onPageChange}
          defaultPageSize={limit}
        />
      )}
    </div>
  );
};

export default Trackers;
