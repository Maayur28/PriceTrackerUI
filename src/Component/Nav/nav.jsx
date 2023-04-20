import React from "react";
import { Layout, Menu, Image, Dropdown } from "antd";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { BellOutlined } from "@ant-design/icons";
import { handleLoginLogout } from "../../Util";
import "./nav.css";

const { Header } = Layout;

const Nav = () => {
  const navigate = useNavigate();

  const items = [
    {
      key: "1",
      label: (
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://www.antgroup.com"
        >
          1st menu item
        </a>
      ),
    },
    {
      key: "2",
      label: (
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://www.aliyun.com"
        >
          2nd menu item
        </a>
      ),
    },
    {
      key: "3",
      label: (
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://www.luohanacademy.com"
        >
          3rd menu item
        </a>
      ),
    },
  ];

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
