import React, { useEffect, useState } from "react";
import { Layout, Menu, Image, Dropdown, Empty } from "antd";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { BellOutlined } from "@ant-design/icons";
import { handleLoginLogout } from "../../Util";
import "./nav.css";
import { addNotification, getNotification } from "../../Cache";
import { contructItems } from "./navUtil";

const { Header } = Layout;

const Nav = () => {
  const navigate = useNavigate();
  const trackerNotification = "priceTracker_notification";

  const [notifyData, setNotifyData] = useState(
    getNotification(trackerNotification) == null ||
      getNotification(trackerNotification) === undefined
      ? []
      : getNotification(trackerNotification)
  );

  const [items, setItems] = useState([]);

  useEffect(() => {
    if (
      notifyData != null &&
      notifyData !== undefined &&
      notifyData.length > 0
    ) {
      contructItems({ notifyData: notifyData, setItems: setItems });
    } else {
      let item = [];
      let obj = {};
      obj.key = "no_notification";
      obj.label = <Empty />;
      item.push(obj);
      setItems(item);
    }
  }, [notifyData]);

  useEffect(() => {
    if (
      Cookies.get("accessToken") !== undefined &&
      Cookies.get("refreshToken") !== undefined &&
      (notifyData == null ||
        notifyData === undefined ||
        notifyData.length === 0)
    ) {
      console.log("called");
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
            setNotifyData(data.notification);
            addNotification(trackerNotification, data.notification);
          } else {
            setNotifyData([]);
          }
        })
        .catch((err) => {
          console.log("Not logged In!!");
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
