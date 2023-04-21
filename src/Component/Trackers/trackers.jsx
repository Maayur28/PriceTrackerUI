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
  const containerWidth = window.innerWidth;
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();

  const trackerKey = "priceTracker_trackers";

  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [count, setCount] = useState(0);
  const [sortBy, setSortBy] = useState("Relevance");
  const [filterCount, setFilterCount] = useState(0);
  const [filterQuery, setFilterQuery] = useState("");
  const [totalCount, setTotalCount] = useState(0);
  const [renderData, setRenderData] = useState(false);

  const [loading, setloading] = useState(false);
  const [buttonLoading, setbuttonLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState("");
  const [edit, setEdit] = useState("");
  const [alertPrice, setalertPrice] = useState(0);

  const [tempData, setTempData] = useState(
    getTracker(trackerKey) == null ? [] : getTracker(trackerKey)
  );
  const [data, setData] = useState([]);

  useEffect(() => {
    if (
      tempData == null ||
      tempData === undefined ||
      tempData.data == null ||
      tempData.data === undefined ||
      tempData.data.length === 0
    ) {
      fetchTracker();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (
      !loading &&
      tempData != null &&
      tempData !== undefined &&
      tempData.data != null &&
      tempData.data.length > 0
    ) {
      addTracker(trackerKey, tempData);
      setCurrentPage(tempData.page);
      setLimit(tempData.limit);
      setCount(tempData.count);
      setFilterCount(tempData.filterCount);
      setTotalCount(tempData.totalCount);
      setSortBy(tempData.sortBy);
      setFilterQuery(tempData.filterQuery);
      setData(tempData.data);
      setRenderData(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tempData]);

  const fetchTracker = async (page = 0, sortValue = null) => {
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
        const response = await axios.post(
          `https://price-tracker-orchestration.vercel.app/gettracker?page=${
            page === 0 ? currentPage : page
          }&limit=${limit}&sortBy=${
            sortValue == null ? sortBy : sortValue
          }&filter=${filterQuery}`,
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
          response.data.data.data != null &&
          response.data.data.data !== undefined &&
          response.data.data.data.length > 0
        ) {
          setTempData(response.data.data);
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
        setbuttonLoading(true);
        try {
          let obj = {};
          obj.alertPrice = alertPrice;
          obj.productId = edit;
          obj.accessToken = Cookies.get("accessToken");
          obj.refreshToken = Cookies.get("refreshToken");
          const response = await axios.put(
            `https://price-tracker-orchestration.vercel.app/updatetracker?page=${currentPage}&limit=${limit}&sortBy=${sortBy}&filter=${filterQuery}`,
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
            response.data.data.data != null &&
            response.data.data.data !== undefined &&
            response.data.data.data.length > 0
          ) {
            setTempData(response.data.data);
            messageApi.open({
              type: "success",
              content: "Updated",
            });
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
        let obj = {};
        obj.productId = productId;
        obj.accessToken = Cookies.get("accessToken");
        obj.refreshToken = Cookies.get("refreshToken");
        const response = await axios.put(
          `https://price-tracker-orchestration.vercel.app/deletetracker?page=${currentPage}&limit=${limit}&sortBy=${sortBy}&filter=${filterQuery}`,
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
          response.data.data.data != null &&
          response.data.data.data !== undefined &&
          response.data.data.data.length > 0
        ) {
          setTempData(response.data.data);
          setDeleteLoading("");
          messageApi.open({
            type: "success",
            content: "Deleted",
          });
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

  const handleChange = (value) => {
    if (value !== sortBy) {
      setSortBy(value);
      fetchTracker(currentPage, value);
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
        {renderData &&
          data != null &&
          data !== undefined &&
          data.length > 0 && (
            <div className="sort_by_container">
              <Text strong className="sort_by_label">
                Sort By:
              </Text>
              <Select
                value={sortBy}
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
                    value: "CurPrice:L2H",
                    label: "CurPrice : Low to High",
                  },
                  {
                    value: "CurPrice:H2L",
                    label: "CurPrice : High to Low",
                  },
                  {
                    value: "MPD",
                    label: "Maximum Price Drop",
                  },
                ]}
              />
            </div>
          )}
        {contextHolder}
        <div className="trackers-container">
          {renderData && (
            <>
              {data != null && data !== undefined && data.length > 0 ? (
                data.map((val, index) => (
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
                            val.currentPrice !== undefined
                              ? val.currentPrice < val.price.discountPrice
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

                              {val.currentPrice !== undefined && (
                                <>
                                  {val.currentPrice <
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
                                          val.currentPrice
                                      )}
                                    </Title>
                                  )}
                                  <div style={{ marginTop: "10px" }}>
                                    <Space size={[0, "small"]}>
                                      <Tag bordered={false} color="#87D068">
                                        MinPrice:&nbsp;
                                        {val.minimumPrice}
                                      </Tag>

                                      <Tag
                                        bordered={false}
                                        color={
                                          val.currentPrice <
                                          val.price.discountPrice
                                            ? "#108EE9"
                                            : "blue"
                                        }
                                      >
                                        CurPrice:&nbsp;
                                        {val.currentPrice}
                                      </Tag>
                                      <Tag bordered={false} color="#CD201F">
                                        MaxPrice:&nbsp;
                                        {val.maximumPrice}
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
      {data != null && data !== undefined && data.length > 0 && (
        <>
          <Pagination
            style={{ margin: "10px 0" }}
            defaultCurrent={currentPage}
            total={filterCount}
            onChange={onPageChange}
            defaultPageSize={limit}
          />
        </>
      )}
    </div>
  );
};

export default Trackers;
