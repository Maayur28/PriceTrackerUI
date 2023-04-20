import React, { useEffect, useState } from "react";
import {
  Layout,
  Menu,
  Image,
  Dropdown,
  Avatar,
  Typography,
  Divider,
  Button,
  Empty,
} from "antd";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { BellOutlined } from "@ant-design/icons";
import { handleLoginLogout } from "../../Util";
import "./nav.css";
const { Title, Text } = Typography;
const { Header } = Layout;

const Nav = () => {
  const navigate = useNavigate();

  const [items, setItems] = useState([]);
  useEffect(() => {
    if (
      Cookies.get("accessToken") !== undefined &&
      Cookies.get("refreshToken") !== undefined
    ) {
      fetch("https://price-tracker-auth.vercel.app/getNotification", {
        method: "POST",
        body: JSON.stringify({
          accessToken: Cookies.get("accessToken"),
          refreshToken: Cookies.get("refreshToken"),
        }),
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
      })
        .then(async (response) => {
          if (response.status >= 200 && response.status <= 299) {
            return response.json();
          } else {
            const text = await response.text();
            throw new Error(text);
          }
        })
        .then((data) => {
          if (
            data != null &&
            data !== undefined &&
            data.notification != null &&
            data.notification !== undefined &&
            data.notification.length > 0
          ) {
            contructItems(data.notification);
          }
        })
        .catch((err) => {
          console.log("Not logged In!!");
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const dismissNotification = async () => {
    if (
      Cookies.get("accessToken") !== undefined &&
      Cookies.get("refreshToken") !== undefined
    ) {
      fetch("https://price-tracker-auth.vercel.app/dismissNotification", {
        method: "POST",
        body: JSON.stringify({
          accessToken: Cookies.get("accessToken"),
          refreshToken: Cookies.get("refreshToken"),
        }),
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
      })
        .then(async (response) => {
          if (response.status >= 200 && response.status <= 299) {
            return response.json();
          } else {
            const text = await response.text();
            throw new Error(text);
          }
        })
        .then((data) => {
          if (data.success === true) {
            contructItems([]);
          }
        })
        .catch((err) => {
          console.log("Not logged In!!");
        });
    }
  };

  const openInNewTab = (url) => {
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const contructItems = (notification) => {
    let item = [];
    if (
      notification != null &&
      notification !== undefined &&
      notification.length > 0
    ) {
      let obj = {};
      obj.key = "header_notify";
      obj.label = (
        <>
          <div style={{ cursor: "default" }}>
            <Button
              onClick={dismissNotification}
              type="text"
              style={{ position: "absolute", right: "0", top: "0" }}
            >
              Dismiss
            </Button>
          </div>
          <Divider
            style={{ margin: "0", marginTop: "30px", marginBottom: "2px" }}
          />
        </>
      );
      item.push(obj);
      notification.forEach((element) => {
        let difference_ms = Date.now() - element.date;
        //take out milliseconds
        difference_ms = difference_ms / 1000;
        let seconds = Math.floor(difference_ms % 60);
        difference_ms = difference_ms / 60;
        let minutes = Math.floor(difference_ms % 60);
        difference_ms = difference_ms / 60;
        let hours = Math.floor(difference_ms % 24);
        let days = Math.floor(difference_ms / 24);
        let obj = {};
        obj.key = element._id;
        obj.label = (
          <div
            style={{ display: "flex" }}
            onClick={() => openInNewTab(element.url)}
          >
            <Avatar
              shape="square"
              size={56}
              src={<img width="60px" src={element.image} alt="avatar" />}
            />
            <div style={{ marginLeft: "10px" }}>
              <Title style={{ margin: "0" }} level={5}>
                Price dropped by{" "}
                <span style={{ color: "#7f4574", fontWeight: "bolder" }}>
                  ₹{element.price}
                </span>
              </Title>
              <Text ellipsis={true} style={{ maxWidth: "250px" }}>
                {element.title}
              </Text>
              <div>
                <Text type="secondary">
                  {days === 0
                    ? hours === 0
                      ? minutes === 0
                        ? `${seconds} seconds ago`
                        : `${minutes} minutes ago`
                      : `${hours} hours ago`
                    : `${days} days ago`}
                </Text>
              </div>
            </div>
          </div>
        );
        item.push(obj);
      });
    } else {
      let obj = {};
      obj.key = "no_notification";
      obj.label = <Empty />;
      item.push(obj);
    }
    setItems(item);
  };

  return (
    <Layout style={{ height: "60px", position: "relative" }}>
      <Header
        style={{
          width: "100%",
          padding: "0",
        }}
      >
        <Menu mode="horizontal">
          <Menu.Item key="logo" onClick={() => navigate("/")}>
            <Image
              width={80}
              height={50}
              src="/pricetracker-high-resolution-logo-color-on-transparent-background.png"
              preview={false}
            />
          </Menu.Item>
          <Dropdown
            menu={{
              items,
            }}
            placement="bottomLeft"
          >
            <BellOutlined
              style={{
                fontSize: "20px",
                cursor: "pointer",
                position: "absolute",
                right: "1%",
                marginRight: "110px",
                marginTop: "20px",
              }}
            />
          </Dropdown>
          <Menu.SubMenu
            key="profile"
            title={`Hello,
                ${
                  Cookies.get("accessToken") &&
                  Cookies.get("accessToken").endsWith("=") &&
                  Cookies.get("refreshToken") &&
                  Cookies.get("profileName")
                    ? Cookies.get("profileName")
                    : "sign in"
                }`}
            style={{
              position: "absolute",
              right: "1px",
              marginTop: "-5px",
            }}
          >
            <Menu.Item key="account" onClick={() => navigate("/account")}>
              My Account
            </Menu.Item>
            <Menu.Item key="trackers" onClick={() => navigate("/trackers")}>
              My Trackers
            </Menu.Item>
            <Menu.Item key="contact" onClick={() => navigate("/contact")}>
              Contact Us
            </Menu.Item>
            <Menu.Item
              key="login/logout"
              onClick={() =>
                handleLoginLogout() ? navigate("/") : navigate("/login")
              }
            >
              {Cookies.get("accessToken") &&
              Cookies.get("accessToken").endsWith("=") &&
              Cookies.get("refreshToken")
                ? "Logout"
                : "Login"}
            </Menu.Item>
          </Menu.SubMenu>
        </Menu>
      </Header>
    </Layout>
  );
};

export default Nav;
